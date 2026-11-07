/** Address (slug) suggestion: Turkish characters are simplified; returns empty for a title with no Latin letters. */
export const slugify = (s: string): string =>
  s.replace(/İ/g, "i").toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/g, "");
