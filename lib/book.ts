import { readFileSync } from "node:fs";
import path from "node:path";
import data from "@/content/the-third-freedom/book.json";
import { REPO_BRANCH, REPO_URL, SITE_URL } from "@/lib/site";

export { SITE_URL };

export type SectionKind = "front" | "part" | "chapter" | "afterword" | "annex";

export interface Section {
  slug: string;
  kind: SectionKind;
  title: string;
  label?: string;
  dek?: string;
  number?: number;
  part?: string | null;
  annex?: string;
  chapter?: string | null;
  words: number;
}

export interface Part {
  id: string;
  label: string;
  title: string;
  slug: string | null;
}

export interface Book {
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  author: string;
  coverAlt: string;
  blurb: { headline: string; body: string; points: string[]; quote: string };
  parts: Part[];
  sections: Section[];
  annex: { label: string; title: string; dek: string; sections: Section[] };
}

export const book = data as Book;
export const BOOK_PATH = `/${book.slug}`;
export const ANNEX_PATH = `${BOOK_PATH}/annex`;
/** Share image from app/opengraph-image.tsx; pages that set openGraph must list it again. */
export const OG_IMAGES = [{ url: "/opengraph-image", width: 1200, height: 630, alt: "The Third Freedom by Shailesh Gupta" }];
const WORDS_PER_MINUTE = 230;

export function sectionHref(s: Section): string {
  return s.kind === "annex" ? `${ANNEX_PATH}/${s.slug}` : `${BOOK_PATH}/${s.slug}`;
}

export const getSection = (slug: string) => book.sections.find((s) => s.slug === slug);
export const getAnnex = (slug: string) => book.annex.sections.find((s) => s.slug === slug);
export const getPart = (id?: string | null) => book.parts.find((p) => p.id === id);
export const chaptersInPart = (partId: string) =>
  book.sections.filter((s) => s.kind === "chapter" && s.part === partId);
export const chapters = book.sections.filter((s) => s.kind === "chapter");

/** Repo-relative path of a page's Markdown file. */
export function sourcePath(s: Section): string {
  return `content/${book.slug}/${s.kind === "annex" ? "annex" : "sections"}/${s.slug}.md`;
}

export function readBody(s: Section): string {
  return readFileSync(path.join(process.cwd(), sourcePath(s)), "utf8");
}

/** Opens the page's file in GitHub's editor; GitHub forks for non-members and proposes a pull request. */
export const editHref = (s: Section) => `${REPO_URL}/edit/${REPO_BRANCH}/${sourcePath(s)}`;

export const minutes = (words: number) => Math.max(1, Math.round(words / WORDS_PER_MINUTE));

export function formatDuration(words: number): string {
  const m = minutes(words);
  if (m < 60) return `${m} min`;
  const h = Math.round(m / 30) / 2;
  return `${h % 1 ? h.toFixed(1) : h} hours`;
}

export const mainWords = book.sections.reduce((a, s) => a + s.words, 0);
export const annexWords = book.annex.sections.reduce((a, s) => a + s.words, 0);
export const realParts = book.parts.filter((p) => p.id.startsWith("part-"));

/** "Chapter 1: Tax: Keep What You Earn", "Part I: Unleash Enterprise", "Conclusion" */
export function fullTitle(s: Section): string {
  return s.label ? `${s.label}: ${s.title}` : s.title;
}

/** Small line above a page title. */
export function eyebrowFor(s: Section): string | null {
  if (s.kind === "chapter") return `${getPart(s.part)?.label ?? ""} · ${s.label}`;
  if (s.kind === "part") return s.label ?? null;
  if (s.kind === "afterword") return getPart(s.part)?.title ?? "Afterword";
  if (s.kind === "annex") return `${book.annex.title} · ${s.label}`;
  return null;
}

/** Markdown → plain text, for meta descriptions and JSON-LD. */
export function plain(md = ""): string {
  return md
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\\(.)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function describe(text: string, max = 158): string {
  const t = plain(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export const firstParagraph = (md: string) =>
  md
    .split(/\n{2,}/)
    .find((b) => b.trim() && !/^(#|\||-|\d+\.)/.test(b.trim())) ?? "";

// ---------- reading order ----------

export interface Stop {
  href: string;
  title: string;
  label?: string;
}

const stop = (s: Section): Stop => ({ href: sectionHref(s), title: s.title, label: s.label });

export const readingOrder: Stop[] = [
  ...book.sections.map(stop),
  { href: ANNEX_PATH, title: book.annex.title, label: book.annex.label },
  ...book.annex.sections.map(stop),
];

export function neighbours(href: string): { prev?: Stop; next?: Stop } {
  const i = readingOrder.findIndex((s) => s.href === href);
  if (i < 0) return {};
  return { prev: readingOrder[i - 1], next: readingOrder[i + 1] };
}

// ---------- contents (serialisable, for the client nav) ----------

export interface TocItem {
  href: string;
  title: string;
  number?: string;
}

export interface TocGroup {
  title: string | null;
  href?: string;
  label?: string;
  collapsible?: boolean;
  items: TocItem[];
}

export function tableOfContents(): TocGroup[] {
  const front: TocGroup = {
    title: null,
    items: book.sections.filter((s) => s.kind === "front").map((s) => ({ href: sectionHref(s), title: s.title })),
  };
  const parts: TocGroup[] = book.parts.map((p) => {
    const part = book.sections.find((s) => s.kind === "part" && s.part === p.id);
    const items = book.sections
      .filter((s) => (s.kind === "chapter" || s.kind === "afterword") && s.part === p.id)
      .map((s) => ({
        href: sectionHref(s),
        title: s.title,
        number: s.kind === "chapter" ? String(s.number) : undefined,
      }));
    return { title: p.title, label: p.label || undefined, href: part ? sectionHref(part) : undefined, items };
  });
  const annex: TocGroup = {
    title: book.annex.title,
    label: book.annex.label,
    href: ANNEX_PATH,
    collapsible: true,
    items: book.annex.sections.map((s) => ({
      href: sectionHref(s),
      title: s.title,
      number: s.number ? String(s.number) : undefined,
    })),
  };
  return [front, ...parts, annex];
}

/** href → short title shown in the phone top bar. */
export function shortTitles(): Record<string, string> {
  const map: Record<string, string> = { [BOOK_PATH]: book.title, [ANNEX_PATH]: book.annex.title };
  for (const s of book.sections) map[sectionHref(s)] = s.kind === "chapter" ? `${s.number}. ${s.title}` : s.title;
  for (const s of book.annex.sections)
    map[sectionHref(s)] = s.number ? `Annex ${s.number}. ${s.title}` : `Annex: ${s.title}`;
  return map;
}
