import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/Reading";
import {
  book,
  describe,
  editHref,
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
  return book.annex.sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = getAnnex(slug);
  if (!s) return {};
  const title = `${s.label}: ${s.title} · ${book.title}`;
  const description = describe(firstParagraph(readBody(s)) || s.dek || "");
  const url = sectionHref(s);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description, images: OG_IMAGES },
  };
}

export default async function AnnexPage({ params }: Params) {
  const { slug } = await params;
  const s = getAnnex(slug);
  if (!s) notFound();
  const chapter = s.chapter ? getSection(s.chapter) : undefined;

  return (
    <ReadingPage
      href={sectionHref(s)}
      eyebrow={eyebrowFor(s)}
      title={s.title}
      fullTitle={`${s.label}: ${s.title}`}
      dek={s.dek}
      meta={`${minutes(s.words)} min read`}
      variant="annex"
      body={readBody(s)}
      editHref={editHref(s)}
    >
      {chapter ? (
        <aside className="annex-cta" aria-label="Chapter">
          <p className="section-label">Back to the chapter</p>
          <Link href={sectionHref(chapter)} prefetch={false}>
            {fullTitle(chapter)}
          </Link>
        </aside>
      ) : null}
    </ReadingPage>
  );
}
