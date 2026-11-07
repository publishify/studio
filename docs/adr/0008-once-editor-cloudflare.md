# ADR-0008: Önce editör, Cloudflare Workers statik varlıkları olarak

- **Durum:** kabul edildi
- **Tarih:** 2026-11-06

## Bağlam
CLAUDE.md "önce doğrulama prototipi (kurul)" diyordu. Kurucu önceliği değiştirdi: önce yazma editörü Cloudflare üzerinde yaşayacak; kurul doğrulaması paralel, komut satırından sürer.

## Karar
`apps/web` (React + Vite 8 + CodeMirror 6 + Tailwind 4) Cloudflare Workers statik varlıkları olarak dağıtılır (`wrangler.jsonc`, SPA yönlendirmesi). Aşama 1 kapsamı: yerel kayıt (IndexedDB), bölüm listesi, işaret gizleme, odak/daktilo modu, açık/koyu tema. Sunucu, eşitleme ve kurul sonraki aşamalar.

## Sonuçlar
Sunucu maliyeti yok; metin yalnızca tarayıcıda. Editör `React.lazy` ile ayrı parçada: ilk JS ≈ 70 KB gzip (bütçe ≤ 100), editör parçası ≈ 173 KB (hedef ~150, izlenecek).
