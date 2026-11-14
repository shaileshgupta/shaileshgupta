import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import cover from "@/content/the-third-freedom/cover.png";
import { StartReading } from "@/components/LastRead";
import { Markdown } from "@/components/Markdown";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/Site";
import {
  ANNEX_PATH,
  BOOK_PATH,
  SITE_URL,
  annexWords,
  book,
  chapters,
  formatDuration,
  mainWords,
  minutes,
  realParts,
  sectionHref,
  type Section,
  OG_IMAGES,
} from "@/lib/book";

const description = `${book.subtitle}. A playbook in ${chapters.length} chapters by ${book.author}, free to read online.`;

export const metadata: Metadata = {
  title: { absolute: `${book.title} · ${book.author}` },
  description,
  alternates: { canonical: BOOK_PATH },
  openGraph: { type: "book", url: BOOK_PATH, title: book.title, description, images: OG_IMAGES },
};

const first = book.sections[0];

function Row({ s }: { s: Section }) {
  return (
    <li>
      <Link href={sectionHref(s)} prefetch={false} className="toc-row">
        {s.number ? <span className="n">{s.number}</span> : <span className="n" aria-hidden="true" />}
        <span className="toc-row-title">{s.title}</span>
        <span className="toc-row-min">{minutes(s.words)} min</span>
      </Link>
    </li>
  );
}

export default function BookPage() {
  const front = book.sections.filter((s) => s.kind === "front");
  const afterword = book.sections.filter((s) => s.kind === "afterword");

  return (
    <>
      <SiteHeader />
      <main className="container book-home">
        <section className="book-hero">
          <div className="book-hero-text">
            <p className="eyebrow">{book.eyebrow}</p>
            <h1>{book.title}</h1>
            <p className="book-sub">{book.subtitle}</p>
            <p className="byline">{book.author}</p>
            <StartReading startHref={sectionHref(first)} startTitle={first.title} />
            <p className="facts">
              {chapters.length} chapters in {realParts.length} parts · about {formatDuration(mainWords)} to read · plus
              an implementation annex
            </p>
          </div>
          <div className="book-hero-cover">
            <Image
              src={cover}
              alt={book.coverAlt}
              sizes="(min-width: 900px) 380px, 64vw"
              preload
              placeholder="blur"
            />
          </div>
        </section>

        <section className="about" aria-labelledby="about">
          <h2 id="about" className="section-label">
            About the book
          </h2>
          <p className="about-headline">{book.blurb.headline}</p>
          <p>{book.blurb.body}</p>
          <ul className="about-points">
            {book.blurb.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <blockquote>{book.blurb.quote}</blockquote>
        </section>

        <section className="book-contents" aria-labelledby="contents">
          <h2 id="contents" className="section-label">
            Contents
          </h2>
          <div className="toc-columns">
          <div className="toc-block">
            <ol className="toc-list">
              {front.map((s) => (
                <Row key={s.slug} s={s} />
              ))}
            </ol>
          </div>
          {realParts.map((p) => {
            const opener = book.sections.find((s) => s.kind === "part" && s.part === p.id);
            const list = book.sections.filter((s) => s.kind === "chapter" && s.part === p.id);
            return (
              <div className="toc-block" key={p.id}>
                <h3>
                  {opener ? (
                    <Link href={sectionHref(opener)} prefetch={false}>
                      <small>{p.label}</small>
                      {p.title}
                    </Link>
                  ) : (
                    p.title
                  )}
                </h3>
                <ol className="toc-list">
                  {list.map((s) => (
                    <Row key={s.slug} s={s} />
                  ))}
                </ol>
              </div>
            );
          })}
          <div className="toc-block">
            <h3>Afterword</h3>
            <ol className="toc-list">
              {afterword.map((s) => (
                <Row key={s.slug} s={s} />
              ))}
            </ol>
          </div>
          <div className="toc-block annex-block">
            <h3>
              <Link href={ANNEX_PATH} prefetch={false}>
                <small>{book.annex.label}</small>
                {book.annex.title}
              </Link>
            </h3>
            <p className="annex-note">
              <Markdown inline>{book.annex.dek}</Markdown> {book.annex.sections.length} sections, about{" "}
              {formatDuration(annexWords)}.
            </p>
          </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: book.title,
          alternativeHeadline: book.subtitle,
          author: { "@type": "Person", name: book.author, url: SITE_URL },
          url: `${SITE_URL}${BOOK_PATH}`,
          image: `${SITE_URL}${cover.src}`,
          inLanguage: "en-IN",
          bookFormat: "https://schema.org/EBook",
          isAccessibleForFree: true,
          hasPart: chapters.map((c) => ({
            "@type": "Chapter",
            position: c.number,
            name: c.title,
            url: `${SITE_URL}${sectionHref(c)}`,
          })),
        }}
      />
    </>
  );
}
