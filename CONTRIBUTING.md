# Contributing to The Third Freedom

Thank you for helping improve the book. Corrections, better sources, clearer wording and new evidence are all welcome.

## Suggest an edit

1. On [shaileshgupta.xyz](https://shaileshgupta.xyz/the-third-freedom), open the page you want to change and choose **Suggest an edit to this page on GitHub** at the end of it.
2. GitHub opens that page's file in its editor and makes a fork for you.
3. Make your change, write a short note on what and why, then choose **Propose changes** and **Create pull request**.

You can also fork the repository and edit the files directly.

## Where the text lives

| Part of the book | File |
| --- | --- |
| Introduction, executive summary, principles, part openers, chapters, afterword | `content/the-third-freedom/sections/<slug>.md` |
| Implementation Annex | `content/the-third-freedom/annex/<slug>.md` |
| Titles, chapter order, one-line summaries, back-cover text | `content/the-third-freedom/book.json` |

The slug is the last part of the page's address. For example, `shaileshgupta.xyz/the-third-freedom/tax-keep-what-you-earn` is `sections/tax-keep-what-you-earn.md`, and its annex is `annex/tax-keep-what-you-earn.md`.

## Guidelines

- Keep each pull request to one topic, so it can be reviewed on its own.
- Back any new or changed figure with a source, and add it to the page's **Sources:** line.
- Keep the Markdown structure: `##` for section headings, plain lists and tables. Link to other chapters by their site path, for example `[Chapter 2](/the-third-freedom/every-rupee-digital)`.
- For a bigger proposal, such as a new reform, a change of position or a restructured chapter, [open an issue](https://github.com/shaileshgupta/shaileshgupta/issues) first so it can be discussed.

## Preview your change (optional)

```bash
npm install
npm run dev
```

Then open http://localhost:5450.

## Review

Shailesh Gupta reviews every pull request. Accepted changes are published on [shaileshgupta.xyz](https://shaileshgupta.xyz).

## License

By contributing, you agree that your contribution is licensed under CC BY-SA 4.0 if it is book text, or MIT if it is code. See [LICENSE.md](LICENSE.md).
