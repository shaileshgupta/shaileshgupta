#!/usr/bin/env node
/**
 * Imports "The Third Freedom" from the book's published HTML (the claude.ai
 * artifact) into Markdown sections plus a manifest the site reads at build time.
 *
 *   node scripts/import-book.mjs <path-to-artifact.html>
 *
 * Output (overwritten on every run):
 *   content/the-third-freedom/book.json        manifest: titles, parts, order
 *   content/the-third-freedom/sections/*.md    one file per reading page
 *   content/the-third-freedom/annex/*.md       one file per annex page
 *   content/the-third-freedom/cover.png        front cover
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const BOOK_SLUG = "the-third-freedom";
const BASE = `/${BOOK_SLUG}`;
const OUT = path.resolve("content", BOOK_SLUG);

// Back-cover copy, kept as text so it stays crisp and searchable. The printed
// back cover still says "31 reforms" from an earlier draft; the book has 28.
const BLURB = {
  headline:
    "1947 freed India from foreign rule. 1991 freed it from the licence raj. The third freedom frees every Indian to build.",
  body: "India has the largest, youngest workforce on earth, and a window that will not stay open for ever. This book is a complete playbook to turn that demographic dividend into a developed nation within one generation, not fifty years: 28 reforms, each with its cost, its legal route, its guardrails and real proof that it already works somewhere in India or abroad.",
  points: [
    "Three simple taxes and no income tax",
    "A fully digital, cashless economy",
    "No licence raj: register and start the same day",
    "Courts with hard deadlines, and a clean, well-paid police",
    "A lean, contract-based state that pays only for results",
    "Every action in the first 30 days or within 1 year",
  ],
  quote:
    "It is not a question of whether it can be done. It is a question of political will, within one tenure.",
};

const src = process.argv[2];
if (!src) {
  process.stderr.write("usage: node scripts/import-book.mjs <artifact.html>\n");
  process.exit(1);
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const text = (el) => el.textContent.replace(/\s+/g, " ").trim();
const wordCount = (md) =>
  md
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>|`-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

/**
 * A few list items in the source were written as raw text inside a paragraph
 * ("- <strong>Fines…" or "2B. <strong>Fixed pay…" on their own line). Browsers
 * collapse those into one run-on paragraph; put them back on their own lines.
 */
function repairRawLists(html) {
  const lines = html.split("\n");
  const out = [];
  let inDashRun = false;
  for (const line of lines) {
    if (/^- <strong>/.test(line)) {
      if (!inDashRun) {
        out[out.length - 1] += "</p><ul>";
        inDashRun = true;
      }
      out.push(`<li>${line.slice(2)}</li>`);
      continue;
    }
    if (inDashRun) {
      out.push("</ul>");
      inDashRun = false;
    }
    if (/^\d+[A-Z]?\. <strong>/.test(line)) {
      out.push(`<br>${line}`);
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

let html = readFileSync(src, "utf8");
html = repairRawLists(html);
const root = parse(html, { comment: false });
const main = root.querySelector("main");
if (!main) throw new Error("No <main> in source HTML");
const nodes = main.childNodes.filter((n) => n.nodeType === 1);

// ---------- pass 1: chapter slugs, for rewriting #ch-N links ----------
const chapterSlug = {};
for (const h of main.querySelectorAll("h2")) {
  const m = /^ch-(\d+)$/.exec(h.getAttribute("id") ?? "");
  if (m) chapterSlug[m[1]] = slugify(text(h).replace(/^Chapter \d+:\s*/, ""));
}

const td = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
  codeBlockStyle: "fenced",
});
td.use(gfm);
td.addRule("internalLinks", {
  filter: (node) => node.nodeName === "A" && /^#ch-\d+$/.test(node.getAttribute("href") ?? ""),
  replacement: (content, node) => {
    const n = node.getAttribute("href").slice(4);
    const slug = chapterSlug[n];
    if (!slug) throw new Error(`Unknown chapter link #ch-${n}`);
    return `[${content}](${BASE}/${slug})`;
  },
});
td.addRule("externalLinks", {
  filter: (node) => node.nodeName === "A" && /^https?:/.test(node.getAttribute("href") ?? ""),
  replacement: (content, node) => `[${content}](${node.getAttribute("href")})`,
});
// Section bodies start at h2 (the page title is the h1), so shift headings up.
td.addRule("headings", {
  filter: ["h3", "h4", "h5"],
  replacement: (content, node) => {
    const level = { H3: 2, H4: 3, H5: 4 }[node.nodeName];
    return `\n\n${"#".repeat(level)} ${content.trim()}\n\n`;
  },
});
// Table wrappers carry no meaning in Markdown.
td.addRule("tableWrap", {
  filter: (node) => node.nodeName === "DIV" && node.getAttribute("class") === "tw",
  replacement: (content) => `\n\n${content.trim()}\n\n`,
});

const toMd = (htmlChunk) =>
  td
    .turndown(htmlChunk)
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";

const isDek = (el) =>
  el.tagName === "P" &&
  el.childNodes.filter((c) => c.nodeType === 1 || c.textContent.trim()).length === 1 &&
  el.firstElementChild?.tagName === "EM";

// ---------- pass 2: walk the book ----------
const book = {
  slug: BOOK_SLUG,
  title: "",
  eyebrow: "",
  subtitle: "",
  author: "",
  coverAlt: "",
  blurb: BLURB,
  parts: [],
  sections: [],
  annex: { label: "", title: "", dek: "", sections: [] },
};

let cur = null; // { meta, chunks[], target: 'sections' | 'annex' | 'annexIndex' }
let partId = null;
let coverDone = false;
const finished = [];

function start(meta, target) {
  if (cur) finished.push(cur);
  cur = { meta, chunks: [], target };
}

for (const el of nodes) {
  const tag = el.tagName;
  const id = el.getAttribute("id") ?? "";
  const cls = el.getAttribute("class") ?? "";

  if (tag === "FIGURE" && cls.includes("cover")) {
    if (coverDone) continue; // back cover: kept as text in BLURB
    const img = el.querySelector("img");
    const m = /^data:image\/png;base64,(.+)$/.exec(img.getAttribute("src"));
    mkdirSync(OUT, { recursive: true });
    writeFileSync(path.join(OUT, "cover.png"), Buffer.from(m[1], "base64"));
    book.coverAlt = img.getAttribute("alt") ?? "";
    coverDone = true;
    continue;
  }

  if (tag === "SECTION" && cls.includes("titlepage")) {
    book.eyebrow = text(el.querySelector(".eyebrow"));
    book.title = text(el.querySelector("h1"));
    book.subtitle = text(el.querySelector(".tag"));
    book.author = text(el.querySelector(".by"));
    continue;
  }

  if (tag === "H1" && cls.includes("part")) {
    const label = el.querySelector("small") ? text(el.querySelector("small")) : "";
    const title = text(el.querySelector("span"));
    if (id.startsWith("part-")) {
      partId = id;
      const slug = slugify(title);
      book.parts.push({ id, label, title, slug });
      start({ slug, kind: "part", label, title, part: id, dek: "" }, "sections");
    } else if (id === "afterword") {
      partId = id;
      book.parts.push({ id, label: "", title, slug: null });
      if (cur) finished.push(cur);
      cur = null;
    } else if (id === "annex") {
      partId = null;
      book.annex.label = label;
      book.annex.title = title;
      start({ kind: "annexIndex" }, "annexIndex");
    } else {
      throw new Error(`Unexpected part heading #${id}`);
    }
    continue;
  }

  if (tag === "H2" && id) {
    const raw = text(el);
    let meta;
    if (id === "intro") meta = { slug: "introduction", kind: "front", title: raw };
    else if (id === "summary") meta = { slug: "executive-summary", kind: "front", title: raw };
    else if (id === "principles") meta = { slug: slugify(raw), kind: "front", title: raw };
    else if (/^ch-\d+$/.test(id)) {
      const number = Number(id.slice(3));
      const title = raw.replace(/^Chapter \d+:\s*/, "");
      meta = {
        slug: chapterSlug[number],
        kind: "chapter",
        number,
        label: `Chapter ${number}`,
        title,
        part: partId,
        annex: chapterSlug[number],
      };
    } else if (id === "conclusion" || id === "takeaway")
      meta = { slug: slugify(raw), kind: "afterword", title: raw, part: partId };
    else if (id === "annex-rules" || id === "annex-map") {
      const title = raw.replace(/^Annex:\s*/, "");
      meta = { slug: slugify(title), kind: "annex", label: "Annex", title, chapter: null };
      start(meta, "annex");
      continue;
    } else if (/^annex-\d+$/.test(id)) {
      const number = Number(id.slice(6));
      meta = {
        slug: chapterSlug[number],
        kind: "annex",
        label: `Annex to Chapter ${number}`,
        title: raw.replace(/^Annex to Chapter \d+:\s*/, ""),
        chapter: chapterSlug[number],
        number,
      };
      start(meta, "annex");
      continue;
    } else throw new Error(`Unexpected section heading #${id}`);
    start(meta, "sections");
    continue;
  }

  if (!cur) throw new Error(`Content outside a section: <${tag.toLowerCase()}> ${text(el).slice(0, 60)}`);
  if (cur.chunks.length === 0 && !("dek" in cur.meta && cur.meta.dek) && isDek(el)) {
    cur.meta.dek = toMd(el.firstElementChild.innerHTML).trim();
    continue;
  }
  cur.chunks.push(el.outerHTML);
}
if (cur) finished.push(cur);

// ---------- write ----------
rmSync(path.join(OUT, "sections"), { recursive: true, force: true });
rmSync(path.join(OUT, "annex"), { recursive: true, force: true });
mkdirSync(path.join(OUT, "sections"), { recursive: true });
mkdirSync(path.join(OUT, "annex"), { recursive: true });

const seen = new Set();
for (const s of finished) {
  const md = s.chunks.length ? toMd(s.chunks.join("\n")) : "";
  if (s.target === "annexIndex") {
    book.annex.dek = s.meta.dek ?? "";
    if (md.trim()) throw new Error("Annex index has body text; extend the importer");
    continue;
  }
  const key = `${s.target}/${s.meta.slug}`;
  if (seen.has(key)) throw new Error(`Duplicate slug ${key}`);
  seen.add(key);
  const meta = { ...s.meta, words: wordCount(md) };
  const dir = s.target === "annex" ? "annex" : "sections";
  writeFileSync(path.join(OUT, dir, `${meta.slug}.md`), md);
  (s.target === "annex" ? book.annex.sections : book.sections).push(meta);
}

writeFileSync(path.join(OUT, "book.json"), JSON.stringify(book, null, 2) + "\n");

const words =
  book.sections.reduce((a, s) => a + s.words, 0) + book.annex.sections.reduce((a, s) => a + s.words, 0);
process.stdout.write(
  `Imported "${book.title}": ${book.sections.length} reading pages, ${book.annex.sections.length} annex pages, ${book.parts.length} parts, ${words.toLocaleString()} words\n`,
);
