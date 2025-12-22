// web/components/NavigationBar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CompactLogo } from "./CompactLogo";

export function NavigationBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50",
        "transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",

        // Glass surface
        "backdrop-blur-xl",

        // Light mode: soft glass
        "bg-white/70",
        "border-b border-slate-200/60",
        "shadow-sm",

        // Dark mode: deeper glass + subtle separation
        "dark:bg-slate-950/55",
        "dark:border-slate-700/40",
        "dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]",
      ].join(" ")}
    >
      {/* Dark mode top glow line (makes it feel intentional, not muddy) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent dark:via-slate-500/30" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            aria-label="Back to homepage"
            className="group flex items-center gap-2"
          >
            {/* Slight hover lift for “brand” */}
            <div className="transition-transform duration-200 group-hover:-translate-y-[1px]">
              <CompactLogo />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Future actions live here */}
          </div>
        </div>
      </div>
    </nav>
  );
}
