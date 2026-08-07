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
    var dots = document.querySelectorAll(".carousel-dot");
    var cards = track.querySelectorAll(".carousel-card");

    function scrollByCard(direction) {
      var card = cards[0];
      if (!card) return;
      var cardWidth = card.getBoundingClientRect().width + 20; // gap dahil

      
      if (direction > 0) {
        var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        if (atEnd) {
          track.scrollTo({ left: 0, behavior: "smooth" });
          return;
        }
      }

      if (direction < 0) {
        var atStart = track.scrollLeft <= 4;
        if (atStart) {
          track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
          return;
        }
      }

      track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    }

    if (leftBtn) leftBtn.addEventListener("click", function () { scrollByCard(-1); });
    if (rightBtn) rightBtn.addEventListener("click", function () { scrollByCard(1); });

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        var card = cards[i];
        if (!card) return;
        track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
      });
    });

    track.addEventListener("scroll", function () {
      var index = Math.round(track.scrollLeft / (cards[0].getBoundingClientRect().width + 20));
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    });
  }

  /* Telefon alanına sadece rakam girilebilsin */
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