# ADR-0006: Açık çekirdek sınırı

- **Durum:** kabul edildi
- **Tarih:** 2026-11-06

## Karar
- Açık: editör, Tauri kabuğu, `crates/analiz`, eşitleme protokolü, MCP araç tanımları.
- Kapalı (sunucuda): `packages/kurul` — rol talimatları, tür ölçütleri, değerlendirme mantığı; ödeme ve hesaplar.

## Sonuçlar
Kod kopyalanabilir, değer (kurul, veri, platform) kopyalanamaz. Kurul talimatları istemciye hiçbir zaman tam gönderilmez.
