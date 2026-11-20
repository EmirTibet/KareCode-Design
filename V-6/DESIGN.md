# KareCode V-6 — Tasarım Sistemi ("Gece sahnesi, gündüz sayfa")

Her sayfa koyu bir hero sahnesiyle açılır ve yumuşak bir gradyanla (`.gecis`) açık kâğıt zemine geçer. Sayfanın geri kalanı açık temadadır. Tüm değerler `style.css` içindeki `:root` token'larından gelir; yeni bir bileşende sabit renk/ölçü yerine bu token'ları kullanın.

---

## 1. İlkeler

1. **Koyu sahne, açık sayfa.** Yalnızca hero'lar `--gece` zeminlidir. Bölümler, kartlar, Tanışalım paneli ve footer açık temadadır.
2. **Tek vurgu rengi.** Marka turuncusu `--vurgu` (#ff6b35). Açık zeminde metin olarak kullanılacaksa `--vurgu-metin` (#c2410c) kullanılır (kontrast).
3. **Tek CTA stili.** Bütün butonlar aynıdır: turuncu zemin, koyu metin, beyaz daire içinde siyah ok. İkincil/çerçeveli buton yoktur.
4. **İnce ve büyük tipografi.** Başlıklar Inter Tight 200–300, sıkı harf aralığı; kısa başlık, az metin.
5. **1px çizgi, cömert boşluk, yumuşak gölge.** Açık zeminde "parıltı" = gölge + cam (blur) + ince turuncu hale.
6. **Sade hareket.** Yalnızca başlıklar ve bileşenler (kart, panel, liste) kısa ve yumuşak biçimde belirir (14px kayma, 0.7s, 60ms sıra gecikmesi, bulanıklık yok); açıklama metinleri animasyonsuz görünür. `prefers-reduced-motion` açıkken tüm hareket kapanır.
7. **Hero'da bilgi baloncuğu yok.** Hero yalnızca başlık, tek cümle açıklama ve (anasayfada) tek buton içerir.

---

## 2. Renkler

### Zemin
| Token | Değer | Kullanım |
|---|---|---|
| `--kagit` | `#f5f4f0` | Sayfa zemini |
| `--kagit-2` | `#eceae4` | İkon kutusu gradyanı, ikincil yüzey |
| `--yuzey` | `#ffffff` | Kart/form alanları |
| `--gece` | `#07090d` | Hero, terminal ve konsol zemini |

### Metin
| Token | Değer | Kullanım |
|---|---|---|
| `--murekkep` | `#0c0f14` | Başlıklar, güçlü metin, buton metni |
| `--murekkep-2` | `#3b414b` | Gövde metni |
| `--murekkep-3` | `#646a74` | Notlar, etiketler, ikincil metin |
| `--ay` / `--ay-2` | `#f3f1ec` / `#a9aeb7` | Koyu zeminde başlık / gövde |

### Vurgu, çizgi, gölge
| Token | Değer | Kullanım |
|---|---|---|
| `--vurgu` | `#ff6b35` | Buton zemini, nokta, ikon vurgusu, koyu zeminde `<em>` |
| `--vurgu-metin` | `#c2410c` | Açık zeminde `<em>`, ikonlar, numaralar |
| `--vurgu-sis` | `rgba(255,107,53,.12)` | Odak halkası, uyarı zemini, hale |
| `--cizgi` / `--cizgi-2` | `rgba(12,15,20,.09)` / `.16` | Kart kenarı / form alanı kenarı |
| `--cizgi-gece` | `rgba(255,255,255,.10)` | Koyu zeminde çizgi |
| `--golge-1` / `--golge-2` | — | Kart / hover ve paneller |
| `--isik` | — | KCLogger büyük kartının turuncu halesi |

---

## 3. Tipografi

| Rol | Sınıf | Font | Boyut |
|---|---|---|---|
| Hero başlığı | `.dev` | Inter Tight 300 | `clamp(2.75rem, 1.4rem + 6vw, 6.5rem)`, satır .98 |
| Bölüm başlığı | `.baslik` | Inter Tight 300 | `clamp(2.25rem, 1.5rem + 3.4vw, 4.5rem)` |
| Küçük başlık | `.baslik-s`, `.ara-baslik` | Inter Tight 400 | `1.375–2.25rem` |
| Gövde | — | Inter 400 | `1.0625rem`, satır 1.7 |
| Giriş metni | `.metin-l` | Inter 400 | `clamp(1.0625rem, …, 1.25rem)` |
| Etiket | `.etiket` | JetBrains Mono 500 | `.75rem`, büyük harf, `.14em` aralık, solda turuncu nokta |

Başlıktaki vurgulu kelime `<em>` ile yazılır: italik değil, turuncu.

---

## 4. Ölçü, köşe, hareket

| Token | Değer |
|---|---|
| `--kap` | `1240px` içerik genişliği |
| `--kenar` | `clamp(16px, 4vw, 40px)` yan boşluk |
| `--bolum` | `clamp(96px, 13vw, 184px)` bölüm boşluğu |
| `--ust` | `76px` header yüksekliği |
| `--r-sm / --r-md / --r-lg` | `12 / 18 / 28px` |
| `--egri`, `--sure` | `cubic-bezier(.16,1,.3,1)`, `900ms` |

Tüm ızgara kolonları `minmax(0, 1fr)` ile yazılır; içerik (logo, uzun kelime) ekranı taşırmaz.

---

## 5. Bileşenler

### Ortak
| Bileşen | Açıklama |
|---|---|
| **Header** (`.ust`) | Sabit. Hero üzerindeyken şeffaf ve koyu logolu; hero geçilince açık zemin + açık logo (`.is-dolu`). Masaüstünde menü linkleri ve sosyal ikonlar (Instagram, Facebook, LinkedIn) **tek kapsül** içinde, aralarında ince dikey çizgi. KCLogger linki ok ikonu taşımaz, yeni sekmede açılır. |
| **Mobil menü** (< 900px) | Tam ekran koyu panel; büyük linkler, altında sosyal ikonlar. Logo ve kapatma butonu her zaman görünür; mobilde header'da `backdrop-filter` kullanılmaz (sabit menüyü hapsetmesin diye). |
| **Buton** (`.dugme`) | Hap biçimli, turuncu zemin, koyu metin; sağda beyaz daire içinde siyah ok (`.dugme__ok`). Hover'da ok -45° döner. |
| **Kart** (`.kart`) | Beyaz cam gradyan, `--cizgi` kenar, `--r-lg` köşe. `.kart--hover` hover'da yükselir. |
| **Hero** (`.sahne`) | Nokta ızgarası, dikey ışık hüzmesi, (anasayfada) ufuk yayı, dev silik yazı (`.dev-yazi`: marka adı / sayfa adı). Altında `.gecis` ile kâğıt zemine geçiş. |
| **Tanışalım** (`.kapanis`) | Açık cam panel, ince nokta dokusu, ortalı başlık ve tek buton. Dekoratif yay yoktur. |
| **Footer** (`.alt`) | 4 sütun (≥ 760px): marka + sosyal, Sayfalar, Konular, İletişim. |

### Anasayfa
| Bileşen | Açıklama |
|---|---|
| **3D kalkan** (`[data-kalkan]`) | SVG katmanları `translateZ` ile dizilmiş kalkan + turuncu kilit. Fareyle eğilir, yavaşça süzülür. |
| **Konu kartları** (`.konular`) | 3 kart: Captive Portal, Dijital Ayak İzi, KCLogger. |
| **Sayı kartları** (`.sayilar`) | 5651 · 2007 · 9 modül · 2 ofis + büyük KCLogger kartı (CTA'lı). Masaüstünde büyük kart sağda iki satır boyunca; **tablette (640–999px) tam genişlikte yatay**; mobilde alt alta. |
| **Orbit** (`[data-orbit]`) | Dijital ayak izi: ortada cümle + seçili düğümün açıklaması, çemberde 6 düğüm. Scroll'da döner, aktif düğüm tepeye gelir; düğüme tıklanarak da seçilir. Boyut: `min(clamp(620px, 44vw, 1400px), 100vw − 230px, 100vh − header − 96px)` (1440px → ~630px, 1920px → ~845px, 2560px → ~1125px, 4K → 1400px). Çember başlığın hemen altında, header’ın 32px altında sabitlenir. Düğümler **container query** ile çember boyutuna göre ayarlanır: > 620px tam, 501–620px küçük etiket, ≤ 500px yalnızca ikon. |
| **Noktalı kalkan** (`[data-noktalar]`) | Canvas nokta ızgarasından kalkan + turuncu anahtar deliği; imleç yaklaşınca dağılır, geri toplanır. |

### Özellikler
Bölümler: 01 Captive Portal · 02 Dijital Ayak İzi · 03 KCLogger · 04 Araç Takımı · 05 Kullanım alanları. (Sayfa içi sekme çubuğu yoktur; orbit ve noktalı kalkan yalnızca anasayfadadır.)

| Bileşen | Açıklama |
|---|---|
| **Akış + portal maketi** | 5 adımlı numaralı liste; yanında temsili Wi-Fi giriş sayfası. |
| **Sahte portal riskleri** (`.izgara-3--uc`) | 3 kart; ≥ 640px yan yana. |
| **Aktif / pasif ayak izi** (`.iz-tip`) | İki kart, ikisi de açık tema. |
| **Modüller** (`.izgara-3`) | 6 kart: 1 / 2 (≥ 720px) / 3 (≥ 1040px) sütun. |
| **Erişim kaydı** (`.terminal`) | Temsili log; satırlar sığmazsa alt satıra geçer, hiçbir genişlikte kesilmez. |
| **Araç takımı** (`[data-konsol]`) | Solda araç sekmeleri, sağda komutu canlı yazan koyu konsol + açıklama. < 960px: tek sekme görünür, **sağ/sol oklarla** araç değişir; ikon ve yazı tek satırda. Çıktı satırları en fazla ~34 karakter (320px'te tam sığar). |
| **Kullanım alanları** (`.yerler`) | 6 görselli panel (masaüstünde hover'da genişler); tablette 2 sütun, < 560px tek sütun yatay şerit. Görseller `assets/sectors/`. |

### Hakkımızda
| Bileşen | Açıklama |
|---|---|
| **Misyon / Vizyon** | İki açık kart (`.iz-tip`), aynı renkte. |
| **İlkeler** (`.izgara-3--uc`) | 3 kart; ≥ 640px yan yana. |
| **Yolculuk** (`.yol`) | 3 aşama; ≥ 900px yatay, arada gradyan çizgi. |
| **Partnerler** (`.partnerler`) | 9 logo, 2 / 3 (≥ 720px) sütun. Logolar **her zaman renkli**, hover efekti yok; hemen yüklenir (lazy değil), animasyonsuz görünür. |

### İletişim
| Alan | Kural (maske + doğrulama) |
|---|---|
| Ad soyad | Rakam yazılamaz; en fazla 50 karakter. |
| Kurum | Zorunlu; en fazla 80 karakter. |
| Telefon | Yalnızca rakam, 0 dahil 11 hane (başa 0 otomatik eklenir); `0XXXXXXXXXX` olmalı. |
| E-posta | `@` zorunlu; boşluk yazılamaz; en fazla 100 karakter. |
| Konu | Seçim zorunlu. |
| Mesaj | 20–750 karakter, sayaçlı; kutu yeniden boyutlandırılamaz. |

Form bir sunucuya gönderilmez; mesajı kullanıcının e-posta uygulamasında (`mailto:`) hazırlar. Altında SSS (`<details>` akordeon).

---

## 6. Duyarlı kırılımlar

| Genişlik | Değişiklik |
|---|---|
| ≤ 400px | Araç takımı sekmesinde küçük yazı/ikon, dar oklar |
| < 560px | Kullanım alanları tek sütun |
| < 600px | Terminal yazısı küçülür |
| ≤ 640px | Orbit boyutu `84vw` tabanlı |
| ≥ 640px | Sayı kartları 2 sütun; 3'lü ızgaralar (`--uc`) yan yana |
| 640–999px | KCLogger büyük kartı tam genişlik, yatay |
| ≥ 720px | Modül ızgarası 2 sütun; partnerler 3 sütun |
| < 900px | Hamburger menü; kullanım alanları ızgara |
| ≥ 900px | Tek kapsüllü masaüstü menü; bölüm başlıkları iki sütun |
| < 960px | Araç takımında oklu gezinme |
| ≥ 1000px | Sayı kartları masaüstü düzeni |
| ≥ 1040px | Modül ızgarası 3 sütun |

---

## 7. Erişilebilirlik

- Odak halkası: 2px turuncu, tüm etkileşimli öğelerde görünür; "İçeriğe geç" linki her sayfada.
- Mobil menü `aria-expanded`, Esc ile kapanır.
- Araç takımı `role="tablist"`; ok tuşları, Home/End ile gezilir.
- Orbit detay metni `aria-live="polite"`; dekoratif katmanlar `aria-hidden`.
- Form hataları alan altında, `aria-invalid` ve `aria-describedby` ile bağlı.
- `prefers-reduced-motion`: animasyonlar kapanır, orbit sabit durur, sayaçlar doğrudan son değeri gösterir.

---

## 8. Dosya yapısı

```
V-6/
├── index.html        Hero (3D kalkan), konular, sayılar, dijital ayak izi orbiti, KCLogger noktalı kalkan, Tanışalım
├── ozellikler.html   Captive portal, dijital ayak izi, KCLogger, araç takımı, kullanım alanları
├── hakkimizda.html   Kimiz, misyon/vizyon, ilkeler, yolculuk, partnerler, Tanışalım
├── iletisim.html     Form, iletişim kartları, SSS
├── style.css         Token'lar + tüm bileşenler
├── main.js           Header, mobil menü, belirme, sayaç, kalkan eğimi, orbit, noktalı kalkan, konsol, form maskeleri
├── DESIGN.md         Bu belge
└── assets/
    ├── karecode-logo-dark.png   Koyu zemin logosu (hero üzerinde header)
    ├── karecode-logo-light.png  Açık zemin logosu (header dolu, footer)
    ├── icon.png                 Favicon
    ├── partners/                9 partner logosu
    └── sectors/                 Kullanım alanı görselleri (cafe, hotel, toplu-tasima, yurt, hastane, okul)
```

Header ve footer dört sayfada aynıdır; değişiklik yaparken dört dosyayı da güncelleyin. İkonlar: Tabler Icons webfont 3.19.0.
