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
  OG_IMAGES,
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
} from "@/lib/book";
import { BOOK_LICENSE, CONTRIBUTING_URL, PROFILES, REPO_URL } from "@/lib/site";

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
        <span className="n">{s.number ?? ""}</span>
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
        <section className="bh-grid book-hero">
          <div className="book-hero-cover">
            <Image src={cover} alt={book.coverAlt} sizes="(min-width: 900px) 300px, 60vw" preload placeholder="blur" />
          </div>
          <div className="book-hero-text">
            <p className="eyebrow">{book.eyebrow}</p>
            <h1>{book.title}</h1>
            <p className="book-sub">{book.subtitle}</p>
            <p className="byline">{book.author}</p>
            <StartReading startHref={sectionHref(first)} startTitle={first.title} />
            <ul className="facts" aria-label="About this book">
              <li>{chapters.length} chapters</li>
              <li>{realParts.length} parts</li>
              <li>About {formatDuration(mainWords)}</li>
            </ul>
          </div>
        </section>

        <section className="bh-grid bh-section" aria-labelledby="about">
          <h2 id="about" className="section-label bh-label">
            About the book
          </h2>
          <div className="bh-main about">
            <p className="about-headline">{book.blurb.headline}</p>
            <p>{book.blurb.body}</p>
            <ul className="about-points">
              {book.blurb.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <blockquote>{book.blurb.quote}</blockquote>
          </div>
        </section>

        <section className="bh-grid bh-section" aria-labelledby="contents">
          <h2 id="contents" className="section-label bh-label">
            Contents
          </h2>
          <div className="bh-main">
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
            <div className="toc-block">
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

        <section className="bh-grid bh-section" aria-labelledby="contribute">
          <h2 id="contribute" className="section-label bh-label">
            Contribute
          </h2>
          <div className="bh-main contribute">
            <p className="about-headline">An open book</p>
            <p>
              The full text of {book.title} is on GitHub. Anyone can fork it, suggest an edit to any chapter or open
              an issue with a correction or a better source. Accepted changes are published here.
            </p>
            <div className="contribute-actions">
              <a className="btn btn-secondary" href={REPO_URL} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
              <a href={CONTRIBUTING_URL} target="_blank" rel="noopener noreferrer">
                How to contribute
              </a>
            </div>
            <p className="license-note">
              Text licensed under{" "}
              <a href={BOOK_LICENSE.url} target="_blank" rel="license noopener noreferrer">
                {BOOK_LICENSE.name}
              </a>
              .
            </p>
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
          author: {
            "@type": "Person",
            name: book.author,
            url: SITE_URL,
            sameAs: PROFILES.map((p) => p.href),
          },
          url: `${SITE_URL}${BOOK_PATH}`,
          image: `${SITE_URL}${cover.src}`,
          inLanguage: "en-IN",
          bookFormat: "https://schema.org/EBook",
          isAccessibleForFree: true,
          license: BOOK_LICENSE.url,
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
