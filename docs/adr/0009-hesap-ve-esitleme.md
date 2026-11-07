# ADR-0009: Hesap (passkey + kurtarma kodu) ve bölüm bazlı eşitleme

- **Durum:** kabul edildi
- **Tarih:** 2026-11-06

## Bağlam
Editör yalnızca tarayıcıda çalışıyordu. Cihazlar arası erişim ve yedek için hesap ve sunucu gerekiyor (MIMARI §3–4). Metin yazarındır: eşitleme hiçbir metni sessizce ezmemeli.

## Karar
- **Tek Worker:** `workers/api` (Hono) hem `/api/*` hem statik editörü sunar (`run_worker_first: ["/api/*"]`); aynı kaynak, CORS yok, çerez `SameSite=Lax`.
- **Giriş:** passkey (WebAuthn, `@simplewebauthn`, bulunabilir kimlik bilgisi, kullanıcı adsız). E-posta bağlantısı ertelendi; hesabı kurtarmak için kayıtta bir kez gösterilen 100 bitlik **kurtarma kodu** (D1'de yalnızca SHA-256'sı; kullanılınca yenisi üretilir). Oturum: rastgele 256 bit belirteç, D1'de yalnızca özeti, 30 gün, HttpOnly çerez.
- **Veri:** D1 (kullanıcılar, kimlik bilgileri, oturumlar, kitap listesi) + kitap başına bir Durable Object (SQLite, ad = `<kullanıcı>:<kitap>`; başka kullanıcının nesnesine erişim yapısal olarak imkânsız).
- **Eşitleme:** birim bölüm. Her bölümün sunucu sıra numarası (`seq`); istemci `baseSeq` gönderir. Farklıysa **çakışma**: sunucu sürümü kalır, istemcinin metni yeni bir "çakışan kopya" bölümü olur. Silmeler tombstone. Sıra ve künye son yazan kazanır.
- **Yerel öncelik:** istemci hesapsız da çalışır; değişiklikler IndexedDB'de, çevrimiçi olunca arka planda eşitlenir (2,5 sn debounce, odak/çevrimiçi/60 sn).

## Değerlendirilen seçenekler
- E-posta bağlantısı (Cloudflare Email Service) — alan doğrulaması ve teslim edilebilirlik işi; passkey + kurtarma kodu ile başlandı, sonra eklenir.
- CRDT (Yjs/Loro) — ADR-0005: ertelendi; tek yazar için revizyon yeterli.

## Sonuçlar
Metin sunucuda düz metin saklanır (R2/DO şifrelemesi Cloudflare tarafında dinlenme halinde). Hız sınırlama henüz yok (kurtarma kodu denemeleri için eklenmeli). Çakışan kopyalar kullanıcıya rozetle gösterilir.

## Hız sınırlama (7 Kasım 2026)
- `workers/api/migrations/0002_rate_limits.sql` + `rateLimit` ara katmanı (D1, sabit pencere, IP başına): kurtarma kodu **5 deneme / 15 dk**, hesap oluşturma **10 / saat**, giriş seçenekleri **40 / 15 dk**. Aşılınca `429 {"error":"rate"}`. Yerelde denendi (6. yanlış kurtarma denemesi 429).
- Dağıtımdan önce uzak veritabanına migrasyon uygulanmalı: `cd workers/api && pnpm exec wrangler d1 migrations apply publishify --remote`.
