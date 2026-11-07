import { describe, expect, it } from "vitest";
import { bookLangOf, bookLangs, htmlLang, isBookLang, isRtl } from "../languages";

describe("yazı dilleri", () => {
  it("sıra: Arapça, Osmanlıca, Türkçe, İngilizce, Almanca, Fransızca, Rusça, Japonca; sonda Kurmancî ve Zazaca", () => {
    expect(bookLangs.map((l) => l.code)).toEqual(["ar", "ota", "tr", "en", "de", "fr", "ru", "ja", "ku", "zza"]);
  });
  it("Zazaca Kürtçenin lehçesi olarak değil ayrı dil olarak adlandırılır", () => {
    expect(bookLangs.find((l) => l.code === "zza")?.tr).toMatch(/^Zazaca/);
  });
  it("yön: Osmanlıca ve Arapça sağdan sola, diğerleri soldan sağa", () => {
    for (const l of ["ota", "ar"] as const) expect(isRtl(l), l).toBe(true);
    for (const l of ["tr", "ku", "zza", "en"] as const) expect(isRtl(l), l).toBe(false);
  });
  it("HTML dil etiketi: Osmanlıca ota-Arab, Kurmancî ku-Latn", () => {
    expect(htmlLang("ota")).toBe("ota-Arab");
    expect(htmlLang("ku")).toBe("ku-Latn");
  });
  it("listede olmayan eski değerler güvenle çözülür", () => {
    expect(isBookLang("fa")).toBe(false);
    expect(bookLangOf({ lang: "fa" }, "tr")).toBe("tr");
    expect(bookLangOf({ lang: "az" }, "ar")).toBe("ar");
    expect(bookLangOf({}, "xx")).toBe("tr");
    expect(bookLangOf({ lang: "zza" }, "tr")).toBe("zza");
  });
});
