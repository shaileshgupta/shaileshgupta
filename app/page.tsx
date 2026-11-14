import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import cover from "@/content/the-third-freedom/cover.png";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/Site";
import { BOOK_PATH, SITE_URL, book, OG_IMAGES } from "@/lib/book";

export const metadata: Metadata = {
  title: { absolute: "Shailesh Gupta" },
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "Shailesh Gupta", images: OG_IMAGES },
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="container home">
        <section className="home-intro">
          <h1>Shailesh Gupta</h1>
          <p className="home-sub">Author of {book.title}</p>
        </section>

        <section className="home-books" aria-labelledby="books">
          <h2 id="books" className="section-label">
            Books
          </h2>
          <article className="book-card">
            <Link href={BOOK_PATH} className="book-card-cover" aria-label={`${book.title}: book page`}>
              <Image src={cover} alt={book.coverAlt} sizes="(min-width: 700px) 220px, 46vw" preload placeholder="blur" />
            </Link>
            <div className="book-card-text">
              <p className="eyebrow">{book.eyebrow}</p>
              <h3>
                <Link href={BOOK_PATH}>{book.title}</Link>
              </h3>
              <p className="book-card-sub">{book.subtitle}</p>
              <Link href={BOOK_PATH} className="btn btn-primary">
                Read online
              </Link>
            </div>
          </article>
        </section>
      </main>
      <SiteFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Shailesh Gupta",
          url: SITE_URL,
        }}
      />
    </>
  );
}
