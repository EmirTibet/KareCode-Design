document.addEventListener("DOMContentLoaded", function () {
  console.log("KareCode main.js yüklendi, .reveal sayısı:", document.querySelectorAll(".reveal").length);


  /* Mobil menü aç/kapat */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      var icon = toggle.querySelector(".material-symbols-outlined");
      if (icon) {
        icon.textContent = nav.classList.contains("open") ? "close" : "menu";
      }
    });
  }

  /* Kaydırmalı kart bölümü (carousel) */
  var track = document.querySelector(".carousel-track");
  if (track) {
    var leftBtn = document.querySelector(".carousel-arrow--left");
    var rightBtn = document.querySelector(".carousel-arrow--right");
    var dotsContainer = document.querySelector(".carousel-dots");
    var cards = track.querySelectorAll(".carousel-card");

    var cardsPerView = 1;
    var totalPages = 1;
    var pageStarts = [];

    function getCardStep() {
      if (!cards.length) return 0;
      return cards[0].getBoundingClientRect().width + 20; // gap dahil
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      for (var i = 0; i < totalPages; i++) {
        var dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", (i + 1) + ". görsel");
        dot.addEventListener("click", (function (index) {
          return function () {
            track.scrollTo({ left: pageStarts[index], behavior: "smooth" });
          };
        })(i));
        dotsContainer.appendChild(dot);
      }
    }

    function recalcPages() {
      var step = getCardStep();
      if (!step || !cards.length) return;

      cardsPerView = Math.max(1, Math.round(track.clientWidth / step));
      totalPages = Math.max(1, Math.ceil(cards.length / cardsPerView));

      pageStarts = [];
      for (var p = 0; p < totalPages; p++) {
        var cardIndex = Math.min(p * cardsPerView, cards.length - 1);
        pageStarts.push(cards[cardIndex].offsetLeft);
      }

      buildDots();
    }

    function currentPageIndex() {
      var closest = 0;
      var minDiff = Infinity;
      pageStarts.forEach(function (pos, i) {
        var diff = Math.abs(track.scrollLeft - pos);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      });
      return closest;
    }

    function updateActiveDot() {
      if (!dotsContainer || !pageStarts.length) return;
      var index = currentPageIndex();
      var dotEls = dotsContainer.querySelectorAll(".carousel-dot");
      dotEls.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function scrollByPage(direction) {
      if (!pageStarts.length) return;
      var nextPage = currentPageIndex() + direction;
      if (nextPage >= totalPages) nextPage = 0;
      if (nextPage < 0) nextPage = totalPages - 1;
      track.scrollTo({ left: pageStarts[nextPage], behavior: "smooth" });
    }

    if (leftBtn) leftBtn.addEventListener("click", function () { scrollByPage(-1); });
    if (rightBtn) rightBtn.addEventListener("click", function () { scrollByPage(1); });

    track.addEventListener("scroll", function () {
      updateActiveDot();
    });

    recalcPages();

    var carouselResizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(carouselResizeTimer);
      carouselResizeTimer = setTimeout(function () {
        recalcPages();
        track.scrollTo({ left: 0, behavior: "auto" });
      }, 200);
    });
  }

  
  var phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");
    });
  }

  /* Mesaj karakter sayacı */
  var messageInput = document.getElementById("message");
  var messageCount = document.getElementById("messageCount");
  if (messageInput && messageCount) {
    messageInput.addEventListener("input", function () {
      messageCount.textContent = messageInput.value.length;
    });
  }

  /* İstatistik sayaç animasyonu (Hakkımızda) */
  var statNums = document.querySelectorAll(".stats-row .num");
  if (statNums.length) {
    var prefersReducedStats =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var parseStatValue = function (text) {
      var raw = text.trim();
      var prefix = "";
      var suffix = "";
      if (raw.charAt(0) === "%") {
        prefix = "%";
        raw = raw.slice(1);
      }
      if (raw.charAt(raw.length - 1) === "+") {
        suffix = "+";
        raw = raw.slice(0, -1);
      }
      var normalized = raw.replace(",", ".");
      var decimals =
        normalized.indexOf(".") > -1 ? normalized.split(".")[1].length : 0;
      var value = parseFloat(normalized);
      return { prefix: prefix, suffix: suffix, value: value, decimals: decimals };
    };

    var animateStat = function (el) {
      var data = parseStatValue(el.textContent);
      if (isNaN(data.value) || prefersReducedStats) return;

      var duration = 1400;
      var start = null;

      var step = function (timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        var current = data.value * eased;
        el.textContent = data.prefix + current.toFixed(data.decimals) + data.suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent =
            data.prefix + data.value.toFixed(data.decimals) + data.suffix;
        }
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var statsObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateStat(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      statNums.forEach(function (el) {
        statsObserver.observe(el);
      });
    }
  }

  /* TaptoTop butonu */
  var scrollBtn = document.getElementById("scrollTopBtn");
  if (scrollBtn) {
    window.addEventListener("scroll", function () {
      scrollBtn.classList.toggle("show", window.scrollY > 400);
    });
    scrollBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Scroll ile beliren animasyonlar  */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

      
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          revealEls.forEach(function (el) { revealObserver.observe(el); });
        });
      });
    }
  }

});