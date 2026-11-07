import { describe, expect, it } from "vitest";
import { bookLangOf, bookLangs, htmlLang, isBookLang, isRtl } from "../languages";

describe("writing languages", () => {
  it("order: Arabic, Ottoman Turkish, Turkish, English, German, French, Russian, Japanese; Kurmanji and Zazaki last", () => {
    expect(bookLangs.map((l) => l.code)).toEqual(["ar", "ota", "tr", "en", "de", "fr", "ru", "ja", "ku", "zza"]);
  });
  it("Zazaki is named as a separate language, not as a dialect of Kurdish", () => {
    expect(bookLangs.find((l) => l.code === "zza")?.tr).toMatch(/^Zazaca/);
  });
  it("direction: Ottoman Turkish and Arabic are right-to-left, the others left-to-right", () => {
    for (const l of ["ota", "ar"] as const) expect(isRtl(l), l).toBe(true);
    for (const l of ["tr", "ku", "zza", "en"] as const) expect(isRtl(l), l).toBe(false);
  });
  it("HTML language tag: Ottoman Turkish ota-Arab, Kurmanji ku-Latn", () => {
    expect(htmlLang("ota")).toBe("ota-Arab");
    expect(htmlLang("ku")).toBe("ku-Latn");
  });
  it("old values that are not in the list resolve safely", () => {
    expect(isBookLang("fa")).toBe(false);
    expect(bookLangOf({ lang: "fa" }, "tr")).toBe("tr");
    expect(bookLangOf({ lang: "az" }, "ar")).toBe("ar");
    expect(bookLangOf({}, "xx")).toBe("tr");
    expect(bookLangOf({ lang: "zza" }, "tr")).toBe("zza");
  });
});
