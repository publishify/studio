// Blog posts (Turkish and English). Every claim comes from what the tools really do today.
// Each post opens with a direct answer and uses question headings, for readers and for answer engines.

const PUBLISHED = "2026-11-10";

const STAGES = [
  { tr: ["Çağrı", "Eksik olan ne, yolcu çağrıya nasıl cevap veriyor?", "Düzen bir yerinden sızlar. Yolcu eksik olanı fark eder, önce direnebilir, sonra cevap verir. Derdin ilk hâli burada görünür."], en: ["Call", "What is missing, and how does the wayfarer answer the call?", "Something in the order of things begins to ache. The wayfarer notices what is missing, may resist, then answers. The first form of the inner need appears here."] },
  { tr: ["Kılavuz", "Kim yol gösteriyor, ne hazırlanıyor?", "Yolcuya yol gösteren biri ya da bir şey belirir: mürşit, usta, yoldaş, bazen bir kitap ya da bir ses. Kılavuzun olmaması da bir tercihtir."], en: ["Guide", "Who shows the way, and what is being prepared?", "Someone or something shows the way: a master, a mentor, a companion, sometimes a book or a voice. Having no guide is a choice too."] },
  { tr: ["Eşik", "Neyi geride bırakıyor, geri dönüş neden yok?", "Geri dönüşü zorlaştıran adım atılır. Yolcu bildiği dünyadan kopar ve yeni bir düzene bağlanır."], en: ["Threshold", "What is left behind, and why is there no way back?", "A step is taken that makes going back hard. The wayfarer breaks from the known world and binds themselves to a new order."] },
  { tr: ["Sınav", "Yol onu nasıl sınıyor, yeni dünyanın kuralı ne?", "Engeller, nefis, aşk ve öğrenme birbirini izler. Yolcu yeni dünyanın kuralını çoğu kez bedel ödeyerek öğrenir."], en: ["Trial", "How does the road test them, and what is the rule of the new world?", "Obstacles, desire, love and learning follow one another. The wayfarer learns the rule of the new world, often at a cost."] },
  { tr: ["Uyanış", "Neyi yakıp neye uyandı?", "En büyük yüzleşme burada yaşanır. Yolcunun içinde bir şey yanar, yerine yeni bir görüş gelir."], en: ["Awakening", "What burned away, and what did they wake to?", "The greatest confrontation happens here. Something burns away inside the wayfarer, and a new way of seeing takes its place."] },
  { tr: ["Ödül", "Bedeli ne, artık kim oldu?", "Kazanılan çoğu kez bir nesne değil; bir ad, bir hakikat ya da yeni bir kimliktir. Bedeliyle birlikte gelir."], en: ["Reward", "What was the price, and who have they become?", "What is won is rarely an object. It is a name, a truth or a new identity, and it comes with its price."] },
  { tr: ["Dönüş", "Ocağa ne getiriyor, ocak değişti mi?", "Yolcu kazandığını ocağına getirir, hizmet eder, paylaşır. Ne ocak ne yolcu eskisi gibidir."], en: ["Return", "What do they bring home, and has home changed?", "The wayfarer brings what was won back home, to serve and to share. Neither home nor wayfarer is what it was."] },
];

const POSTS = ["seven-stages", "what-is-studio", "what-is-masthead"];

function article(L, h, id, post, content) {
  const related = POSTS.filter((p) => p !== id)
    .map((p) => `<a href="${h.href(p)}">${h.navName(p)} →</a>`)
    .join(" &nbsp; ");
  const questions = post.qa
    .map((x) => `<details class="q"><summary>${x.q[L]}</summary><div class="a">${x.a[L]}</div></details>`)
    .join("");
  return `
<div class="wrap">${h.crumbs([["home"], ["blog"], [id]])}
<header class="page-head"><p class="eyebrow">Blog</p><h1>${post.h1[L]}</h1><p class="lede">${post.answer[L]}</p><p class="small muted">Publishify · <time datetime="${PUBLISHED}">${h.t("10 Kasım 2026", "10 November 2026")}</time></p></header>
${content}
<div class="prose"><h2>${h.t("Sık sorulanlar", "Frequently asked questions")}</h2>${questions}<p style="margin-top:1.6rem">${related}</p></div></div>`;
}

const post = (id, data, content) => ({
  h1: data.h1,
  id,
  slug: data.slug,
  label: data.label,
  title: data.title,
  desc: data.desc,
  qa: data.qa,
  parent: "blog",
  article: PUBLISHED,
  priority: 0.7,
  schema: ["crumbs"],
  body: (L, h) => article(L, h, id, data, content(L, h)),
});

const sevenStages = post(
  "seven-stages",
  {
    slug: { tr: "/tr/blog/yolcunun-yedi-merhalesi/", en: "/blog/the-wayfarers-seven-stages/" },
    label: { tr: "Yolcunun Yedi Merhalesi", en: "The Wayfarer's Seven Stages" },
    title: { tr: "Yolcunun Yedi Merhalesi nedir? Anlatı modeli | Publishify", en: "What are The Wayfarer's Seven Stages? | Publishify" },
    desc: { tr: "Yolcunun Yedi Merhalesi, anlatıyı dert üzerinden okuyan yedi aşamalı bir modeldir. Merhaleleri öğren, PDF rehberi ücretsiz indir.", en: "The Wayfarer's Seven Stages is a seven-step narrative model built around a character's inner need. Learn the stages and download the free PDF guide." },
    h1: { tr: "Yolcunun Yedi Merhalesi nedir?", en: "What are The Wayfarer's Seven Stages?" },
    answer: {
      tr: "Yolcunun Yedi Merhalesi, bir anlatıdaki değişim yolculuğunu yedi aşamada inceleyen bir modeldir: Çağrı, Kılavuz, Eşik, Sınav, Uyanış, Ödül ve Dönüş. Merkezine dışsal başarıyı değil, kişiyi yola çıkaran derdi koyar.",
      en: "The Wayfarer's Seven Stages is a model that reads the journey of change in a story through seven steps: Call, Guide, Threshold, Trial, Awakening, Reward and Return. Its centre is not outward success but the inner need that sets a person on the road.",
    },
    qa: [
      { q: { tr: "Yolcunun Yedi Merhalesi'ni kim geliştirdi?", en: "Who developed The Wayfarer's Seven Stages?" }, a: { tr: "Model, yazar ve girişimci Ali Osman Akçaoğlu tarafından 2026'da geliştirildi.", en: "The model was developed by writer and entrepreneur Ali Osman Akçaoğlu in 2026." } },
      { q: { tr: "Kahramanın yolculuğundan farkı nedir?", en: "How is it different from the Hero's Journey?" }, a: { tr: "Çağrı, eşik, sınav ve dönüş gibi ortak aşamaları paylaşır. Farkı, merkeze kahramanın başarısını değil derdini koymasıdır.", en: "It shares stages such as the call, the threshold, the trial and the return. The difference is that its centre is not the hero's success but the inner need." } },
      { q: { tr: "Her merhale her kitapta olmak zorunda mı?", en: "Must every stage appear in every book?" }, a: { tr: "Hayır. Merhaleler bir denetim listesi değil, haritadır. Sıraları zorunlu değildir ve bir merhalenin olmaması kusur sayılmaz.", en: "No. The stages are a map, not a checklist. Their order is not fixed, and a stage that is absent is not a fault." } },
      { q: { tr: "Hangi türlere uygulanır?", en: "Which kinds of writing does it suit?" }, a: { tr: "Roman, öykü, anı, biyografi ve oyun gibi anlatı türlerine uygulanır. Akademik metinler kapsam dışındadır.", en: "It suits narrative forms such as novels, short stories, memoirs, biographies and plays. Academic texts are out of scope." } },
    ],
  },
  (L, h) => `
<div class="prose">
<h2>${h.t("Model neye dayanır?", "What is the model based on?")}</h2>
<p>${h.t("Ali Osman Akçaoğlu, modeli Dede Korkut hikâyeleri, Feridüddin Attâr'ın <em>Mantıku't-Tayr</em>'ı ile tasavvuf edebiyatının yol ve dönüşüm anlayışını temel alarak geliştirdi. Kahramanın yolculuğu olarak bilinen anlatı modeliyle ortak aşamaları paylaşır; yolu ise Türk ve tasavvuf edebiyatının kavramlarıyla okur.", "Ali Osman Akçaoğlu developed the model from the stories of Dede Korkut, Attar's <em>Conference of the Birds</em> and the Sufi understanding of the path and of change. It shares stages with the narrative model known as the Hero's Journey, and reads the road through the concepts of Turkish and Sufi literature.")}</p>
<p><em>${h.t("Yolcu, derdiyle yola çıkar, yedi merhaleden geçer, ocağına değişmiş olarak döner.", "The wayfarer sets out with an inner need, passes through seven stages and returns home changed.")}</em></p>
<h2>${h.t("Yedi merhale hangileri?", "What are the seven stages?")}</h2>
</div>
<ol class="stages">${STAGES.map((s, i) => `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><div><h3>${s[L][0]}</h3><p class="q">${s[L][1]}</p><p>${s[L][2]}</p></div></li>`).join("")}</ol>
<div class="prose">
<h2>${h.t("Bir merhale nasıl değerlendirilir?", "How is a stage assessed?")}</h2>
<p>${h.t("Her merhale dört durumdan biriyle işaretlenir: <strong>belirgin</strong>, <strong>örtük</strong>, <strong>yok</strong> ya da <strong>henüz yazılmadı</strong>. Bir kitapta birden çok yolcu varsa her biri ayrı izlenebilir.", "Each stage is marked with one of four states: <strong>clear</strong>, <strong>implicit</strong>, <strong>absent</strong> or <strong>not yet written</strong>. If a book has several wayfarers, each one can be followed separately.")}</p>
</div>
<div class="band" style="margin:2rem 0">
<h2>${h.t("Rehberi PDF olarak indir", "Download the guide as a PDF")}</h2>
<p>${h.t("Modeli, dört durumu ve kendi kitabına uygulama adımlarını anlatan 5 sayfalık ücretsiz rehber.", "A free 5-page guide to the model, the four states and how to apply it to your own book.")}</p>
<p class="cta" style="justify-content:center"><a class="btn" href="/downloads/${h.t("yolcunun-yedi-merhalesi.pdf", "the-wayfarers-seven-stages.pdf")}">${h.t("PDF'i indir", "Download the PDF")}</a></p>
</div>
<div class="prose">
<h2>${h.t("Kitabımda bu haritayı nasıl görürüm?", "How can I see this map for my own book?")}</h2>
<p>${h.t("Publishify Masthead, kitabını okuyup yedi merhalede nerede durduğunu tek bir halkada gösterir. Bunun yanında kanıta dayalı editör notları, tutarlılık denetimi ve simüle okur tepkileri verir. Metnine dokunmaz; kararı sen verirsin. Masthead şu an erken erişimdedir.", "Publishify Masthead reads your book and shows where it stands in the seven stages on a single ring. It also gives evidence-based editorial notes, continuity checks and simulated reader responses. It never touches your text, and the decisions stay yours. Masthead is in early access.")}</p>
<p class="cta"><a class="btn primary" href="${h.href("masthead")}">${h.t("Masthead'i incele", "Explore Masthead")}</a></p>
</div>`,
);

const whatIsStudio = post(
  "what-is-studio",
  {
    slug: { tr: "/tr/blog/publishify-studio-nedir/", en: "/blog/what-is-publishify-studio/" },
    label: { tr: "Publishify Studio nedir?", en: "What is Publishify Studio?" },
    title: { tr: "Publishify Studio nedir? Ücretsiz yazma editörü | Publishify", en: "What is Publishify Studio? A free writing editor | Publishify" },
    desc: { tr: "Publishify Studio, tarayıcıda çalışan ücretsiz bir yazma editörüdür. Kitabını kur, çok dilde yaz, Word ve ePUB indir, tek tıkla yayınla.", en: "Publishify Studio is a free writing editor that runs in your browser. Structure your book, write in many languages, export Word and ePUB, publish online." },
    h1: { tr: "Publishify Studio nedir?", en: "What is Publishify Studio?" },
    answer: {
      tr: "Publishify Studio, roman, öykü, deneme ve daha pek çok tür için tarayıcıda çalışan ücretsiz bir yazma editörüdür. Hesap açmadan başlarsın; kitabını kısım, bölüm ve sahnelere ayırır, istediğin biçimde indirir ya da tek tıkla yayınlarsın.",
      en: "Publishify Studio is a free writing editor that runs in your browser, for novels, stories, essays and much more. You can start without an account, shape your book into parts, chapters and scenes, then download it in the format you need or publish it in one click.",
    },
    qa: [
      { q: { tr: "Publishify Studio ücretsiz mi?", en: "Is Publishify Studio free?" }, a: { tr: "Evet. Editör ücretsizdir ve hesap açmadan kullanmaya başlayabilirsin.", en: "Yes. The editor is free, and you can start using it without an account." } },
      { q: { tr: "Kurulum gerekiyor mu?", en: "Do I need to install anything?" }, a: { tr: "Hayır. Studio tarayıcıda açılır; Mac, Windows, Linux, Chromebook, telefon ve tablette çalışır.", en: "No. Studio opens in the browser and works on Mac, Windows, Linux, Chromebook, phone and tablet." } },
      { q: { tr: "Kitabımı hangi biçimlerde indirebilirim?", en: "Which formats can I download my book in?" }, a: { tr: "Markdown, HTML, Word (.docx), e-kitap (.epub) ve PDF olarak indirebilirsin.", en: "You can download it as Markdown, HTML, Word (.docx), e-book (.epub) and PDF." } },
      { q: { tr: "Basılı kitap yayınlıyor mu?", en: "Does it publish printed books?" }, a: { tr: "Hayır. Publishify'da yayınlamak, kitabını web'de herkese açmak ya da e-kitap ve dosya olarak hazırlamak demektir. Matbaa baskısı ve mağazalara dağıtım yapmıyoruz.", en: "No. On Publishify, publishing means putting your book on the web or preparing it as an e-book and files. We do not handle printing or distribution to stores." } },
    ],
  },
  (L, h) => `
${h.shot("editor-dark", h.t("Publishify Studio editörü: solda kitabın yapısı, sağda metin", "The Publishify Studio editor: book structure on the left, text on the right"), { w: 1600, hh: 1000, sizes: "(min-width:980px) 1072px, 100vw" })}
<div class="prose">
<h2>${h.t("Studio'da neler yapabilirsin?", "What can you do in Studio?")}</h2>
<ul>
<li>${h.t("Canlı Markdown ile yaz; işaretler imleç satırından çıkınca kaybolur.", "Write in live Markdown, where the marks disappear once the cursor leaves the line.")}</li>
<li>${h.t("Kitabını kısım, bölüm ve sahnelere ayır; sürükleyerek sırala.", "Shape your book into parts, chapters and scenes, and reorder them by dragging.")}</li>
<li>${h.t("Türe göre hazır şablonlarla başla.", "Start from a template for your kind of writing.")}</li>
<li>${h.t("Sesle yaz ve tam ekran yazma modunda yalnızca sayfaya odaklan.", "Dictate, and focus on the page alone in full-screen writing mode.")}</li>
<li>${h.t("Sürüm geçmişi ve çöp kutusuyla yazdıklarını koru.", "Protect your work with version history and a trash folder.")}</li>
</ul>
<h2>${h.t("Hangi dillerde yazılır?", "Which languages can you write in?")}</h2>
<p>${h.t("Arapça, Osmanlıca, Türkçe, İngilizce, Almanca, Fransızca, Rusça, Japonca, Kurmancî ve Zazaca. Sağdan sola yazılan diller için yön, editörde ve dışa aktarmada korunur.", "Arabic, Ottoman Turkish, Turkish, English, German, French, Russian, Japanese, Kurmanji and Zazaki. For right-to-left languages, direction is kept in the editor and in exports.")}</p>
<h2>${h.t("Yazdıklarım nerede durur?", "Where does my writing live?")}</h2>
<p>${h.t("Önce kendi cihazında durur. İstersen hesabınla eşitlersin; Google Drive bağlantısı ise erken erişimde.", "It stays on your own device first. You can sync it with an account if you like, and the Google Drive connection is in early access.")}</p>
<p class="cta"><a class="btn primary" href="/studio/">${h.t("Yazmaya başla — ücretsiz", "Start writing — it's free")}</a><a class="btn ghost" href="${h.href("features")}">${h.t("Studio'yu incele", "Explore Studio")}</a></p>
</div>`,
);

const whatIsMasthead = post(
  "what-is-masthead",
  {
    slug: { tr: "/tr/blog/publishify-masthead-nedir/", en: "/blog/what-is-publishify-masthead/" },
    label: { tr: "Publishify Masthead nedir?", en: "What is Publishify Masthead?" },
    title: { tr: "Publishify Masthead nedir? Yapay zekâ yayın kurulu | Publishify", en: "What is Publishify Masthead? An AI editorial board | Publishify" },
    desc: { tr: "Publishify Masthead, kitabını okuyup kanıta dayalı editör notları veren yapay zekâ yayın kuruludur. Metnine dokunmaz, kararı sen verirsin.", en: "Publishify Masthead is an AI editorial board that reads your book and gives evidence-based notes. It never touches your text, and the decisions stay yours." },
    h1: { tr: "Publishify Masthead nedir?", en: "What is Publishify Masthead?" },
    answer: {
      tr: "Publishify Masthead, kitabını bir yayınevi kadrosu gibi okuyan yapay zekâ yayın kuruludur. Kanıta dayalı editör notları verir, tutarsızlıkları gösterir ve kitabın yolculuğunu haritalar. Metni değiştirmez, hüküm vermez; kararı sen verirsin.",
      en: "Publishify Masthead is an AI editorial board that reads your book the way a publishing house staff would. It gives evidence-based editorial notes, points out inconsistencies and maps your book's journey. It does not change your text or pass verdicts; the decisions stay yours.",
    },
    qa: [
      { q: { tr: "Masthead kitabımı yeniden yazar mı?", en: "Does Masthead rewrite my book?" }, a: { tr: "Hayır. Masthead metni değiştirmez ve “yayına hazır” gibi bir hüküm vermez. Metnini yalnızca sen değiştirirsin.", en: "No. Masthead does not change your text or give verdicts such as “ready to publish”. Only you change your text." } },
      { q: { tr: "Kitabım sunucuya gidiyor mu?", en: "Does my book go to a server?" }, a: { tr: "Tam metin ve bölüm özetleri bilgisayarında kalır. Publishify sunucusuna yalnızca editör notları, en fazla 25 kelimelik alıntılar ve sayılar gider. Kitabı kendi Claude hesabındaki yapay zekâ okur.", en: "Your full text and section summaries stay on your computer. Only editorial notes, quotes of up to 25 words and counts reach Publishify's server. The AI on your own Claude account reads the book." } },
      { q: { tr: "Masthead'i kullanmak için ne gerekir?", en: "What do I need to use Masthead?" }, a: { tr: "Masthead bir Claude Code eklentisidir ve bir Claude hesabı gerektirir. Şu an erken erişimdedir; lisans Google hesabının e-postasına tanımlanır.", en: "Masthead is a Claude Code plugin and needs a Claude account. It is in early access, and a licence is linked to the email of your Google account." } },
      { q: { tr: "Hangi türleri okur?", en: "What kinds of books does it read?" }, a: { tr: "Ana odağı roman, novella, öykü, anı, biyografi ve oyundur. Makale, küçürek, blog yazısı ve deneme beta olarak desteklenir; yolculuk haritası yalnızca anlatılarda çıkar.", en: "Its main focus is novels, novellas, short stories, memoirs, biographies and plays. Articles, flash fiction, blog posts and essays are supported in beta, and the journey map appears only for narratives." } },
    ],
  },
  (L, h) => `
<figure style="margin:0 0 2rem"><img src="/img/masthead-night-press-${L}.svg" width="680" height="580" loading="lazy" style="width:100%;height:auto;max-width:760px;display:block;margin:0 auto" alt="${h.t("Masthead yayın kurulu: yedi merhaleli halka, yapay zekâ editörleri ve betikler. Örnek veridir.", "The Masthead editorial board: a ring of seven stages, AI editors and scripts. Sample data.")}"></figure>
<div class="prose">
<h2>${h.t("Masthead kitabı nasıl okur?", "How does Masthead read a book?")}</h2>
<p>${h.t("Üç ayrı okuma yapar:", "It carries out three separate readings:")}</p>
<ul>
<li>${h.t("<strong>Editör</strong> her bölümü bir kez okur; yapı, tempo, dil ve imla notları çıkarır.", "<strong>The Editor</strong> reads each section once and gives notes on structure, pacing, language and spelling.")}</li>
<li>${h.t("<strong>Denetçi</strong> yaş, tarih, mekân ve nesne çelişkilerini iki yerden kanıtla gösterir, kitabı yedi merhalede haritalar.", "<strong>The Auditor</strong> shows contradictions in age, date, place and objects with evidence from two places, and maps the book onto the seven stages.")}</li>
<li>${h.t("<strong>Okur Paneli</strong> bir okurun nerede merak edip nerede uzaklaştığını simüle eder.", "<strong>The Reader Panel</strong> simulates where a reader grew curious and where they drifted away.")}</li>
</ul>
<h2>${h.t("Notlara neden güvenebilirim?", "Why can I trust the notes?")}</h2>
<p>${h.t("Her not kitaptan bir alıntıya bağlıdır. Alıntı kitapta birebir bulunamazsa not “doğrulanamadı” diye işaretlenir. Yapay zekâ hata yapabilir; bu yüzden son söz her zaman yazarındır.", "Every note is tied to a quote from your book. If a quote cannot be found word for word, the note is marked as unverified. AI can make mistakes, so the last word is always the author's.")}</p>
<h2>${h.t("Sonuçta ne elde ederim?", "What do I get at the end?")}</h2>
<p>${h.t("Tek bakışta yedi merhale, en fazla üç ana karar, bölüm bölüm durum ve bütün notların yer aldığı görsel bir rapor. İnternetsiz açılır ve yazdırılabilir.", "A visual report with the seven stages at a glance, up to three main decisions, section status and every note. It opens offline and can be printed.")}</p>
<p>${h.t("Kitabının yolculuğunu okuyan modeli merak ediyorsan", "If you are curious about the model that reads your book's journey, see")} <a href="${h.href("seven-stages")}">${h.t("Yolcunun Yedi Merhalesi yazısına göz at", "The Wayfarer's Seven Stages")}</a>.</p>
<p class="cta"><a class="btn primary" href="mailto:info@publishify.app?subject=Masthead">${h.t("Erken erişim iste", "Request early access")}</a><a class="btn ghost" href="${h.href("masthead")}">${h.t("Masthead'i incele", "Explore Masthead")}</a></p>
</div>`,
);

const blogIndex = {
  id: "blog",
  slug: { tr: "/tr/blog/", en: "/blog/" },
  label: { tr: "Blog", en: "Blog" },
  priority: 0.8,
  schema: ["crumbs"],
  title: { tr: "Blog: yazar-yayıncılar için rehberler | Publishify", en: "Blog: guides for author-publishers | Publishify" },
  desc: { tr: "Yazar-yayıncılar için rehberler: Yolcunun Yedi Merhalesi, Publishify Studio ve Masthead hakkında bilmen gerekenler.", en: "Guides for author-publishers: what to know about The Wayfarer's Seven Stages, Publishify Studio and Masthead." },
  body: (L, h) => `
<div class="wrap">${h.crumbs([["home"], ["blog"]])}
<header class="page-head"><h1>Blog</h1><p class="lede">${h.t("Kendi kitabını yayınlayan yazarlar için rehberler.", "Guides for authors who publish their own books.")}</p></header>
<div class="grid g3">
<a class="card" style="text-decoration:none;color:inherit" href="${h.href("seven-stages")}"><h3>${h.t("Yolcunun Yedi Merhalesi nedir?", "What are The Wayfarer's Seven Stages?")}</h3><p>${h.t("Anlatıyı dert üzerinden okuyan yedi aşamalı model. Ücretsiz PDF rehberiyle.", "A seven-step model that reads a story through its inner need. With a free PDF guide.")}</p></a>
<a class="card" style="text-decoration:none;color:inherit" href="${h.href("what-is-studio")}"><h3>${h.t("Publishify Studio nedir?", "What is Publishify Studio?")}</h3><p>${h.t("Tarayıcıda çalışan ücretsiz yazma editörü ve neler yapabildiği.", "The free writing editor that runs in your browser, and what it can do.")}</p></a>
<a class="card" style="text-decoration:none;color:inherit" href="${h.href("what-is-masthead")}"><h3>${h.t("Publishify Masthead nedir?", "What is Publishify Masthead?")}</h3><p>${h.t("Kitabını okuyan, metnine dokunmayan yapay zekâ yayın kurulu.", "The AI editorial board that reads your book and never touches your text.")}</p></a>
</div><div style="height:64px"></div></div>`,
};

export const BLOG = [blogIndex, sevenStages, whatIsStudio, whatIsMasthead];
