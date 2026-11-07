# ADR-0004: Metin analizi Rust → WebAssembly

- **Durum:** kabul edildi (2. aşamada başlar)
- **Tarih:** 2026-11-06

## Karar
`crates/analiz`: Türkçe kelime/cümle istatistikleri, okunabilirlik, tekrarlar, diyalog oranı, karakter adları, bölüm parmak izleri. `wasm-bindgen` ile (wasm-pack arşivlendi). Tarayıcı, Worker ve Tauri'de aynı modül. Açık kaynak, ayrı crate olarak da yayımlanır.

## Sonuçlar
Dashboard'un sayısal kısmı çevrimdışı ve anında. İlk sürümde gerekirse TypeScript ile başlanıp taşınır.
