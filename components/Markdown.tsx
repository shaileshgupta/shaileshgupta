import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type HastNode = { type: string; tagName?: string; value?: string; children?: HastNode[] };

const textOf = (n?: HastNode): string =>
  !n ? "" : n.type === "text" ? (n.value ?? "") : (n.children ?? []).map(textOf).join("");

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
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={inline ? inlineComponents : blockComponents}>
      {children}
    </ReactMarkdown>
  );
}
