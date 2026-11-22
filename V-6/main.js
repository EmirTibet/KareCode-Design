/* KareCode V-6 — etkileşimler */
(() => {
  "use strict";

  const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, k = document) => k.querySelector(s);
  const $$ = (s, k = document) => [...k.querySelectorAll(s)];

  /* ---------- Yıl ---------- */
  $$("[data-yil]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Header: gece sahnesini geçince dolu ---------- */
  const ust = $("[data-ust]");
  const sahne = $(".sahne");
  const ustGuncelle = () => {
    const sinir = sahne ? sahne.offsetHeight - 80 : 10;
    ust && ust.classList.toggle("is-dolu", window.scrollY > sinir);
  };
  ustGuncelle();
  window.addEventListener("scroll", ustGuncelle, { passive: true });
  window.addEventListener("resize", ustGuncelle);

  const taptotop = $("[data-taptotop]");
  if (taptotop) {
    const yGuncelle = () => taptotop.classList.toggle("is-gorunur", window.scrollY > 600);
    yGuncelle();
    window.addEventListener("scroll", yGuncelle, { passive: true });
    taptotop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "instant" });
      const icerik = $("#icerik");
      if (icerik) icerik.focus({ preventScroll: true });
    });
  }

  /* ---------- Mobil menü ---------- */
  const menuAc = $("[data-menu-ac]");
  const menu = $("#menu");
  if (menuAc && menu) {
    const kapat = (odak = true) => {
      document.body.classList.remove("menu-acik");
      menuAc.setAttribute("aria-expanded", "false");
      menuAc.setAttribute("aria-label", "Menüyü aç");
      if (odak) menuAc.focus();
    };
    menuAc.addEventListener("click", () => {
      const acik = document.body.classList.toggle("menu-acik");
      menuAc.setAttribute("aria-expanded", String(acik));
      menuAc.setAttribute("aria-label", acik ? "Menüyü kapat" : "Menüyü aç");
      if (acik) $("a", menu)?.focus();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-acik")) kapat();
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", () => kapat(false)));
    window.matchMedia("(min-width: 900px)").addEventListener("change", (m) => m.matches && kapat(false));
  }

  /* ---------- Bölüm belirme ---------- */
  const belirler = $$("[data-belir]");
  if ("IntersectionObserver" in window && !azHareket) {
    const io = new IntersectionObserver((girdiler) => {
      girdiler.forEach((g) => {
        if (g.isIntersecting) { g.target.classList.add("is-gorundu"); io.unobserve(g.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    belirler.forEach((el) => io.observe(el));
  } else {
    belirler.forEach((el) => el.classList.add("is-gorundu"));
  }

  /* ---------- Sayaç ---------- */
  const sayaclar = $$("[data-say]");
  const say = (el) => {
    const hedef = Number(el.dataset.say);
    if (azHareket) { el.textContent = hedef; return; }
    const bas = hedef > 1000 ? hedef - 120 : 0;
    const sure = 1600; const t0 = performance.now();
    const adim = (t) => {
      const p = Math.min(1, (t - t0) / sure);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(bas + (hedef - bas) * e);
      if (p < 1) requestAnimationFrame(adim);
    };
    requestAnimationFrame(adim);
  };
  if (sayaclar.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((g) => g.forEach((x) => {
      if (x.isIntersecting) { say(x.target); io.unobserve(x.target); }
    }), { threshold: 0.6 });
    sayaclar.forEach((el) => io.observe(el));
  }

  /* ---------- Güven şeridi: sonsuz döngü ---------- */
  $$("[data-serit]").forEach((iz) => {
    [...iz.children].forEach((li) => {
      const k = li.cloneNode(true);
      k.setAttribute("aria-hidden", "true");
      $$("img", k).forEach((i) => (i.alt = ""));
      iz.appendChild(k);
    });
  });

  /* ---------- 3D kalkan: fareyle eğilme ---------- */
  const kalkan = $("[data-kalkan]");
  if (kalkan && !azHareket && window.matchMedia("(pointer: fine)").matches) {
    const alan = kalkan.closest(".sahne") || document.body;
    const parlama = $("[data-parlama]", kalkan);
    alan.addEventListener("pointermove", (e) => {
      const r = kalkan.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      kalkan.style.setProperty("--ry", `${(nx * 34).toFixed(2)}deg`);
      kalkan.style.setProperty("--rx", `${(-ny * 24).toFixed(2)}deg`);
      if (parlama) {
        parlama.style.setProperty("--gx", `${50 + nx * 120}%`);
        parlama.style.setProperty("--gy", `${30 + ny * 100}%`);
      }
    });
    alan.addEventListener("pointerleave", () => {
      kalkan.style.setProperty("--rx", "0deg");
      kalkan.style.setProperty("--ry", "0deg");
    });
  }

  /* ---------- Orbit: scroll'da dön, sırayla vurgula ---------- */
  $$("[data-orbit]").forEach((bolum) => {
    const orbit = $(".orbit", bolum);
    const dugumler = $$(".orbit__dugum", orbit);
    const detay = $("[data-orbit-detay]", orbit);
    const n = dugumler.length;
    let aktif = -1;
    let donus = 0;

    const yerlestir = () => {
      const r = orbit.offsetWidth / 2;
      dugumler.forEach((d, i) => {
        const a = ((i * 360) / n + donus - 90) * (Math.PI / 180);
        d.style.setProperty("--x", `${(Math.cos(a) * r).toFixed(1)}px`);
        d.style.setProperty("--y", `${(Math.sin(a) * r).toFixed(1)}px`);
      });
      if (aktif > -1) orbit.style.setProperty("--isik-aci", `${(aktif * 360) / n + donus}deg`);
    };

    const sec = (i) => {
      if (i === aktif) return;
      aktif = i;
      dugumler.forEach((d, j) => {
        d.classList.toggle("is-aktif", j === i);
        d.setAttribute("aria-pressed", String(j === i));
      });
      if (detay) {
        const d = dugumler[i];
        detay.style.opacity = 0;
        setTimeout(() => {
          detay.innerHTML = `<b>${d.dataset.baslik}</b>${d.dataset.metin}`;
          detay.style.opacity = 1;
        }, azHareket ? 0 : 200);
      }
      yerlestir();
    };

    dugumler.forEach((d, i) => d.addEventListener("click", () => sec(i)));

    if (azHareket) { sec(0); yerlestir(); window.addEventListener("resize", yerlestir); return; }

    let bekliyor = false;
    const guncelle = () => {
      bekliyor = false;
      const r = bolum.getBoundingClientRect();
      const toplam = bolum.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, toplam)));
      // çember döner; aktif düğüm her zaman tepeye gelir
      donus = (-p * (n - 1) * 360) / n;
      sec(Math.round(p * (n - 1)));
      yerlestir();
    };
    const iste = () => { if (!bekliyor) { bekliyor = true; requestAnimationFrame(guncelle); } };
    window.addEventListener("scroll", iste, { passive: true });
    window.addEventListener("resize", iste);
    guncelle();
  });

  /* ---------- Noktalı kalkan (canvas) ---------- */
  $$("[data-noktalar]").forEach((kutu) => {
    const tuval = $("canvas", kutu);
    const ctx = tuval.getContext("2d");
    const test = document.createElement("canvas").getContext("2d");
    const dis = new Path2D("M100 6 L186 36 V110 C186 168 150 208 100 234 C50 208 14 168 14 110 V36 Z");
    const ic = new Path2D("M100 26 L168 50 V110 C168 156 140 190 100 212 C60 190 32 156 32 110 V50 Z");
    const kilit = new Path2D();
    kilit.arc(100, 104, 17, 0, Math.PI * 2);
    kilit.moveTo(91, 112); kilit.lineTo(86, 156); kilit.lineTo(114, 156); kilit.lineTo(109, 112); kilit.closePath();

    let W = 0, H = 0, dpr = 1, noktalar = [], fare = { x: -9999, y: -9999 }, calisiyor = false, gorunur = false, t = 0;

    const kur = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = kutu.getBoundingClientRect();
      W = r.width; H = r.height;
      tuval.width = W * dpr; tuval.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sc = Math.min(W / 230, H / 262);
      const ox = (W - 200 * sc) / 2, oy = (H - 240 * sc) / 2 - 8;
      const ara = Math.max(7, W / 52);
      noktalar = [];
      for (let y = ara / 2; y < H; y += ara) {
        for (let x = ara / 2; x < W; x += ara) {
          const px = (x - ox) / sc, py = (y - oy) / sc;
          let tur = null;
          if (test.isPointInPath(dis, px, py)) {
            if (test.isPointInPath(kilit, px, py)) tur = 3;
            else if (!test.isPointInPath(ic, px, py)) tur = 2;
            else tur = 1;
          } else {
            const dx = (x - W / 2) / (W / 2), dy = (y - H / 2) / (H / 2);
            const d = Math.hypot(dx, dy);
            if (d < 1 && ((Math.round(x / ara) + Math.round(y / ara)) % 2 === 0)) tur = 0;
          }
          if (tur === null) continue;
          const ilk = !azHareket;
          noktalar.push({
            hx: x, hy: y, tur,
            x: ilk ? W / 2 + (Math.random() - .5) * W * 1.4 : x,
            y: ilk ? H / 2 + (Math.random() - .5) * H * 1.4 : y,
            vx: 0, vy: 0,
            a: tur === 0 ? .12 * (1 - Math.hypot(x - W / 2, y - H / 2) / (W / 2)) : tur === 1 ? .22 + .3 * (1 - py / 240) : tur === 2 ? .8 : 1,
            r: tur === 3 ? 1.9 : tur === 2 ? 1.5 : 1.2,
            f: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const ciz = () => {
      ctx.clearRect(0, 0, W, H);
      const R = W * 0.17;
      for (const p of noktalar) {
        if (!azHareket) {
          const dx = p.x - fare.x, dy = p.y - fare.y;
          const d = Math.hypot(dx, dy);
          if (d < R && d > 0.1) {
            const k = Math.pow(1 - d / R, 2) * 7;
            p.vx += (dx / d) * k; p.vy += (dy / d) * k;
          }
          const nefes = Math.sin(t * 0.0012 + p.f) * 0.6;
          p.vx += (p.hx - p.x) * 0.045; p.vy += (p.hy + nefes - p.y) * 0.045;
          p.vx *= 0.84; p.vy *= 0.84;
          p.x += p.vx; p.y += p.vy;
        }
        ctx.globalAlpha = Math.max(0, p.a);
        ctx.fillStyle = p.tur === 3 ? "#ff6b35" : "#0c0f14";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const dongu = (zaman) => {
      t = zaman;
      ciz();
      if (gorunur) requestAnimationFrame(dongu); else calisiyor = false;
    };
    const baslat = () => { if (!calisiyor && !azHareket) { calisiyor = true; requestAnimationFrame(dongu); } };

    kur();
    if (azHareket) ciz();

    kutu.addEventListener("pointermove", (e) => {
      const r = tuval.getBoundingClientRect();
      fare.x = e.clientX - r.left; fare.y = e.clientY - r.top;
    });
    kutu.addEventListener("pointerleave", () => { fare.x = fare.y = -9999; });

    new IntersectionObserver((g) => {
      gorunur = g[0].isIntersecting;
      if (gorunur) baslat();
    }, { threshold: 0.05 }).observe(kutu);

    let zm;
    window.addEventListener("resize", () => {
      clearTimeout(zm);
      zm = setTimeout(() => { kur(); noktalar.forEach((p) => { p.x = p.hx; p.y = p.hy; }); ciz(); }, 150);
    });
  });

  /* ---------- Araç takımı konsolu ---------- */
  $$("[data-konsol]").forEach((konsol) => {
    const sekmeler = $$('[role="tab"]', konsol);
    const panel = $('[role="tabpanel"]', konsol);
    const cikti = $("[data-konsol-cikti]", konsol);
    const aciklama = $("[data-konsol-aciklama]", konsol);
    let zamanlayici;
    const kacir = (t) => t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

    const yaz = (sekme) => {
      clearTimeout(zamanlayici);
      const komut = sekme.dataset.komut;
      const satirlar = sekme.dataset.cikti.split("|");
      const bas = `<span class="v">$</span> `;
      if (azHareket) { cikti.innerHTML = bas + kacir(komut) + "\n" + satirlar.map(kacir).join("\n"); return; }
      let i = 0;
      const komutYaz = () => {
        cikti.innerHTML = bas + kacir(komut.slice(0, i)) + '<span class="imlec"></span>';
        if (i++ < komut.length) zamanlayici = setTimeout(komutYaz, 28);
        else { i = 0; zamanlayici = setTimeout(satirYaz, 260); }
      };
      const satirYaz = () => {
        const govde = satirlar.slice(0, i + 1).map(kacir).join("\n");
        cikti.innerHTML = bas + kacir(komut) + "\n" + govde + (i < satirlar.length - 1 ? '\n<span class="imlec"></span>' : "");
        if (++i < satirlar.length) zamanlayici = setTimeout(satirYaz, 320);
      };
      komutYaz();
    };

    const sec = (sekme, odak) => {
      sekmeler.forEach((s) => {
        const aktif = s === sekme;
        s.setAttribute("aria-selected", String(aktif));
        s.tabIndex = aktif ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", sekme.id);
      aciklama.textContent = sekme.dataset.aciklama;
      if (odak) sekme.focus();
      yaz(sekme);
    };

    sekmeler.forEach((s, i) => {
      s.addEventListener("click", () => sec(s));
      s.addEventListener("keydown", (e) => {
        const ileri = ["ArrowDown", "ArrowRight"].includes(e.key);
        const geri = ["ArrowUp", "ArrowLeft"].includes(e.key);
        if (!ileri && !geri && e.key !== "Home" && e.key !== "End") return;
        e.preventDefault();
        const n = sekmeler.length;
        const j = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (i + (ileri ? 1 : -1) + n) % n;
        sec(sekmeler[j], true);
      });
    });

    // mobil oklar: önceki / sonraki araç
    const kaydir = (yon) => {
      const i = sekmeler.findIndex((s) => s.getAttribute("aria-selected") === "true");
      sec(sekmeler[(i + yon + sekmeler.length) % sekmeler.length]);
    };
    $("[data-konsol-onceki]", konsol)?.addEventListener("click", () => kaydir(-1));
    $("[data-konsol-sonraki]", konsol)?.addEventListener("click", () => kaydir(1));

    // ilk görünüşte ilk aracı canlı yaz
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((g) => {
        if (g[0].isIntersecting) { yaz(sekmeler.find((s) => s.getAttribute("aria-selected") === "true")); io.disconnect(); }
      }, { threshold: 0.4 });
      io.observe(konsol);
    }
  });

  /* ---------- Sekmeler (özellikler) ---------- */
  const sekmeLinkleri = $$("[data-sekme] a");
  if (sekmeLinkleri.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((g) => g.forEach((x) => {
      if (!x.isIntersecting) return;
      sekmeLinkleri.forEach((a) => {
        const aktif = a.getAttribute("href") === `#${x.target.id}`;
        a.classList.toggle("is-aktif", aktif);
        aktif ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
      });
    }), { rootMargin: "-45% 0px -50% 0px" });
    sekmeLinkleri.forEach((a) => { const h = $(a.getAttribute("href")); h && io.observe(h); });
  }

  /* ---------- İletişim formu (mailto) ---------- */
  const form = $("[data-form]");
  if (form) {
    const durum = $("[data-form-durum]");
    const yedek = $("[data-mailto-yedek]");
    const kurallar = {
      ad: (v) => {
        const t = v.trim();
        if (t.length < 2) return "Lütfen adınızı ve soyadınızı yazın.";
        if (/\d/.test(t)) return "Ad soyad rakam içeremez.";
        return t.length <= 50 || "Ad soyad en fazla 50 karakter olabilir.";
      },
      kurum: (v) => v.trim().length >= 2 || "Lütfen kurum adını yazın.",
      telefon: (v) => /^0\d{10}$/.test(v) || "Telefonu 0 ile başlayan 11 haneli olarak yazın (05XXXXXXXXX).",
      eposta: (v) => {
        const t = v.trim();
        if (!t.includes("@")) return "E-posta adresinde @ işareti olmalı.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) || "Geçerli bir e-posta adresi yazın.";
      },
      konu: (v) => v !== "" || "Bir konu seçin.",
      mesaj: (v) => {
        const t = v.trim();
        if (t.length < 20) return "Mesajınız en az 20 karakter olmalı.";
        return t.length <= 750 || "Mesajınız en fazla 750 karakter olabilir.";
      },
    };

    // Giriş maskeleri: yazarken ve yapıştırırken uygulanır
    const maskeler = {
      harf: (v) => v.replace(/[0-9]/g, "").replace(/\s{2,}/g, " ").slice(0, 50),
      rakam: (v) => {
        let r = v.replace(/\D/g, "");
        if (r && r[0] !== "0") r = "0" + r;
        return r.slice(0, 11);
      },
      eposta: (v) => v.replace(/\s/g, "").slice(0, 100),
    };
    $$("[data-maske]", form).forEach((alan) => {
      const uygula = maskeler[alan.dataset.maske];
      alan.addEventListener("input", () => {
        const yeni = uygula(alan.value);
        if (yeni !== alan.value) alan.value = yeni;
      });
    });
    const mesajAlani = form.elements.mesaj;
    const sayac = $("[data-sayac]", form);
    if (mesajAlani && sayac) {
      const sayGuncelle = () => {
        if (mesajAlani.value.length > 750) mesajAlani.value = mesajAlani.value.slice(0, 750);
        sayac.textContent = `${mesajAlani.value.length} / 750`;
      };
      mesajAlani.addEventListener("input", sayGuncelle);
      sayGuncelle();
    }
    const denetle = (alan) => {
      const sonuc = kurallar[alan.name](alan.value);
      const kap = alan.closest(".alan");
      const hata = $(".alan__hata", kap);
      const ok = sonuc === true;
      kap.classList.toggle("is-hata", !ok);
      alan.setAttribute("aria-invalid", String(!ok));
      if (hata) hata.textContent = ok ? "" : sonuc;
      return ok;
    };
    Object.keys(kurallar).forEach((ad) => {
      const alan = form.elements[ad];
      alan.addEventListener("blur", () => alan.value && denetle(alan));
      alan.addEventListener("input", () => alan.closest(".alan").classList.contains("is-hata") && denetle(alan));
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const alanlar = Object.keys(kurallar).map((ad) => form.elements[ad]);
      const gecersiz = alanlar.filter((a) => !denetle(a));
      if (gecersiz.length) { gecersiz[0].focus(); return; }
      const v = (ad) => form.elements[ad].value.trim();
      const konu = `[${v("konu")}] ${v("ad")}`;
      const govde = `${v("mesaj")}\n\n—\n${v("ad")}\n${v("kurum")}\n${v("telefon")}\n${v("eposta")}`;
      const link = `mailto:info@karecode.com.tr?subject=${encodeURIComponent(konu)}&body=${encodeURIComponent(govde)}`;
      if (yedek) yedek.href = link;
      durum.classList.add("is-acik");
      durum.focus();
      window.location.href = link;
    });
  }
})();
