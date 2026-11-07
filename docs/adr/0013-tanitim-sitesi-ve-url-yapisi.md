# ADR-0013: Tanıtım sitesi kökte, editör `/studio/` altında; SEO ve GEO yaklaşımı

- **Durum:** kabul edildi (7 Kasım 2026)

## Bağlam
`publishify.app` doğrudan editörü açıyordu. Ürünün bir tanıtım sitesi yoktu; arama motorları ve yapay zekâ asistanları için içerik, kimlik ve yapısal veri eksikti. Rakipler (Ulysses, Scrivener, iA Writer, Sudowrite…) kök adreste tanıtım, uygulama başka bir yolda ya da alt alan adında.

## Karar
- **Adres yapısı:** `/` Türkçe tanıtım, `/en/` İngilizce; iç sayfalar `/ozellikler/`, `/diller/`, `/yayinla/`, `/karsilastirma/`, `/sss/` ve `/en/features/`, `/en/languages/`, `/en/publishing/`, `/en/compare/`, `/en/faq/`. Editör **`/studio/`** altındadır (Vite `base: "/studio/"`, çıktı `dist/studio`). Yayınlanan yazılar `/k/<adres>` (Worker) olarak kalır.
- **Neden yol, alt alan adı değil:** aynı kaynak (origin) korunur; yerel veriler (IndexedDB), passkey (`rpID: publishify.app`), Google OAuth izinli kaynakları ve oturum çerezi değişmeden çalışır. Alt alan adı ek DNS ve OAuth/passkey yapılandırması gerektirirdi.
- **Site statik ve betiksiz:** `apps/site` içerikten düz HTML üretir (`pnpm --filter @publishify/site build`), tek satır içi CSS, harici istek yok, JavaScript yok, sistem yazı tipleri. Dosyalar `apps/web/dist/` köküne yazılır; Cloudflare Workers statik varlıkları olarak sunulur (`not_found_handling: 404-page`). `/studio` → `/studio/` yönlendirmesi varlık işleyicisinden gelir.
- **Yalnızca doğrulanabilir iddialar:** özellik listesi koddan, karşılaştırma tablosu (Ulysses: Mac/iPad/iPhone, abonelik; Scrivener: Mac/Windows/iOS, tek seferlik) kaynaklarla doğrulandı ve tarih düşüldü. Hazır olmayanlar ("kurul", mobil/masaüstü uygulamalar, çevrimdışı, Drive bağlantısının herkese açılması) açıkça "yolda/erken erişim" diye yazıldı.
- **SEO:** sayfa başına benzersiz başlık/açıklama (uzunluk denetimli), canonical, hreflang (tr, en, x-default), Open Graph + Twitter kartı (1200×630 görsel), `sitemap.xml` (hreflang'lı), `robots.txt`, kırıntı ve JSON-LD (Organization, WebSite, SoftwareApplication, WebPage, FAQPage, BreadcrumbList), tek h1, görsellerde alt/width/height, LCP görseli preload, kırık bağlantı denetimi (`apps/site/src/check.mjs`, her derlemede çalışır).
- **GEO (yapay zekâ görünürlüğü):** "Kısaca Publishify" kısa cevap bloğu, soru-cevap biçiminde SSS, tutarlı adlandırma, `llms.txt` ve `llms-full.txt` (aynı veriden), `robots.txt`'te yapay zekâ tarayıcılarına açık izin (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…), editör ve API `Disallow`.
- **Güvenlik/performans:** sayfalarda `<meta>` ile katı CSP (betik yok), `_headers` ile nosniff, Referrer-Policy, Permissions-Policy (mikrofon yalnızca kendi kaynağı), HSTS; görseller `immutable` önbellek, ekran görüntüleri 800/1600 px `srcset`.
- **Ekran görüntüleri gerçek uygulamadan:** `?demo=` (yalnızca geliştirme, `apps/web/src/dev/demo.ts`) örnek kitap yükler; başsız Chrome ile çekilir. Örnek metin özgündür, kurucunun metni kullanılmaz.

## Açık işler
Google Search Console ve Bing Webmaster doğrulaması + sitemap gönderimi (kurucu hesabı gerekir); gizlilik politikası ve kullanım şartları sayfaları (Google OAuth doğrulaması için de gerekli); sosyal hesaplar açılınca Organization `sameAs`; blog/rehber içerikleri; tanıtım sitesinde ödeme/fiyat sayfası (ürün ücretlendirilince); gerçek kullanıcı yorumları (uydurma yorum eklenmez).
