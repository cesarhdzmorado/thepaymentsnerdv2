"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SubscribeForm({ source = "homepage" }: { source?: string }) {
  const searchParams = useSearchParams();

  const subscribedFlag = searchParams.get("subscribed");
  const unsubscribedFlag = searchParams.get("unsubscribed");
  const referralCode = searchParams.get("ref"); // Capture referral code from URL

  const bannerMessage = useMemo(() => {
    if (subscribedFlag === "1") return "✅ Confirmed. You're subscribed.";
    if (subscribedFlag === "0") return "⚠️ That confirmation link didn't work. Try subscribing again.";
    if (unsubscribedFlag === "1") return "✅ You've been unsubscribed.";
    if (unsubscribedFlag === "0") return "⚠️ Unsubscribe link didn't work.";
    return null;
  }, [subscribedFlag, unsubscribedFlag]);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          source,
          referralCode: referralCode || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.message || "Something went wrong. Try again.");
        return;
      }

      setStatus("success");
      setMessage("Check your inbox to confirm your subscription.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="text-center">
      {bannerMessage && (
        <div className="mb-6 rounded-lg px-4 py-3 text-sm font-medium
                        bg-blue-50 dark:bg-blue-900/20
                        text-blue-800 dark:text-blue-200
                        border border-blue-200 dark:border-blue-800
                        animate-fade-in">
          {bannerMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="w-full max-w-xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="w-full rounded-lg px-4 py-3.5 text-base
                         bg-white dark:bg-slate-800
                         border-2 border-slate-300 dark:border-slate-600
                         text-slate-900 dark:text-slate-100
                         placeholder:text-slate-500 dark:placeholder:text-slate-400
                         outline-none
                         focus:border-blue-500 dark:focus:border-blue-400
                         focus:ring-4 focus:ring-blue-500/10
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={status === "loading"}
            />
            {status === "success" && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 dark:text-green-400 animate-fade-in" />
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg px-8 py-3.5 text-base font-semibold
                       bg-slate-900 text-white
                       hover:bg-slate-800
                       dark:bg-slate-100 dark:text-slate-900
                       dark:hover:bg-white
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2
                       min-w-[140px] sm:min-w-[120px]"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Subscribing…</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </div>
      </form>

      {/* Message */}
      {message && (
        <div
          className={`mt-5 rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 animate-fade-in ${
            status === "error"
              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
              : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
          }`}
        >
          {status === "error" ? (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Footer text */}
      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        You can unsubscribe anytime with one click.
      </p>
    </div>
  );
}
