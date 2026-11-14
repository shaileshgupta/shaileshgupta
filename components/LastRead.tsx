"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

const KEY = "ttf:last-read";

interface Saved {
  href: string;
  title: string;
}

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

/** Records the page being read, so the book page can offer "Continue reading". */
export function RememberRead({ href, title }: Saved) {
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ href, title }));
    } catch {
      // Storage unavailable: nothing to remember.
    }
  }, [href, title]);
  return null;
}

/** Start button that becomes "Continue reading" on a return visit. Same size either way. */
export function StartReading({ startHref, startTitle }: { startHref: string; startTitle: string }) {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  let saved: Saved | null = null;
  try {
    const parsed = raw ? (JSON.parse(raw) as Saved) : null;
    if (parsed?.href?.startsWith("/") && parsed.href !== startHref) saved = parsed;
  } catch {
    saved = null;
  }

  return (
    <div className="start">
      <Link className="btn btn-primary" href={saved ? saved.href : startHref}>
        {saved ? "Continue reading" : "Start reading"}
      </Link>
      <p className="start-note">
        {saved ? (
          <>
            {saved.title} ·{" "}
            <Link href={startHref} prefetch={false}>
              start over
            </Link>
          </>
        ) : (
          <>Begins with the {startTitle}</>
        )}
      </p>
    </div>
  );
}
