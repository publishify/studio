# ADR-0011: Yapı düzeyleri (kısım › bölüm › sahne) ve kitap türü

- **Durum:** kabul edildi (kurgu türleri için); diğer türlerin yapısı açık
- **Tarih:** 2026-11-07

## Bağlam
Yazar roman, novella ve hikâye için kısım, bölüm ve sahne eklemek istiyor. Şiir, deneme, akademik metin gibi diğer türlerin yapısı henüz kararlaştırılmadı.

## Karar
- Üç düzey: **kısım** (başlık, belge değil), **bölüm** (belge), **sahne** (belge, bir bölümün altında). Sahne ayrı bir tür değil, `level: 2` işaretli bir belgedir (`kind` hâlâ `chapter`), böylece düzenleyici, sürümler, seslendirme, çöp kutusu, Drive dosyaları aynen çalışır. Hiyerarşi, düz listedeki sıradan çıkar: sahne, kendinden önceki en yakın bölüme aittir.
- **Tür** (`Book.genre`): `roman`, `novella`, `hikaye`, `diger`. Roman/novella/hikâyede "Sahne ekle" görünür. `diger`'de sahne düzeyi kapalıdır; tür modülleri geldikçe her türün kendi düzeyleri ve adları (örn. akademik: bölüm › alt bölüm; şiir kitabı: kısım › şiir) bu yapıyla tanımlanacak. Varsayılan: roman.
- Sunucu eşitlemesinde sahne `kind: "scene"` olarak taşınır (istemci `chapter + level 2`ye çevirir), tür künyede (`meta.genre`) taşınır. Drive `kitap.json` içinde `level` ve `genre` var.
- Dışa aktarma: sahneler bölümün içine katılır, aralarına `* * *` konur (bölümün kendi metni yalnızca başlıksa ilk sahneden önce konmaz).

## Açık sorular
- Diğer türlerde düzey adları ve sayısı (şiir, deneme, akademik, anı, çocuk, oyun/senaryo).
- Bölüm ↔ sahne dönüştürme ve sürükleyerek düzey değiştirme henüz yok.
