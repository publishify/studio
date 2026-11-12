// Development only (?demo): loads a sample book for the marketing-site screenshots. Not part of the production build.
// Example: /studio/?demo=1&theme=light&book=tr   (book: tr | en | ar)
import { useStore } from "../store";
import type { Item } from "../store";

const q = new URLSearchParams(location.search);
const uid = () => crypto.randomUUID();
const ch = (body: string, extra: Partial<Item> = {}): Item => ({ id: uid(), kind: "chapter", title: "", body, updated: Date.now(), versions: [], ...extra });
const part = (title: string): Item => ({ id: uid(), kind: "part", title, body: "", updated: Date.now(), versions: [] });

const tr = () => {
  const open = ch((q.get("zen") ? "" : "# Liman\n\n") + "Sabah, sis limanın üstünden çekilmeden önce gelmişti Nehir. Valizi küçüktü; içinde yalnızca bir defter, bir kalem ve *annesinin sesinin* kayıtlı olduğu eski bir kaset vardı.\n\n> “Deniz, söylemeyi bilmeyenlerin dilidir,” derdi babası.\n\nNehir bunu hiçbir zaman anlamamıştı. Ta ki **o akşam**, iskelenin ucunda, tuzun kokusu çocukluğunun bütün kapılarını bir anda açana kadar.\n\n- Defterin ilk sayfası boştu.\n- İkincisine tek bir cümle yazdı.\n\nKasetçaları bulmak kolay değildi; ama yazmak, diye düşündü, hâlâ elindeydi.");
  const items: Item[] = [
    part("I. Kıyı"), open,
    ch("Sabah, sis çekilmeden", { level: 2 }), ch("İskelenin ucunda", { level: 2 }),
    ch("# Kaset"), ch("Ustanın dükkânı", { level: 2 }),
    part("II. Açık deniz"), ch("# Fırtına"), ch("# Dönüş"),
  ];
  return { items, active: open.id, title: "Tuz ve Deniz", author: "Yazar Adı", lang: undefined as string | undefined };
};
const en = () => {
  const open = ch((q.get("zen") ? "" : "# The Harbor\n\n") + "River reached the harbor before the fog had lifted. Her suitcase was small; it held only a notebook, a pen and an old cassette with *her mother's voice* on it.\n\n> “The sea is the language of those who cannot speak,” her father used to say.\n\nRiver had never understood that. Not until **that evening**, at the end of the pier, when the smell of salt threw open every door of her childhood at once.\n\n- The first page of the notebook was empty.\n- On the second she wrote a single sentence.\n\nA cassette player would be hard to find; but writing, she thought, was still in her hands.");
  const items: Item[] = [
    part("I. The Shore"), open,
    ch("Morning, before the fog", { level: 2 }), ch("At the end of the pier", { level: 2 }),
    ch("# The Cassette"), ch("The repair shop", { level: 2 }),
    part("II. Open Water"), ch("# The Storm"), ch("# The Return"),
  ];
  return { items, active: open.id, title: "Salt and Sea", author: "Author Name", lang: undefined as string | undefined };
};
const ar = () => {
  const open = ch("# الفصل الأول\n\nفي صباحٍ باكر، وصلت نهى إلى الميناء قبل أن ينقشع الضباب. كانت حقيبتها صغيرة، لا يحمل داخلها سوى دفترٍ وقلمٍ وشريطٍ قديمٍ يحفظ صوت أمها.\n\n> «البحر لغة من لا يُجيدون الكلام»، كان أبوها يقول.\n\nلم تفهم نهى ذلك يومًا، حتى **تلك الليلة**، عند طرف الرصيف، حين فتحت رائحة الملح أبواب طفولتها كلها دفعةً واحدة.");
  const items: Item[] = [part("القسم الأول"), open, ch("# الشريط"), ch("# العودة")];
  return { items, active: open.id, title: "الملح والبحر", author: "اسم الكاتب", lang: "ar" };
};

const seed = () => {
  const s = useStore.getState();
  const d = q.get("book") === "ar" ? ar() : q.get("book") === "en" ? en() : tr();
  const id = uid();
  useStore.setState({ ready: true });
  s.patch(() => ({
    books: [{ id, title: d.title, author: d.author, created: Date.now(), items: d.items, activeId: d.active, genre: "roman" as const, ...(d.lang ? { lang: d.lang as "ar" } : {}) }],
    activeBookId: q.get("library") ? null : id,
    daily: { date: new Date().toISOString().slice(0, 10), words: 312 },
  }));
  s.setSettings({ theme: (q.get("theme") ?? "light") as "light", lang: (q.get("lang") ?? "tr") as "tr", focus: q.get("focus") === "1", dailyGoal: 500 });
};
// IndexedDB can stall in headless Chrome, so seed immediately; in a real browser, seed once more when init finishes.
seed();
window.setTimeout(seed, 2500);
const click = q.get("click");
if (click) window.setTimeout(() => [...document.querySelectorAll<HTMLElement>("button")].find((b) => (b.textContent ?? "").includes(click) || b.title === click)?.click(), 3500);
