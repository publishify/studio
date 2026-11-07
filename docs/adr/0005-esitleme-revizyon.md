# ADR-0005: Eşitleme bölüm bazında, revizyon tabanlı; CRDT ertelendi

- **Durum:** kabul edildi
- **Tarih:** 2026-11-06

## Karar
Önce yerel. Birim bölüm; her bölümün revizyon numarası ve hash'i var. Çakışmada iki kopya korunur, yazar seçer. Eşitleme bir arayüzün arkasında; ileride Yjs ya da Loro (Rust CRDT) eklenebilir.

## Sonuçlar
Sade ve test edilebilir; tek yazarlı kullanımda çakışma nadir. Gerçek zamanlı çok cihaz/çok yazar sonra.
