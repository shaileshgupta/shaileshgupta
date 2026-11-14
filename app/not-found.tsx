import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/Site";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container not-found">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>
          This page does not exist. <Link href="/the-third-freedom">Go to The Third Freedom</Link> or{" "}
          <Link href="/">the home page</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
