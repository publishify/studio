# Intent: Kurul uygulamanın içinde
Author: Publishify. Status: draft. Change name: board-web.

## Problem
Yayın kurulu çalışıyor ve denendi. Ama yazar ona yalnızca Claude Code eklentisiyle ulaşabiliyor: ücretli Claude hesabı, Node.js, terminal ve eklenti kurulumu gerekiyor. Yazarların çoğu bu adımları geçemiyor.

Uygulama ile kurul birbirini görmüyor. Kitap uygulamada yazılıyor, kurula okutmak için dışa aktarılıp terminalde ayrıca çalıştırılması gerekiyor. Uygulamadaki kurul sekmesi devre dışı bir yer tutucu.

Kurul için para almanın bir yolu yok. Yazar "Publishify", "Studio" ve "Masthead" adlarını ayrı ürünler gibi görüyor.

## Proposed outcome
Yazarın gördüğü tek ürün Publishify: tek marka, tek hesap, tek aylık paket.

Yazar kitabında Kurul sekmesini açar, türü seçer ve "Kurulu çağır"a basar. Kurul arka planda kitabı okur, notlar ve pano aynı uygulamada açılır. Terminal, eklenti ya da kendi Claude hesabı gerekmez. Kelime hakkı aylık paketten düşer, paket uygulamanın içinden alınır.

Gözlenebilir sonuç:
- Uygulamada yazılmış bir romanın tamamı, ilk kez gelen bir yazar tarafından düğmeye basılarak okutulur ve pano uygulamada açılır.
- Ücretli bir paket Paddle üzerinden uçtan uca satın alınır.
- Aynı kitap eklentiyle ve uygulamadan okutulduğunda aynı adımlar çıkar.

## Affected users and systems
- Yazarlar: uygulamayı kullanan herkes.
- `apps/web`: Kurul sekmesi, pano görünümü, paket ve ödeme ekranı, marka metinleri.
- `workers/api`: okumayı başlatan ve izleyen API, Workflow, kota, Paddle webhook'u, silme.
- `BookDO`: `board_*` tabloları.
- D1: abonelikler, aylık kullanım, `charged_jobs`, pano çeviri önbelleği, `users.email`.
- `packages/board` (yeni): Masthead eklentisinin saf TypeScript kodu.
- Kurul motoru (`publishify/board`, kapalı): Service Binding ile çağrılan RPC kapısı. O depoda kendi değişikliğiyle yapılır.
- `docs/adr/0006`, `docs/adr/0014`.
- Claude Code eklentisi (`publishify/masthead`): donduruldu, dokunulmaz, bugünkü gibi çalışmaya devam eder.

## Constraints
- Kurulun ilkeleri değişmez: metni değiştirmez, hüküm vermez, notlar metinden alıntıyla desteklenir.
- Hiçbir metin sessizce ezilmez.
- Web yolunda kurul talimatları tarayıcıya hiç gönderilmez.
- Model çağrıları yalnızca Cloudflare AI Gateway üzerinden Anthropic API'ye gider, aylık harcama sınırı orada konur.
- Rol–model eşlemesi eklentidekiyle aynı: Editör ve Okur Paneli Haiku, Denetçi Sonnet. Profesyonel paketin derin okuması Sonnet.
- Paket ve kota yalnızca bu deponun D1'inde tutulur.
- Değişmeyenler: Worker adı `publishify-web`, editörün `/studio/` adresi.
- Kapsam dışı: Atölye, EPUB ve PDF, masaüstü, mobil, Claude.ai ve ChatGPT kapısı, kurul üyesi seçimi ve serbest soru, Batch API, eklenti ve uygulama hesaplarının birleştirilmesi.

## Open questions
Aşama 1 özetinde sahibine ayrı liste olarak soruldu (BRD, 10. bölüm).
