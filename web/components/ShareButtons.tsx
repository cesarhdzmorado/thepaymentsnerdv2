"use client";

import { Twitter, Linkedin, Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title?: string;
  url?: string;
  description?: string;
}

export function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Default values
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  // Simple, clean Twitter share text
  const twitterText = "www.thepaymentsnerd.co 👀";
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;

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
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Share:
      </span>

      {/* Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   bg-slate-100 dark:bg-slate-800
                   hover:bg-blue-50 dark:hover:bg-blue-900/20
                   border border-slate-200 dark:border-slate-700
                   hover:border-blue-300 dark:hover:border-blue-700
                   text-slate-700 dark:text-slate-300
                   hover:text-blue-600 dark:hover:text-blue-400
                   transition-all duration-200 text-sm font-medium"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">Twitter</span>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   bg-slate-100 dark:bg-slate-800
                   hover:bg-blue-50 dark:hover:bg-blue-900/20
                   border border-slate-200 dark:border-slate-700
                   hover:border-blue-300 dark:hover:border-blue-700
                   text-slate-700 dark:text-slate-300
                   hover:text-blue-600 dark:hover:text-blue-400
                   transition-all duration-200 text-sm font-medium"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                   bg-slate-100 dark:bg-slate-800
                   hover:bg-green-50 dark:hover:bg-green-900/20
                   border border-slate-200 dark:border-slate-700
                   hover:border-green-300 dark:hover:border-green-700
                   text-slate-700 dark:text-slate-300
                   hover:text-green-600 dark:hover:text-green-400
                   transition-all duration-200 text-sm font-medium"
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
