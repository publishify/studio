/** Adres (slug) önerisi: Türkçe karakterler sadeleşir; Latin harfi olmayan başlıkta boş döner. */
export const slugify = (s: string): string =>
  s.replace(/İ/g, "i").toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/g, "");
