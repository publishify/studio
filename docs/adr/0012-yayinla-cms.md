# ADR-0012: Yayınla (CMS) — kitap ve tek parçalık yazılar herkese açık sayfa olur

- **Durum:** kabul edildi (ilk dilim uygulandı, 7 Kasım 2026)
- **İlham:** kurucunun writercms projesi (Hono + D1, sunucu taraflı HTML, SEO/GEO, yazar kimliği). Aynı bakış açısı: yazar yazar, yayın bir kopyadır, sayfalar hızlı, güvenli ve arama motoru/yapay zekâ için okunur.

## Karar
- **Yayın birimi:** Publishify'daki her proje (kitap) yayınlanabilir. Tek parçalık yazılar (blog, deneme, hikâye, küçürek öykü, şiir, kurgu dışı, akademik makale) bir bölümlük projedir; **tek bölümlü yayın doğrudan `/k/<adres>` adresinde makale olarak açılır**, çok bölümlü yayın içindekiler sayfası + `/k/<adres>/<n>` bölüm sayfaları olur.
- **Yayın bir kopyadır:** Taslak metin Durable Object'te kalır; "Yayınla/Güncelle" D1'e (`published_books`, `published_chapters`) bir kopya yazar. "Yayından kaldır" kopyayı siler. Taslak ve yayın birbirinden bağımsız.
- **Tür (`kind`):** kitap, roman, novella, hikâye, küçürek, şiir, deneme, blog, makale, kurgu dışı, anı, oyun. schema.org türüne çevrilir (Book, Article, BlogPosting, ScholarlyArticle, CreativeWork).
- **Dil ve yön:** yayın dili (Türk dilleri, Ortadoğu dilleri, İngilizce) `lang` ve `dir` olarak sayfaya yansır; Arap/İbrani harfli diller için uygun yazı tipleri.
- **Paylaşma:** sayfada JavaScript'siz bağlantılar (WhatsApp, X, Facebook, e-posta); yazar panelinde sistem paylaşma menüsü (Web Share) ve bağlantı kopyalama.
- **Güvenlik (yazar metni bizim alan adımızda yayımlanır):** Markdown sunucuda işlenir; ham HTML metne çevrilir, yalnızca http/https/mailto bağlantıları ve yalnızca https görseller kalır, bağlantılara `nofollow ugc noopener`; sayfa başına katı CSP (`default-src 'none'`, betik yok), `nosniff`; yayın API'si oturumlu, CSRF kaynak denetimli, saatte 60 yayın sınırlı; adres (slug) benzersiz ve doğrulanmış.
- **Adres:** şimdilik `publishify.app/k/<adres>`. Yazara ait alan adı (örn. yazarin-sitesi.com) sonraki dilim: Cloudflare for SaaS (özel ana makine adı) gerekir.

## Sonraki dilimler
Yazar sayfası (`/@ad`, tüm yayınlar), RSS ve `sitemap.xml`/`robots.txt`/`llms.txt`, kapak görseli (R2 gerekir), okur istatistiği (çerezsiz), abone/bülten, seriler, taslak bölüm durumu (kitabın bir kısmını yayınlama), yorumlar (şimdilik yok), özel alan adı, tema seçimi.

## Notlar
- writercms çok siteli tek yazar içindir; Publishify çok kiracılı (her yazarın kendi yayınları). Migrasyon gerekmez; writercms ayrı yaşamaya devam eder.
- Yayınlanan içerik herkese açıktır; arayüz bunu açıkça söyler.
