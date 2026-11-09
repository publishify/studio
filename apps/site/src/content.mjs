// Tanıtım sitesi içeriği (Türkçe + İngilizce). Her iddia gerçek özelliklerden gelir; "yakında" denenler açıkça öyle yazılır.
// Not: Metinler hem sayfalara hem llms.txt'ye aynı veriden girer ("görünen metin = yapısal veri").

export const SITE = "https://publishify.app";

export const FEATURES = [
  { id: "markdown", icon: "✍️",
    title: { tr: "Canlı Markdown", en: "Live Markdown" },
    text: { tr: "Markdown yazarsın, işaretler imleç satırından çıkınca kaybolur. Ne gördüğün, ne yazdığındır: kalın, eğik, başlık, alıntı, liste, yapılacaklar.", en: "You write Markdown and the marks disappear once the cursor leaves the line. Bold, italic, headings, quotes, lists and checklists look the way they will read." } },
  { id: "structure", icon: "🗂️",
    title: { tr: "Kısım › bölüm › sahne", en: "Part › chapter › scene" },
    text: { tr: "Kitabını üç düzeyde kur: kısım, bölüm ve sahne. Sürükleyerek sırala, bölümü sahneye çevir, çöpe at, geri al.", en: "Build your book on three levels: part, chapter and scene. Drag to reorder, turn a chapter into a scene, trash and restore." } },
  { id: "templates", icon: "📚",
    title: { tr: "Türe göre hazır şablonlar", en: "Templates for every kind of writing" },
    text: { tr: "Roman (üç perde, kahramanın yolculuğu), novella, hikâye, küçürek öykü, şiir, deneme, blog yazısı, anı, kurgu dışı, akademik makale, tez, çocuk kitabı, oyun. Şablon yalnızca yapıyı kurar, metne karışmaz.", en: "Novel (three acts, hero's journey), novella, short story, flash fiction, poetry, essay, blog post, memoir, non-fiction, academic article, thesis, picture book, play. A template only sets up structure; it never touches your text." } },
  { id: "focus", icon: "🎯",
    title: { tr: "Yazma modu: tam ekran, yalnızca sen ve sayfa", en: "Writing mode: full screen, just you and the page" },
    text: { tr: "Tam ekran düğmesine bas: menüler, paneller ve araç çubuğu kapanır, yalnızca yazı sayfası kalır. Yazdığın paragraf net, gerisi silik görünür; imleç ekranın ortasında kalır. Her şey kendiliğinden kaydedilir.", en: "Press full screen: menus, panels and toolbar disappear and only the page remains. The paragraph you are writing stays sharp while the rest fades, and the cursor stays centred. Everything saves itself." } },
  { id: "dictation", icon: "🎙️",
    title: { tr: "Sesle yazma", en: "Dictation" },
    text: { tr: "Konuşarak yaz. “Nokta”, “virgül”, “yeni satır” dediğinde noktalama kendiliğinden girer; cümle başları büyük harfle başlar. Ses, tarayıcının konuşma tanıma hizmetine gider, Publishify'a değil.", en: "Speak to write. Say “period”, “comma” or “new line” and punctuation is inserted; sentences start with capitals. Audio goes to your browser's speech recognition service, not to Publishify." } },
  { id: "history", icon: "🕰️",
    title: { tr: "Sürüm geçmişi ve çöp kutusu", en: "Version history and trash" },
    text: { tr: "Yazdıkça sürümler otomatik alınır, istediğini geri yüklersin. Sildiğin şey önce çöp kutusuna gider ve sen “boşalt” diyene kadar orada durur.", en: "Versions are saved as you write and any of them can be restored. Anything you delete goes to the trash first and stays there until you empty it." } },
  { id: "media", icon: "🖼️",
    title: { tr: "Kapak ve seslendirme", en: "Cover and narration" },
    text: { tr: "Kitabına kapak, her bölümüne seslendirme dosyası ekle. Kapak e-kitap dosyasının içine girer.", en: "Add a cover to your book and a narration file to each chapter. The cover is embedded in the EPUB." } },
  { id: "export", icon: "📤",
    title: { tr: "Dışa aktarma", en: "Export" },
    text: { tr: "Markdown, HTML, Word (.docx), e-kitap (.epub) ve PDF. Sağdan sola diller için yön her biçimde korunur.", en: "Markdown, HTML, Word (.docx), EPUB and PDF. Right-to-left direction is preserved in every format." } },
  { id: "themes", icon: "🎨",
    title: { tr: "Yedi tema", en: "Seven themes" },
    text: { tr: "Açık, koyu, sepya, yeşil, pembe, gece ve kendi seçtiğin iki rengin (zemin ve yazı) kayıtlı özel teması.", en: "Light, dark, sepia, green, pink, night and a custom theme from two colours of your own (background and text)." } },
];

export const FAQ = [
  { q: { tr: "Publishify nedir?", en: "What is Publishify?" },
    a: { tr: "Publishify, bağımsız yazarlar için tarayıcıda çalışan bir yazma editörü ve yayın stüdyosudur. Roman, öykü, deneme, makale ve şiir yazarsın; dosyaların cihazında, istersen kendi Google Drive'ında durur; yazını tek tıkla herkese açık bir sayfa olarak yayınlarsın.", en: "Publishify is a browser-based writing editor and publishing studio for independent authors. You write novels, stories, essays, articles and poems; your files stay on your device and, if you like, in your own Google Drive; and you can publish a piece as a public page in one click." } },
  { q: { tr: "Ücretsiz mi?", en: "Is it free?" },
    a: { tr: "Yazma editörü ücretsizdir ve hesap açmadan başlayabilirsin. Planımız, yazma editörünü ücretsiz tutmak; editör kurulunun bir kısmını da ücretsiz sunmak; derin değerlendirme gibi ek hizmetleri hazır olduğunda ücretli sunmaktır.", en: "The writing editor is free and you can start without an account. Our plan is to keep the editor free and offer part of the editorial board for free and charge only for deeper services once they are ready." } },
  { q: { tr: "Hesap açmam gerekiyor mu?", en: "Do I need an account?" },
    a: { tr: "Hayır. Hesapsız yazarsan her şey bu cihazdaki tarayıcında kaydedilir. Hesap açarsan (şifresiz, passkey ile) kitapların cihazların arasında eşitlenir ve yayın yapabilirsin.", en: "No. Without an account everything is saved in this device's browser. With an account (passwordless, using a passkey) your books sync between devices and you can publish." } },
  { q: { tr: "Dosyalarım nerede duruyor?", en: "Where are my files stored?" },
    a: { tr: "Önce cihazındaki tarayıcıda. Hesap açarsan Publishify sunucusunda da eşitlenir. Google Drive bağlantısı (erken erişim) açıldığında kitabın Drive'ında “Publishify” klasöründe, bölüm başına bir düz Markdown dosyası olarak durur; dosyaları Drive'dan kendin de açabilirsin.", en: "First in your device's browser. With an account they also sync to the Publishify server. With the Google Drive connection (early access) your book lives in a “Publishify” folder in your Drive, one plain Markdown file per chapter, which you can also open from Drive yourself." } },
  { q: { tr: "Hangi dillerde yazabilirim?", en: "Which languages can I write in?" },
    a: { tr: "Arapça, Osmanlıca, Türkçe, İngilizce, Almanca, Fransızca, Rusça ve Japonca; ayrıca Kurmancî (Latin) ve Zazaca. Sağdan sola yazım dahil. Arayüz de ilk sekiz dilde.", en: "Arabic, Ottoman Turkish, Turkish, English, German, French, Russian and Japanese, plus Kurmanji (Latin script) and Zazaki. Right-to-left writing is included. The interface is available in the first eight." } },
  { q: { tr: "Yapay zekâ metnimi yeniden yazar mı?", en: "Will AI rewrite my text?" },
    a: { tr: "Hayır. Şu an uygulamada yapay zekâ yok. Geliştirme aşamasındaki editoryal kurulumuzun ilkesi şu: kurul metnini okur, işaretler ve öneri verir ama asla yeniden yazmaz. Son söz her zaman yazardadır.", en: "No. There is no AI in the app today. The principle of the editorial board we are developing is: it reads, annotates and suggests, but never rewrites. The final word is always the author's." } },
  { q: { tr: "Telefonda ya da tablette çalışır mı?", en: "Does it work on phones and tablets?" },
    a: { tr: "Evet, tarayıcıdan çalışır. Masaüstü ve mobil uygulamalar planlanıyor; şimdilik uygulama yüklemen gerekmez.", en: "Yes, in the browser. Desktop and mobile apps are planned; for now there is nothing to install." } },
  { q: { tr: "İnternetsiz çalışır mı?", en: "Does it work offline?" },
    a: { tr: "Şimdilik sayfanın açılması için internet gerekir; açıldıktan sonra yazdıkların cihazında kaydedilir. Tam çevrimdışı kullanım planlı.", en: "For now you need a connection to open the page; once open, what you write is saved on your device. Full offline use is planned." } },
  { q: { tr: "Yazımı nasıl yayınlarım?", en: "How do I publish my writing?" },
    a: { tr: "Hesap açtıktan sonra Studio'da sağ paneldeki Yayınla sekmesinden bir adres seç, türünü belirle ve Yayınla'ya bas. Yazın publishify.app/k/adres altında herkese açık bir sayfa olur; paylaşma bağlantıları ve arama motorları için gerekli etiketler hazır gelir.", en: "After creating an account, open the Publish tab in the right-hand panel of Studio, choose an address and a type, and press Publish. Your piece becomes a public page under publishify.app/k/your-address, with sharing links and search-engine markup built in." } },
  { q: { tr: "Yayınladığım şey taslağımı etkiler mi?", en: "Does publishing affect my draft?" },
    a: { tr: "Hayır. Yayın bir kopyadır. Taslağın sende kalır; sen “Güncelle” demedikçe yayın değişmez, istediğin an yayından kaldırırsın.", en: "No. A publication is a copy. Your draft stays with you; the published page only changes when you press Update, and you can unpublish at any time." } },
  { q: { tr: "Ulysses ve Scrivener'dan farkı ne?", en: "How is it different from Ulysses and Scrivener?" },
    a: { tr: "Publishify tarayıcıda çalışır, yani Mac, Windows, Linux, Chromebook ve telefonda aynıdır; Ulysses yalnızca Apple cihazlarında, Scrivener Mac, Windows ve iOS'ta çalışır. Publishify'da ayrıca tek tıkla yayın ve Arapça, Osmanlıca, Türkçe, Kurmancî, Zazaca gibi diller için yerleşik destek var. Ayrıntı: karşılaştırma sayfası.", en: "Publishify runs in the browser, so it is the same on Mac, Windows, Linux, Chromebooks and phones; Ulysses runs on Apple devices only and Scrivener on Mac, Windows and iOS. Publishify also has one-click publishing and built-in support for Turkish, Kurmanji, Zazaki, Ottoman Turkish and Arabic. Details: the comparison page." } },
  { q: { tr: "Verilerim güvende mi?", en: "Is my data safe?" },
    a: { tr: "Giriş şifresiz: cihazının passkey'i (parmak izi, yüz tanıma ya da PIN) kullanılır, hesabı kaybedersen kurtarma kodu vardır. Metinlerin reklam için kullanılmaz. Yayınladığın sayfalar herkese açıktır, taslakların değildir.", en: "Sign-in is passwordless, using your device's passkey (fingerprint, face or PIN), with a recovery code if you lose it. Your text is never used for advertising. Published pages are public; your drafts are not." } },
];

export const LANGS = [
  { name: "Arapça", native: "العربية", rtl: true, script: { tr: "Arap", en: "Arabic" }, dir: "rtl", ui: true },
  { name: "Osmanlıca", native: "لسان عثمانى", rtl: true, script: { tr: "Arap harfli", en: "Arabic script" }, dir: "rtl", ui: true },
  { name: "Türkçe", native: "Türkçe", script: { tr: "Latin", en: "Latin" }, dir: "ltr", ui: true },
  { name: "English", native: "English", script: { tr: "Latin", en: "Latin" }, dir: "ltr", ui: true },
  { name: "Deutsch", native: "Almanca", script: { tr: "Latin", en: "Latin" }, dir: "ltr", ui: true },
  { name: "Français", native: "Fransızca", script: { tr: "Latin", en: "Latin" }, dir: "ltr", ui: true },
  { name: "Русский", native: "Rusça", script: { tr: "Kiril", en: "Cyrillic" }, dir: "ltr", ui: true },
  { name: "日本語", native: "Japonca", script: { tr: "Japon", en: "Japanese" }, dir: "ltr", ui: true },
  { name: "Kurmancî", native: "Kurdî (Kurmancî)", script: { tr: "Latin", en: "Latin" }, dir: "ltr", ui: false },
  { name: "Zazaca", native: "Zazakî (Kırmancki / Dimilkî)", script: { tr: "Latin", en: "Latin" }, dir: "ltr", ui: false },
];

export const THEMES = [
  { name: { tr: "Açık", en: "Light" }, bg: "#ffffff", ink: "#111111" },
  { name: { tr: "Koyu", en: "Dark" }, bg: "#19191a", ink: "#f1f1f1" },
  { name: { tr: "Sepya", en: "Sepia" }, bg: "#f6efdc", ink: "#3a2e1c" },
  { name: { tr: "Yeşil", en: "Green" }, bg: "#EFF6ED", ink: "#000000" },
  { name: { tr: "Pembe", en: "Pink" }, bg: "#FFF1FA", ink: "#000000" },
  { name: { tr: "Gece", en: "Night" }, bg: "#000014", ink: "#ffffff" },
  { name: { tr: "Özel", en: "Custom" }, bg: "#F4F0FF", ink: "#1C1530" },
];

// ---- sayfalar ---------------------------------------------------------------------------------
// body(L, h): h = { t(tr,en), img(...), href(id), faq(items) }
export const pages = [
  {
    id: "home", slug: { tr: "/tr/", en: "/" }, priority: 1.0, schema: ["org", "site", "app"],
    title: { tr: "Publishify — yazarlar için sade yazma editörü ve yayın stüdyosu", en: "Publishify — a calm writing editor and publishing studio for authors" },
    desc: { tr: "Romanını, öykünü, denemeni Arapça, Osmanlıca, Türkçe ve daha pek çok dilde yaz. Tarayıcıda çalışır, ücretsiz; dosyaların senin, yayınlamak tek tık.", en: "Write your novel, story or essay in Arabic, Ottoman Turkish, Turkish and more. Browser-based and free; your files stay yours and publishing is one click." },
    body: (L, h) => `
<section class="hero wrap">
  <div>
    <p class="eyebrow">${h.t("Yazarlar için sade yazma stüdyosu", "A calm writing studio for authors")}</p>
    <h1>${h.t("Yazmak için <em>sade bir stüdyo.</em>", "A <em>calm studio</em> to write in.")}</h1>
    <p class="lede">${h.t(
      "Publishify; romanını, öykünü, denemeni ya da makaleni yazman, kendi Google Drive'ında saklaman ve tek tıkla yayınlaman için tasarlanmış bir yazma editörüdür. Tarayıcıda çalışır, her cihazda aynıdır.",
      "Publishify is a writing editor made for drafting your novel, story, essay or article, keeping it in your own Google Drive and publishing it in one click. It runs in the browser and feels the same on every device.")}</p>
    <p class="cta"><a class="btn primary" href="/studio/">${h.t("Studio'yu aç — ücretsiz", "Open Studio — it's free")}</a><a class="btn ghost" href="${h.href("features")}">${h.t("Özellikleri gör", "See the features")}</a></p>
    <ul class="ticks"><li>${h.t("Hesap gerekmez", "No account needed")}</li><li>${h.t("Dosyaların Drive'ında, kimseyle paylaşılmaz", "Your files live in your Drive, shared with no one")}</li><li>${h.t("Word, PDF, ePUB, MD: istediğin biçimde indir", "Download as Word, PDF, ePUB or Markdown")}</li></ul>
  </div>
  <div class="stage" aria-hidden="false">
    <div class="glow g-a"></div><div class="glow g-b"></div>
    <div class="tilt back">${h.shot("rtl-ar", h.t("Arapça bir kitap: arayüz ve metin sağdan sola akıyor", "An Arabic book: the interface and the text flow right to left"), { w: 1600, hh: 1000, sizes: "(min-width:980px) 420px, 80vw" })}</div>
    <div class="tilt front">${h.shot("editor-dark", h.t("Publishify Studio editörü koyu temada: solda kısım, bölüm ve sahne ağacı, sağda canlı Markdown metin", "Publishify Studio in the dark theme: part, chapter and scene tree on the left and live Markdown text on the right"), { eager: true, w: 1600, hh: 1000, sizes: "(min-width:980px) 640px, 100vw" })}</div>
    <span class="float f1"><i></i>${h.t("Kaydedildi · 0,4 sn", "Saved · 0.4 s")}</span>
    <span class="float f2"><i></i>${h.t("Esc ile çık", "Esc to leave")}</span>
  </div>
</section>

<section class="s alt" aria-labelledby="brief"><div class="wrap">
  <div class="head"><h2 id="brief">${h.t("Kısaca Publishify", "Publishify in brief")}</h2></div>
  <dl class="ans">
    <div><dt>${h.t("Nedir?", "What is it?")}</dt><dd>${h.t("Bağımsız yazarlar için tarayıcıda çalışan bir yazma editörü ve yayın stüdyosu.", "A browser-based writing editor and publishing studio for independent authors.")}</dd></div>
    <div><dt>${h.t("Kimler için?", "Who is it for?")}</dt><dd>${h.t("Roman, novella, hikâye, küçürek öykü, şiir, deneme, kurgu dışı ve akademik makale yazanlar için.", "Anyone writing novels, novellas, short stories, flash fiction, poetry, essays, non-fiction or academic articles.")}</dd></div>
    <div><dt>${h.t("Ne kadar?", "What does it cost?")}</dt><dd>${h.t("Editör ücretsiz; hesap açmadan başlarsın.", "The editor is free; you can start without an account.")}</dd></div>
    <div><dt>${h.t("Nerede çalışır?", "Where does it run?")}</dt><dd>${h.t("Tarayıcısı olan her cihazda: Mac, Windows, Linux, Chromebook, telefon, tablet.", "On any device with a browser: Mac, Windows, Linux, Chromebook, phone, tablet.")}</dd></div>
    <div><dt>${h.t("Hangi dillerde?", "Which languages?")}</dt><dd>${h.t("Arapça, Osmanlıca, Türkçe, İngilizce, Almanca, Fransızca, Rusça, Japonca (+ Kurmancî, Zazaca); sağdan sola dahil, arayüz de aynı dillerde.", "Arabic, Ottoman Turkish, Turkish, English, German, French, Russian, Japanese (+ Kurmanji, Zazaki); right-to-left included, and the interface speaks them too.")}</dd></div>
  </dl>
</div></section>

<section class="s" aria-labelledby="flow"><div class="wrap">
  <div class="head"><h2 id="flow">${h.t("Yaz. Sakla. Yayınla.", "Write. Keep. Publish.")}</h2><p>${h.t("Bir yazarın ihtiyacı olan üç şey, tek yerde ve sade.", "The three things an author needs, in one calm place.")}</p></div>
  <div class="grid">
    <div class="card"><span class="ic">01</span><h3>${h.t("Yaz", "Write")}</h3><p>${h.t("Canlı Markdown, kısım › bölüm › sahne yapısı, odak ve daktilo modu, sesle yazma, sürüm geçmişi.", "Live Markdown, part › chapter › scene structure, focus and typewriter mode, dictation and version history.")}</p></div>
    <div class="card"><span class="ic">02</span><h3>${h.t("Sakla", "Keep")}</h3><p>${h.t("Önce cihazında; hesap açarsan eşitlenir; Google Drive bağlantısıyla (erken erişim) kendi Drive'ında düz Markdown dosyaları olarak.", "On your device first; synced if you create an account; and, with the Google Drive connection (early access), as plain Markdown files in your own Drive.")}</p></div>
    <div class="card"><span class="ic">03</span><h3>${h.t("Yayınla", "Publish")}</h3><p>${h.t("Bir tıkla herkese açık, hızlı, arama motorlarına hazır bir sayfa. Paylaşma bağlantıları dahil. Taslağın sende kalır.", "One click to a public, fast, search-ready page with sharing links built in. Your draft stays with you.")}</p></div>
  </div>
</div></section>

<section class="s" aria-labelledby="board"><div class="wrap">
  <div class="head">
    <p class="eyebrow">${h.t("Editör kurulu · Yakında", "Editorial board · Coming soon")}</p>
    <h2 id="board">${h.t("Arkanda koca bir yayınevi kadrosu.", "A whole publishing house behind you.")}</h2>
    <p>${h.t("Tek başına yazarsın ama yalnız değilsin. Roman, öykü, şiir, deneme ve akademik metin için ayrı ayrı uzmanlaşmış bir editör kurulu kitabını okur, haritalar ve sana yol gösterir.", "You write alone, but you are not on your own. An editorial board, with specialists for novels, stories, poetry, essays and academic writing, reads your book, maps it and guides you.")}</p>
  </div>
  <div class="grid g3">
    <div class="card"><h3>${h.t("Editörler", "Editors")}</h3><p>${h.t("Kurgu, edebiyat, akademik, şiir, kurgu dışı, çocuk ve gençlik editörleri; her tür kendi ölçütüyle okunur.", "Fiction, literary, academic, poetry, non-fiction and children's editors; every genre is read by its own standards.")}</p></div>
    <div class="card"><h3>${h.t("Okur paneli", "Reader panel")}</h3><p>${h.t("Metnini farklı okurların gözüyle ön okumadan geçirir: nerede sıkıldılar, nerede etkilendiler?", "A first read through the eyes of different readers: where did they get bored, where were they moved?")}</p></div>
    <div class="card"><h3>${h.t("Denetçiler", "Checkers")}</h3><p>${h.t("Tutarlılık, kaynak, dil ve yazım, hassasiyet: kitabın dosyası temiz ve sağlam çıksın.", "Consistency, sources, language and spelling, sensitivity: so your book goes out clean and solid.")}</p></div>
  </div>
  <p class="note" style="margin-top:28px">${h.t("Kurulun bir bölümü ücretsiz olacak; derin değerlendirmeler ücretli. Yazma editörü her zaman ücretsiz kalır.", "Part of the board will be free; deeper evaluations will be paid. The writing editor stays free.")}</p>
</div></section>

<section class="s alt" aria-labelledby="feat"><div class="wrap">
  <div class="head"><h2 id="feat">${h.t("Yazmayı kolaylaştıran ayrıntılar", "Details that make writing easier")}</h2></div>
  <div class="grid g3">${h.features(6)}</div>
  <p class="cta"><a class="btn ghost" href="${h.href("features")}">${h.t("Tüm özellikler", "All features")}</a></p>
</div></section>

<section class="s" aria-labelledby="langs"><div class="wrap split">
  <div>
    <p class="eyebrow">${h.t("Kendi dilinde", "In your language")}</p>
    <h2 id="langs">${h.t("Arapça, Osmanlıca, Türkçe ve daha fazlası.", "Arabic, Ottoman Turkish, Turkish and more.")}</h2>
    <p class="lede">${h.t("Sağdan sola yazılan diller ikinci sınıf değil. Editör, dışa aktarma ve yayın sayfası her dilin yönünü ve uygun yazı tipini kendiliğinden kullanır; aynı belgede iki yön yan yana akabilir.", "Right-to-left languages are not an afterthought. The editor, the exports and the published page each use the right direction and a suitable typeface for the language, and one document can mix both directions.")}</p>
    <div class="chips">${h.langChips()}</div>
    <p><a href="${h.href("languages")}">${h.t("Diller hakkında ayrıntı →", "More about languages →")}</a></p>
  </div>
  ${h.shot("rtl-ar", h.t("Arapça bir kitap: arayüz ve metin sağdan sola akıyor", "An Arabic book: the interface and the text flow right to left"), { w: 1600, hh: 1000, sizes: "(min-width:980px) 540px, 100vw" })}
</div></section>

<section class="s alt" aria-labelledby="tpl"><div class="wrap split flip">
  ${h.shot("templates", h.t("Yeni penceresi: roman, novella, hikâye, şiir, deneme, blog, makale ve daha fazlası için şablonlar", "New dialog: templates for novels, novellas, stories, poetry, essays, blog posts, articles and more"), { w: 1400, hh: 875, sizes: "(min-width:980px) 540px, 100vw" })}
  <div>
    <p class="eyebrow">${h.t("Her tür için bir başlangıç", "A starting point for every kind of writing")}</p>
    <h2 id="tpl">${h.t("Roman yazmak da blog yazmak da aynı sadelikte.", "A novel or a blog post, with the same calm.")}</h2>
    <p class="lede">${h.t("Bir şablon seç, yapı hazır olsun. Roman için üç perde ya da kahramanın yolculuğu; deneme, makale, şiir, anı ve çocuk kitabı için de uygun iskeletler var. Şablon yalnızca yapıyı kurar, metne karışmaz.", "Pick a template and the structure is ready: three acts or the hero's journey for a novel, and fitting outlines for essays, articles, poems, memoirs and picture books. A template only sets up structure; it never touches your text.")}</p>
    <ul class="list"><li>${h.t("Kısım › bölüm › sahne düzeyleri", "Part › chapter › scene levels")}</li><li>${h.t("Sürükle-bırak sıralama", "Drag-and-drop ordering")}</li><li>${h.t("Çöp kutusu: sildiğin geri gelir", "Trash: what you delete can come back")}</li></ul>
  </div>
</div></section>

<section class="s" aria-labelledby="zen"><div class="wrap split">
  <div>
    <p class="eyebrow">${h.t("Yazma modu", "Writing mode")}</p>
    <h2 id="zen">${h.t("Tam ekrana bas, yalnızca yazmaya odaklan.", "Press full screen and focus only on writing.")}</h2>
    <p class="lede">${h.t("Menüler, paneller, araç çubuğu: hepsi kapanır. Ekranda yalnızca sayfan kalır. Yazdığın paragraf net, geri kalanı silik; imleç hep ortada. Kaydetmeyi düşünmene gerek yok, her şey kendiliğinden kaydedilir.", "Menus, panels, toolbar: all of it closes. Only your page remains. The paragraph you are writing stays sharp and the rest fades; the cursor stays centred. No need to think about saving, everything saves itself.")}</p>
    <ul class="list"><li>${h.t("Çıkmak için Esc", "Press Esc to leave")}</li><li>${h.t("Açık ve koyu temada", "In light and dark themes")}</li><li>${h.t("Sesle yazma ve her dil bu modda da çalışır", "Dictation and every language work here too")}</li></ul>
  </div>
  ${h.shot("zen-dark", h.t("Yazma modu: yalnızca sayfa; yazılan paragraf net, diğerleri silik", "Writing mode: just the page; the paragraph being written is sharp, the others faded"), { w: 1600, hh: 1000, sizes: "(min-width:980px) 540px, 100vw" })}
</div></section>

<section class="s" aria-labelledby="pub"><div class="wrap split">
  <div>
    <p class="eyebrow">${h.t("Yayınla", "Publish")}</p>
    <h2 id="pub">${h.t("Yazın, bir tıkla herkese açık bir sayfa.", "Your writing, one click from a public page.")}</h2>
    <p class="lede">${h.t("Blog yazısı, deneme, hikâye, makale ya da bütün bir kitap: adresini seç, türünü belirle, yayınla. Sayfa hızlı açılır, telefonda güzel görünür, arama motorları ve yapay zekâ için gerekli bilgiyle gelir.", "A blog post, essay, story, article or a whole book: choose an address, pick a type, publish. The page loads fast, looks good on a phone and ships with the markup that search engines and AI assistants need.")}</p>
    <ul class="list"><li>${h.t("Paylaşma bağlantıları: WhatsApp, X, Facebook, e-posta", "Sharing links: WhatsApp, X, Facebook, email")}</li><li>${h.t("Okuma süresi, yazar adı, yayın tarihi", "Reading time, author name, publication date")}</li><li>${h.t("Yayın bir kopyadır: taslağın korunur", "A publication is a copy: your draft is protected")}</li></ul>
    <p><a href="${h.href("publishing")}">${h.t("Yayın nasıl çalışır →", "How publishing works →")}</a></p>
  </div>
  ${h.shot("published-dark", h.t("Yayınlanmış bir hikâye sayfası: başlık, okuma süresi ve paylaşma bağlantıları", "A published story page with a title, reading time and sharing links"), { w: 1400, hh: 875, sizes: "(min-width:980px) 540px, 100vw" })}
</div></section>

<section class="s alt" aria-labelledby="themes"><div class="wrap">
  <div class="head"><h2 id="themes">${h.t("Gözüne göre bir ekran", "A screen that suits your eyes")}</h2><p>${h.t("Yedi tema: açık, koyu, sepya, yeşil, pembe, gece ve zemin ile yazı rengini kendin seçtiğin özel tema.", "Seven themes: light, dark, sepia, green, pink, night, and a custom theme where you pick the background and text colours.")}</p></div>
  <div class="sws" role="list">${h.themes()}</div>
</div></section>

<section class="s" aria-labelledby="own"><div class="wrap split">
  ${h.shot("editor-dark", h.t("Koyu temada Publishify Studio", "Publishify Studio in the dark theme"), { w: 1600, hh: 1000, sizes: "(min-width:980px) 540px, 100vw" })}
  <div>
    <p class="eyebrow">${h.t("Yazın senin", "Your writing is yours")}</p>
    <h2 id="own">${h.t("Dosyalar kilitli bir yerde değil, senin Drive'ında.", "Not locked away: in your own Drive.")}</h2>
    <p class="lede">${h.t("Google Drive bağlantısı (erken erişim) açıldığında her bölüm, Drive'ında “Publishify” klasöründe düz bir Markdown dosyası olur. İki cihazda aynı bölümü değiştirirsen hiçbir metin ezilmez: biri “çakışan kopya” olarak saklanır. Sildiklerin Drive'ın çöp kutusuna gider.", "With the Google Drive connection (early access) every chapter becomes a plain Markdown file in a “Publishify” folder in your Drive. If you change the same chapter on two devices nothing is overwritten: one version is kept as a “conflict copy”. Deleted items go to your Drive trash.")}</p>
    <p class="note">${h.t("Drive bağlantısı şimdilik davetli test kullanıcılarına açık; Google'ın uygulama doğrulaması tamamlanınca herkese açılacak.", "The Drive connection is currently open to invited testers; it opens to everyone once Google's app verification is complete.")}</p>
  </div>
</div></section>

<section class="s alt" aria-labelledby="soon"><div class="wrap">
  <div class="head"><h2 id="soon">${h.t("Yolda olanlar", "On the way")}</h2><p>${h.t("Henüz hazır olmayanları açıkça söylüyoruz.", "We say plainly what is not ready yet.")}</p></div>
  <div class="grid">
    <div class="card"><h3>${h.t("Editör kurulu", "Editorial board")}</h3><p>${h.t("Kitabını okuyan, yapısını haritalayan, bir yayınevi kadrosu kadar geniş bir editör kurulu geliştiriyoruz. Bir kısmı ücretsiz olacak, geri kalanı ücretli.", "We are building an editorial board as broad as a publishing house's staff that reads your book and maps its structure. Part of it will be free, the rest paid.")}</p></div>
    <div class="card"><h3>${h.t("Masaüstü ve mobil uygulamalar", "Desktop and mobile apps")}</h3><p>${h.t("Mac, Windows, iPhone ve Android için uygulamalar planlanıyor; bunlar da aynı kitap biçimini kullanacak.", "Apps for Mac, Windows, iPhone and Android are planned and will use the same book format.")}</p></div>
    <div class="card"><h3>${h.t("Çevrimdışı kullanım", "Offline use")}</h3><p>${h.t("Sayfa bir kez açıldıktan sonra internetsiz de açılabilmesi için çalışıyoruz.", "We are working on letting the page open without a connection after the first visit.")}</p></div>
  </div>
</div></section>

<section class="s" aria-labelledby="faq"><div class="wrap">
  <div class="head"><h2 id="faq">${h.t("Sık sorulanlar", "Frequently asked questions")}</h2></div>
  <div class="prose">${h.faq(5)}</div>
  <p><a href="${h.href("faq")}">${h.t("Tüm sorular →", "All questions →")}</a></p>
</div></section>

<section class="s"><div class="wrap"><div class="band">
  <h2>${h.t("Bugün bir sayfa yaz.", "Write a page today.")}</h2>
  <p>${h.t("Kurulum yok, hesap yok, kredi kartı yok. Studio'yu aç ve yazmaya başla.", "No install, no account, no credit card. Open Studio and start writing.")}</p>
  <p class="cta" style="justify-content:center"><a class="btn" href="/studio/">${h.t("Studio'yu aç", "Open Studio")}</a></p>
</div></div></section>`,
  },

  {
    id: "features", slug: { tr: "/tr/ozellikler/", en: "/features/" }, priority: 0.9, schema: ["app", "crumbs"],
    title: { tr: "Özellikler — canlı Markdown, sahne yapısı, sesle yazma | Publishify", en: "Features — live Markdown, scene structure, dictation | Publishify" },
    desc: { tr: "Publishify'ın özellikleri: canlı Markdown, kısım › bölüm › sahne, hazır şablonlar, odak modu, sesle yazma, sürüm geçmişi, kapak, dışa aktarma ve temalar.", en: "Publishify features: live Markdown, part › chapter › scene, templates, focus mode, dictation, version history, covers, export and themes." },
    body: (L, h) => `
<div class="wrap">${h.crumbs([["home"], ["features"]])}
<header class="page-head"><h1>${h.t("Özellikler", "Features")}</h1><p class="lede">${h.t("Publishify yazmaya odaklanır: gösterişli menüler yerine az ve iyi düşünülmüş araçlar.", "Publishify focuses on writing: a few well-considered tools instead of a wall of menus.")}</p></header>
<div class="prose">${FEATURES.map((f) => `<h2 id="${f.id}">${f.title[L]}</h2><p>${f.text[L]}</p>`).join("")}
<h2 id="accounts">${h.t("Hesap ve eşitleme", "Accounts and sync")}</h2>
<p>${h.t("Hesap açmak şifresizdir: cihazının passkey'ini (parmak izi, yüz tanıma ya da PIN) kullanırsın. Hesabın kurtarma koduyla korunur. Hesap açınca kitapların bölüm bölüm cihazların arasında eşitlenir; aynı bölüm iki yerde değişirse sunucudaki sürüm kalır, diğeri yeni bir “çakışan kopya” bölümü olur. Hiçbir metin sessizce ezilmez.", "Creating an account is passwordless: you use your device's passkey (fingerprint, face or PIN), and a recovery code protects the account. Once you have an account your books sync chapter by chapter between devices; if the same chapter changes in two places the server version stays and the other becomes a new “conflict copy” chapter. Nothing is silently overwritten.")}</p>
<h2 id="drive">Google Drive</h2>
<p>${h.t("Google Drive bağlantısı (erken erişim) kitabını Drive'ında düz Markdown dosyaları olarak tutar: kitap başına bir klasör, bölüm başına bir dosya, künye için küçük bir kitap.json. Yalnızca Publishify'ın kendi oluşturduğu dosyalara erişir (drive.file izni), Drive'ının geri kalanını göremez.", "The Google Drive connection (early access) keeps your book as plain Markdown files in your Drive: one folder per book, one file per chapter and a small book.json for metadata. It can only access files Publishify itself created (the drive.file scope) and cannot see the rest of your Drive.")}</p>
</div>
<p class="cta"><a class="btn primary" href="/studio/">${h.t("Studio'yu aç", "Open Studio")}</a></p></div>`,
  },

  {
    id: "languages", slug: { tr: "/tr/diller/", en: "/languages/" }, priority: 0.8, schema: ["crumbs"],
    title: { tr: "Diller — Türkçe, Kurmancî, Zazaca, Osmanlıca, Arapça | Publishify", en: "Languages — Turkish, Kurmanji, Zazaki, Ottoman, Arabic | Publishify" },
    desc: { tr: "Publishify'da Türkçe, Kurmancî (Latin), Zazaca, Osmanlıca ve Arapça yazabilirsin; sağdan sola yön, uygun yazı tipleri ve dışa aktarma dahil.", en: "Write in Turkish, Kurmanji (Latin), Zazaki, Ottoman Turkish and Arabic in Publishify, with right-to-left direction, suitable typefaces and exports included." },
    body: (L, h) => `
<div class="wrap">${h.crumbs([["home"], ["languages"]])}
<header class="page-head"><h1>${h.t("Kendi dilinde yaz", "Write in your own language")}</h1><p class="lede">${h.t("Her kitabın bir yazı dili vardır. Dil; editörün yönünü, yazım denetimini, dışa aktarmayı ve yayın sayfasını belirler.", "Every book has a writing language. It sets the editor's direction, spell-checking, exports and the published page.")}</p></header>
<div class="tw"><table><thead><tr><th>${h.t("Dil", "Language")}</th><th>${h.t("Yazı", "Script")}</th><th>${h.t("Yön", "Direction")}</th><th>${h.t("Yazı dili", "Writing language")}</th><th>${h.t("Arayüz", "Interface")}</th></tr></thead><tbody>
${LANGS.map((x) => `<tr><td><b>${x.name}</b><br><span class="${x.rtl ? "rtl" : "muted small"}"${x.rtl ? ' lang="ar" dir="rtl"' : ""}>${x.native}</span></td><td>${x.script[L]}</td><td>${x.dir === "rtl" ? h.t("Sağdan sola", "Right to left") : h.t("Soldan sağa", "Left to right")}</td><td class="y">✓</td><td${x.ui ? ' class="y">✓' : ">—"}</td></tr>`).join("")}
</tbody></table></div>
<div class="prose">
<h2>${h.t("Zazaca ve Kürtçe", "Zazaki and Kurdish")}</h2>
<p>${h.t("Kurmancî (Kuzey Kürtçesi) Latin harfleriyle yazılır. Zazaca (Kırmancki / Dimilkî) dilbilimde ayrı bir dil sayılır, birçok Zaza ise kendini Kürt kabul eder; bu yüzden onu Kürtçenin lehçesi olarak değil, kendi seçeneği olarak sunuyoruz. Soranî ve Arap harfli Kurmancî gibi diğer çeşitleri talebe göre ekleyeceğiz.", "Kurmanji (Northern Kurdish) is written in Latin letters. Zazaki (Kırmancki / Dimilkî) is regarded by linguists as a separate language while many Zazas consider themselves Kurds, so we offer it as its own option rather than as a Kurdish dialect. We will add other varieties, such as Sorani and Arabic-script Kurmanji, on demand.")}</p>
<h2>${h.t("Osmanlıca", "Ottoman Turkish")}</h2>
<p>${h.t("Osmanlıca, Arap harfleriyle yazılan Türkçedir. Editör sağdan sola akar, Arap harfli yazı tipiyle gösterilir; Osmanlıca yazmak için cihazında bir Arap harfli klavye etkinleştirmen gerekir. Latin harfli Türkçe ile Osmanlıca arasında dönüştürme aracı fikir aşamasındadır.", "Ottoman Turkish is Turkish written in Arabic script. The editor flows right to left and uses an Arabic-script typeface; to type Ottoman you need to enable an Arabic keyboard on your device. A converter between Latin-script Turkish and Ottoman is at the idea stage.")}</p>
<h2>${h.t("Karışık yön", "Mixed direction")}</h2>
<p>${h.t("Aynı belgede Arapça bir ayet sağdan sola, Kurmancî ya da Türkçe bir çeviri soldan sağa akabilir; her satır kendi yönünü seçer. Çift dilli kitaplar, meal ve çeviri metinleri için uygundur.", "In one document an Arabic verse can flow right to left while a Kurmanji or Turkish translation flows left to right; each line picks its own direction. This suits bilingual books, translated texts and commentaries.")}</p>
<h2>${h.t("Sesle yazma", "Dictation")}</h2>
<p>${h.t("Sesle yazma şimdilik Türkçe, Arapça ve İngilizce için çalışır; tarayıcının konuşma tanıma desteğine bağlıdır.", "Dictation currently works for Turkish, Arabic and English and depends on your browser's speech recognition support.")}</p>
</div>
<p class="cta"><a class="btn primary" href="/studio/">${h.t("Studio'yu aç", "Open Studio")}</a></p></div>`,
  },

  {
    id: "publishing", slug: { tr: "/tr/yayinla/", en: "/publishing/" }, priority: 0.8, schema: ["crumbs"],
    title: { tr: "Yayınla — yazını bir tıkla herkese açık sayfa yap | Publishify", en: "Publish your writing as a public page in one click | Publishify" },
    desc: { tr: "Blog yazısı, deneme, hikâye, makale ya da kitap: Publishify ile bir tıkla hızlı, güvenli, arama motorlarına hazır bir sayfada yayınla.", en: "A blog post, essay, story, article or book: publish it with Publishify in one click on a fast, secure, search-ready page." },
    body: (L, h) => `
<div class="wrap">${h.crumbs([["home"], ["publishing"]])}
<header class="page-head"><h1>${h.t("Yazını yayınla", "Publish your writing")}</h1><p class="lede">${h.t("Yazdığın şey yalnızca bir dosya olmak zorunda değil. Publishify'da bir tıkla herkesin okuyabileceği bir sayfa olur.", "What you write does not have to stay a file. In Publishify it becomes a page anyone can read, in one click.")}</p></header>
<div class="split">
<div class="prose">
<h2>${h.t("Nasıl çalışır", "How it works")}</h2>
<ol><li>${h.t("Hesap aç (şifresiz, passkey ile).", "Create an account (passwordless, with a passkey).")}</li><li>${h.t("Studio'da bir kitabı ya da tek parçalık bir yazıyı aç.", "Open a book or a single piece in Studio.")}</li><li>${h.t("Sağ paneldeki Yayınla sekmesinde adres, tür ve kısa tanıtım gir.", "In the Publish tab of the right-hand panel enter an address, a type and a short description.")}</li><li>${h.t("Yayınla'ya bas. Sayfan publishify.app/k/adres altında açılır.", "Press Publish. Your page opens under publishify.app/k/your-address.")}</li></ol>
<h2>${h.t("Hangi türler", "Which types")}</h2>
<p>${h.t("Kitap, roman, novella, hikâye, küçürek öykü, şiir, deneme, blog yazısı, akademik makale, kurgu dışı, anı ve oyun. Tek bölümlü bir yazı doğrudan makale sayfası olur; çok bölümlü bir yayın içindekiler ve bölüm sayfalarıyla açılır.", "Book, novel, novella, short story, flash fiction, poem, essay, blog post, academic article, non-fiction, memoir and play. A one-chapter piece becomes an article page directly; a multi-chapter publication opens with a table of contents and chapter pages.")}</p>
<h2>${h.t("Sayfada neler var", "What is on the page")}</h2>
<ul class="list"><li>${h.t("Başlık, yazar adı, yayın tarihi ve okuma süresi", "Title, author name, publication date and reading time")}</li><li>${h.t("WhatsApp, X, Facebook ve e-posta ile paylaşma bağlantıları", "Sharing links for WhatsApp, X, Facebook and email")}</li><li>${h.t("Sağdan sola diller için doğru yön ve yazı tipi", "Correct direction and typefaces for right-to-left languages")}</li><li>${h.t("Arama motorları ve yapay zekâ asistanları için schema.org yapısal verisi, canonical adres, Open Graph", "schema.org structured data, canonical address and Open Graph for search engines and AI assistants")}</li></ul>
<h2>${h.t("Güvenlik ve gizlilik", "Security and privacy")}</h2>
<p>${h.t("Yayın bir kopyadır: taslağın sende kalır ve sen “Güncelle” demedikçe sayfa değişmez; istediğin an yayından kaldırırsın. Yazdığın Markdown güvenli biçimde işlenir: ham HTML ve betik çalışmaz, sayfada JavaScript yoktur.", "A publication is a copy: your draft stays with you and the page only changes when you press Update; you can unpublish at any time. Your Markdown is rendered safely: raw HTML and scripts do not run and the page has no JavaScript.")}</p>
</div>
${h.shot("published-dark", h.t("Yayınlanmış bir hikâye sayfası", "A published story page"), { w: 1400, hh: 875, sizes: "(min-width:980px) 540px, 100vw" })}
</div>
<p class="cta"><a class="btn primary" href="/studio/">${h.t("Studio'yu aç", "Open Studio")}</a></p></div>`,
  },

  {
    id: "masthead", slug: { tr: "/tr/masthead/", en: "/masthead/" }, priority: 0.9, schema: ["crumbs"],
    title: { tr: "Masthead: yapay zekâ yayın kurulu | Publishify", en: "Masthead: your AI editorial board | Publishify" },
    desc: { tr: "Kitabını bir yayınevi kadrosu gibi okuyan, kanıta dayalı notlar veren ve metnine dokunmayan yapay zekâ yayın kurulu. Erken erişimde.", en: "An AI editorial board that reads your book like a publishing house, gives evidence-based notes and never touches your text. In early access." },
    body: (L, h) => `
<div class="wrap">${h.crumbs([["home"], ["masthead"]])}
<header class="page-head"><span class="eyebrow">${h.t("Erken erişim", "Early access")}</span><h1>${h.t("Kitabının yayın kurulu", "An editorial board for your book")}</h1><p class="lede">${h.t("Publishify Masthead, kitabını bir yayınevi kadrosu gibi okur; kanıta dayalı notlar verir, yolculuğun nerede durduğunu gösterir. Metnine dokunmaz, karar senindir.", "Publishify Masthead reads your book like a publishing house staff, gives evidence-based notes and shows where the journey stands. It never touches your text, and the decisions stay yours.")}</p>
<p class="cta"><a class="btn primary" href="mailto:info@publishify.app?subject=Masthead">${h.t("Erken erişim iste", "Request early access")}</a><a class="btn ghost" href="https://github.com/publishify/masthead-plugin">${h.t("Eklentiyi incele", "View the plugin")}</a></p></header>
<figure style="margin:0 0 2.5rem"><img src="/img/masthead-night-press-${L}.svg" width="680" height="580" style="width:100%;height:auto;max-width:860px;display:block;margin:0 auto" alt="${h.t("Gece yayınevi: yedi merhaleli tek halkanın altında çalışan yapay zekâ editörleri ve betikler. Örnek veridir.", "The night press: AI editors and scripts at work beneath a single ring of seven stages. Sample data.")}"></figure>
<div class="prose"><h2>${h.t("Masthead ne yapar?", "What Masthead does")}</h2></div>
<div class="grid three"><div class="card"><h3>${h.t("Bölüm bölüm editör okuması", "A section-by-section edit")}</h3><p>${h.t("Editör her bölümü bir kez okur; yapı ve tempo notları çıkarır, yazar için özet hazırlar.", "The Editor reads each section once, gives notes on structure and pacing and prepares a summary.")}</p></div><div class="card"><h3>${h.t("Dil ve imla", "Language and spelling")}</h3><p>${h.t("Yazım, noktalama ve dil bilgisi hatalarını gösterir. Sık yapılan yanlışlar betikle, tokensız yakalanır.", "It shows spelling, punctuation and grammar errors. Frequent mistakes are caught by a script, using no tokens.")}</p></div><div class="card"><h3>${h.t("Kitap boyunca tutarlılık", "Continuity across the book")}</h3><p>${h.t("Denetçi yaş, tarih, mekân, nesne ve bilgi çelişkilerini iki yerden kanıtla gösterir.", "The Auditor shows contradictions in age, date, place, objects and knowledge, each with evidence from two places.")}</p></div><div class="card"><h3>${h.t("Yolculuk haritası", "A map of the journey")}</h3><p>${h.t("Anlatının Yolcunun Yedi Merhalesi'nde nerede durduğunu tek bir halkada gösterir.", "A single ring shows where the narrative stands in The Wayfarer's Seven Stages.")}</p></div><div class="card"><h3>${h.t("Okur tepkisi", "Reader response")}</h3><p>${h.t("Okur Paneli, seçili bir okur profilinin nerede merak ettiğini, nerede uzaklaştığını canlandırır. Bu bir simülasyondur.", "The Reader Panel simulates where a chosen reader profile grew curious and where they drifted away. It is a simulation.")}</p></div><div class="card"><h3>${h.t("Görsel dashboard", "A visual dashboard")}</h3><p>${h.t("En fazla üç ana karar, bölüm bölüm durum ve bütün notlar tek sayfada. İnternetsiz açılır, yazdırılabilir.", "Up to three main decisions, section status and every note on one page. It opens offline and can be printed.")}</p></div></div>
<div class="prose"><h2>${h.t("Yazarın işini nasıl kolaylaştırır?", "How it makes the work easier")}</h2></div>
<div class="grid three"><div class="card"><h3>${h.t("Metne dokunmaz", "It never touches your text")}</h3><p>${h.t("Masthead yeniden yazmaz, hüküm vermez, “yayına hazır” demez. Kararı yalnızca yazar verir.", "Masthead does not rewrite, does not issue verdicts and never says “ready to publish”. Decisions stay with the author.")}</p></div><div class="card"><h3>${h.t("Kanıtsız not olmaz", "Notes come with evidence")}</h3><p>${h.t("Her not kitaptan bir alıntıya bağlıdır. Alıntı birebir bulunamazsa not “doğrulanamadı” diye işaretlenir.", "Every note is tied to a quote from your book. If a quote cannot be found word for word, the note is marked as unverified.")}</p></div><div class="card"><h3>${h.t("Değişmeyeni yeniden okumaz", "Unchanged sections are not read again")}</h3><p>${h.t("Kitabı düzeltip tekrar çalıştırdığında yalnızca değişen bölümler okunur.", "When you revise and run it again, only the sections that changed are read.")}</p></div><div class="card"><h3>${h.t("Rutin işler tokensız", "Routine work uses no tokens")}</h3><p>${h.t("Ölçüm, alıntı kontrolü, karne ve dashboard betikle yapılır; yapay zekâ yalnızca okuma gereken yerde çalışır.", "Measuring, quote checks, the scorecard and the dashboard are done by scripts. AI runs only where reading is needed.")}</p></div><div class="card"><h3>${h.t("Kitabının dilinde", "In your book's language")}</h3><p>${h.t("Notlar kitabın dilinde yazılır. Rapor ekranı da aynı dilde açılır.", "Notes are written in the language of your book, and the report opens in that language too.")}</p></div><div class="card"><h3>${h.t("Kaldığı yerden devam", "Picks up where it stopped")}</h3><p>${h.t("Bağlantı kopar ya da kullanım hakkın dolarsa, yeniden başlattığında tamamlanan iş tekrarlanmaz.", "If the connection drops or your usage limit is reached, finished work is not repeated when you start again.")}</p></div></div>
<div class="prose"><h2>${h.t("Dünya standartlarında altyapı", "World-class infrastructure")}</h2><p>${h.t("Masthead'i yazarın kitabını ve verisini merkeze alarak kurduk.", "We built Masthead around the author's book and data.")}</p></div>
<div class="grid three"><div class="card"><h3>${h.t("Kendi Claude hesabınla", "Runs on your own Claude account")}</h3><p>${h.t("Kitabı okuyan yapay zekâ senin Claude hesabında çalışır.", "The AI that reads your book runs on your own Claude account.")}</p></div><div class="card"><h3>${h.t("Kitabın sunucuya gitmez", "Your book stays with you")}</h3><p>${h.t("Tam metin ve bölüm özetleri bilgisayarında kalır. Sunucuya yalnızca notlar, en fazla 25 kelimelik alıntılar ve sayılar gider.", "Your full text and summaries stay on your computer. Only notes, quotes of up to 25 words and counts reach the server.")}</p></div><div class="card"><h3>${h.t("Sunucuda yapay zekâ yok", "No AI on our servers")}</h3><p>${h.t("Publishify sunucuları kitabını yapay zekâya okutmaz; iş sırasını ve rapor kayıtlarını betikle yönetir.", "Publishify's servers do not run AI on your book. Scripts manage the order of work and the report records.")}</p></div><div class="card"><h3>${h.t("Küresel altyapı", "Global infrastructure")}</h3><p>${h.t("Merkez, Cloudflare'in küresel ağında çalışır; her hesabın verisi kendi ayrı alanında tutulur.", "The service runs on Cloudflare's global network, and each account's data is kept in its own separate store.")}</p></div><div class="card"><h3>${h.t("Standart güvenli giriş", "Standard secure sign-in")}</h3><p>${h.t("Google ile giriş, OAuth ve PKCE ile yapılır. Kimlik bilgilerin bilgisayarında korunur.", "Sign-in with Google uses OAuth and PKCE, and your sign-in details are protected on your computer.")}</p></div><div class="card"><h3>${h.t("Verin senin", "Your data is yours")}</h3><p>${h.t("Silmek istediğinde tek kullanımlık ve süreli bir onay bağlantısıyla verin kaldırılır.", "When you want it gone, a single-use, time-limited confirmation link removes your data.")}</p></div></div>
<div class="prose"><h2>${h.t("Neleri okur?", "What it reads")}</h2><p>${h.t("Ana odağımız anlatı türleridir:", "Our main focus is narrative:")}</p></div>
<div class="chips"><span class="chip"><b>${h.t("Roman", "Novel")}</b></span><span class="chip"><b>${h.t("Novella", "Novella")}</b></span><span class="chip"><b>${h.t("Öykü", "Short story")}</b></span><span class="chip"><b>${h.t("Anı", "Memoir")}</b></span><span class="chip"><b>${h.t("Biyografi", "Biography")}</b></span><span class="chip"><b>${h.t("Oyun", "Play")}</b></span></div>
<div class="prose"><p>${h.t("Ana işimiz olmasa da beta olarak şunları da destekliyoruz. Yolculuk haritası yalnızca anlatılarda çıkar:", "Although not our main focus, these are also supported in beta. The journey map appears only for narratives:")}</p></div>
<div class="chips"><span class="chip"><b>${h.t("Makale", "Article")}</b></span><span class="chip"><b>${h.t("Küçürek", "Flash fiction")}</b></span><span class="chip"><b>${h.t("Blog yazısı", "Blog post")}</b></span><span class="chip"><b>${h.t("Deneme", "Essay")}</b></span></div>
<div class="prose"><h2>${h.t("Yolcunun Yedi Merhalesi", "The Wayfarer's Seven Stages")}</h2><p>${h.t("Masthead bir anlatıyı, Ali Osman Akçaoğlu'nun Dede Korkut, Attâr'ın <em>Mantıku't-Tayr</em>'ı ve tasavvuf edebiyatının yol anlayışını temel alarak geliştirdiği yedi merhalede okur. Kahramanın yolculuğu ile ortak aşamaları paylaşır; farkı, merkeze başarıyı değil derdi koymasıdır.", "Masthead reads a narrative through seven stages developed by Ali Osman Akçaoğlu from the Book of Dede Korkut, Attar's <em>Conference of the Birds</em> and the Sufi understanding of the path. It shares stages with the Hero's Journey; the difference is that its centre is not success but the wayfarer's inner need.")}</p><p><em>${h.t("Yolcu, derdiyle yola çıkar, yedi merhaleden geçer, ocağına değişmiş olarak döner.", "The wayfarer sets out with an inner need, passes through seven stages and returns home changed.")}</em></p></div>
<ol class="stages"><li><span class="n">01</span><div><h3>${h.t("Çağrı", "Call")}</h3><p class="q">${h.t("Eksik olan ne, yolcu çağrıya nasıl cevap veriyor?", "What is missing, and how does the wayfarer answer the call?")}</p><p>${h.t("Düzen bir yerinden sızlar. Yolcu eksik olanı fark eder, önce direnebilir, sonra cevap verir. Derdin ilk hâli burada görünür.", "Something in the order of things begins to ache. The wayfarer notices what is missing, may resist, then answers. The first form of the inner need appears here.")}</p></div></li><li><span class="n">02</span><div><h3>${h.t("Kılavuz", "Guide")}</h3><p class="q">${h.t("Kim yol gösteriyor, ne hazırlanıyor?", "Who shows the way, and what is being prepared?")}</p><p>${h.t("Yolcuya yol gösteren biri ya da bir şey belirir: mürşit, usta, yoldaş, bazen bir kitap ya da bir ses. Kılavuzun olmaması da bir tercihtir.", "Someone or something shows the way: a master, a mentor, a companion, sometimes a book or a voice. Having no guide is a choice too.")}</p></div></li><li><span class="n">03</span><div><h3>${h.t("Eşik", "Threshold")}</h3><p class="q">${h.t("Neyi geride bırakıyor, geri dönüş neden yok?", "What is left behind, and why is there no way back?")}</p><p>${h.t("Geri dönüşü zorlaştıran adım atılır. Yolcu bildiği dünyadan kopar ve yeni bir düzene bağlanır.", "A step is taken that makes going back hard. The wayfarer breaks from the known world and binds themselves to a new order.")}</p></div></li><li><span class="n">04</span><div><h3>${h.t("Sınav", "Trial")}</h3><p class="q">${h.t("Yol onu nasıl sınıyor, yeni dünyanın kuralı ne?", "How does the road test them, and what is the rule of the new world?")}</p><p>${h.t("Engeller, nefis, aşk ve öğrenme birbirini izler. Yolcu yeni dünyanın kuralını çoğu kez bedel ödeyerek öğrenir.", "Obstacles, desire, love and learning follow one another. The wayfarer learns the rule of the new world, often at a cost.")}</p></div></li><li><span class="n">05</span><div><h3>${h.t("Uyanış", "Awakening")}</h3><p class="q">${h.t("Neyi yakıp neye uyandı?", "What burned away, and what did they wake to?")}</p><p>${h.t("En büyük yüzleşme burada yaşanır. Yolcunun içinde bir şey yanar, yerine yeni bir görüş gelir.", "The greatest confrontation happens here. Something burns away inside the wayfarer, and a new way of seeing takes its place.")}</p></div></li><li><span class="n">06</span><div><h3>${h.t("Ödül", "Reward")}</h3><p class="q">${h.t("Bedeli ne, artık kim oldu?", "What was the price, and who have they become?")}</p><p>${h.t("Kazanılan çoğu kez bir nesne değil; bir ad, bir hakikat ya da yeni bir kimliktir. Bedeliyle birlikte gelir.", "What is won is rarely an object. It is a name, a truth or a new identity, and it comes with its price.")}</p></div></li><li><span class="n">07</span><div><h3>${h.t("Dönüş", "Return")}</h3><p class="q">${h.t("Ocağa ne getiriyor, ocak değişti mi?", "What do they bring home, and has home changed?")}</p><p>${h.t("Yolcu kazandığını ocağına getirir, hizmet eder, paylaşır. Ne ocak ne yolcu eskisi gibidir.", "The wayfarer brings what was won back home, to serve and to share. Neither home nor wayfarer is what it was.")}</p></div></li></ol>
<div class="prose"><p>${h.t("Merhaleler bir denetim listesi değil, haritadır. Sıraları zorunlu değildir, bir merhalenin olmaması da kusur sayılmaz.", "The stages are a map, not a checklist. Their order is not fixed, and a stage that is absent is not a fault.")}</p></div>
<div class="prose"><h2>${h.t("Nasıl kullanılır?", "How to use it")}</h2><p>${h.t("Masthead bir Claude Code eklentisidir; bir Claude hesabı gerekir. Erken erişim sürecinde lisans, Google hesabının e-postasına tanımlanır.", "Masthead is a Claude Code plugin and needs a Claude account. During early access, a licence is linked to the email of your Google account.")}</p></div>
<p class="cta"><a class="btn primary" href="mailto:info@publishify.app?subject=Masthead">${h.t("Erken erişim iste", "Request early access")}</a><a class="btn ghost" href="/studio/">${h.t("Studio'yu aç", "Open Studio")}</a></p></div>`,
  },

  {
    id: "compare", slug: { tr: "/tr/karsilastirma/", en: "/compare/" }, priority: 0.7, schema: ["crumbs"],
    title: { tr: "Publishify, Ulysses ve Scrivener karşılaştırması", en: "Publishify vs Ulysses vs Scrivener" },
    desc: { tr: "Publishify, Ulysses ve Scrivener'ı çalıştıkları cihazlar, ödeme modeli ve kurulum açısından karşılaştır; hangisi kime uygun?", en: "Compare Publishify, Ulysses and Scrivener by devices, pricing model and setup, and see which one suits whom." },
    body: (L, h) => `
<div class="wrap">${h.crumbs([["home"], ["compare"]])}
<header class="page-head"><h1>${h.t("Publishify, Ulysses ve Scrivener", "Publishify, Ulysses and Scrivener")}</h1><p class="lede">${h.t("Üçü de iyi yazma araçları; farklı insanlara göre yapılmışlar. Yalnızca doğrulayabildiğimiz olguları karşılaştırıyoruz.", "All three are good writing tools built for different people. We compare only facts we can verify.")}</p></header>
<div class="tw"><table><thead><tr><th></th><th>Publishify</th><th>Ulysses</th><th>Scrivener</th></tr></thead><tbody>
<tr><th scope="row">${h.t("Çalıştığı cihazlar", "Devices")}</th><td class="y">${h.t("Tarayıcısı olan her cihaz: Mac, Windows, Linux, Chromebook, telefon, tablet", "Any device with a browser: Mac, Windows, Linux, Chromebook, phone, tablet")}</td><td>Mac, iPad, iPhone</td><td>Mac, Windows, iPhone / iPad</td></tr>
<tr><th scope="row">${h.t("Ödeme modeli", "Pricing model")}</th><td class="y">${h.t("Editör ücretsiz", "Free editor")}</td><td>${h.t("Abonelik", "Subscription")}</td><td>${h.t("Tek seferlik satın alma (platform başına)", "One-time purchase (per platform)")}</td></tr>
<tr><th scope="row">${h.t("Kurulum", "Setup")}</th><td class="y">${h.t("Yok, tarayıcıdan açılır", "None, opens in the browser")}</td><td>${h.t("Uygulama kurulumu", "App install")}</td><td>${h.t("Uygulama kurulumu", "App install")}</td></tr>
</tbody></table></div>
<p class="small muted">${h.t("Bilgiler Kasım 2026'da ilgili resmî sayfalardan ve mağaza sayfalarından derlendi; fiyatlar ve cihaz desteği değişebilir, güncel hâli için kaynaklara bak.", "Information gathered in November 2026 from the official and store pages; prices and device support can change, so check the sources for current details.")} <a href="https://www.literatureandlatte.com/store/scrivener" rel="noopener nofollow">Scrivener</a> · <a href="https://ulysses.app" rel="noopener nofollow">Ulysses</a></p>
<div class="prose">
<h2>${h.t("Kime hangisi?", "Which one for whom?")}</h2>
<h3>Ulysses</h3><p>${h.t("Yalnızca Apple cihazları kullanıyorsan ve aboneliğe itirazın yoksa güçlü, cilalı bir yazma ortamıdır.", "If you use only Apple devices and don't mind a subscription, it is a polished and powerful writing environment.")}</p>
<h3>Scrivener</h3><p>${h.t("Araştırma notları, kaynaklar ve çok karmaşık yapıları aynı projede yönetmek isteyen uzun soluklu yazarlar için derin bir araçtır; öğrenmesi zaman alır.", "A deep tool for long-form authors who want research notes, sources and very complex structures in one project; it takes time to learn.")}</p>
<h3>Publishify</h3><p>${h.t("Sade bir editör, her cihazda aynı deneyim, kurulumsuz başlangıç, tek tıkla yayın ve Türkçe, Kurmancî, Zazaca, Osmanlıca, Arapça gibi dillere yerleşik destek istiyorsan. Henüz genç bir ürün: Scrivener'ın araştırma panolarını ya da Ulysses'in uygulama cilasını arıyorsan şimdilik onlar daha olgun.", "If you want a simple editor, the same experience on every device, no setup, one-click publishing and built-in support for Turkish, Kurmanji, Zazaki, Ottoman Turkish and Arabic. It is still a young product: if you want Scrivener's research boards or Ulysses' native-app polish, they are more mature today.")}</p>
</div>
<p class="cta"><a class="btn primary" href="/studio/">${h.t("Publishify'ı dene", "Try Publishify")}</a></p></div>`,
  },

  {
    id: "faq", slug: { tr: "/tr/sss/", en: "/faq/" }, priority: 0.7, schema: ["faq", "crumbs"],
    title: { tr: "Sık sorulan sorular | Publishify", en: "Frequently asked questions | Publishify" },
    desc: { tr: "Publishify hakkında sık sorulanlar: ücret, hesap, dosyalar, diller, yapay zekâ, yayınlama, güvenlik ve Ulysses ile Scrivener'dan farkı.", en: "Frequently asked questions about Publishify: pricing, accounts, files, languages, AI, publishing, security and how it differs from Ulysses and Scrivener." },
    body: (L, h) => `
<div class="wrap">${h.crumbs([["home"], ["faq"]])}
<header class="page-head"><h1>${h.t("Sık sorulan sorular", "Frequently asked questions")}</h1></header>
<div class="prose">${h.faq(99)}</div>
<p class="cta"><a class="btn primary" href="/studio/">${h.t("Studio'yu aç", "Open Studio")}</a></p></div>`,
  },
];
