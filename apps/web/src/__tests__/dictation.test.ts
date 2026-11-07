import { describe, expect, it } from "vitest";
import { applyVoiceCommands } from "../dictation";

describe("sesle yazma: komutlar", () => {
  it("punctuation commands turn into marks", () => {
    expect(applyVoiceCommands("bugün hava güzel nokta yarın yağmur yağar mı soru işareti", "tr")).toBe("bugün hava güzel. yarın yağmur yağar mı?");
  });
  it("new line and new paragraph", () => {
    expect(applyVoiceCommands("birinci yeni satır ikinci yeni paragraf üçüncü", "tr")).toBe("birinci\nikinci\n\nüçüncü");
  });
  it("comma", () => expect(applyVoiceCommands("elma virgül armut", "tr")).toBe("elma, armut"));
  it("English", () => expect(applyVoiceCommands("hello comma world period", "en")).toBe("hello, world."));
});
