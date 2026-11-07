import type { Book } from "./store";

/** Publication types (same as `kinds` on the server). Single-piece writings are published too. */
export const pubKinds: { id: string; tr: string; en: string }[] = [
  { id: "kitap", tr: "Kitap", en: "Book" },
  { id: "roman", tr: "Roman", en: "Novel" },
  { id: "novella", tr: "Novella", en: "Novella" },
  { id: "hikaye", tr: "Hikâye", en: "Short story" },
  { id: "kucurek", tr: "Küçürek öykü", en: "Flash fiction" },
  { id: "siir", tr: "Şiir", en: "Poetry" },
  { id: "deneme", tr: "Deneme", en: "Essay" },
  { id: "blog", tr: "Blog yazısı", en: "Blog post" },
  { id: "makale", tr: "Akademik makale", en: "Academic article" },
  { id: "kurgu-disi", tr: "Kurgu dışı", en: "Non-fiction" },
  { id: "ani", tr: "Anı / biyografi", en: "Memoir / biography" },
  { id: "oyun", tr: "Oyun / senaryo", en: "Play / screenplay" },
];

const fromTemplate: Record<string, string> = {
  "roman-uc-perde": "roman", "roman-kahraman": "roman", novella: "novella", hikaye: "hikaye", kucurek: "kucurek", siir: "siir",
  deneme: "deneme", "deneme-kitabi": "kitap", ani: "ani", rehber: "kurgu-disi", makale: "makale", tez: "kitap", cocuk: "kitap", oyun: "oyun", blog: "blog",
};
/** Default publication type from the book's template or genre. */
export function defaultKind(b: Pick<Book, "template" | "genre">): string {
  if (b.template && fromTemplate[b.template]) return fromTemplate[b.template]!;
  return b.genre === "roman" || b.genre === "novella" || b.genre === "hikaye" ? b.genre : "kitap";
}
