"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Top navigation for all marketing pages (/, /method, /tech, /terms).
 * Stays out of the way — small, dark, on-brand. The current page is
 * highlighted so people always know where they are.
 */
export default function MarketingNav() {
  const pathname = usePathname();

  const links: { href: string; label: string }[] = [
    { href: "/method", label: "The Method" },
    { href: "/tech", label: "The Tech" },
    { href: "/terms", label: "Terms" },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-md">
      <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-[11px] font-bold tracking-[0.4em] uppercase text-foreground hover:text-accent transition"
        >
          Sub Three
        </Link>

        {/* Section links */}
        <div className="flex items-center gap-6">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[12px] tracking-wide transition ${
                  active
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          {/* CTA */}
          <Link
            href="/companion"
            className="ml-2 text-[11px] font-semibold tracking-[0.12em] uppercase bg-foreground text-background px-3.5 py-2 rounded hover:opacity-85 active:scale-[0.98] transition"
          >
            Companion →
          </Link>
        </div>
      </div>
    </nav>
  );
}
