(function () {
  "use strict";

  var themeToggle = document.getElementById("themeToggle");

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function syncToggleState() {
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-pressed", currentTheme() === "light" ? "true" : "false");
  }

  if (themeToggle) {
    syncToggleState();
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("karecode-theme", next);
      } catch (e) {}
      syncToggleState();
    });
  }

  var burger = document.getElementById("navBurger");
  var mobileNav = document.getElementById("navMobile");

  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      burger.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  var nav = document.getElementById("nav");

  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var contactForm = document.getElementById("contactForm");

  if (contactForm) {
    var nameInput = document.getElementById("cf-name");
    var emailInput = document.getElementById("cf-email");
    var phoneInput = document.getElementById("cf-phone");
    var subjectInput = document.getElementById("cf-subject");
    var messageInput = document.getElementById("cf-message");
    var messageCount = document.getElementById("cf-message-count");
    var statusEl = document.getElementById("cf-status");
    var nameRegex = /[^A-Za-zÇĞİÖŞÜçğıöşü\s]/g;

    nameInput.addEventListener("input", function () {
      nameInput.value = nameInput.value.replace(nameRegex, "");
    });

    phoneInput.addEventListener("input", function () {
      phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 11);
    });

    messageInput.addEventListener("input", function () {
      messageCount.textContent = messageInput.value.length;
    });

    function setError(input, message) {
      var errorEl = contactForm.querySelector('[data-error-for="' + input.id + '"]');
      input.classList.toggle("is-invalid", !!message);
      if (errorEl) errorEl.textContent = message || "";
    }

    function validateForm() {
      var valid = true;

      if (!nameInput.value.trim()) {
        setError(nameInput, "Ad soyad zorunludur.");
        valid = false;
      } else {
        setError(nameInput, "");
      }

      if (!emailInput.value.includes("@") || !emailInput.checkValidity()) {
        setError(emailInput, "Geçerli bir e-posta adresi girin.");
        valid = false;
      } else {
        setError(emailInput, "");
      }

      if (phoneInput.value.length !== 11) {
        setError(phoneInput, "Telefon numarası 11 haneli olmalıdır.");
        valid = false;
      } else {
        setError(phoneInput, "");
      }

      if (!messageInput.value.trim()) {
        setError(messageInput, "Mesaj alanı boş bırakılamaz.");
        valid = false;
      } else {
        setError(messageInput, "");
      }

      return valid;
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.textContent = "";

      if (!validateForm()) return;

      var body =
        "Ad Soyad: " + nameInput.value +
        "\nE-posta: " + emailInput.value +
        "\nTelefon: " + phoneInput.value +
        "\nKonu: " + subjectInput.value +
        "\n\nMesaj:\n" + messageInput.value;

      window.location.href =
        "mailto:info@karecode.com.tr?subject=" +
        encodeURIComponent("Web sitesi iletişim formu — " + subjectInput.value) +
        "&body=" + encodeURIComponent(body);

      statusEl.textContent = "E-posta uygulamanız açılıyor…";
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var navHeight = nav ? nav.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
