import { ReaderShell } from "@/components/ReaderShell";
import { BOOK_PATH, book, shortTitles, tableOfContents } from "@/lib/book";

export default function ReadLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReaderShell
      groups={tableOfContents()}
      titles={shortTitles()}
      bookTitle={book.title}
      bookHref={BOOK_PATH}
      author={book.author}
    >
      {children}
    </ReaderShell>
  );
}
