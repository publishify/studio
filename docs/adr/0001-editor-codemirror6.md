# ADR-0001: Editör çekirdeği CodeMirror 6

- **Durum:** kabul edildi
- **Tarih:** 2026-11-06

## Bağlam
Metin her zaman düz Markdown kalmalı; 200 bin kelimelik kitaplarda akıcı olmalı; kurul notları metne dokunmadan işaretlenebilmeli; mobil, Türkçe klavye ve yazım denetimi çalışmalı.

## Karar
CodeMirror 6 + Markdown dili, Obsidian tarzı canlı önizleme (imleç dışındaki işaretler gizli).

## Değerlendirilen seçenekler
- ProseMirror/TipTap — en olgun WYSIWYG; Markdown gidiş-dönüşünde kayıp riski (OpenWriter'ın `browser-write-fidelity` ADR'si).
- Lexical — küçük ve hızlı; Markdown dönüşümü yine kayıplı.
- Milkdown — Markdown öncelikli WYSIWYG; küçük topluluk.
- Monaco — kod editörü, ağır, mobilde zayıf.

## Sonuçlar
Dönüşüm kaybı yok; notlar dekorasyon olarak çizilir. Tablo/görsel gibi zengin öğeler ek iş ister.
