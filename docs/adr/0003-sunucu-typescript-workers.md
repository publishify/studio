# ADR-0003: Sunucu TypeScript ile Cloudflare Workers (Hono)

- **Durum:** kabul edildi
- **Tarih:** 2026-11-06

## Karar
API: Hono üzerinde TypeScript Worker. Kitap verisi: kitap başına SQLite tabanlı Durable Object. Hesaplar: D1. Dosyalar: R2. Yapay zekâ: AI Gateway.

## Değerlendirilen seçenekler
- Python Workers — anlık görüntüyle bile ~1 sn soğuk başlangıç.
- Rust Workers — WASM paket yükü; G/Ç ağırlıklı API'de hız kazancı yok.

## Sonuçlar
V8'e doğal, en küçük paket, bütün Cloudflare bağlamalarına birinci sınıf erişim. Kurucu Hono + D1'i writercms'ten tanıyor.
