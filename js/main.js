
document.addEventListener("DOMContentLoaded", function () {

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


});