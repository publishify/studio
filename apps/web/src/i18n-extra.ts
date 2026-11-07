// Arapça arayüz (temel metinler). Çevrilmemiş metinler İngilizce'ye düşer. Çevirileri anadili Arapça olan biri gözden geçirmeli.
import type { Key } from "./i18n";

type Tr = Partial<Record<Key, string>>;

export const ar: Tr = {
  library: "المكتبة", newBook: "جديد", untitledBook: "كتاب بلا عنوان", author: "المؤلف", words: "كلمة",
  addChapter: "إضافة فصل", addPart: "إضافة قسم", addScene: "إضافة مشهد", newChapter: "فصل جديد", newPart: "قسم جديد", newScene: "مشهد جديد",
  untitled: "فصل بلا عنوان", untitledScene: "مشهد بلا عنوان", rename: "إعادة تسمية", del: "حذف", back: "المكتبة",
  saved: "تم الحفظ", saving: "جارٍ الحفظ…", focus: "التركيز", typewriter: "الآلة الكاتبة", theme: "السمة",
  light: "فاتح", dark: "داكن", sepia: "سيبيا", green: "أخضر", pink: "وردي", night: "ليلي", custom: "مخصص",
  contents: "المحتويات", add: "إضافة", export: "تصدير", history: "الإصدارات", board: "اللجنة", goal: "الهدف اليومي", today: "اليوم", bookWords: "الكتاب",
  snapshot: "حفظ إصدار", restore: "استعادة", noVersions: "لا توجد إصدارات بعد. تُحفظ تلقائيًا أثناء الكتابة.",
  bold: "غامق", italic: "مائل", strike: "يتوسطه خط", code: "رمز", h1: "عنوان 1", h2: "عنوان 2", h3: "عنوان 3", quote: "اقتباس", list: "قائمة", numbered: "قائمة مرقمة", checklist: "قائمة مهام", link: "رابط", hr: "فاصل",
  chapters: "فصل", empty: "لا توجد كتب بعد. أنشئ كتابك الأول.", language: "اللغة", sidebar: "الفصول", search: "بحث…", noResults: "لا نتائج", startWriting: "ابدأ الكتابة…",
  fullscreen: "ملء الشاشة", sidebarToggle: "الشريط الجانبي", panelToggle: "اللوحة", stats: "الهدف", settings: "الإعدادات", readTime: "مدة القراءة", min: "د", fontSize: "حجم الخط", wordsToday: "المكتوب اليوم", chapterWords: "هذا الفصل",
  account: "الحساب", signIn: "الدخول بمفتاح المرور", createAccount: "إنشاء حساب", yourName: "اسمك (اختياري)", recoverWith: "الدخول برمز الاسترداد", signOut: "تسجيل الخروج",
  syncNow: "مزامنة الآن", syncOff: "المزامنة متوقفة", syncIdle: "تمت المزامنة", syncing: "جارٍ المزامنة…", syncError: "تعذّرت المزامنة", syncOffline: "غير متصل",
  copy: "نسخ", copied: "تم النسخ", close: "إغلاق", cancel: "إلغاء", save: "حفظ",
  trash: "سلة المحذوفات", untrash: "استرجاع", deleteForever: "حذف نهائي", emptyTrash: "إفراغ السلة", yesDelete: "نعم، احذف نهائيًا",
  editBook: "معلومات الكتاب", title: "عنوان الكتاب", coverTitle: "الغلاف", uploadCover: "رفع الغلاف", replaceFile: "استبدال", removeFile: "إزالة", audio: "التسجيل الصوتي",
  publish: "نشر", publishBtn: "نشر", updateBtn: "تحديث", unpublish: "إلغاء النشر", slugLabel: "العنوان", descLabel: "نبذة قصيرة", kindLabel: "نوع المنشور", share: "مشاركة",
  writingLang: "لغة الكتابة", genre: "النوع", genreRoman: "رواية", genreNovella: "رواية قصيرة", genreHikaye: "قصة", genreDiger: "أخرى",
  dictate: "الكتابة بالصوت", dictateStop: "إيقاف الاستماع", bgColor: "الخلفية", textColor: "النص",
  driveTitle: "Google Drive", driveConnect: "ربط Google Drive", driveDisconnect: "قطع الاتصال", toScene: "تحويل إلى مشهد", toChapter: "تحويل إلى فصل",
  newBookTitle: "جديد", pickTemplate: "اختر قالبًا. يُنشئ البنية فقط، ويمكنك تغيير كل شيء لاحقًا.",
};
