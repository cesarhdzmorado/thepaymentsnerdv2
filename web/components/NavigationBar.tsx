// web/components/NavigationBar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CompactLogo } from "./CompactLogo";

export function NavigationBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);

      // Calculate scroll progress percentage
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50",
        "transition-all duration-500 ease-out",
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none",

        // Glass surface with enhanced blur
        "backdrop-blur-xl backdrop-saturate-150",

        // Light mode: soft glass with subtle gradient
        "bg-gradient-to-b from-white/80 to-white/60",
        "border-b border-slate-200/60",
        "shadow-lg shadow-slate-200/50",

        // Dark mode: deeper glass + subtle separation
        "dark:from-slate-950/70 dark:to-slate-950/50",
        "dark:border-slate-700/40",
        "dark:shadow-lg dark:shadow-black/20",
      ].join(" ")}
    >
      {/* Reading progress indicator - gradient line at top */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-slate-200/50 via-slate-300/50 to-slate-200/50 dark:from-slate-700/30 dark:via-slate-600/30 dark:to-slate-700/30">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            aria-label="Back to homepage"
            className="group flex items-center gap-2"
          >
            {/* Enhanced hover effects */}
            <div className="transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
              <CompactLogo />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Future actions: subscribe button, theme toggle, etc. */}
          </div>
        </div>
      </div>

      {/* Bottom subtle glow on scroll */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300/30 to-transparent dark:via-slate-600/20" />
    </nav>
  );
}
