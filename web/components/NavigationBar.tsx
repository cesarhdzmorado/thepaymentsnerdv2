// web/components/NavigationBar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CompactLogo } from "./CompactLogo";

export function NavigationBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50",
        "transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",

        // Light mode
        "bg-white/75 border-b border-slate-200/60 shadow-sm",

        // Dark mode
        "dark:bg-slate-900/70 dark:border-slate-800/80 dark:shadow-none",

        // Shared
        "backdrop-blur-xl",
      ].join(" ")}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            aria-label="Back to homepage"
            className="flex items-center gap-2"
          >
            <CompactLogo />
          </Link>

          {/* Placeholder for future actions */}
          <div className="flex items-center gap-3">
            {/* Example future button */}
            {/*
            <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500">
              Subscribe
            </button>
            */}
          </div>
        </div>
      </div>
    </nav>
  );
}
