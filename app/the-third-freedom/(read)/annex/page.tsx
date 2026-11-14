import type { Metadata } from "next";
import Link from "next/link";
import { ReadingPage } from "@/components/Reading";
import { ANNEX_PATH, annexWords, book, describe, formatDuration, minutes, sectionHref, OG_IMAGES } from "@/lib/book";

const title = `${book.annex.title} · ${book.title}`;
const description = describe(book.annex.dek);

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: ANNEX_PATH },
  openGraph: { type: "article", url: ANNEX_PATH, title, description, images: OG_IMAGES },
};

export default function AnnexIndex() {
  return (
    <ReadingPage
      href={ANNEX_PATH}
      eyebrow={book.annex.label}
      title={book.annex.title}
      fullTitle={book.annex.title}
      dek={book.annex.dek}
      meta={`${book.annex.sections.length} sections · about ${formatDuration(annexWords)}`}
      variant="part"
    >
      <section className="in-part" aria-label="Annex sections">
        <ol>
          {book.annex.sections.map((s) => (
            <li key={s.slug}>
              <Link href={sectionHref(s)} prefetch={false}>
                <span className="in-part-label">{s.label}</span>
                <span className="in-part-title">{s.title}</span>
                <span className="in-part-dek">{minutes(s.words)} min</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </ReadingPage>
  );
}
