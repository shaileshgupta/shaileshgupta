import Link from "next/link";
import type { ReactNode } from "react";
import { RememberRead } from "@/components/LastRead";
import { Markdown } from "@/components/Markdown";
import { neighbours, type Stop } from "@/lib/book";

interface PageProps {
  href: string;
  eyebrow?: string | null;
  title: string;
  /** Title remembered for "Continue reading". */
  fullTitle: string;
  dek?: string;
  meta?: string;
  variant?: "part" | "annex" | "default";
  body?: string;
  children?: ReactNode;
}

/** One reading page: heading block, Markdown body, extras, previous / next. */
export function ReadingPage({ href, eyebrow, title, fullTitle, dek, meta, variant = "default", body, children }: PageProps) {
  const { prev, next } = neighbours(href);
  return (
    <article className={`reading reading-${variant}`}>
      <header className="reading-head">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {dek ? (
          <p className="dek">
            <Markdown inline>{dek}</Markdown>
          </p>
        ) : null}
        {meta ? <p className="reading-meta">{meta}</p> : null}
      </header>
      {body ? (
        <div className="prose">
          <Markdown>{body}</Markdown>
        </div>
      ) : null}
      {children}
      <PrevNext prev={prev} next={next} />
      <RememberRead href={href} title={fullTitle} />
    </article>
  );
}

function PrevNext({ prev, next }: { prev?: Stop; next?: Stop }) {
  if (!prev && !next) return null;
  return (
    <nav className="prev-next" aria-label="Previous and next">
      {prev ? (
        <Link href={prev.href} className="pn pn-prev" rel="prev">
          <span className="pn-dir">Previous</span>
          <span className="pn-title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="pn pn-next" rel="next">
          <span className="pn-dir">Next</span>
          <span className="pn-title">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
