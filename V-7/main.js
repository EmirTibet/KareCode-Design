(function () {
  "use strict";

  const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)");

  function hareketAzMi() {
    return azHareket.matches;
  }

  function gozle(ogeler, secenekler, gorununce) {
    if (!("IntersectionObserver" in window)) {
      ogeler.forEach(gorununce);
      return;
    }
    const gozcu = new IntersectionObserver(function (kayitlar) {
      kayitlar.forEach(function (kayit) {
        if (kayit.isIntersecting) {
          gorununce(kayit.target);
          gozcu.unobserve(kayit.target);
        }
      });
    }, secenekler);
    ogeler.forEach(function (oge) {
      gozcu.observe(oge);
    });
  }

  function animasyonDongusu(alan, ciz) {
    let calisiyor = false;
    let gorunur = true;
    let cerceve = 0;

    function dongu(zaman) {
      if (!calisiyor) {
        return;
      }
      ciz(zaman / 1000);
      cerceve = window.requestAnimationFrame(dongu);
    }

    function baslat() {
      if (calisiyor || hareketAzMi() || !gorunur || document.hidden) {
        return;
      }
      calisiyor = true;
      cerceve = window.requestAnimationFrame(dongu);
    }

    function durdur() {
      calisiyor = false;
      window.cancelAnimationFrame(cerceve);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (kayitlar) {
        gorunur = kayitlar[0].isIntersecting;
        if (gorunur) {
          baslat();
        } else {
          durdur();
        }
      }).observe(alan);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        durdur();
      } else {
        baslat();
      }
    });

    return function yenile() {
      durdur();
      if (hareketAzMi()) {
        ciz(2.4);
      } else {
        baslat();
      }
    };
  }

  function boyutDinle(geriCagir) {
    let zamanlayici = 0;
    let sonGenislik = window.innerWidth;
    window.addEventListener("resize", function () {
      if (Math.abs(window.innerWidth - sonGenislik) < 2) {
        return;
      }
      sonGenislik = window.innerWidth;
      window.clearTimeout(zamanlayici);
      zamanlayici = window.setTimeout(geriCagir, 180);
    });
    azHareket.addEventListener("change", geriCagir);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(geriCagir);
    } else {
      geriCagir();
    }
  }

  function kaydirmaDinle(geriCagir) {
    let bekliyor = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!bekliyor) {
          bekliyor = true;
          window.requestAnimationFrame(function () {
            geriCagir();
            bekliyor = false;
          });
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", geriCagir);
    geriCagir();
  }

  function bildir(metin) {
    let kutu = document.querySelector("[data-bildirim]");
    if (!kutu) {
      kutu = document.createElement("p");
      kutu.className = "bildirim";
      kutu.setAttribute("data-bildirim", "");
      kutu.setAttribute("role", "status");
      kutu.innerHTML = '<i class="ti ti-circle-check" aria-hidden="true"></i><span></span>';
      document.body.appendChild(kutu);
    }
    kutu.querySelector("span").textContent = metin;
    kutu.classList.add("gorunur");
    window.clearTimeout(bildir.zaman);
    bildir.zaman = window.setTimeout(function () {
      kutu.classList.remove("gorunur");
    }, 2400);
  }

  function yiliYaz() {
    const yil = String(new Date().getFullYear());
    document.querySelectorAll("[data-yil]").forEach(function (alan) {
      alan.textContent = yil;
    });
  }

  function ustMenu() {
    const ust = document.querySelector("[data-ust]");
    const dugme = document.querySelector("[data-menu-ac]");
    const menu = document.getElementById("menu");
    if (!ust) {
      return;
    }

    kaydirmaDinle(function () {
      ust.classList.toggle("ust--golgeli", window.scrollY > 8);
    });

    if (!dugme || !menu) {
      return;
    }

    function ayarla(acik) {
      dugme.setAttribute("aria-expanded", String(acik));
      dugme.setAttribute("aria-label", acik ? "Menüyü kapat" : "Menüyü aç");
      menu.classList.toggle("menu--acik", acik);
    }

    dugme.addEventListener("click", function () {
      ayarla(dugme.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (olay) {
      if (olay.key === "Escape" && menu.classList.contains("menu--acik")) {
        ayarla(false);
        dugme.focus();
      }
    });

    document.addEventListener("click", function (olay) {
      if (menu.classList.contains("menu--acik") && !ust.contains(olay.target)) {
        ayarla(false);
      }
    });

    menu.querySelectorAll("a").forEach(function (bag) {
      bag.addEventListener("click", function () {
        ayarla(false);
      });
    });

    window.matchMedia("(min-width: 921px)").addEventListener("change", function (sorgu) {
      if (sorgu.matches) {
        ayarla(false);
      }
    });
  }

  function aktifBaglanti() {
    const dosya = window.location.pathname.split("/").pop() || "index.html";
    const sayfa = dosya.replace(".html", "") || "index";
    document.querySelectorAll("[data-sayfa]").forEach(function (bag) {
      if (bag.getAttribute("data-sayfa") === sayfa) {
        bag.setAttribute("aria-current", "page");
      } else {
        bag.removeAttribute("aria-current");
      }
    });
  }

  function sayfaGecisi() {
    window.addEventListener("pageshow", function () {
      document.body.classList.remove("sayfa-cikis");
    });

    document.addEventListener("click", function (olay) {
      const bag = olay.target.closest("a[href]");
      if (!bag || olay.defaultPrevented || hareketAzMi()) {
        return;
      }
      if (olay.button !== 0 || olay.metaKey || olay.ctrlKey || olay.shiftKey || olay.altKey) {
        return;
      }
      if ((bag.target && bag.target !== "_self") || bag.hasAttribute("download")) {
        return;
      }
      const hedef = new URL(bag.href, window.location.href);
      if (hedef.origin !== window.location.origin || !/\.html$|\/$/.test(hedef.pathname)) {
        return;
      }
      if (hedef.pathname === window.location.pathname) {
        return;
      }
      olay.preventDefault();
      document.body.classList.add("sayfa-cikis");
      window.setTimeout(function () {
        window.location.href = hedef.href;
      }, 200);
    });
  }

  function belirmeler() {
    const ogeler = Array.from(document.querySelectorAll("[data-belir]"));

    function tamamla(oge) {
      oge.classList.add("gorunur");
      const sira = parseFloat(getComputedStyle(oge).getPropertyValue("--i")) || 0;
      window.setTimeout(function () {
        oge.removeAttribute("data-belir");
        oge.classList.remove("gorunur");
      }, hareketAzMi() ? 0 : 900 + sira * 90);
    }

    if (hareketAzMi()) {
      ogeler.forEach(tamamla);
      return;
    }
    gozle(ogeler, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }, tamamla);
  }

  function sayaclar() {
    const sayilar = Array.from(document.querySelectorAll("[data-say]"));

    function say(oge) {
      const hedef = parseInt(oge.getAttribute("data-say"), 10) || 0;
      const yazi = oge.querySelector("[data-say-deger]") || oge;
      if (hareketAzMi()) {
        yazi.textContent = String(hedef);
        return;
      }
      const baslangic = performance.now();
      function adim(simdi) {
        const oran = Math.min(1, (simdi - baslangic) / 1400);
        yazi.textContent = String(Math.round(hedef * (1 - Math.pow(1 - oran, 3))));
        if (oran < 1) {
          window.requestAnimationFrame(adim);
        }
      }
      window.requestAnimationFrame(adim);
    }

    gozle(sayilar, { threshold: 0.6 }, say);
  }

  function kelimelereBol(kap, sinif, sayac) {
    let sira = 0;
    function isle(dugum) {
      Array.from(dugum.childNodes).forEach(function (cocuk) {
        if (cocuk.nodeType === Node.TEXT_NODE) {
          const parca = document.createDocumentFragment();
          cocuk.textContent.split(/(\s+)/).forEach(function (metin) {
            if (!metin) {
              return;
            }
            if (/^\s+$/.test(metin)) {
              parca.appendChild(document.createTextNode(" "));
              return;
            }
            const kelime = document.createElement("span");
            kelime.className = sinif;
            if (sayac) {
              kelime.style.setProperty("--k", String(sira));
            }
            kelime.textContent = metin;
            sira += 1;
            parca.appendChild(kelime);
          });
          dugum.replaceChild(parca, cocuk);
        } else if (cocuk.nodeType === Node.ELEMENT_NODE) {
          isle(cocuk);
        }
      });
    }
    isle(kap);
  }

  function hero() {
    const baslik = document.querySelector("[data-hero] [data-kelimeler]");
    if (baslik) {
      kelimelereBol(baslik, "kelime", true);
    }
  }

  function senaryo() {
    const kap = document.querySelector("[data-senaryo]");
    if (!kap) {
      return;
    }
    const gosterge = kap.querySelector("[data-gosterge]");
    const etiket = kap.querySelector("[data-gosterge-etiket]");
    const paneller = Array.from(kap.querySelectorAll("[data-senaryo-panel]"));
    const radyolar = Array.from(kap.querySelectorAll("input[name='senaryo']"));

    function guncelle() {
      const secili = radyolar.find(function (r) {
        return r.checked;
      });
      if (!secili) {
        return;
      }
      gosterge.style.setProperty("--aci", secili.getAttribute("data-aci") + "deg");
      etiket.textContent = secili.getAttribute("data-duzey");
      paneller.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-senaryo-panel") !== secili.value;
      });
    }

    radyolar.forEach(function (r) {
      r.addEventListener("change", guncelle);
    });
    guncelle();
  }

  function akis() {
    const kap = document.querySelector("[data-akis]");
    if (!kap) {
      return;
    }
    const adimlar = Array.from(kap.querySelectorAll(".akis__adim"));
    const telefon = kap.querySelector("[data-telefon]");

    function sec(sira) {
      adimlar.forEach(function (adim, i) {
        adim.classList.toggle("etkin", i <= sira);
      });
      if (telefon) {
        telefon.setAttribute("data-ekran", String(sira + 1));
      }
    }

    if (!("IntersectionObserver" in window)) {
      sec(adimlar.length - 1);
      return;
    }
    const gozcu = new IntersectionObserver(
      function (kayitlar) {
        kayitlar.forEach(function (kayit) {
          if (kayit.isIntersecting) {
            sec(adimlar.indexOf(kayit.target));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    adimlar.forEach(function (adim) {
      gozcu.observe(adim);
    });
  }

  function ayakIzi() {
    const anahtar = document.querySelector("[data-anahtar]");
    const yorunge = document.querySelector("[data-yorunge]");
    if (anahtar) {
      const dugmeler = Array.from(anahtar.querySelectorAll("[data-filtre]"));
      const aciklamalar = Array.from(document.querySelectorAll("[data-iz-aciklama]"));
      dugmeler.forEach(function (dugme) {
        dugme.addEventListener("click", function () {
          const filtre = dugme.getAttribute("data-filtre");
          anahtar.setAttribute("data-secili", filtre);
          dugmeler.forEach(function (d) {
            d.setAttribute("aria-pressed", String(d === dugme));
          });
          if (yorunge) {
            yorunge.setAttribute("data-filtre", filtre);
          }
          aciklamalar.forEach(function (a) {
            a.hidden = a.getAttribute("data-iz-aciklama") !== filtre;
          });
        });
      });
    }

    if (!yorunge) {
      return;
    }
    const dugumler = Array.from(yorunge.querySelectorAll(".yorunge__dugum"));

    function yerlestir(sn) {
      const g = yorunge.clientWidth;
      const h = yorunge.clientHeight;
      const rx = g * (g < 420 ? 0.36 : 0.44);
      const ry = h * (g < 420 ? 0.32 : 0.29);
      dugumler.forEach(function (d, i) {
        const aci = (i / dugumler.length) * Math.PI * 2 + sn * 0.16;
        const derinlik = (Math.sin(aci) + 1) / 2;
        const x = Math.cos(aci) * rx;
        const y = Math.sin(aci) * ry;
        const olcek = 0.78 + derinlik * 0.32;
        d.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) scale(" + olcek.toFixed(3) + ")";
        d.style.zIndex = String(Math.sin(aci) > 0 ? 60 : 10);
      });
    }

    const yenile = animasyonDongusu(yorunge, yerlestir);
    boyutDinle(yenile);
  }

  function karusel() {
    document.querySelectorAll("[data-karusel]").forEach(function (kap) {
      const iz = kap.querySelector("[data-karusel-iz]");
      const geri = kap.querySelector("[data-karusel-geri]");
      const ileri = kap.querySelector("[data-karusel-ileri]");

      function durum() {
        const son = iz.scrollWidth - iz.clientWidth - 2;
        geri.disabled = iz.scrollLeft <= 2;
        ileri.disabled = iz.scrollLeft >= son;
      }

      function kaydir(yon) {
        const kart = iz.firstElementChild;
        const adim = kart ? kart.getBoundingClientRect().width + 16 : iz.clientWidth * 0.8;
        iz.scrollBy({ left: yon * adim, behavior: hareketAzMi() ? "auto" : "smooth" });
      }

      geri.addEventListener("click", function () {
        kaydir(-1);
      });
      ileri.addEventListener("click", function () {
        kaydir(1);
      });
      iz.addEventListener("scroll", durum, { passive: true });
      window.addEventListener("resize", durum);
      durum();
    });
  }

  function hat() {
    const paketler = Array.from(document.querySelectorAll(".hat__paket"));
    if (!paketler.length) {
      return;
    }
    function olc() {
      paketler.forEach(function (paket, i) {
        paket.style.setProperty("--mesafe", Math.max(0, paket.clientWidth - 10) + "px");
        paket.style.setProperty("--p", i * 0.6 + "s");
      });
    }
    window.addEventListener("resize", olc);
    olc();
  }

  function loglar() {
    const ogeler = Array.from(document.querySelectorAll("[data-log]"));
    ogeler.forEach(function (oge) {
      oge.querySelectorAll("li").forEach(function (satir, sira) {
        satir.style.setProperty("--s", String(sira));
      });
    });
    gozle(ogeler, { threshold: 0.3 }, function (oge) {
      oge.classList.add("oynat");
    });
  }

  function manifesto() {
    const metin = document.querySelector("[data-manifesto]");
    if (!metin) {
      return;
    }
    kelimelereBol(metin, "km", false);
    const kelimeler = Array.from(metin.querySelectorAll(".km"));
    if (hareketAzMi()) {
      kelimeler.forEach(function (k) {
        k.classList.add("yandi");
      });
      return;
    }
    kaydirmaDinle(function () {
      const kutu = metin.getBoundingClientRect();
      const vh = window.innerHeight;
      const ilerleme = Math.max(0, Math.min(1, (vh * 0.8 - kutu.top) / (kutu.height + vh * 0.25)));
      const sinir = Math.round(ilerleme * kelimeler.length);
      kelimeler.forEach(function (k, i) {
        k.classList.toggle("yandi", i < sinir);
      });
    });
  }

  function yol() {
    const kap = document.querySelector("[data-yol]");
    if (!kap) {
      return;
    }
    const dolgu = kap.querySelector(".yol__dolgu");
    if (hareketAzMi()) {
      dolgu.style.transform = "scaleY(1)";
      return;
    }
    kaydirmaDinle(function () {
      const kutu = kap.getBoundingClientRect();
      const vh = window.innerHeight;
      const ilerleme = Math.max(0, Math.min(1, (vh * 0.6 - kutu.top) / kutu.height));
      dolgu.style.transform = "scaleY(" + ilerleme.toFixed(3) + ")";
    });
  }

  function sektorler() {
    const liste = document.querySelector("[data-sektorler]");
    if (!liste) {
      return;
    }
    const mobil = window.matchMedia("(max-width: 680px)");
    const durdurDugme = document.querySelector("[data-sektor-durdur]");
    const sirali = Array.from(liste.children);
    const SURE = 5000;
    let sira = 0;
    let zamanlayici = 0;
    let elleDurduruldu = false;
    let uzerinde = false;
    let gorunur = false;

    function sec(secilen, odakla) {
      const dugme = secilen.querySelector(".sektor__dugme");
      if (dugme.getAttribute("aria-pressed") === "true") {
        return;
      }
      const ogeler = Array.from(liste.children);
      const once = new Map();
      ogeler.forEach(function (oge) {
        once.set(oge, oge.getBoundingClientRect());
      });

      ogeler.forEach(function (oge) {
        oge.classList.remove("sektor--buyuk");
        oge.querySelector(".sektor__dugme").setAttribute("aria-pressed", "false");
        oge.querySelector(".sektor__resim").setAttribute("sizes", liste.getAttribute("data-sizes-kucuk"));
      });
      secilen.classList.add("sektor--buyuk");
      secilen.querySelector(".sektor__resim").setAttribute("sizes", liste.getAttribute("data-sizes-buyuk"));
      dugme.setAttribute("aria-pressed", "true");
      liste.insertBefore(secilen, liste.firstElementChild);
      if (odakla) {
        dugme.focus({ preventScroll: true });
      }

      if (hareketAzMi()) {
        return;
      }

      const oynayanlar = [];
      ogeler.forEach(function (oge) {
        const a = once.get(oge);
        const b = oge.getBoundingClientRect();
        if (!b.width || !b.height) {
          return;
        }
        const dx = a.left - b.left;
        const dy = a.top - b.top;
        const sx = a.width / b.width;
        const sy = a.height / b.height;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) {
          return;
        }
        oge.style.transformOrigin = "top left";
        oge.style.transition = "none";
        oge.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + sx.toFixed(3) + "," + sy.toFixed(3) + ")";
        oynayanlar.push(oge);
      });

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          oynayanlar.forEach(function (oge) {
            oge.style.transition = "transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)";
            oge.style.transform = "";
          });
        });
      });

      window.setTimeout(function () {
        oynayanlar.forEach(function (oge) {
          oge.style.transition = "";
          oge.style.transformOrigin = "";
        });
      }, 700);
    }

    function calismali() {
      return !elleDurduruldu && !uzerinde && gorunur && !document.hidden && !mobil.matches && !hareketAzMi();
    }

    function planla() {
      window.clearTimeout(zamanlayici);
      if (!calismali()) {
        return;
      }
      zamanlayici = window.setTimeout(function () {
        if (!calismali()) {
          return;
        }
        sira = (sira + 1) % sirali.length;
        sec(sirali[sira], false);
        planla();
      }, SURE);
    }

    liste.addEventListener("click", function (olay) {
      const dugme = olay.target.closest(".sektor__dugme");
      if (!dugme || mobil.matches) {
        return;
      }
      const secilen = dugme.parentElement;
      sira = sirali.indexOf(secilen);
      sec(secilen, true);
      planla();
    });

    liste.addEventListener("pointerenter", function () {
      uzerinde = true;
      planla();
    });
    liste.addEventListener("pointerleave", function () {
      uzerinde = false;
      planla();
    });
    liste.addEventListener("focusin", function () {
      uzerinde = true;
      planla();
    });
    liste.addEventListener("focusout", function (olay) {
      if (!liste.contains(olay.relatedTarget)) {
        uzerinde = false;
        planla();
      }
    });

    if (durdurDugme) {
      durdurDugme.addEventListener("click", function () {
        elleDurduruldu = !elleDurduruldu;
        durdurDugme.setAttribute("aria-pressed", String(elleDurduruldu));
        durdurDugme.querySelector(".ti").className = elleDurduruldu ? "ti ti-player-play" : "ti ti-player-pause";
        durdurDugme.querySelector("span").textContent = elleDurduruldu ? "Otomatik geçişi başlat" : "Otomatik geçişi durdur";
        planla();
      });
      if (hareketAzMi()) {
        durdurDugme.hidden = true;
      }
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (kayitlar) {
        gorunur = kayitlar[0].isIntersecting;
        planla();
      }, { threshold: 0.35 }).observe(liste);
    }

    document.addEventListener("visibilitychange", planla);
    mobil.addEventListener("change", planla);
    azHareket.addEventListener("change", planla);
  }

  function kopyala() {
    document.querySelectorAll("[data-kopyala]").forEach(function (dugme) {
      dugme.addEventListener("click", function () {
        const metin = dugme.getAttribute("data-kopyala");
        const etiket = dugme.getAttribute("data-kopyala-etiket") || "Bilgi";
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(metin).then(
            function () {
              bildir(etiket + " panoya kopyalandı");
            },
            function () {
              bildir("Kopyalanamadı; metni elle seçebilirsiniz");
            }
          );
        } else {
          bildir("Kopyalanamadı; metni elle seçebilirsiniz");
        }
      });
    });
  }

  function sssArama() {
    const giris = document.querySelector("[data-sss-ara]");
    if (!giris) {
      return;
    }
    const ogeler = Array.from(document.querySelectorAll(".sss__oge"));
    const yok = document.querySelector("[data-sss-yok]");
    giris.addEventListener("input", function () {
      const aranan = giris.value.trim().toLocaleLowerCase("tr");
      let gorunen = 0;
      ogeler.forEach(function (oge) {
        const eslesir = !aranan || oge.textContent.toLocaleLowerCase("tr").indexOf(aranan) > -1;
        oge.hidden = !eslesir;
        if (eslesir) {
          gorunen += 1;
        }
      });
      yok.hidden = gorunen > 0;
    });
  }

  function sss() {
    document.querySelectorAll("[data-sss]").forEach(function (dugme) {
      const panel = document.getElementById(dugme.getAttribute("aria-controls"));
      if (!panel) {
        return;
      }
      dugme.addEventListener("click", function () {
        const acik = dugme.getAttribute("aria-expanded") === "true";
        dugme.setAttribute("aria-expanded", String(!acik));
        panel.hidden = acik;
      });
    });
  }

  function yukari() {
    const dugme = document.querySelector("[data-yukari]");
    if (!dugme) {
      return;
    }
    kaydirmaDinle(function () {
      dugme.classList.toggle("gorunur", window.scrollY > 600);
    });
    dugme.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: hareketAzMi() ? "auto" : "smooth" });
      const hedef = document.getElementById("icerik");
      if (hedef) {
        hedef.focus({ preventScroll: true });
      }
    });
  }

  function iletisimFormu() {
    const form = document.querySelector("[data-form]");
    if (!form) {
      return;
    }
    const adres = form.getAttribute("data-eposta");
    const durum = document.querySelector("[data-form-durum]");
    const durumIkon = durum.querySelector(".ti");
    const durumBaslik = durum.querySelector("[data-form-durum-baslik]");
    const durumMetin = durum.querySelector("[data-form-durum-metin]");
    const durumBag = durum.querySelector("[data-form-durum-bag]");
    const konuGrubu = form.querySelector("[data-konu]");
    const epostaDeseni = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const kurallar = {
      ad: function (deger) {
        if (!deger) {
          return "Adınızı yazın; size nasıl hitap edeceğimizi bilelim.";
        }
        return deger.length < 2 ? "Ad en az 2 karakter olmalı." : "";
      },
      eposta: function (deger) {
        if (!deger) {
          return "Size dönebilmemiz için e-posta adresinizi yazın.";
        }
        if (deger.indexOf("@") === -1) {
          return "E-posta adresinde @ işareti olmalı. Örnek: ad@alanadi.com";
        }
        return epostaDeseni.test(deger) ? "" : "Bu adres geçerli görünmüyor. Örnek: ad@alanadi.com";
      },
      telefon: function (deger) {
        if (!deger) {
          return "Size ulaşabilmemiz için telefon numaranızı yazın.";
        }
        return /^[0-9]{11}$/.test(deger) ? "" : "Telefon numarası 11 haneli olmalı. Örnek: 05XXXXXXXXX";
      },
      mesaj: function (deger) {
        if (!deger) {
          return "Mesaj alanı boş bırakılamaz.";
        }
        if (deger.length > 750) {
          return "Mesaj en fazla 750 karakter olabilir.";
        }
        return deger.length < 10 ? "Biraz daha ayrıntı yazın; en az 10 karakter." : "";
      }
    };

    const alanlar = Array.from(form.querySelectorAll("input, textarea")).filter(function (alan) {
      return Boolean(kurallar[alan.name]);
    });
    const telefon = form.querySelector("[data-telefon-alani]");
    const mesaj = form.querySelector("#mesaj");
    const sayac = form.querySelector("[data-mesaj-sayac]");

    if (telefon) {
      telefon.addEventListener("input", function () {
        const temiz = telefon.value.replace(/[^0-9]/g, "").slice(0, 11);
        if (telefon.value !== temiz) {
          telefon.value = temiz;
        }
      });
    }

    function sayaciYaz() {
      if (!mesaj || !sayac) {
        return;
      }
      if (mesaj.value.length > 750) {
        mesaj.value = mesaj.value.slice(0, 750);
      }
      const uzunluk = mesaj.value.length;
      sayac.textContent = uzunluk + " / 750";
      sayac.classList.toggle("dolu", uzunluk >= 750);
    }

    if (mesaj) {
      mesaj.addEventListener("input", sayaciYaz);
      sayaciYaz();
    }

    function dogrula(alan) {
      const hata = kurallar[alan.name](alan.value.trim());
      document.getElementById(alan.name + "-hata").textContent = hata;
      if (hata) {
        alan.setAttribute("aria-invalid", "true");
      } else {
        alan.removeAttribute("aria-invalid");
      }
      return !hata;
    }

    function konuDogrula() {
      const secili = form.querySelector("input[name='konu']:checked");
      const kutu = document.getElementById("konu-hata");
      kutu.textContent = secili ? "" : "Mesajınızın konusunu seçin.";
      if (secili) {
        konuGrubu.removeAttribute("data-hatali");
      } else {
        konuGrubu.setAttribute("data-hatali", "");
      }
      return Boolean(secili);
    }

    alanlar.forEach(function (alan) {
      alan.addEventListener("blur", function () {
        if (alan.value.trim() || alan.hasAttribute("aria-invalid")) {
          dogrula(alan);
        }
      });
      alan.addEventListener("input", function () {
        if (alan.hasAttribute("aria-invalid")) {
          dogrula(alan);
        }
      });
    });

    form.querySelectorAll("input[name='konu']").forEach(function (r) {
      r.addEventListener("change", konuDogrula);
    });

    form.addEventListener("submit", function (olay) {
      olay.preventDefault();
      const hatalilar = alanlar.filter(function (alan) {
        return !dogrula(alan);
      });
      const konuTamam = konuDogrula();
      durum.hidden = false;
      if (hatalilar.length || !konuTamam) {
        const sayi = hatalilar.length + (konuTamam ? 0 : 1);
        durum.classList.add("form-durum--hata");
        durumIkon.className = "ti ti-alert-circle";
        durumBaslik.textContent = "Formda düzeltilmesi gereken " + sayi + " alan var.";
        durumMetin.textContent = "İşaretli alanlardaki açıklamalara göre bilgileri tamamlayın.";
        durumBag.hidden = true;
        if (hatalilar.length) {
          hatalilar[0].focus();
        } else {
          form.querySelector("input[name='konu']").focus();
        }
        return;
      }

      const veri = new FormData(form);
      const ad = String(veri.get("ad")).trim();
      const kurum = String(veri.get("kurum") || "").trim();
      const konu = "[KareCode] " + veri.get("konu") + " - " + ad;
      const govde =
        "Ad: " + ad + "\n" +
        (kurum ? "Kurum: " + kurum + "\n" : "") +
        "E-posta: " + String(veri.get("eposta")).trim() + "\n" +
        "Telefon: " + String(veri.get("telefon")).trim() + "\n" +
        "Konu: " + veri.get("konu") + "\n\n" +
        String(veri.get("mesaj")).trim();
      const bag = "mailto:" + adres + "?subject=" + encodeURIComponent(konu) + "&body=" + encodeURIComponent(govde);

      durum.classList.remove("form-durum--hata");
      durumIkon.className = "ti ti-mail-forward";
      durumBaslik.textContent = "Mesajınız e-posta uygulamanızda hazırlandı.";
      durumMetin.textContent =
        "Bu site mesajları kendisi iletmez. Açılan taslağı kontrol edip Gönder'e bastığınızda mesaj " + adres + " adresine ulaşır. Uygulama açılmadıysa aşağıdaki bağlantıyı kullanın.";
      durumBag.hidden = false;
      durumBag.href = bag;
      durum.focus();
      window.location.href = bag;
    });
  }

  yiliYaz();
  ustMenu();
  aktifBaglanti();
  sayfaGecisi();
  hero();
  yukari();
  belirmeler();
  sayaclar();
  senaryo();
  akis();
  ayakIzi();
  karusel();
  hat();
  loglar();
  manifesto();
  yol();
  sektorler();
  kopyala();
  sssArama();
  sss();
  iletisimFormu();
})();
