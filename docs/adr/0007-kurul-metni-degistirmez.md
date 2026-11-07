# ADR-0007: Kurul metni değiştirmez

- **Durum:** kabul edildi
- **Tarih:** 2026-11-06

## Karar
Hiçbir ajan, araç ya da MCP çağrısı yazarın metnini yeniden yazmaz, uzatmaz, kısaltmaz. Kurul yalnızca not, gözlem ve öneri üretir. Nesnel denetimler (tutarlılık, kaynak, dosya geçerliliği) geçti/kaldı verir; öznel değerlendirmeler (hikâyenin gücü, ses, etki) asla "yayına hazır değil" hükmü vermez.

## Sonuçlar
Ürünün güven vaadi ve rakiplerden (OpenWriter, Sudowrite) ayrışma noktası. "Yeniden yaz / uzat / doldur" özellikleri hiç eklenmez.
