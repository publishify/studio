import { describe, expect, it } from "vitest";
import { contrast, themeColors } from "../themes";

describe("kontrast", () => {
  it("siyah-beyaz 21:1", () => expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 0));
  it("identical colours give 1:1", () => expect(contrast("#668f5a", "#668f5a")).toBeCloseTo(1, 5));
  it("built-in themes have readable text/background contrast (>= 7)", () => {
    for (const [name, c] of Object.entries(themeColors)) expect(contrast(c.bg, c.ink), name).toBeGreaterThanOrEqual(7);
  });
  it("custom colours that are close to each other score low", () => expect(contrast("#F4F0FF", "#E8E0FF")).toBeLessThan(4.5));
});
