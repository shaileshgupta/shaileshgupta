# shaileshgupta.xyz

Personal website of Shailesh Gupta. It publishes the book **The Third Freedom** as a free online read.

Next.js 16 (App Router, Cache Components). Every page is prerendered at build time.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5450
```

## Checks

```bash
npm run check      # typecheck + lint + production build
```

## Book content

The book lives in `content/the-third-freedom/`:

- `book.json`: titles, parts, chapter order, back-cover copy
- `sections/*.md`: front matter, part openers, chapters, afterword (one file per page)
- `annex/*.md`: the Implementation Annex (one file per page)
- `cover.png`: front cover

These files are generated from the book's published HTML. To pull in a new version, save the HTML and run:

```bash
npm run import:book -- path/to/the-third-freedom.html
```

The importer rewrites in-book chapter links to site URLs and puts a few broken source lists back on their own lines. The back-cover copy in `book.json` comes from `scripts/import-book.mjs`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/the-third-freedom` | Book page: cover, about, contents |
| `/the-third-freedom/<slug>` | Introduction, summary, principles, part openers, chapters 1–28, afterword |
| `/the-third-freedom/annex` | Implementation Annex index |
| `/the-third-freedom/annex/<slug>` | Annex pages |

## Deploy

Vercel project linked to this repository; pushes to `main` deploy to https://shaileshgupta.xyz.
