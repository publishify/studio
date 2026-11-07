import type { Theme } from "./store";

/** Tema seçicideki yuvarlak simgeler için zemin ve yazı renkleri. */
export const themeColors: Record<Exclude<Theme, "custom">, { bg: string; ink: string }> = {
  light: { bg: "#ffffff", ink: "#111111" },
  dark: { bg: "#19191a", ink: "#f1f1f1" },
  sepia: { bg: "#f6efdc", ink: "#3a2e1c" },
  green: { bg: "#EFF6ED", ink: "#000000" },
  pink: { bg: "#FFF1FA", ink: "#000000" },
  night: { bg: "#000014", ink: "#ffffff" },
};
export const themeOrder: Theme[] = ["light", "dark", "sepia", "green", "pink", "night", "custom"];

const lum = (hex: string): number => {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
};
/** WCAG kontrast oranı (1–21). */
export const contrast = (a: string, b: string): number => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
};
