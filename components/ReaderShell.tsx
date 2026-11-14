"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { TocGroup } from "@/lib/book";
import { ThemeToggle } from "@/components/ThemeToggle";

const WIDE = "(min-width: 1100px)";
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useWide = () =>
  useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );

interface Props {
  groups: TocGroup[];
  titles: Record<string, string>;
  bookTitle: string;
  bookHref: string;
  author: string;
  children: ReactNode;
}

/**
 * Reading frame: a fixed contents rail on wide screens; on phones and tablets a
 * top bar with the current chapter and a contents drawer. Also draws the
 * reading-progress line.
 */
export function ReaderShell({ groups, titles, bookTitle, bookHref, author, children }: Props) {
  const pathname = usePathname();
  const wide = useWide();
  // Open "for" a path, so any navigation closes the drawer without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = !wide && openFor === pathname;
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  const close = (refocus = true) => {
    setOpenFor(null);
    if (refocus) menuBtn.current?.focus();
  };

  // Keep the current entry visible in the contents list.
  useEffect(() => {
    const list = nav.current;
    const current = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !current) return;
    const top = current.offsetTop - list.clientHeight / 3;
    if (current.offsetTop < list.scrollTop || current.offsetTop > list.scrollTop + list.clientHeight - 48)
      list.scrollTop = Math.max(0, top);
  }, [pathname, open]);

  // Reading progress for the page in view.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Drawer: focus, Escape and page scroll lock while open.
  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenFor(null);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("drawer-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("drawer-open");
    };
  }, [open]);

  return (
    <>
      <a className="skip" href="#text">
        Skip to text
      </a>
      <header className="topbar">
        <button
          ref={menuBtn}
          type="button"
          className="icon-btn"
          aria-label="Open contents"
          aria-expanded={open}
          aria-controls="contents"
          onClick={() => setOpenFor(pathname)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <Link href={bookHref} className="topbar-title" prefetch={false}>
          <b>{bookTitle}</b>
          <span>{titles[pathname] ?? author}</span>
        </Link>
        <ThemeToggle />
      </header>
      <div className="progress" aria-hidden="true">
        <span ref={bar} />
      </div>
      <div className="scrim" hidden={!open} onClick={() => close()} />
      <nav
        id="contents"
        ref={nav}
        className="rail"
        data-open={open || undefined}
        aria-label="Contents"
        inert={!wide && !open}
      >
        <div className="rail-head">
          <Link href={bookHref} className="rail-book" prefetch={false}>
            <b>{bookTitle}</b>
            <span>{author}</span>
          </Link>
          <button
            ref={closeBtn}
            type="button"
            className="icon-btn rail-close"
            aria-label="Close contents"
            onClick={() => close()}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ol className="toc">
          {groups.map((g, i) => (
            <Group key={g.href ?? g.title ?? i} group={g} pathname={pathname} />
          ))}
        </ol>
        <div className="rail-foot">
          <Link href="/" prefetch={false}>
            shaileshgupta.xyz
          </Link>
          <ThemeToggle />
        </div>
      </nav>
      <main id="text" className="reader-main" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}

function Group({ group: g, pathname }: { group: TocGroup; pathname: string }) {
  const here = (href: string) => (href === pathname ? ("page" as const) : undefined);
  const active = g.href === pathname || g.items.some((i) => i.href === pathname);

  const items = (
    <ol>
      {g.items.map((i) => (
        <li key={i.href}>
          <Link href={i.href} prefetch={false} aria-current={here(i.href)}>
            {i.number ? <span className="n">{i.number}</span> : null}
            <span>{i.title}</span>
          </Link>
        </li>
      ))}
    </ol>
  );

  if (g.collapsible && g.href) {
    return (
      <li className="toc-part">
        <details open={active || undefined}>
          <summary className="toc-group">
            {g.label ? <small>{g.label}</small> : null}
            {g.title}
          </summary>
          <ol>
            <li>
              <Link href={g.href} prefetch={false} aria-current={here(g.href)}>
                <span>About the annex</span>
              </Link>
            </li>
          </ol>
          {items}
        </details>
      </li>
    );
  }

  return (
    <li className={g.title ? "toc-part" : "toc-front"}>
      {g.title ? (
        g.href ? (
          <Link href={g.href} prefetch={false} className="toc-group" aria-current={here(g.href)}>
            {g.label ? <small>{g.label}</small> : null}
            {g.title}
          </Link>
        ) : (
          <span className="toc-group">{g.title}</span>
        )
      ) : null}
      {items}
    </li>
  );
}
