import { describe, expect, it } from "vitest";
import { detectUiLang, isRtlUi, isUiLang, t, uiLangs } from "../i18n";
import { ar } from "../i18n-extra";
import { de, fr, ja, ota, ru } from "../i18n-more";

describe("interface languages", () => {
  it("translated strings come from their own language", () => {
    expect(t("ar", "library")).toBe("المكتبة");
    expect(t("tr", "library")).toBe("Kitaplık");
  });
  it("untranslated Arabic strings fall back to English", () => expect(t("ar", "boardSoon")).toBe(t("en", "boardSoon")));
  it("order: Arabic, Ottoman Turkish, Turkish, then the others; Arabic and Ottoman Turkish are right-to-left", () => {
    expect(uiLangs.map((l) => l.code)).toEqual(["ar", "ota", "tr", "en", "de", "fr", "ru", "ja"]);
    expect(isRtlUi("ar")).toBe(true);
    expect(isRtlUi("ota")).toBe(true);
    expect(isRtlUi("de")).toBe(false);
    expect(isRtlUi("tr")).toBe(false);
  });
  it("removed languages in old records are treated as invalid", () => {
    expect(isUiLang("az")).toBe(false);
    expect(isUiLang("fa")).toBe(false);
    expect(isUiLang("ar")).toBe(true);
  });
  it("selection from the browser language", () => {
    expect(detectUiLang("ar-SA")).toBe("ar");
    expect(detectUiLang("tr-TR")).toBe("tr");
    expect(detectUiLang("de-DE")).toBe("de");
    expect(detectUiLang("ja-JP")).toBe("ja");
    expect(detectUiLang("es-ES")).toBe("en");
    expect(detectUiLang("fa-IR")).toBe("en");
  });
  it("no empty strings in the translation files", () => { for (const tr of [ar, ota, de, fr, ru, ja]) for (const [k, v] of Object.entries(tr)) expect(v, k).toBeTruthy(); });
  it("new languages return their own text", () => {
    expect(t("de", "library")).toBe("Bibliothek");
    expect(t("ja", "library")).toBe("ライブラリ");
    expect(t("ru", "trash")).toBe("Корзина");
  });
});
