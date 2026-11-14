import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { ReadingPage } from "@/components/Reading";
import { JsonLd } from "@/components/Site";
import {
  BOOK_PATH,
  SITE_URL,
  book,
  chaptersInPart,
  describe,
  eyebrowFor,
  firstParagraph,
  fullTitle,
  getAnnex,
  getSection,
  minutes,
  readBody,
  sectionHref,
  OG_IMAGES,
} from "@/lib/book";

type Params = { params: Promise<{ slug: string }> };

// Every valid slug is prerendered by generateStaticParams, so the page awaits
// params directly: the static HTML then carries the text itself rather than a
// placeholder swapped in by script. Unknown slugs render the 404 page.
export const instant = false;

export function generateStaticParams() {
  return book.sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = getSection(slug);
  if (!s) return {};
  const title = `${fullTitle(s)} · ${book.title}`;
  const description = describe(s.dek || firstParagraph(readBody(s)));
  const url = sectionHref(s);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description, images: OG_IMAGES },
  };
}

export default async function SectionPage({ params }: Params) {
  const { slug } = await params;
  const s = getSection(slug);
  if (!s) notFound();

  const href = sectionHref(s);
  const annex = s.annex ? getAnnex(s.annex) : undefined;
  const inPart = s.kind === "part" && s.part ? chaptersInPart(s.part) : [];

  return (
    <>
      <ReadingPage
        href={href}
        eyebrow={eyebrowFor(s)}
        title={s.title}
        fullTitle={fullTitle(s)}
        dek={s.kind === "part" ? undefined : s.dek}
        meta={s.kind === "part" ? undefined : `${minutes(s.words)} min read`}
        variant={s.kind === "part" ? "part" : "default"}
        body={readBody(s)}
      >
        {inPart.length ? (
          <section className="in-part" aria-label="In this part">
            <h2 className="section-label">
              In this part
            </h2>
            <ol>
              {inPart.map((c) => (
                <li key={c.slug}>
                  <Link href={sectionHref(c)} prefetch={false}>
                    <span className="in-part-label">{c.label}</span>
                    <span className="in-part-title">{c.title}</span>
                    {c.dek ? (
                      <span className="in-part-dek">
                        <Markdown inline>{c.dek}</Markdown>
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
        {annex ? (
          <aside className="annex-cta" aria-label="Implementation annex">
            <p className="section-label">{book.annex.label}</p>
            <Link href={sectionHref(annex)} prefetch={false}>
              Read the annex to {s.label}
            </Link>
            <p>The detailed starting draft behind this chapter&nbsp;·&nbsp;{minutes(annex.words)}&nbsp;min</p>
          </aside>
        ) : null}
      </ReadingPage>
      {s.kind === "chapter" ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Chapter",
            name: s.title,
            position: s.number,
            url: `${SITE_URL}${href}`,
            author: { "@type": "Person", name: book.author, url: SITE_URL },
            isPartOf: { "@type": "Book", name: book.title, url: `${SITE_URL}${BOOK_PATH}` },
          }}
        />
      ) : null}
    </>
  );
}
