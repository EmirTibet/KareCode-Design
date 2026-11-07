(function () {
  /* ---------- Instagram ---------- */
  var instagramUrl = "";

  if (instagramUrl) {
    document.querySelectorAll("[data-instagram]").forEach(function (link) {
      link.href = instagramUrl;
    });
  }

  /* ---------- Heading rise ---------- */
  var riseObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-risen");
        riseObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -6% 0px" });

  document.querySelectorAll("main .display, main .h2").forEach(function (heading) {
    riseObserver.observe(heading);
  });

  /* ---------- Skip link ---------- */
  var main = document.getElementById("main");
  document.querySelector(".skip-link").addEventListener("click", function () {
    main.focus();
  });

  /* ---------- Mobile menu ---------- */
  var sidebar = document.getElementById("sidebar");
  var scrim = document.querySelector(".scrim");
  var topbar = document.querySelector(".topbar");
  var footer = document.querySelector(".footer");
  var menuOpen = document.querySelector("[data-menu-open]");
  var menuClose = document.querySelector("[data-menu-close]");
  var toTop = document.querySelector("[data-to-top]");
  var desktop = window.matchMedia("(min-width: 1024px)");

  function setMenu(open) {
    sidebar.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    scrim.hidden = !open;
    menuOpen.setAttribute("aria-expanded", String(open));
    main.inert = open;
    footer.inert = open;
    topbar.inert = open;
    toTop.inert = open;
    if (open) menuClose.focus();
  }

  function closeMenu() {
    setMenu(false);
    menuOpen.focus();
  }

  menuOpen.addEventListener("click", function () {
    setMenu(true);
  });

  menuClose.addEventListener("click", closeMenu);
  scrim.addEventListener("click", closeMenu);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) closeMenu();
  });

  /* ---------- Sidebar foot ---------- */
  var sidebarFoot = document.querySelector(".sidebar__foot");

  function syncSidebarFoot() {
    var reached = footer.getBoundingClientRect().top < window.innerHeight;
    sidebarFoot.classList.toggle("is-hidden", desktop.matches && reached);
  }

  syncSidebarFoot();
  window.addEventListener("scroll", syncSidebarFoot, { passive: true });
  window.addEventListener("resize", syncSidebarFoot);

  desktop.addEventListener("change", function () {
    setMenu(false);
    syncSidebarFoot();
  });

  /* ---------- Back to top ---------- */
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function syncToTop() {
    toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.75);
  }

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    main.focus({ preventScroll: true });
  });

  syncToTop();
  window.addEventListener("scroll", syncToTop, { passive: true });
  window.addEventListener("resize", syncToTop);

  /* ---------- Feature bulge ---------- */
  var bulgeItems = Array.prototype.slice.call(document.querySelectorAll(".bulge__item"));
  var bulgeList = document.querySelector("[data-bulge]");
  var bulgeWeights = [1, 0.42, 0.16];
  var bulgeActive = -1;

  function measureBulge() {
    var tallest = 0;
    bulgeItems.forEach(function (item) {
      var height = item.querySelector(".bulge__copy").scrollHeight;
      item.style.setProperty("--body", height + "px");
      tallest = Math.max(tallest, height);
    });
    bulgeList.style.setProperty("--count", bulgeItems.length);
    bulgeList.style.setProperty("--tallest", tallest + "px");
  }

  function setBulge(activeIndex) {
    if (activeIndex === bulgeActive) return;
    bulgeActive = activeIndex;
    bulgeItems.forEach(function (item, index) {
      var offset = index - activeIndex;
      var distance = Math.abs(offset);
      item.style.setProperty("--b", bulgeWeights[distance] || 0);
      item.style.setProperty("--t", Math.max(-3, Math.min(3, offset)));
      item.style.setProperty("--open", distance === 0 ? 1 : 0);
      item.classList.toggle("is-active", distance === 0);
      item.querySelector(".bulge__btn").setAttribute("aria-expanded", String(distance === 0));
    });
  }

  bulgeItems.forEach(function (item, index) {
    var button = item.querySelector(".bulge__btn");
    function activate() {
      setBulge(index);
    }
    button.addEventListener("focus", activate);
    button.addEventListener("click", activate);
    button.addEventListener("keydown", function (e) {
      var step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      bulgeItems[(index + step + bulgeItems.length) % bulgeItems.length].querySelector(".bulge__btn").focus();
    });
  });

 
  if (bulgeList) {
    measureBulge();
    setBulge(0);
    window.addEventListener("resize", measureBulge);
    if (document.fonts) document.fonts.ready.then(measureBulge);
    bulgeList.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var box = bulgeList.getBoundingClientRect();
      var zone = Math.floor((e.clientY - box.top) / box.height * bulgeItems.length);
      setBulge(Math.max(0, Math.min(bulgeItems.length - 1, zone)));
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var subject = form.elements.subject;
  var preset = new URLSearchParams(window.location.search).get("konu");
  Array.prototype.forEach.call(subject.options, function (option) {
    if (option.value === preset) subject.value = preset;
  });

  function messageFor(field) {
    if (field.validity.valueMissing) return field.type === "checkbox" ? "Devam etmek için onay vermelisiniz." : "Bu alan zorunludur.";
    if (field.validity.typeMismatch || field.validity.patternMismatch) return field.dataset.message;
    if (field.validity.tooShort) return "Mesajınız en az 10 karakter olmalıdır.";
    return "";
  }

  function validate(field) {
    var error = document.getElementById(field.id + "-error");
    if (!error) return true;
    var text = messageFor(field);
    error.lastElementChild.textContent = text;
    error.hidden = !text;
    if (text) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !text;
  }

  Array.prototype.forEach.call(form.elements, function (field) {
    field.addEventListener("blur", function () {
      validate(field);
    });
  });

  form.elements.name.addEventListener("input", function () {
    this.value = this.value.replace(/[0-9]/g, "");
  });

  form.elements.phone.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var invalid = null;
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!validate(field) && !invalid) invalid = field;
    });
    if (invalid) {
      invalid.focus();
      return;
    }
    var data = form.elements;
    var body = [
      "Ad Soyad: " + data.name.value,
      "E-posta: " + data.email.value,
      "Telefon: " + data.phone.value,
      "Kurum: " + data.organization.value,
      "",
      data.message.value
    ].join("\n");
    var title = "Web sitesi: " + subject.options[subject.selectedIndex].text;
    window.location.href = "mailto:info@karecode.com.tr?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body);
    form.querySelector(".form-status").hidden = false;
  });
})();
