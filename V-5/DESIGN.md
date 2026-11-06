# KareCode V-5 Tasarım Sistemi

Kapsam: KareCode / KcLogger kurumsal sitesi. Konu 5651 uyumlu loglama, dil Türkçe, ton kurumsal.

Yön: Sıcak krem zeminli, sade ve tamamen yuvarlak kurumsal site. Yalnızca açık tema vardır. Turuncu eylemde kullanılır. Yapı `ui-ux-pro-max` skill'inin "Trust & Authority + Conversion" kalıbından gelir, renk ve font kararları kullanıcıya aittir.

Tüm değerler `style.css` içinde token olarak tanımlıdır.

## Renk

| Token | Değer | Rol |
|---|---|---|
| `--primary` | `#ff6b35` | Seçili sekme, adım numarası, kolon çizgisi |
| `--primary-dark` | `#e55a2b` | Buton hover |
| `--secondary` | `#8b4513` | Etiket noktası, zaman çizgisi |
| `--cta` | `#ff6b35` | Seçili menü, özellik rozeti |
| `--cta-glass` | `rgba(255,107,53,.78)` | Cam buton zemini |
| `--on-cta` | `#fff` | Turuncu zemin üzerindeki yazı ve ikon |
| `--bg` | `#fffaf0` | Sayfa zemini |
| `--bg-warm` | `#fff5e6` | Vurgu paneli, hover |
| `--bg-dark` | `#2c1810` | Klavye odak halkası |
| `--text` | `#2c1810` | Başlık ve gövde |
| `--text-muted` | `#6b5344` | Açıklama metni |
| `--border` | `#e8ddd4` | Kenarlık |
| `--border-strong` | `#96806f` | Input kenarı |
| `--accent-green` | `#4a7c59` | Form başarı mesajı |
| `--error` | `#b42318` | Hata |

Hero, footer ve Tanışalım bölümü sayfa zeminindedir. Siyah veya koyu tam genişlik bant kullanılmaz, zeminde çizgi veya desen yoktur. Beyaz yazı turuncu üzerinde 4.5:1 sınırının altındadır (kullanıcı kararı).

## Tipografi

Tek aile: **Karla**, Google Fonts, ağırlıklar 400, 500, 600, 700.

## Yerleşim

- Tüm bölümler aynı `.container` içindedir: en fazla 1080px, kenar boşluğu `--gutter`.
- Sol header 240px. Kırılımlar: 480, 640, 768, 1024px.
- Ölçek: 4, 8, 12, 16, 24, 32, 48, 64.

## Şekil

Tam genişlik hero görselleri dışında köşeli yüzey yoktur. `--r-sm` 12px, `--r-md` 16px, `--r-lg` 24px, `--r-xl` 32px, `--r-pill` 999px.

## Butonlar

Temel buton türü `.btn`'dir. Tüm butonlar sol header ile aynı cam özelliklerini (blur, kenarlık, gölge) taşır, turuncu cam zeminde beyaz yazılıdır, her ekranda 52px yüksekliğinde ve 244px genişliğindedir. Tek istisna `.to-top`: aynı cam özelliklerini taşıyan 52px yuvarlak ikon butonu.

## Bölüm düzenleri

Her bölüm kendi düzenini kullanır, aynı kalıp tekrar edilmez.

| Bölüm | Düzen |
|---|---|
| Sayfa hero'ları | Ana sayfa `panel.jpg`, Özellikler `ozellikler-hero.jpg`, Hakkımızda `hakkimizda-hero.jpg`. Üç hero her ekranda aynı yüksekliktedir (`--hero-height`: 704, 580, 520px), içerik dikeyde ortalıdır. Görsel sayfayı yatayda kaplar, köşesizdir, soldan sayfa rengiyle kaplıdır ve sağa doğru tamamen şeffaf olur. Alt kenarı 120px boyunca sayfa rengine erir |
| Ne sunuyoruz | Eşit genişlik ve yükseklikte üç ürün kartı, buton kartların altında |
| 5651 | Başlık solda, zaman çizgisi sağda |
| Captive portal | Üst çizgili üç kolon |
| Dijital ayak izi | İkiye bölünmüş karşılaştırma paneli |
| Özellikler | V-4'teki gibi sekmeli özellik birimi, sekme üstüne gelince değişir |
| Kullanım alanları | Yan yana beş eşit görsel, adı her zaman altında görünür |
| Nasıl çalışır | Numaralı yatay adımlar |
| Biz kimiz | Başlık solda, metin sağda |
| İş ortakları | Başlık solda, ortası KareCode logosuyla aynı hizada; dönen çember sağda |
| Tanışalım | Sayfa renginde kenarlıklı panel |

## Dönen çember

- 9 logo çember üzerinde durur ve tamamı her an görünür. Logolar dönüş sırasında dik kalır.
- Sol taraftaki logolar aşağıdan yukarı hareket eder.
- Sürekli döner, hover ve klavye odağında durmaz. Ortada KareCode logosu vardır.
- `prefers-reduced-motion` açıksa dönmez.

## Başlık animasyonu

Yalnızca büyük başlıklar (`main` içindeki `.display` ve `.h2`) ekrana girince 32px aşağıdan yukarı, 700ms içinde bir kez yükselerek belirir. Kart, kolon ve sekme başlıkları animasyonsuzdur. JavaScript yoksa veya `prefers-reduced-motion` açıksa başlıklar animasyonsuz görünür.

## Cam efekti

Sol header, mobil üst çubuk, butonlar ve iletişim kartlarında kullanılır. Açık zeminde cam etkisi hafiftir.

## Bileşenler

- **Sol header:** Sabittir. Sıra: logo, menü, alt blok. Alt blokta LinkedIn, Facebook ve Instagram vardır. Instagram adresi `main.js` içindeki `instagramUrl` değişkeninden tek yerden verilir, boşken ikon tıklanamaz. Footer görünür alana girince alt blok kapanır.
- **Mobil menü:** 1024px altında üstte logo ve hamburger bulunur, menü soldan açılır.
- **İletişim kartları:** Dört kart eşit yüksekliktedir.
- **Form:** Ad soyad rakamsız en fazla 50 karakter, e-posta @ zorunlu, telefon yalnızca rakam ve tam 11 hane, kurum en fazla 50 karakter, mesaj en fazla 750 karakter. Mesaj kutusu sabit boyuttadır.
- **Başa dön butonu:** Sağ altta sabittir, Heroicons `arrow-up` ikonunu kullanır. Sayfa ekran yüksekliğinin %75'i kadar kaydırılınca görünür, tıklanınca yumuşak kayar (`prefers-reduced-motion` açıksa anında gider).
- **Odak:** 3px `--bg-dark` halka.

## Görsel ve ikon

Heroicons outline, inline SVG. İletişim kartlarında V-4'teki Material Symbols işaretleri (`mail`, `call`, `location_on`, `arrow_outward`) ve rozet yapısı kullanılır. Logo, sosyal ikonlar, sektör ve iş ortağı görselleri V-4 `assets` klasöründen alınır.

## Teknik kurallar

- Düz HTML, CSS ve JS.
