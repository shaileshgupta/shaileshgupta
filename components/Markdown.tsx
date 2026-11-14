import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const textOf = (n?: HastNode): string =>
  !n ? "" : n.type === "text" ? (n.value ?? "") : (n.children ?? []).map(textOf).join("");

const elements = (n: HastNode | undefined, tag: string) =>
  (n?.children ?? []).filter((c) => c.type === "element" && c.tagName === tag);

const isCell = (c: HastNode) => c.type === "element" && (c.tagName === "td" || c.tagName === "th");

// Column sizing, in px at the table font (0.88rem Archivo). Tables of up to 3
// columns are laid out as tables from 641px, where the table can be as narrow
// as 575px; wider tables only from 901px, where it is 670px. The estimates
// below are measured widths plus a margin, so a word always fits its column.
const CHAR_PX = 8.7;
const HEAD_CHAR_PX = 8.6;
const CELL_PAD_PX = 32;
const FIRST_COL_MIN_PX = 120;

/** Longest run of characters that cannot wrap (a hyphen is a break point). */
const longestWord = (text: string) =>
  Math.max(0, ...text.split(/\s+/).flatMap((w) => w.split(/(?<=-)/)).map((w) => w.length));

/**
 * Shares the width between columns by how much each column has to say,
 * damped so one long cell cannot squeeze the rest, and never narrower than
 * the column's longest word, so words are not split.
 */
function columnWidths(headings: string[], rows: string[][], tableWidth: number): number[] {
  const n = headings.length;
  const weight = headings.map((_, c) => {
    const lens = rows.map((r) => (r[c] ?? "").length);
    const avg = lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length);
    return Math.max(avg, 4) ** 0.6;
  });
  // A first column of short codes ("1", "7, 15, 19", "Bill A") needs no row-name width.
  const firstIsCodes = rows.every((r) => longestWord(r[0] ?? "") <= 4);
  const minShare = headings.map((h, c) => {
    const word = Math.max(longestWord(h) * HEAD_CHAR_PX, ...rows.map((r) => longestWord(r[c] ?? "") * CHAR_PX));
    const px = Math.max(word + CELL_PAD_PX, c === 0 && !firstIsCodes ? FIRST_COL_MIN_PX : 0);
    return px / tableWidth;
  });
  const share = new Array<number>(n).fill(0);
  const fixed = new Set<number>();
  // Give each column its weighted share; pin any that fall below their minimum and re-share the rest.
  for (let pass = 0; pass < n; pass++) {
    const free = 1 - [...fixed].reduce((a, c) => a + minShare[c], 0);
    const freeWeight = weight.reduce((a, w, c) => (fixed.has(c) ? a : a + w), 0);
    let changed = false;
    for (let c = 0; c < n; c++) {
      share[c] = fixed.has(c) ? minShare[c] : (free * weight[c]) / freeWeight;
      if (!fixed.has(c) && share[c] < minShare[c]) {
        fixed.add(c);
        changed = true;
      }
    }
    if (!changed) break;
  }
  // If the minimums alone overfill the table, the first column (the row name)
  // keeps its minimum and the other columns give way in proportion.
  const total = share.reduce((a, b) => a + b, 0);
  if (total > 1) {
    const rest = total - share[0];
    const room = 1 - share[0];
    for (let c = 1; c < n; c++) share[c] = (share[c] / rest) * room;
  }
  const sum = share.reduce((a, b) => a + b, 0);
  return share.map((s) => Math.round((s / sum) * 1000) / 10);
}

/**
 * Prepares every table for reading at any width:
 * - copies each column heading onto its body cells as data-label, so a table
 *   can be laid out as stacked cards with every value labelled;
 * - makes the first cell of each row a row header;
 * - sizes the columns from their content (a <colgroup>);
 * - marks which tables stack as cards: 3 columns on phones, 4 or more up to 900px.
 */
function rehypeTables() {
  const prepare = (table: HastNode) => {
    const head = elements(elements(table, "thead")[0], "tr")[0];
    const headings = (head?.children ?? []).filter(isCell).map((c) => textOf(c).trim());
    const bodyRows = elements(elements(table, "tbody")[0], "tr");
    const rows: string[][] = [];
    for (const row of bodyRows) {
      const cells = (row.children ?? []).filter(isCell);
      rows.push(cells.map((c) => textOf(c).trim()));
      cells.forEach((cell, i) => {
        cell.properties = { ...cell.properties, dataLabel: headings[i] ?? "" };
        if (i === 0) {
          cell.tagName = "th";
          cell.properties = { ...cell.properties, scope: "row" };
        }
      });
    }
    const cols = headings.length;
    if (!cols) return;
    const widths = columnWidths(headings, rows, cols >= 4 ? 670 : 575);
    const colgroup: HastNode = {
      type: "element",
      tagName: "colgroup",
      properties: {},
      children: widths.map((w) => ({ type: "element", tagName: "col", properties: { style: `width:${w}%` }, children: [] })),
    };
    table.children = [colgroup, ...(table.children ?? [])];
    table.properties = {
      ...table.properties,
      dataCols: String(cols),
      dataStack: cols >= 4 ? "tablet" : cols === 3 ? "phone" : undefined,
    };
  };
  const walk = (n: HastNode) => {
    if (n.type === "element" && n.tagName === "table") prepare(n);
    else n.children?.forEach(walk);
  };
  return (tree: HastNode) => walk(tree);
}

/** "**Sources:** …" paragraphs get a quieter, smaller style. */
const isSources = (node?: HastNode) => {
  const first = node?.children?.[0];
  return first?.type === "element" && first.tagName === "strong" && textOf(first).trim() === "Sources:";
};

const blockComponents: Components = {
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href} prefetch={false}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  table: ({ node, children, ...props }) => (
    <div className="table-wrap" role="region" aria-label="Table" tabIndex={0}>
      <table {...props}>{children}</table>
    </div>
  ),
  p: ({ node, children }) =>
    isSources(node as HastNode) ? <p className="sources">{children}</p> : <p>{children}</p>,
};

const inlineComponents: Components = {
  ...blockComponents,
  p: ({ children }) => <>{children}</>,
};

export function Markdown({ children, inline = false }: { children: string; inline?: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeTables]}
      components={inline ? inlineComponents : blockComponents}
    >
      {children}
    </ReactMarkdown>
  );
}
