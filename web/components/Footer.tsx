// web/components/Footer.tsx

import { Heart } from "lucide-react";

export function Footer() {
  const footerLinks = [
    { name: "Legal Terms", href: "/legal" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookies Policy", href: "/cookies" },
  ];

  return (
    <footer
      className="
        mt-20 pt-10 pb-6
        border-t border-slate-200/80
        dark:border-slate-700/60
        text-slate-500
        dark:text-slate-400
        relative
      "
    >
      {/* Top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/60 to-transparent dark:via-cyan-700/40" />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-center sm:text-left">
          <p className="text-sm flex items-center gap-1.5 justify-center sm:justify-start">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              /thepaymentsnerd
            </span>
          </p>
          <p className="text-xs mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start text-slate-500 dark:text-slate-400">
            Made with{" "}
            <Heart className="h-3 w-3 text-red-500 dark:text-red-400 fill-current animate-pulse" />{" "}
            for the payments community
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="
                text-sm font-medium
                text-slate-600 dark:text-slate-400
                hover:text-blue-700 dark:hover:text-cyan-300
                transition-all duration-200
                hover:underline underline-offset-4
                decoration-2 decoration-blue-600/50 dark:decoration-cyan-400/50
              "
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Daily insights on payments, fintech, and financial innovation
        </p>
      </div>
    </footer>
  );
}
