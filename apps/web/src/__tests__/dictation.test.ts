import { describe, expect, it } from "vitest";
import { applyVoiceCommands } from "../dictation";

describe("sesle yazma: komutlar", () => {
  it("noktalama komutları işarete döner", () => {
    expect(applyVoiceCommands("bugün hava güzel nokta yarın yağmur yağar mı soru işareti", "tr")).toBe("bugün hava güzel. yarın yağmur yağar mı?");
  });
  it("yeni satır ve yeni paragraf", () => {
    expect(applyVoiceCommands("birinci yeni satır ikinci yeni paragraf üçüncü", "tr")).toBe("birinci\nikinci\n\nüçüncü");
  });
  it("virgül", () => expect(applyVoiceCommands("elma virgül armut", "tr")).toBe("elma, armut"));
  it("İngilizce", () => expect(applyVoiceCommands("hello comma world period", "en")).toBe("hello, world."));
});
