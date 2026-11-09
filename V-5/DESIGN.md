# KareCode V-5 Tasarım Sistemi

Kapsam: KareCode / KcLogger kurumsal sitesi. Konu 5651 uyumlu loglama, dil Türkçe, ton kurumsal. Sayfalar: Ana Sayfa (`index.html`), Özellikler (`ozellikler.html`), Hakkımızda (`hakkimizda.html`), İletişim (`iletisim.html`).

Yön: Sıcak krem zeminli, sade ve tamamen yuvarlak köşeli kurumsal site. Yalnızca açık tema vardır. Turuncu eylem ve seçili durumda (buton, seçili menü, açık slider satırı) ve küçük vurgu öğelerinde (ikon rozetleri, adım numarası) kullanılır; geniş zemin olarak kullanılmaz.

Renk, yazı, aralık, köşe ve süre değerleri `style.css` başındaki `:root` bloğunda token olarak tanımlıdır. Bu dosyadaki değerler oradaki token'larla aynı olmalıdır; değer değişirse önce token, sonra bu dosya güncellenir. Bileşene özel ölçüler (52px buton, 44px dokunma alanı, 160px mesaj kutusu gibi) ilgili kuralda doğrudan yazılıdır.

## Renk

| Token | Değer | Rol |
|---|---|---|
| `--primary` | `#ff6b35` | Adım numarası zemini |
| `--cta` | `#ff6b35` | Buton zemini, seçili menü, açık slider satırı, slider ve Network Tools ikon rozetleri, açık Captive portal satırının ikon rozeti ve kapalı satırların ikon rengi, "İçeriğe geç" butonu |
| `--cta-glass` | `rgba(255,107,53,.78)` | Buton hover |
| `--on-cta` | `#fff` | Turuncu zemin üzerindeki yazı ve ikon |
| `--secondary` | `#8b4513` | Etiket noktası, zaman çizgisi noktaları |
| `--bg` | `#fffaf0` | Sayfa zemini, hero, footer, Tanışalım paneli |
| `--bg-warm` | `#fff5e6` | Karşılaştırma panelinin ikinci yarısı, kapalı slider satırı, Network Tools paneli, açık Captive portal satırı ve kapalı satırların ikon rozeti, iletişim kartı hover |
| `--bg-dark` | `#2c1810` | Yalnızca klavye odak halkası |
| `--text` | `#2c1810` | Başlık ve gövde metni |
| `--text-muted` | `#6b5344` | Açıklama metni, etiket yazısı |
| `--border` | `#e8ddd4` | Kenarlık, ayırıcı, zaman çizgisi hattı, menü / ikon butonu / sosyal ikon hover |
| `--border-strong` | `#96806f` | Input kenarı |
| `--accent-green` | `#4a7c59` | Form başarı mesajı |
| `--error` | `#b42318` | Form hatası |

`--primary` ve `--cta` aynı renktir; dekoratif kullanım `--primary`, etkileşimli kullanım `--cta` ile yazılır.


## Tipografi

Tek aile: **Karla** (Google Fonts), ağırlıklar 400, 500, 600, 700.

| Sınıf / token | Boyut | Ağırlık | Satır |
|---|---|---|---|
| `.display` / `--text-display` | `clamp(2.5rem, 5.4vw, 4rem)` | 700 | 1.08, en fazla 20ch |
| `.h2` / `--text-h2` | `clamp(1.875rem, 3.4vw, 2.625rem)` | 700 | 1.18 |
| `.h3` / `--text-h3` | 1.5rem | 600 | 1.3 |
| `.h4` / `--text-h4` | 1.125rem | 600 | 1.4 |
| `.lead` / `--text-lead` | 1.1875rem | 400 | 1.6, en fazla 68ch |
| Gövde / `--text-body` | 1rem | 400 | 1.65 |
| Küçük / `--text-sm` | 0.875rem | 400–600 | — |

Başlıklarda harf aralığı `-0.02em` ve `text-wrap: balance` kullanılır.

## Yerleşim

- Tüm bölümler aynı `.container` içindedir, yan boşluk `--gutter` (`clamp(16px, 4vw, 48px)`).
- 1024px altında içerik en fazla 1080px (`--content`) ve ortalıdır. 1024px ve üzerinde (geniş, 4K ve kavisli ekranlar dahil) içerik ortalanmaz: sol header'a yaslanır (aradaki boşluk yalnızca `--gutter`) ve sağa doğru ekranın tamamını doldurur. Metin blokları kendi ölçüleriyle sınırlı kalır (`.display` 20ch, `.lead` 68ch, bölüm başlığı 760px).
- Bölüm dikey boşluğu `--section`: `clamp(56px, 7vw, 96px)`.
- Aralık ölçeği (`--s-1` … `--s-8`): 4, 8, 12, 16, 24, 32, 48, 64.
- Kırılımlar: 480, 640, 768, 1024, 1280px.
- 1024px ve üzerinde sol header 240px genişliğindedir (`--sidebar`), ekran kenarından 12px içeridedir (`--edge`). Altında üst çubuk (64px) kullanılır.

## Şekil

Köşeli yüzey yoktur; tek istisna tam genişlik hero görselleridir.

| Token | Değer | Kullanım |
|---|---|---|
| `--r-sm` | 12px | Menü bağlantısı, ikon butonu, input, ikon rozeti |
| `--r-md` | 16px | İletişim kartı, çember logoları |
| `--r-lg` | 24px | Kart, panel, header, slider satırı, Captive portal satırı, sektör görseli |
| `--r-xl` | 32px | Tanışalım paneli |
| `--r-pill` | 999px | Buton, etiket, nokta ve çizgiler |

## Cam efekti

`.glass`: `--glass-bg` (`rgba(255,250,240,.78)`), 1px `--glass-border`, `--shadow` gölgesi ve 18px blur. Sol header, mobil üst çubuk ve iletişim kartlarında kullanılır. Butonlar aynı kenarlık, gölge ve blur'u taşır ama zeminleri düz turuncudur. Açık zeminde cam etkisi hafiftir.

## İkonlar

- Tek kütüphane: **Bootstrap Icons** 1.11.3 (ikon fontu). Her sayfanın `<head>` bölümünde `style.css`'ten önce yüklenir:
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />`
- Kullanım: `<i class="bi bi-<ad> icon" aria-hidden="true"></i>`. İkon `currentColor` ile boyanır, boyutu `font-size` ile verilir. `.icon` ikonu 1em kutuda ortalar ve kütüphanenin dikey kaydırmasını (`vertical-align`) sıfırlar.
- Boyutlar: `.icon` 24px, `.icon--sm` 20px (buton içi, slider, Network Tools ve Captive portal rozetleri, Captive portal aç/kapa işareti, form hatası, sosyal medya). İletişim kartlarındaki ikonlar 24px'tir.
- Inline SVG, PNG ikon veya başka ikon kütüphanesi kullanılmaz.
- İkonlar bulundukları başlığın anlamına göre seçilir; aynı sayfada iki farklı başlık aynı ikonu paylaşmaz.
- Tüm ikonlar aynı çizgi (outline) stilindedir; içi dolu (`-fill`) ikon kullanılmaz.
- Sosyal medyada kütüphanenin kendi marka logoları kullanılır: `linkedin`, `facebook`, `instagram`; başka ikonla değiştirilmez. Bootstrap Icons'ta LinkedIn ve Facebook dolu geldiği için ikisi `color: transparent` ve `-webkit-text-stroke: 0.07em var(--text)` ile içi boş kontur olarak çizilir; çizgi kalınlığı Instagram'a yakındır. Üçü de 20px, `--text` renginde ve alt çizgisizdir.

| Yer | Bootstrap Icons adı |
|---|---|
| Menü aç / kapat | `list`, `x-lg` |
| Buton oku | `arrow-right` |
| Başa dön | `arrow-up` |
| Ürünler (KcLogger, İki Faktörlü Doğrulama, Bulut Yedekleme) | `shield-check`, `key`, `cloud-arrow-up` |
| Captive portal (Ne işe yarar?, Neden kullanılmalı?, İşletmenize katkısı) | `person-check`, `wifi`, `megaphone`; aç/kapa işareti `plus-lg` |
| Dijital ayak izi (kişi, kurum) | `person`, `building` |
| Dokuz özellik (Dashboard, Captive Portal, Sistem Ayarları, Kullanıcı Yönetimi, Kullanıcı Grupları, Profil Yönetimi, Güvenlik, Raporlar, Giriş Güvenliği) | `speedometer2`, `window`, `gear`, `person-gear`, `people`, `person-vcard`, `shield-check`, `file-earmark-bar-graph`, `shield-lock` |
| Network Tools (Ping, Traceroute, IP Scan, Telnet, System Reboot) | `broadcast`, `signpost-split`, `radar`, `terminal`, `arrow-clockwise` |
| İletişim kartları (e-posta, telefon, adres) | `envelope`, `telephone`, `geo-alt`, sağda `arrow-up-right` |
| Form hatası | `exclamation-circle` |
| Sosyal medya (sol header ve footer) | `linkedin`, `facebook`, `instagram` |

## Butonlar

- Tek buton türü `.btn`: düz `--cta` zemin, beyaz yazı, pill köşe, cam kenarlığı ve gölgesi. Her ekranda 52px yükseklik ve 244px genişlik (`--btn-width`, dar ekranda en fazla %100).
- Hover'da `--cta-glass` ile hafif solar, basılınca `scale(.98)`.
- Metnin sağında 20px `arrow-right` ikonu bulunur.
- Tek istisna `.to-top`: aynı görünümde 52px yuvarlak, yalnızca ikon içeren buton.

## Hero

- Ana Sayfa `panel.jpg`, Özellikler `ozellikler-hero.jpg`, Hakkımızda `hakkimizda-hero.jpg` kullanır. İletişim hero'su görselsizdir.
- Görselli üç hero her ekranda aynı yüksekliktedir (`--hero-height`): 480px altı 704px, 480–639px 580px, 640px ve üzeri 520px. İçerik dikeyde ortalıdır.
- Görsel sayfayı yatayda tam kaplar (masaüstünde sol header'ın arkasına da uzanır), köşesizdir. Soldan sayfa rengiyle örtülür, sağa doğru açılır: 768px altında örtü sağ kenarda da %72 yoğunlukta kalır; 768px ve üzerinde sağ kenarda tamamen şeffaf olur (1280px ve üzerinde genişliğin %92'sinden itibaren şeffaftır). Alt kenarı 120px boyunca sayfa rengine erir.

## Bölüm düzenleri

Her bölüm kendi düzenini kullanır, aynı kalıp tekrar edilmez. Bölüm başlığında numaralı etiket (`01 · …`) ve `.h2` bulunur; İletişim sayfasındaki kartlar ve form bölümü bunun dışındadır (başlığı `.h3` "Bize yazın").

| Sayfa | Bölüm | Düzen |
|---|---|---|
| Ana Sayfa | Ne sunuyoruz | Eşit genişlik ve yükseklikte üç kenarlıklı ürün kartı (768px ve üzeri yan yana), buton kartların altında |
| Ana Sayfa | 5651 | Başlık solda, zaman çizgisi sağda (1024px ve üzeri) |
| Ana Sayfa | Captive portal | Açılır soru listesi (akordeon, aşağıya bakın). 1024px ve üzerinde başlık solda, liste sağda; altında başlık üstte, liste tam genişlikte |
| Ana Sayfa | Dijital ayak izi | İkiye bölünmüş karşılaştırma paneli, ikinci yarı `--bg-warm` |
| Özellikler | Dokuz temel özellik | Bombeli dikey slider (`.bulge`), aşağıya bakın |
| Özellikler | Kullanım alanları | 768px ve üzeri yan yana beş eşit görsel (3:4), altında iki kolon ve son görsel ortada; ad her zaman görselin altında |
| Özellikler | Network Tools | Tek kenarlıklı `--bg-warm` panelde numaralı satırlar: numara, ikon rozeti, başlık, açıklama. 768px ve üzerinde satırlar eşit yüksekliktedir; altında her satır kendi içeriği kadar uzar, böylece kısa açıklamalı satırlar (IP Scan) diğerleriyle aynı hizada üstten başlar |
| Özellikler | Nasıl çalışır | Numaralı üç adım; 768px ve üzerinde yan yana, adımlar arasında çizgi |
| Hakkımızda | Biz kimiz | Başlık ("Yirmi yılı aşan birikimle kurumlara güvenilir yazılım çözümleri sunuyoruz") solda, metin sağda |
| Hakkımızda | İş ortakları | Başlık solda ve dikeyde KareCode logosuyla aynı hizada, dönen çember sağda |
| Hakkımızda | Tanışalım | Sayfa renginde kenarlıklı panel; buton 768px ve üzerinde sağda, altında metnin altında |
| İletişim | Kartlar ve form | Dört iletişim kartı ve form; 1280px ve üzerinde yan yana, altında alt alta |

## Bombeli slider (Dokuz temel özellik)

- Dokuz özellik dikey bir sütunda dizilir. Liste container'ın tüm genişliğini kaplar (1024px ve üzerinde ekranın sağına kadar), sola yaslıdır ve satırlar sağa doğru büyür.
- Kapalı satırlar liste genişliğinin 768px altında %86'sı, 768px ve üzerinde %68'idir. Açık satır tam genişliğe (%100) büyür.
- Satır yüksekliği 44px, 1024px ve üzerinde 40px. Satır numarası (`01`–`09`) 768px ve üzerinde görünür.
- Sütun yüksekliği `main.js` içindeki `measureBulge` ile en uzun açıklamaya göre hesaplanır ve sabit kalır; satır açılırken sayfa zıplamaz. Komşu satırların büyüme payı (`--bulge-swell`) 768px altında 120px'tir; 768px ve üzerinde ekran yüksekliğine göre 24–150px arasında daralır, böylece liste dizüstü ekranlara sığar.
- Fare üzerine gelince, dokunmatik ekranda dokununca satır açılır. Ayrım ekran genişliğine değil giriş türüne (`pointerType`) göre yapılır. Açılan satır (klavye odağında da) turuncu olur ve açıklamasını gösterir. Yakınlık ağırlıkları `bulgeWeights` dizisindedir (1, 0.42, 0.16): komşular da hafifçe büyür ve renk alır.
- Bombe etkisi üç şeyden gelir: satır genişliklerinin oluşturduğu mercek silueti, satırların aktif satırdan uzaklaştıkça `rotateX` ile geriye yatması ve aktif satırın iç gölgesi.
- Hover, satır kutularına değil listenin sabit eşit dikey bölgelerine göre hesaplanır; sabit duran imleç satır değiştirmez.
- Sayfa ilk satır açık olarak yüklenir. Fare ayrılınca son satır açık kalır. Yukarı ve aşağı ok tuşları satır değiştirir; listenin sonundan başına (ve tersi) döner. JavaScript yoksa tüm açıklamalar düz liste olarak görünür.

## Açılır soru listesi (Captive portal)

- Üç soru ayrı satırlardır: "Ne işe yarar?", "Neden kullanılmalı?", "İşletmenize katkısı". Yerel `<details>` / `<summary>` ile yapılır; JavaScript gerektirmez, klavye ve ekran okuyucu desteği tarayıcıdan gelir.
- Satırlar aynı `name` değerini paylaşır: aynı anda yalnızca bir satır açık kalır. Sayfa ilk satır açık olarak yüklenir.
- Kapalı satır: 1px `--border` kenarlık, `--r-lg` köşe, sayfa zemini. Solda 40px `--r-sm` rozet (`--bg-warm` zemin, `--cta` ikon), ortada `.h4` soru, sağda `plus-lg` işareti. Satır en az 72px yüksekliktedir.
- Açık satır: kenarlık kaybolur, zemin `--bg-warm` olur, rozet dolu turuncuya (`--cta` zemin, beyaz ikon) döner, `+` işareti 45° dönerek × olur. Açıklama sorunun hizasından başlar.
- Geçişler `--t-med` sürer; `prefers-reduced-motion` açıksa kapanır.

## Dönen çember (İş ortakları)

- 9 iş ortağı logosu çember üzerinde durur ve tamamı her an görünür. Logolar dönüş sırasında dik kalır.
- Sol taraftaki logolar aşağıdan yukarı hareket eder (saat yönünde). Bir tur 48 saniyedir (`--spin`).
- Sürekli döner, hover ve klavye odağında durmaz. Ortada KareCode logosu vardır.
- `prefers-reduced-motion` açıksa dönmez.

## Hareket

| Token | Değer | Kullanım |
|---|---|---|
| `--t-fast` | 180ms | Hover renkleri, buton basma |
| `--t-med` | 260ms | Mobil menü, başa dön butonu |
| `--t-bulge` | 420ms | Slider satırları |
| `--t-rise` | 700ms | Başlık yükselişi |
| `--ease` | `cubic-bezier(.22,1,.36,1)` | Tüm geçişler (dönen çember doğrusal hızla döner) |

Başlık animasyonu: Yalnızca büyük başlıklar (`main` içindeki `.display` ve `.h2`) ekrana girince 32px aşağıdan yukarı, 700ms içinde bir kez yükselerek belirir. Kart, kolon ve sekme başlıkları animasyonsuzdur. JavaScript yoksa veya `prefers-reduced-motion` açıksa başlıklar animasyonsuz görünür ve tüm geçişler kapanır.

## Bileşenler

- **Sol header:** 1024px ve üzerinde sabittir. Sıra: logo, menü, alt blok. Seçili sayfa turuncu zeminli, diğerleri hover'da `--border` zeminlidir. Alt blokta ortalanmış LinkedIn, Facebook ve Instagram vardır. Instagram adresi `main.js` içindeki `instagramUrl` değişkeninden tek yerden verilir, boşken ikon tıklanamaz. Footer görünür alana girince alt blok gizlenir.
- **Mobil menü:** 1024px altında üstte cam çubukta logo ve hamburger bulunur, menü soldan açılır, arka plan karartılır. Escape veya karartmaya tıklama menüyü kapatır.
- **Etiket (`.label`):** Pill, ince kenarlık, solda 8px `--secondary` nokta.
- **İletişim kartları:** Dört cam kart eşit yüksekliktedir; solda 52px kenarlıklı, sayfa renginde ikon rozeti; ortada küçük büyük harfli başlık ve değer; sağda `arrow-up-right`. Hover'da `--bg-warm` zemin alır.
- **Form:** Ad soyad rakamsız en fazla 50 karakter, e-posta @ zorunlu, telefon yalnızca rakam ve tam 11 hane, kurum isteğe bağlı en fazla 50 karakter, mesaj 10–750 karakter, KVKK onayı zorunlu. Mesaj kutusu sabit boyuttadır (160px). Gönderim kullanıcının e-posta uygulamasını açar.
- **Başa dön butonu:** Sağ altta sabittir. Sayfa ekran yüksekliğinin %75'i kadar kaydırılınca görünür, tıklanınca yumuşak kayar (`prefers-reduced-motion` açıksa anında gider).
- **Footer:** Sayfa renginde, üstte ince çizgi. Marka bloğu, Çözümler, Şirket ve İletişim kolonları.
- **Odak:** Tüm etkileşimli öğelerde 3px `--bg-dark` halka, 2px dışarıda.

## Görseller

- Logo, sektör ve iş ortağı görselleri `assets` klasöründedir (`assets/sectors`, `assets/partners`).
- Sektör görselleri `loading="lazy"` ile yüklenir; dekoratif oldukları için `alt=""` kullanılır, ad `figcaption` ile verilir.

## Teknik kurallar

- Düz HTML, CSS ve JS; derleme adımı yoktur. Tüm stiller `style.css`, tüm davranışlar `main.js` içindedir; tek istisna `<head>` içinde `html` öğesine `js` sınıfını ekleyen tek satırlık betiktir.
- Harici kaynaklar yalnızca Google Fonts (Karla) ve Bootstrap Icons CSS'idir.
- Renk, yazı boyutu, aralık, köşe ve süre için doğrudan değer yazılmaz, `:root` token'ları kullanılır. İstisnalar: mobil menü karartması (`rgba(44,24,16,.55)`) ve bileşene özel ölçüler.
- Tüm sayfalarda aynı head yapısı, üst çubuk, sol header, footer ve başa dön butonu bulunur.
- Erişilebilirlik: "İçeriğe geç" butonu, ikonlarda `aria-hidden="true"`, yeni sekmede açılan bağlantılarda bunu belirten `aria-label`, tüm hareketlerde `prefers-reduced-motion` desteği.
