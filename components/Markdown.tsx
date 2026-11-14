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

/**
 * Copies each column heading onto its body cells as data-label, so that on
 * phones a wide table can be laid out as stacked cards, each value labelled.
 */
function rehypeTableLabels() {
  const label = (table: HastNode) => {
    const head = elements(elements(table, "thead")[0], "tr")[0];
    const headings = (head?.children ?? [])
      .filter((c) => c.type === "element" && (c.tagName === "th" || c.tagName === "td"))
      .map((c) => textOf(c).trim());
    for (const row of elements(elements(table, "tbody")[0], "tr")) {
      let i = 0;
      for (const cell of row.children ?? []) {
        if (cell.type !== "element" || (cell.tagName !== "td" && cell.tagName !== "th")) continue;
        cell.properties = { ...cell.properties, dataLabel: headings[i] ?? "" };
        i++;
      }
    }
  };
  const walk = (n: HastNode) => {
    if (n.type === "element" && n.tagName === "table") label(n);
    n.children?.forEach(walk);
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
  table: ({ children }) => (
    <div className="table-wrap" role="region" aria-label="Table" tabIndex={0}>
      <table>{children}</table>
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
      rehypePlugins={[rehypeTableLabels]}
      components={inline ? inlineComponents : blockComponents}
    >
      {children}
    </ReactMarkdown>
  );
}
