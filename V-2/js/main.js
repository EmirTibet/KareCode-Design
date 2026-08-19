document.addEventListener("DOMContentLoaded", function () {
  var toTop = document.createElement("a");
  toTop.href = "#ust";
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Sayfanın başına dön");
  toTop.setAttribute(
    "style",
    [
      "position:fixed",
      "right:var(--sp-6)",
      "bottom:var(--sp-6)",
      "z-index:var(--z-sticky)",
      "width:42px",
      "height:42px",
      "display:grid",
      "place-items:center",
      "background:var(--gray-900)",
      "color:var(--white)",
      "border-radius:var(--r-md)",
      "box-shadow:var(--shadow-md)",
      "font-size:18px",
      "opacity:0",
      "visibility:hidden",
      "pointer-events:none",
      "transition:opacity var(--dur-base) var(--ease), visibility var(--dur-base), background var(--dur-fast) var(--ease)",
    ].join(";"),
  );

  var icon = document.createElement("span");
  icon.className = "material-symbols-outlined";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "arrow_upward";
  toTop.appendChild(icon);
  document.body.appendChild(toTop);

  toTop.addEventListener("mouseenter", function () {
    toTop.style.background = "var(--gray-700)";
  });
  toTop.addEventListener("mouseleave", function () {
    toTop.style.background = "var(--gray-900)";
  });
  toTop.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  var footer = document.querySelector(".footer");
  var scrolledDown = false;
  var footerVisible = false;

  function syncToTop() {
    var visible = scrolledDown && !footerVisible;
    toTop.style.opacity = visible ? "1" : "0";
    toTop.style.visibility = visible ? "visible" : "hidden";
    toTop.style.pointerEvents = visible ? "auto" : "none";
  }

  scrolledDown = window.scrollY > 400;
  syncToTop();
  window.addEventListener(
    "scroll",
    function () {
      scrolledDown = window.scrollY > 400;
      syncToTop();
    },
    { passive: true },
  );

  if (footer && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        footerVisible = entry.isIntersecting;
        syncToTop();
      });
    }).observe(footer);
  }

  var headingSelectors = [
    "h1",
    "h2",
    ".display",
    ".h1",
    ".h2",
    ".h3",
    ".block__title",
    ".page-hero__title",
    ".hero__title",
    ".card__title",
    ".cta__title",
  ].join(", ");

  var headings = document.querySelectorAll(headingSelectors);

  if ("IntersectionObserver" in window && headings.length) {
    var headingObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("anim-in");
            headingObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );

    headings.forEach(function (el) {
      el.classList.add("anim-ready");
      headingObserver.observe(el);
    });
  } else {
    headings.forEach(function (el) {
      el.classList.add("anim-in");
    });
  }

  var counters = document.querySelectorAll("[data-count-to]");

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count-to"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1200;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var suffix = el.getAttribute("data-suffix") || "";
      el.textContent = target + suffix;
    });
  }
});