// Kitabın yazı dili: yön (RTL), yazım denetimi, sesle yazma ve dışa aktarma buna göre ayarlanır.
// Sıra: Arapça, Osmanlıca, Türkçe, sonra diğerleri. Arayüzü olan her dil yazı dili de olur; Kurmancî ve Zazaca yalnızca yazı dilidir (arayüz çevirisi yok).
export type BookLang = "ar" | "ota" | "tr" | "en" | "de" | "fr" | "ru" | "ja" | "ku" | "zza";

export interface LangInfo { code: BookLang; native: string; tr: string; en: string; rtl: boolean; speech?: string }

export const bookLangs: LangInfo[] = [
  { code: "ar", native: "العربية", tr: "Arapça", en: "Arabic", rtl: true, speech: "ar-SA" },
  { code: "ota", native: "لسان عثمانى", tr: "Osmanlıca (Arap harfli)", en: "Ottoman Turkish", rtl: true },
  { code: "tr", native: "Türkçe", tr: "Türkçe", en: "Turkish", rtl: false, speech: "tr-TR" },
  { code: "en", native: "English", tr: "İngilizce", en: "English", rtl: false, speech: "en-US" },
  { code: "de", native: "Deutsch", tr: "Almanca", en: "German", rtl: false, speech: "de-DE" },
  { code: "fr", native: "Français", tr: "Fransızca", en: "French", rtl: false, speech: "fr-FR" },
  { code: "ru", native: "Русский", tr: "Rusça", en: "Russian", rtl: false, speech: "ru-RU" },
  { code: "ja", native: "日本語", tr: "Japonca", en: "Japanese", rtl: false, speech: "ja-JP" },
  // Zazaca dilbilimde ayrı bir dil sayılır; Kürtçenin lehçesi olarak değil, yanında listelenir.
  { code: "ku", native: "Kurdî (Kurmancî)", tr: "Kürtçe — Kurmancî (Latin)", en: "Kurdish — Kurmanji (Latin)", rtl: false },
  { code: "zza", native: "Zazakî (Kırmancki)", tr: "Zazaca (Kırmancki / Dimilkî)", en: "Zazaki", rtl: false },
];

const byCode = new Map(bookLangs.map((l) => [l.code, l] as const));
export const isBookLang = (c: unknown): c is BookLang => typeof c === "string" && byCode.has(c as BookLang);
export const langInfo = (c: BookLang): LangInfo => byCode.get(c) ?? byCode.get("tr")!;
export const isRtl = (c: BookLang): boolean => langInfo(c).rtl;
/** HTML lang özniteliği: Osmanlıca Arap harfiyle, Kurmancî Latin harfiyle yazıldığı için betik etiketi eklenir. */
export const htmlLang = (c: BookLang): string => (c === "ota" ? "ota-Arab" : c === "ku" ? "ku-Latn" : c);
/** Kitabın dili; listede olmayan (eski) bir değerse arayüz diline, o da uygun değilse Türkçe'ye düşer. */
export const bookLangOf = (b: { lang?: string }, ui: string): BookLang => (isBookLang(b.lang) ? b.lang : isBookLang(ui) ? ui : "tr");
