// Örnek şablonlar: yeni kitap için kategoriye göre hazır iskelet (kısım/bölüm/sahne başlıkları).
// Şablonlar metne öğüt yazmaz; yalnızca yapıyı kurar. Yazar başlıkları değiştirir, siler, çoğaltır.
import type { Genre } from "./store";

type Spec = { k: "part" | "chapter" | "scene"; t: [string, string] };
export interface Template {
  id: string;
  group: "kurgu" | "siir" | "dusunce" | "akademik" | "diger";
  genre: Genre;
  name: [string, string];
  desc: [string, string];
  items: Spec[];
}

const P = (tr: string, en: string): Spec => ({ k: "part", t: [tr, en] });
const C = (tr: string, en: string): Spec => ({ k: "chapter", t: [tr, en] });
const S = (): Spec => ({ k: "scene", t: ["", ""] });

export const templateGroups: Record<Template["group"], [string, string]> = {
  kurgu: ["Kurgu", "Fiction"],
  siir: ["Şiir", "Poetry"],
  dusunce: ["Deneme ve kurgu dışı", "Essay and non-fiction"],
  akademik: ["Akademik", "Academic"],
  diger: ["Diğer", "Other"],
};

export const templates: Template[] = [
  { id: "bos", group: "diger", genre: "roman", name: ["Boş kitap", "Blank book"], desc: ["Tek bir boş bölümle başla.", "Start with one empty chapter."], items: [C("Birinci bölüm", "Chapter one")] },

  {
    id: "roman-uc-perde", group: "kurgu", genre: "roman", name: ["Roman — üç perde", "Novel — three acts"],
    desc: ["Kurulum, çatışma, çözüm. Üç kısım, sekiz bölüm, sahneler.", "Setup, confrontation, resolution. Three parts, eight chapters, scenes."],
    items: [
      P("I. Kurulum", "I. Setup"), C("Olağan dünya", "The ordinary world"), S(), S(), C("Tetikleyici olay", "Inciting incident"), S(),
      P("II. Çatışma", "II. Confrontation"), C("Artan engeller", "Rising obstacles"), S(), S(), C("Orta nokta", "Midpoint"), S(), C("Kriz", "Crisis"), S(),
      P("III. Çözüm", "III. Resolution"), C("Doruk", "Climax"), S(), S(), C("Sonuç", "Resolution"), S(),
    ],
  },
  {
    id: "roman-kahraman", group: "kurgu", genre: "roman", name: ["Roman — kahramanın yolculuğu", "Novel — hero's journey"],
    desc: ["Campbell ve Vogler'in on iki aşaması: Ayrılış, Erginlenme, Dönüş.", "Campbell and Vogler's twelve stages: Departure, Initiation, Return."],
    items: [
      P("Ayrılış", "Departure"), C("Olağan dünya", "Ordinary world"), C("Maceraya çağrı", "Call to adventure"), C("Çağrıyı reddetme", "Refusal of the call"), C("Akıl hocasıyla karşılaşma", "Meeting the mentor"), C("Eşiği geçmek", "Crossing the threshold"),
      P("Erginlenme", "Initiation"), C("Sınavlar, müttefikler, düşmanlar", "Tests, allies, enemies"), C("Mağaranın en derinine yaklaşma", "Approach to the inmost cave"), C("Büyük sınav", "The ordeal"), C("Ödül", "Reward"),
      P("Dönüş", "Return"), C("Dönüş yolu", "The road back"), C("Diriliş", "Resurrection"), C("İksirle dönüş", "Return with the elixir"),
    ],
  },
  {
    id: "novella", group: "kurgu", genre: "novella", name: ["Novella", "Novella"],
    desc: ["Kısa ve yoğun anlatı: altı bölüm, her birinde bir sahne.", "Short, dense narrative: six chapters with one scene each."],
    items: [C("Açılış", "Opening"), S(), C("Yükseliş", "Rising"), S(), C("Dönüm noktası", "Turning point"), S(), C("Çatışma", "Conflict"), S(), C("Doruk", "Climax"), S(), C("Kapanış", "Closing"), S()],
  },
  {
    id: "hikaye", group: "kurgu", genre: "hikaye", name: ["Hikâye (öykü)", "Short story"],
    desc: ["Tek bölüm, üç sahne: açılış, gelişme, son.", "One chapter, three scenes: opening, development, ending."],
    items: [C("Başlık", "Title"), S(), S(), S()],
  },
  { id: "kucurek", group: "kurgu", genre: "hikaye", name: ["Küçürek öykü", "Flash fiction"], desc: ["Tek sayfalık boş bir metin.", "A single empty page."], items: [C("Başlık", "Title")] },

  {
    id: "siir", group: "siir", genre: "diger", name: ["Şiir kitabı", "Poetry collection"],
    desc: ["Üç kısım, her birinde üç şiir.", "Three parts, three poems each."],
    items: [P("I", "I"), C("Şiir", "Poem"), C("Şiir", "Poem"), C("Şiir", "Poem"), P("II", "II"), C("Şiir", "Poem"), C("Şiir", "Poem"), C("Şiir", "Poem"), P("III", "III"), C("Şiir", "Poem"), C("Şiir", "Poem"), C("Şiir", "Poem")],
  },

  {
    id: "deneme", group: "dusunce", genre: "diger", name: ["Edebi deneme", "Literary essay"],
    desc: ["Tek deneme: açılış, düşünce, karşı görüş, kapanış.", "A single essay: opening, thought, counterargument, closing."],
    items: [C("Açılış", "Opening"), C("Düşünce", "Thought"), C("Karşı görüş", "Counterargument"), C("Kapanış", "Closing")],
  },
  { id: "blog", group: "dusunce", genre: "diger", name: ["Blog yazısı", "Blog post"], desc: ["Tek sayfalık, doğrudan yayınlanabilir yazı.", "A single page you can publish right away."], items: [C("Başlık", "Title")] },
  {
    id: "deneme-kitabi", group: "dusunce", genre: "diger", name: ["Deneme kitabı", "Essay collection"],
    desc: ["Önsöz ve altı deneme.", "A preface and six essays."],
    items: [C("Önsöz", "Preface"), C("Birinci deneme", "First essay"), C("İkinci deneme", "Second essay"), C("Üçüncü deneme", "Third essay"), C("Dördüncü deneme", "Fourth essay"), C("Beşinci deneme", "Fifth essay"), C("Altıncı deneme", "Sixth essay")],
  },
  {
    id: "ani", group: "dusunce", genre: "diger", name: ["Anı / biyografi", "Memoir / biography"],
    desc: ["Yaşam dönemlerine göre: çocukluk, gençlik, dönüm noktaları, bugün.", "By life period: childhood, youth, turning points, today."],
    items: [C("Önsöz", "Preface"), P("Çocukluk", "Childhood"), C("İlk anılar", "First memories"), P("Gençlik", "Youth"), C("Yollar", "Roads"), P("Dönüm noktaları", "Turning points"), C("Karar anı", "The decision"), P("Bugün", "Today"), C("Geriye bakınca", "Looking back")],
  },
  {
    id: "rehber", group: "dusunce", genre: "diger", name: ["Kurgu dışı rehber", "Non-fiction guide"],
    desc: ["Giriş, sorun, yöntem, uygulama, sonuç.", "Introduction, problem, method, practice, conclusion."],
    items: [C("Giriş", "Introduction"), C("Sorun", "The problem"), C("Yöntem", "The method"), C("Uygulama", "In practice"), C("Sonuç", "Conclusion")],
  },

  {
    id: "makale", group: "akademik", genre: "diger", name: ["Akademik makale", "Academic article"],
    desc: ["Özet, giriş, kuramsal çerçeve, yöntem, bulgular, tartışma, sonuç, kaynakça.", "Abstract, introduction, framework, method, findings, discussion, conclusion, references."],
    items: [C("Özet", "Abstract"), C("Giriş", "Introduction"), C("Kuramsal çerçeve", "Theoretical framework"), C("Yöntem", "Method"), C("Bulgular", "Findings"), C("Tartışma", "Discussion"), C("Sonuç", "Conclusion"), C("Kaynakça", "References")],
  },
  {
    id: "tez", group: "akademik", genre: "diger", name: ["Akademik kitap / tez", "Academic book / thesis"],
    desc: ["Önsöz, giriş, dört ana bölüm, sonuç, kaynakça, ekler.", "Preface, introduction, four main chapters, conclusion, references, appendices."],
    items: [C("Önsöz", "Preface"), C("Giriş", "Introduction"), C("Birinci bölüm", "Chapter one"), C("İkinci bölüm", "Chapter two"), C("Üçüncü bölüm", "Chapter three"), C("Dördüncü bölüm", "Chapter four"), C("Sonuç", "Conclusion"), C("Kaynakça", "References"), C("Ekler", "Appendices")],
  },

  {
    id: "cocuk", group: "diger", genre: "diger", name: ["Çocuk resimli kitabı", "Children's picture book"],
    desc: ["On iki sayfa (açılım).", "Twelve spreads."],
    items: Array.from({ length: 12 }, (_, i) => C(`Sayfa ${i + 1}`, `Page ${i + 1}`)),
  },
  {
    id: "oyun", group: "diger", genre: "diger", name: ["Oyun / senaryo", "Play / screenplay"],
    desc: ["Üç perde, her birinde üç sahne.", "Three acts, three scenes each."],
    items: [P("I. Perde", "Act I"), C("Sahne 1", "Scene 1"), C("Sahne 2", "Scene 2"), C("Sahne 3", "Scene 3"), P("II. Perde", "Act II"), C("Sahne 4", "Scene 4"), C("Sahne 5", "Scene 5"), C("Sahne 6", "Scene 6"), P("III. Perde", "Act III"), C("Sahne 7", "Scene 7"), C("Sahne 8", "Scene 8"), C("Sahne 9", "Scene 9")],
  },
];

export const templateById = (id: string): Template | undefined => templates.find((t) => t.id === id);
