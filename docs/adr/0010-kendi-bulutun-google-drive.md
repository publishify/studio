# ADR-0010: Kendi bulutun — Google Drive (sonra iCloud) ortak kitap biçimi

- **Durum:** kabul edildi; web'de Google Drive uygulandı (7 Kasım 2026), iCloud ve masaüstü/mobil sonra
- **Tarih:** 2026-11-07

## Bağlam
Yazar kitabını kendi Google Drive / iCloud hesabında tutmak ve her yerden (web, masaüstü, mobil) aynı kitaba erişmek istiyor. Bu hem yazar için güven vaadi ("kitabın bizim sunucumuzda değil") hem bizim için sıfır depolama maliyeti. Eşitleme şu an sunucuda (ADR-0009).

## Karar
1. **Depolama sağlayıcısı arayüzü:** editör bir `Depo` arayüzü üzerinden çalışır. Gerçeklemeler: `Yerel` (IndexedDB, var), `PublishifyBulutu` (ADR-0009, var), `GoogleDrive` (ilk yeni), `iCloud` (sonra).
2. **Ortak kitap biçimi (bütün uygulamaların başvurduğu sözleşme):** Drive'da `Publishify/<Kitap Adı>/` klasörü.
   - Her bölüm düz Markdown dosyası: `NN-bolum-adi.md` (ön yazı/künye için isteğe bağlı YAML başlığı: `id`, `tur`, `kısım`).
   - `kitap.json`: künye, sıra, kısımlar, bölüm kimlikleri, biçim sürümü.
   - Yazar dosyaları Drive'dan kendisi de açıp okuyabilir; biçim sürümü ile ileriye uyum korunur.
3. **İzin kapsamı:** yalnızca `drive.file` (uygulamanın oluşturduğu dosyalar). Tüm Drive'a erişim istenmez.
4. **Giriş:** passkey'e ek olarak "Google ile giriş" ve "Apple ile giriş" (kimlik). Depolama izni ayrıca, bilinçli olarak verilir.
5. **Eşitleme:** Drive'ın dosya sürüm bilgisi (`headRevisionId`, `md5Checksum`) ile çakışma tespiti istemcide; kural ADR-0009 ile aynı: hiçbir metin sessizce ezilmez, çakışan metin "çakışan kopya" olarak saklanır.
6. **iCloud:** web'de dosya erişimi yok. Mac/iPhone uygulamasında (Tauri) iCloud Drive klasörü, aynı biçimle. Web için CloudKit JS ayrı karar (ADR'si sonra).
7. **Kurul:** rapor için metin analiz süresince Publishify sunucusuna gider; kalıcı saklanmaz (ayrıntı ayrı ADR).

## Değerlendirilen seçenekler
- Tüm Drive erişimi (`drive`) — gereksiz geniş, Google'ın ağır denetimi.
- `appdata` gizli klasör — yazar dosyaları göremez, "her yerden kendi dosyam" vaadine uymaz.
- Tek ikili/JSON kitap dosyası — çakışma ve elle okuma zor; bölüm bazlı dosya ADR-0005 ile uyumlu.

## Sonuçlar
- Gerekli dış adımlar: Google Cloud projesi, OAuth onay ekranı, gizlilik sayfası (publishify.app), alan adı doğrulaması.
- Eşitleme mantığı iki yerde olur (sunucu, istemci); ortak testle tutarlı tutulmalı.
- Ücretsiz katman (yerel + kendi bulutun) sunucu maliyeti doğurmaz; ücretli değer kurulda kalır.

## Uygulama notları (web, 7 Kasım 2026)
- `apps/web/src/drive.ts`. Giriş: Google Identity Services belirteç akışı, yalnızca tarayıcıda (sunucuya sır gitmez). Belirteç ~1 saat; süresi dolunca sessizce yenilenir, olmazsa "Yeniden bağlan" gösterilir.
- Dosya eşleşmesi Drive `appProperties` ile (`pfRoot`, `pfBook`, `pfId`, `pfKind`, `pfConflict`); dosya adları (`NN-başlık.md`) yalnızca okunaklılık içindir, adı değiştirmek bağı bozmaz.
- Değişiklik tespiti: Drive `version` (uzak) + içerik özeti (yerel). Uzak değişti, yerel değişmedi → indir. İkisi de değişti → Drive sürümü kalır, yerel metin "çakışan kopya" olur ve o da dosya olarak yüklenir.
- Silme: yerelde silinen bölüm/kitap Drive **çöp kutusuna** taşınır (kalıcı silinmez). Drive'da silinen ve burada değişmeyen bölüm yerelden de kalkar; dosyalar hiç görünmüyorsa (klasör sorunu) hiçbir şey silinmez, yeniden yüklenir.
- Künye (`kitap.json`) çakışmasında: yerel değiştiyse yerel kazanır (son yazan), değişmediyse Drive'daki benimsenir.
- Bağlantıyı kesmek yerel kitaplara ve Drive dosyalarına dokunmaz.
- **Uyarı:** `drive.file` izni Google Cloud *projesine* bağlıdır. Masaüstü/mobil uygulamaların OAuth istemcileri aynı projede (`publishify-513923`) açılmalı, yoksa başka uygulamanın dosyalarını göremezler.
- Test: `?mockdrive` (yalnızca geliştirme) sahte Drive yükler: `src/dev/mock-drive.ts`.
- Google uygulaması şu an "test" modunda: yalnızca eklenen test kullanıcıları girebilir. Herkese açmak için yayın + doğrulama (gizlilik sayfası, alan adı) gerekir.

## Çöp kutusu (7 Kasım 2026)
- Silme iki aşamalıdır. "Sil" kitabı/bölümü **uygulama içi çöp kutusuna** taşır (`trashed` zaman damgası); hiçbir şey sunucudan, Drive'dan ya da diskten silinmez. Kullanıcı "Çöp kutusunu boşalt" + ikinci onay verene kadar orada kalır; "Geri al" ile yerine döner.
- Yalnızca boşaltınca kalıcı silme çalışır: sunucuya silme bilgisi gider, Drive dosyaları/klasörü Drive çöp kutusuna taşınır.
- Çöp bilgisi Drive'da `kitap.json` içinde (`trashed`) taşınır, böylece başka cihazda da çöpte görünür. Publishify sunucu eşitlemesi (ADR-0009) çöp bilgisini henüz taşımıyor: sunucu üzerinden eşitlenen başka cihazda çöpteki bölüm normal görünür.
- Tarayıcının `confirm()` penceresi bırakıldı (bazı tarayıcılar engelliyor ve sormadan siliyor).

## Kapak ve seslendirme (7 Kasım 2026)
- Kitap başına bir **kapak** (`Book.cover`), bölüm başına bir **seslendirme** dosyası (`Item.audio`). Dosyalar kitaplık kaydına değil, ayrı IndexedDB girdilerine yazılır (`src/media.ts`); kayıtta yalnızca küçük bir künye (ad, tür, boyut, Drive bağı) durur.
- Kapak 1800 px üstündeyse küçültülüp JPEG'e çevrilir. Ses için üst sınır 300 MB.
- Drive'da kitap klasörünün içinde: `kapak.<uzantı>` (`pfKind=cover`) ve `NN-ad.<uzantı>` (`pfKind=audio`, `pfAudio=<bölüm kimliği>`). Büyük dosyalar yeniden başlatılabilir (resumable) yüklemeyle gider.
- Eşitleme: yeni/değişen yerel dosya yüklenir (Drive'da varsa aynı dosya yerinde güncellenir); Drive'da değişen dosya iner; Drive'dan silinen yerelden de kalkar; yerelde kaldırılan Drive çöp kutusuna gider.
- Başka cihazda kapak hemen iner, ses **isteğe bağlı** iner ("Drive'dan indir") ki telefon gereksiz yere yüzlerce MB çekmesin.
- Drive bağlı değilse dosyalar yalnızca o cihazda kalır ve arayüz bunu söyler. Publishify sunucu eşitlemesi medyayı taşımaz (R2 maliyeti, ayrı karar).
- Henüz yok: kapağın e-kitap (EPUB) dosyasına konması, birden fazla ses dosyası/bölüm, yükleme yüzdesi.
