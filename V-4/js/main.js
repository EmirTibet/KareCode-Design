/* KareCode — V-4 interactions */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  root.classList.add("js");

  /* ---------- Theme ---------- */
  var themeBtn = document.querySelector("[data-theme-toggle]");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      var dark = theme === "dark";
      themeBtn.setAttribute("aria-pressed", String(dark));
      themeBtn.setAttribute("aria-label", dark ? "Açık temaya geç" : "Koyu temaya geç");
    }
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("karecode-theme", next);
      } catch (e) {}
    });
  }

  /* ---------- Nav: scrolled state + back-to-top ---------- */
  var nav = document.querySelector(".nav");
  var toTop = document.querySelector(".to-top");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle("is-scrolled", y > 24);
    if (toTop) toTop.classList.toggle("is-visible", y > 900);
    updateStory();
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
      var skipTarget = document.querySelector("#main");
      if (skipTarget) skipTarget.focus({ preventScroll: true });
    });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".nav__burger");
  var menu = document.getElementById("mobile-menu");

  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    menu.classList.toggle("is-open", open);
    if (open) {
      var first = menu.querySelector("a");
      if (first) first.focus();
    }
  }

  if (burger && menu) {
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        burger.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (menu.classList.contains("is-open") && !menu.contains(e.target) && !burger.contains(e.target)) {
        setMenu(false);
      }
    });

    window.matchMedia("(min-width: 960px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, [data-fx]");

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Liquid glass specular: follows pointer ---------- */
  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll("[data-glow]").forEach(function (el) {
      var frame = null;
      el.addEventListener("pointermove", function (e) {
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          var r = el.getBoundingClientRect();
          el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
          el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
          frame = null;
        });
      });
      el.addEventListener("pointerleave", function () {
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
      });
    });
  }

  /* ---------- Story chapters: active index + progress ---------- */
  var story = document.querySelector("[data-story]");
  var chapters = story ? story.querySelectorAll(".chapter") : [];
  var storyLinks = story ? story.querySelectorAll(".story__index a") : [];
  var storyBar = story ? story.querySelector(".story__progress") : null;

  function updateStory() {
    if (!story || !chapters.length) return;
    var vh = window.innerHeight;
    var rect = story.getBoundingClientRect();
    var total = rect.height - vh * 0.5;
    var progress = Math.min(1, Math.max(0, (vh * 0.5 - rect.top) / (total || 1)));
    if (storyBar) storyBar.style.setProperty("--progress", progress.toFixed(3));

    var active = 0;
    chapters.forEach(function (ch, i) {
      if (ch.getBoundingClientRect().top < vh * 0.55) active = i;
    });
    storyLinks.forEach(function (a, i) {
      var on = i === active;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "step");
      else a.removeAttribute("aria-current");
    });
  }

  /* ---------- Feature explorer: hover/focus a feature, details fill the right ---------- */
  document.querySelectorAll("[data-fx]").forEach(function (fx) {
    var tabs = Array.prototype.slice.call(fx.querySelectorAll('[role="tab"]'));
    var indicator = fx.querySelector(".fx-list__indicator");
    var current = 0;

    function moveIndicator() {
      var tab = tabs[current];
      if (!indicator || !tab.offsetHeight) return;
      indicator.style.setProperty("--fx-y", tab.parentElement.offsetTop + "px");
      indicator.style.setProperty("--fx-h", tab.offsetHeight + "px");
    }

    function select(i, focus) {
      if (i === current && !focus) return;
      tabs.forEach(function (tab, j) {
        var on = j === i;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).classList.toggle("is-active", on);
      });
      current = i;
      moveIndicator();
      if (focus) tabs[i].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("mouseenter", function () {
        select(i);
      });
      tab.addEventListener("focus", function () {
        select(i);
      });
      tab.addEventListener("click", function () {
        select(i);
      });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowDown") next = (i + 1) % tabs.length;
        else if (e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        if (next !== null) {
          e.preventDefault();
          select(next, true);
        }
      });
    });

    moveIndicator();
    window.addEventListener("resize", moveIndicator);
  });

  /* ---------- Forms ---------- */
  var messages = {
    valueMissing: "Bu alan zorunludur.",
    noAt: "E-posta adresi @ işareti içermelidir (ör. ad@firma.com).",
    typeMismatch: "Lütfen geçerli bir e-posta adresi girin (ör. ad@firma.com).",
    patternMismatch: "Lütfen bu alanı istenen biçimde doldurun.",
    tooShort: "Lütfen biraz daha ayrıntı ekleyin (en az 10 karakter).",
    consent: "Devam etmek için aydınlatma metnini onaylamanız gerekir."
  };

  function fieldError(input) {
    var v = input.validity;
    if (v.valid) return lengthError(input);
    if (input.type === "checkbox") return messages.consent;
    if (v.valueMissing) return messages.valueMissing;
    if (input.type === "email" && input.value.indexOf("@") === -1) return messages.noAt;
    if (v.typeMismatch) return messages.typeMismatch;
    if (v.patternMismatch) return input.getAttribute("data-pattern-msg") || messages.patternMismatch;
    if (v.tooShort) return messages.tooShort;
    return messages.valueMissing;
  }

  // minlength is only checked natively after user edits; check it ourselves too
  function lengthError(input) {
    var min = input.minLength;
    if (min > 0 && input.value && input.value.length < min) return messages.tooShort;
    return "";
  }

  /* Input filters: strip characters a field must never contain */
  var filters = {
    "no-digits": function (v) {
      return v.replace(/[0-9]/g, "");
    },
    // digits only, always starting with 0
    phone: function (v) {
      v = v.replace(/\D/g, "");
      if (v && v.charAt(0) !== "0") v = "0" + v;
      return v.slice(0, 11);
    }
  };

  document.querySelectorAll("[data-filter], [maxlength]").forEach(function (input) {
    var fn = filters[input.getAttribute("data-filter")];
    input.addEventListener("input", function () {
      var clean = fn ? fn(input.value) : input.value;
      if (input.maxLength > 0) clean = clean.slice(0, input.maxLength);
      if (clean !== input.value) input.value = clean;
    });
  });

  function showError(input, msg) {
    var err = document.getElementById(input.id + "-error");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (!err) return;
    var text = err.querySelector("span");
    if (text) text.textContent = msg;
    err.classList.toggle("is-visible", !!msg);
  }

  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    var fields = form.querySelectorAll("input, select, textarea");
    var summary = form.querySelector(".error-summary");
    var success = form.querySelector(".form-success");
    var submit = form.querySelector('[type="submit"]');

    fields.forEach(function (input) {
      input.addEventListener("blur", function () {
        if (input.value || input.type === "checkbox") showError(input, fieldError(input));
      });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") showError(input, fieldError(input));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var invalid = [];
      fields.forEach(function (input) {
        if (!input.willValidate) return;
        var msg = fieldError(input);
        showError(input, msg);
        if (msg) invalid.push({ input: input, msg: msg });
      });

      if (invalid.length) {
        if (summary && invalid.length > 1) {
          var list = summary.querySelector("ul");
          list.innerHTML = "";
          invalid.forEach(function (item) {
            var label = form.querySelector('label[for="' + item.input.id + '"]');
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "#" + item.input.id;
            a.textContent = (label ? label.textContent.replace("*", "").trim() + ": " : "") + item.msg;
            a.addEventListener("click", function (ev) {
              ev.preventDefault();
              item.input.focus();
            });
            li.appendChild(a);
            list.appendChild(li);
          });
          summary.classList.add("is-visible");
          summary.focus();
        } else {
          if (summary) summary.classList.remove("is-visible");
          invalid[0].input.focus();
        }
        return;
      }

      if (summary) summary.classList.remove("is-visible");
      // Demo: no backend is wired yet — simulate a request.
      submit.setAttribute("aria-busy", "true");
      submit.disabled = true;
      window.setTimeout(function () {
        submit.removeAttribute("aria-busy");
        submit.disabled = false;
        form.reset();
        updateCounters();
        fields.forEach(function (input) {
          input.removeAttribute("aria-invalid");
        });
        if (success) {
          success.classList.add("is-visible");
          success.focus();
        }
      }, 1200);
    });
  });

  /* Character counters */
  var counters = document.querySelectorAll("[data-counter]");

  function updateCounters() {
    counters.forEach(function (out) {
      var input = document.getElementById(out.getAttribute("data-counter"));
      if (input) out.textContent = input.value.length + " / " + input.maxLength;
    });
  }

  counters.forEach(function (out) {
    var input = document.getElementById(out.getAttribute("data-counter"));
    if (input) input.addEventListener("input", updateCounters);
  });
  updateCounters();

  /* Prefill contact subject from ?konu= */
  var subject = document.getElementById("konu");
  if (subject && window.URLSearchParams) {
    var konu = new URLSearchParams(window.location.search).get("konu");
    if (konu) {
      for (var i = 0; i < subject.options.length; i++) {
        if (subject.options[i].value === konu) subject.selectedIndex = i;
      }
    }
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  onScroll();
})();
