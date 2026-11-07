import { describe, expect, it } from "vitest";
import { detectUiLang, isRtlUi, isUiLang, t, uiLangs } from "../i18n";
import { ar } from "../i18n-extra";
import { de, fr, ja, ota, ru } from "../i18n-more";

describe("arayüz dilleri", () => {
  it("çevrilen metinler kendi dilinden gelir", () => {
    expect(t("ar", "library")).toBe("المكتبة");
    expect(t("tr", "library")).toBe("Kitaplık");
  });
  it("çevrilmemiş Arapça metin İngilizce'ye düşer", () => expect(t("ar", "boardSoon")).toBe(t("en", "boardSoon")));
  it("sıra: Arapça, Osmanlıca, Türkçe, sonra diğerleri; Arapça ve Osmanlıca sağdan sola", () => {
    expect(uiLangs.map((l) => l.code)).toEqual(["ar", "ota", "tr", "en", "de", "fr", "ru", "ja"]);
    expect(isRtlUi("ar")).toBe(true);
    expect(isRtlUi("ota")).toBe(true);
    expect(isRtlUi("de")).toBe(false);
    expect(isRtlUi("tr")).toBe(false);
  });
  it("eski kayıtlardaki kaldırılmış diller geçersiz sayılır", () => {
    expect(isUiLang("az")).toBe(false);
    expect(isUiLang("fa")).toBe(false);
    expect(isUiLang("ar")).toBe(true);
  });
  it("tarayıcı dilinden seçim", () => {
    expect(detectUiLang("ar-SA")).toBe("ar");
    expect(detectUiLang("tr-TR")).toBe("tr");
    expect(detectUiLang("de-DE")).toBe("de");
    expect(detectUiLang("ja-JP")).toBe("ja");
    expect(detectUiLang("es-ES")).toBe("en");
    expect(detectUiLang("fa-IR")).toBe("en");
  });
  it("çeviri dosyasında boş metin yok", () => { for (const tr of [ar, ota, de, fr, ru, ja]) for (const [k, v] of Object.entries(tr)) expect(v, k).toBeTruthy(); });
  it("yeni diller kendi metnini verir", () => {
    expect(t("de", "library")).toBe("Bibliothek");
    expect(t("ja", "library")).toBe("ライブラリ");
    expect(t("ru", "trash")).toBe("Корзина");
  });
});
