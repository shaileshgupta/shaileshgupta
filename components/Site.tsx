import Link from "next/link";
import { ThemeSwitch } from "@/components/ThemeToggle";
import { PROFILES } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-name">
          Shailesh Gupta
        </Link>
        <ThemeSwitch />
      </div>
    </header>
  );
}

export function ProfileLinks({ label = "Profiles" }: { label?: string }) {
  return (
    <ul className="profile-links" aria-label={label}>
      {PROFILES.map((p) => (
        <li key={p.href}>
          <a href={p.href} target="_blank" rel="me noopener noreferrer">
            {p.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <p>© 2026 Shailesh Gupta</p>
        <ProfileLinks label="Shailesh Gupta elsewhere" />
      </div>
    </footer>
  );
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
