document.addEventListener("DOMContentLoaded", function () {
  console.log("KareCode main.js yüklendi, .reveal sayısı:", document.querySelectorAll(".reveal").length);


  /* Mobil menü aç/kapat */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
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