# Shailesh Gupta

Author of **The Third Freedom**: *India's unfinished freedom, from developing to developed nation in one generation.*

Read it free at **[shaileshgupta.xyz](https://shaileshgupta.xyz/the-third-freedom)** · [LinkedIn](https://www.linkedin.com/in/shaileshgupta88/) · [X](https://x.com/sg_markets)

## An open book

The whole book is in this repository as Markdown, open for corrections and improvements. Every page on the site has a **Suggest an edit to this page on GitHub** link, and [CONTRIBUTING.md](CONTRIBUTING.md) explains how changes are proposed and reviewed.

| Part of the book | Files |
| --- | --- |
| Introduction, summary, principles, part openers, chapters 1–28, afterword | `content/the-third-freedom/sections/` |
| Implementation Annex | `content/the-third-freedom/annex/` |
| Titles, order and summaries | `content/the-third-freedom/book.json` |

## The website

Next.js 16 (App Router, Cache Components). Every page is prerendered at build time and deployed on Vercel from `main`.

```bash
npm install
npm run dev        # http://localhost:5450
npm run check      # typecheck + lint + production build
```

| Path | Page |
| --- | --- |
| `/` | Home |
| `/the-third-freedom` | Book page: cover, about, contents, contribute |
| `/the-third-freedom/<slug>` | Front matter, part openers, chapters, afterword |
| `/the-third-freedom/annex` | Implementation Annex index |
| `/the-third-freedom/annex/<slug>` | Annex pages |

The Markdown in this repository is the source of truth. `scripts/import-book.mjs` rebuilds every file from a complete HTML edition of the book and overwrites the Markdown, so use it only to import a whole new edition.

## License

Book text and cover: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Website code: MIT. See [LICENSE.md](LICENSE.md).
