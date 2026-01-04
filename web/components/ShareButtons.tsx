"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url?: string;
}

export function ShareButtons({ url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Default values
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  // Simple, clean X share text
  const xText = "www.thepaymentsnerd.co 👀";
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`;

  // LinkedIn share URL (LinkedIn doesn't support pre-populated text anymore)
  // The OG tags will provide rich preview automatically
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-200">
        Share:
      </span>

      {/* X */}
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   bg-slate-100 dark:bg-slate-800
                   hover:bg-blue-50 dark:hover:bg-blue-900/20
                   border border-slate-200 dark:border-slate-700
                   hover:border-blue-300 dark:hover:border-blue-700
                   text-slate-700 dark:text-slate-300
                   hover:text-blue-600 dark:hover:text-blue-400
                   transition-all duration-300
                   hover:scale-105 hover:shadow-md active:scale-95
                   text-sm font-medium"
        aria-label="Share on X"
      >
        <img src="/images/x-logo.png" alt="X" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12 dark:brightness-0 dark:invert" />
        <span className="hidden sm:inline">X</span>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   bg-slate-100 dark:bg-slate-800
                   hover:bg-blue-50 dark:hover:bg-blue-900/20
                   border border-slate-200 dark:border-slate-700
                   hover:border-blue-300 dark:hover:border-blue-700
                   text-slate-700 dark:text-slate-300
                   hover:text-blue-600 dark:hover:text-blue-400
                   transition-all duration-300
                   hover:scale-105 hover:shadow-md active:scale-95
                   text-sm font-medium"
        aria-label="Share on LinkedIn"
      >
        <img src="/images/linkedin-logo.png" alt="LinkedIn" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 dark:brightness-0 dark:invert" />
        <span className="hidden sm:inline">LinkedIn</span>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   border text-sm font-medium
                   transition-all duration-300
                   hover:scale-105 hover:shadow-md active:scale-95
                   ${copied
                     ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400"
                     : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400"
                   }`}
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 animate-scale-in" />
            <span className="hidden sm:inline">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
            <span className="hidden sm:inline">Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
