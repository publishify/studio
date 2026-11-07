import { ar } from "./i18n-extra";
import { de, fr, ja, ota, ru } from "./i18n-more";

export type Lang = "ar" | "ota" | "tr" | "en" | "de" | "fr" | "ru" | "ja";
/** Arayüz dilleri; sıra: Arapça, Osmanlıca, Türkçe, sonra diğerleri. Çevrilmemiş metinler İngilizce'ye düşer. */
export const uiLangs: { code: Lang; native: string; rtl: boolean }[] = [
  { code: "ar", native: "العربية", rtl: true }, { code: "ota", native: "لسان عثمانى", rtl: true }, { code: "tr", native: "Türkçe", rtl: false },
  { code: "en", native: "English", rtl: false }, { code: "de", native: "Deutsch", rtl: false }, { code: "fr", native: "Français", rtl: false },
  { code: "ru", native: "Русский", rtl: false }, { code: "ja", native: "日本語", rtl: false },
];
export const isUiLang = (c: unknown): c is Lang => uiLangs.some((l) => l.code === c);
export const isRtlUi = (l: Lang): boolean => uiLangs.find((x) => x.code === l)?.rtl ?? false;
/** Tarayıcı dilinden arayüz dili seç. */
export const detectUiLang = (nav: string): Lang => uiLangs.find((l) => nav.toLowerCase().startsWith(l.code))?.code ?? "en";

const dict = {
  tr: {
    library: "Kitaplık", newBook: "Yeni", untitledBook: "Adsız kitap", author: "Yazar", words: "kelime",
    addChapter: "Bölüm ekle", addPart: "Kısım ekle", newChapter: "Yeni bölüm", newPart: "Yeni kısım", untitled: "Başlıksız bölüm",
    rename: "Yeniden adlandır", del: "Sil", confirmDel: "Silinsin mi? Bu geri alınamaz.", back: "Kitaplık",
    saved: "Kaydedildi", saving: "Kaydediliyor…", focus: "Odak", typewriter: "Daktilo", theme: "Tema",
    light: "Açık", dark: "Koyu", sepia: "Sepya", green: "Yeşil", pink: "Pembe", night: "Gece", contents: "İçindekiler", add: "Ekle", newBookTitle: "Yeni", pickTemplate: "Bir şablon seç. Yalnızca yapıyı kurar, sonra her şeyi değiştirebilirsin.", kindLabel: "Yayın türü", share: "Paylaş", shareCopied: "Bağlantı kopyalandı", publish: "Yayınla", publishNote: "Yayınlanan metin herkese açık olur. Taslakların sende kalır; yayın bir kopyadır, düzenledikçe Güncelle de.", slugLabel: "Adres", descLabel: "Kısa tanıtım", publishBtn: "Yayınla", updateBtn: "Güncelle", unpublish: "Yayından kaldır", publishedAs: "Yayında", needAccount: "Yayınlamak için hesap aç (bulut simgesi).", slugTaken: "Bu adres kullanımda, başka bir tane dene.", openPage: "Sayfayı aç", slugRule: "Adres 3-60 karakter: küçük harf, rakam ve tire.", writingLang: "Yazı dili", langHint: "Sağdan sola yazılan dillerde editörün, dışa aktarmanın ve yayın sayfasının yönü otomatik ayarlanır. Osmanlıca ve Arap harfli diller için ilgili klavyeyi etkinleştir.", dictateLangUnsupported: "Bu dil için sesle yazma desteklenmiyor.", dictate: "Sesle yaz", dictateStop: "Dinlemeyi durdur", dictateHint: "Konuşarak yaz. \"nokta\", \"virgül\", \"yeni satır\" diyerek noktalama yapabilirsin. Ses, tarayıcının konuşma tanıma hizmetine gider.", dictateUnsupported: "Bu tarayıcı sesle yazmayı desteklemiyor (Chrome, Edge veya Safari kullan).", dictateDenied: "Mikrofon izni verilmedi.", toScene: "Sahneye çevir", toChapter: "Bölüme çevir", addScene: "Sahne ekle", newScene: "Yeni sahne", untitledScene: "Başlıksız sahne", genre: "Tür", genreRoman: "Roman", genreNovella: "Novella", genreHikaye: "Hikâye", genreDiger: "Diğer", genreHint: "Roman, novella ve hikâyede kısım › bölüm › sahne düzeyleri var. Diğer türlerin yapısı sonra eklenecek.", custom: "Özel", bgColor: "Arka plan", textColor: "Metin", lowContrast: "Renkler birbirine çok yakın, yazı zor okunur.", export: "Dışa aktar", history: "Sürümler", board: "Kurul",
    goal: "Günlük hedef", today: "Bugün", bookWords: "Kitap", snapshot: "Sürüm kaydet", restore: "Geri yükle",
    noVersions: "Henüz sürüm yok. Yazdıkça otomatik alınır.", preview: "Önizleme",
    boardTitle: "Yayın kurulu", boardText: "Kurgu editörü, okur paneli ve tutarlılık denetçisi buradan metni okuyup işaretleyecek. Kurul metni asla yeniden yazmaz.",
    boardSoon: "Kurul bir sonraki aşamada (sunucu) bağlanacak.", boardBtn: "Kurula gönder",
    dashboard: "Dashboard", dashboardSoon: "Kahramanın yolculuğu haritası kurulla birlikte gelecek.",
    expMd: "Markdown (.md)", expHtml: "Web sayfası (.html)", expDocx: "Word (.docx)", expEpub: "E-kitap (.epub)", expPdf: "PDF (yazdır)",
    bold: "Kalın", italic: "Eğik", h1: "Başlık 1", h2: "Başlık 2", quote: "Alıntı", list: "Liste",
    chapters: "bölüm", empty: "Henüz kitap yok. İlk kitabını oluştur.", language: "Dil", sidebar: "Bölümler",
    strike: "Üstü çizili", code: "Kod", h3: "Başlık 3", numbered: "Numaralı liste", checklist: "Yapılacaklar", link: "Bağlantı", hr: "Ayırıcı",
    search: "Ara…", noResults: "Sonuç yok", startWriting: "Yazmaya başla…", fullscreen: "Tam ekran", sidebarToggle: "Kenar çubuğu", panelToggle: "Panel",
    stats: "Hedef", settings: "Ayarlar", readTime: "Okuma süresi", min: "dk", fontSize: "Yazı boyutu", wordsToday: "Bugün yazılan", chapterWords: "Bu bölüm",
    expand: "Aç", collapse: "Kapat", books: "Kitaplar", otherBooks: "Diğer kitaplar", noParts: "Kısım yok",
    account: "Hesap", signIn: "Passkey ile giriş", createAccount: "Hesap oluştur", yourName: "Adın (isteğe bağlı)", recoverWith: "Kurtarma koduyla gir",
    recoveryCode: "Kurtarma kodu", recoveryTitle: "Kurtarma kodunu sakla", recoveryText: "Passkey'ini kaybedersen hesabına yalnızca bu kodla girebilirsin. Bir daha gösterilmeyecek; güvenli bir yere yaz ya da kaydet.",
    recoverySaved: "Kodu güvenli bir yere kaydettim", copy: "Kopyala", copied: "Kopyalandı", signOut: "Çıkış yap", addPasskey: "Bu cihaza passkey ekle", passkeyAdded: "Passkey eklendi",
    syncNow: "Şimdi eşitle", syncOff: "Eşitleme kapalı", syncIdle: "Eşitlendi", syncing: "Eşitleniyor…", syncError: "Eşitlenemedi", syncOffline: "Çevrimdışı",
    accountIntro: "Hesap açınca kitapların cihazların arasında eşitlenir. Hesapsız da yazmaya devam edebilirsin; her şey bu cihazda durur.",
    wrongCode: "Kod geçersiz.", tooMany: "Çok fazla deneme yapıldı. Biraz sonra tekrar dene.", failed: "İşlem tamamlanamadı.", passkeyUnsupported: "Bu tarayıcı passkey desteklemiyor.", lastSync: "Son eşitleme", conflictCopy: "çakışan kopya",
    conflictHint: "Bu bölüm iki cihazda farklı değişti; iki sürüm de saklandı.", resolved: "Çözüldü",
    title: "Kitap adı", close: "Kapat",
    audio: "Seslendirme", coverTitle: "Kapak", uploadCover: "Kapak yükle", replaceFile: "Değiştir", removeFile: "Kaldır", uploadAudio: "Ses dosyası yükle",
    audioNone: "Bu bölüm için henüz seslendirme yok. mp3, m4a, wav gibi bir dosya yükleyebilirsin.", onDrive: "Drive'da", uploading: "Drive'a yükleniyor…",
    localOnly: "Yalnızca bu cihazda. Google Drive'ı bağlayınca yüklenir.", fromDrive: "Drive'dan indir", tooBig: "Dosya çok büyük (en fazla 300 MB).", coverHint: "Kapak Drive'daki kitap klasörüne de yüklenir.",
    trash: "Çöp kutusu", untrash: "Geri al", deleteForever: "Kalıcı sil", emptyTrash: "Çöp kutusunu boşalt", emptyAsk: "Çöptekilerin hepsi kalıcı silinsin mi? Geri alınamaz.",
    yesDelete: "Evet, kalıcı sil", cancel: "Vazgeç", editBook: "Kitap bilgileri", save: "Kaydet", trashNote: "Çöptekiler sen \"boşalt\" diyene kadar burada durur.",
    driveTitle: "Google Drive", driveIntro: "Kitapların kendi Google Drive'ında, Publishify klasöründe düz Markdown dosyaları olarak saklanır. Başka kimse görmez; dosyaları Drive'dan da açabilirsin.",
    driveConnect: "Google Drive'a bağlan", driveDisconnect: "Bağlantıyı kes", driveReconnect: "Yeniden bağlan", driveSyncNow: "Drive'ı şimdi eşitle",
    driveOn: "Bağlı", driveOff: "Bağlı değil", driveNeedsAuth: "Oturum süresi doldu", driveFail: "Google bağlantısı kurulamadı.", driveKept: "Kitapların ve Drive'daki dosyalar olduğu gibi kalır.",
  },
  en: {
    library: "Library", newBook: "New", untitledBook: "Untitled book", author: "Author", words: "words",
    addChapter: "Add chapter", addPart: "Add part", newChapter: "New chapter", newPart: "New part", untitled: "Untitled chapter",
    rename: "Rename", del: "Delete", confirmDel: "Delete? This cannot be undone.", back: "Library",
    saved: "Saved", saving: "Saving…", focus: "Focus", typewriter: "Typewriter", theme: "Theme",
    light: "Light", dark: "Dark", sepia: "Sepia", green: "Green", pink: "Pink", night: "Night", contents: "Contents", add: "Add", newBookTitle: "New", pickTemplate: "Pick a template. It only sets up the structure; you can change everything later.", kindLabel: "Publication type", share: "Share", shareCopied: "Link copied", publish: "Publish", publishNote: "Published text is public. Your drafts stay with you; publishing makes a copy, press Update after editing.", slugLabel: "Address", descLabel: "Short description", publishBtn: "Publish", updateBtn: "Update", unpublish: "Unpublish", publishedAs: "Published", needAccount: "Create an account to publish (cloud icon).", slugTaken: "That address is taken, try another.", openPage: "Open page", slugRule: "3-60 characters: lowercase letters, digits and hyphens.", writingLang: "Writing language", langHint: "For right-to-left languages the editor, exports and the public page direction are set automatically. Enable the matching keyboard for Ottoman and Arabic-script languages.", dictateLangUnsupported: "Dictation is not supported for this language.", dictate: "Dictate", dictateStop: "Stop listening", dictateHint: "Speak to write. Say \"period\", \"comma\", \"new line\" for punctuation. Audio goes to your browser's speech recognition service.", dictateUnsupported: "This browser does not support dictation (use Chrome, Edge or Safari).", dictateDenied: "Microphone permission was not granted.", toScene: "Make a scene", toChapter: "Make a chapter", addScene: "Add scene", newScene: "New scene", untitledScene: "Untitled scene", genre: "Type", genreRoman: "Novel", genreNovella: "Novella", genreHikaye: "Short story", genreDiger: "Other", genreHint: "Novels, novellas and short stories have part › chapter › scene levels. Other types get their own structure later.", custom: "Custom", bgColor: "Background", textColor: "Text", lowContrast: "These colors are too close; text will be hard to read.", export: "Export", history: "Versions", board: "Board",
    goal: "Daily goal", today: "Today", bookWords: "Book", snapshot: "Save version", restore: "Restore",
    noVersions: "No versions yet. They are taken automatically as you write.", preview: "Preview",
    boardTitle: "Editorial board", boardText: "A fiction editor, a reader panel and a consistency checker will read and annotate your text here. The board never rewrites it.",
    boardSoon: "The board connects in the next phase (server).", boardBtn: "Send to board",
    dashboard: "Dashboard", dashboardSoon: "The hero's journey map arrives with the board.",
    expMd: "Markdown (.md)", expHtml: "Web page (.html)", expDocx: "Word (.docx)", expEpub: "E-book (.epub)", expPdf: "PDF (print)",
    bold: "Bold", italic: "Italic", h1: "Heading 1", h2: "Heading 2", quote: "Quote", list: "List",
    chapters: "chapters", empty: "No books yet. Create your first one.", language: "Language", sidebar: "Chapters",
    strike: "Strikethrough", code: "Code", h3: "Heading 3", numbered: "Numbered list", checklist: "Checklist", link: "Link", hr: "Divider",
    search: "Search…", noResults: "No results", startWriting: "Start writing…", fullscreen: "Fullscreen", sidebarToggle: "Sidebar", panelToggle: "Panel",
    stats: "Goal", settings: "Settings", readTime: "Reading time", min: "min", fontSize: "Font size", wordsToday: "Written today", chapterWords: "This chapter",
    expand: "Expand", collapse: "Collapse", books: "Books", otherBooks: "Other books", noParts: "No parts",
    account: "Account", signIn: "Sign in with passkey", createAccount: "Create account", yourName: "Your name (optional)", recoverWith: "Use recovery code",
    recoveryCode: "Recovery code", recoveryTitle: "Keep your recovery code", recoveryText: "If you lose your passkey, this code is the only way back into your account. It will not be shown again; write it down or save it somewhere safe.",
    recoverySaved: "I saved the code somewhere safe", copy: "Copy", copied: "Copied", signOut: "Sign out", addPasskey: "Add a passkey on this device", passkeyAdded: "Passkey added",
    syncNow: "Sync now", syncOff: "Sync off", syncIdle: "Synced", syncing: "Syncing…", syncError: "Sync failed", syncOffline: "Offline",
    accountIntro: "With an account your books sync across devices. You can keep writing without one; everything stays on this device.",
    wrongCode: "Invalid code.", tooMany: "Too many attempts. Try again in a little while.", failed: "Could not complete.", passkeyUnsupported: "This browser does not support passkeys.", lastSync: "Last sync", conflictCopy: "conflict copy",
    conflictHint: "This chapter changed on two devices; both versions were kept.", resolved: "Resolved",
    title: "Book title", close: "Close",
    audio: "Narration", coverTitle: "Cover", uploadCover: "Upload cover", replaceFile: "Replace", removeFile: "Remove", uploadAudio: "Upload audio file",
    audioNone: "No narration for this chapter yet. You can upload an mp3, m4a, wav or similar file.", onDrive: "In Drive", uploading: "Uploading to Drive…",
    localOnly: "On this device only. It uploads once you connect Google Drive.", fromDrive: "Download from Drive", tooBig: "File too large (300 MB max).", coverHint: "The cover is also uploaded to the book folder in Drive.",
    trash: "Trash", untrash: "Restore", deleteForever: "Delete forever", emptyTrash: "Empty trash", emptyAsk: "Delete everything in the trash forever? This cannot be undone.",
    yesDelete: "Yes, delete forever", cancel: "Cancel", editBook: "Book details", save: "Save", trashNote: "Items stay in the trash until you empty it.",
    driveTitle: "Google Drive", driveIntro: "Your books are kept in your own Google Drive, in a Publishify folder, as plain Markdown files. Nobody else sees them, and you can open the files from Drive too.",
    driveConnect: "Connect Google Drive", driveDisconnect: "Disconnect", driveReconnect: "Reconnect", driveSyncNow: "Sync Drive now",
    driveOn: "Connected", driveOff: "Not connected", driveNeedsAuth: "Session expired", driveFail: "Could not connect to Google.", driveKept: "Your books and the files in Drive stay as they are.",
  },
} as const;

export type Key = keyof (typeof dict)["tr"];
const extra: Partial<Record<Lang, Partial<Record<Key, string>>>> = { ar, ota, de, fr, ru, ja };
export const t = (lang: Lang, key: Key): string =>
  lang === "tr" || lang === "en" ? dict[lang][key] : (extra[lang]?.[key] ?? dict.en[key]);
