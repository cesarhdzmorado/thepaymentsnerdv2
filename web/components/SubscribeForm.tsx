"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SubscribeForm({ source = "homepage" }: { source?: string }) {
  const searchParams = useSearchParams();

  const subscribedFlag = searchParams.get("subscribed");
  const unsubscribedFlag = searchParams.get("unsubscribed");

  const bannerMessage = useMemo(() => {
    if (subscribedFlag === "1") return "✅ Confirmed. You’re subscribed.";
    if (subscribedFlag === "0") return "⚠️ That confirmation link didn’t work. Try subscribing again.";
    if (unsubscribedFlag === "1") return "✅ You’ve been unsubscribed.";
    if (unsubscribedFlag === "0") return "⚠️ Unsubscribe link didn’t work.";
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
        body: JSON.stringify({ email: cleanEmail, source }),
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
    <div className="card-surface p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300">
      {bannerMessage && (
        <div className="mb-5 rounded-xl px-5 py-3.5 text-sm font-semibold
                        bg-gradient-to-r from-blue-50 to-indigo-50
                        dark:from-blue-900/20 dark:to-indigo-900/20
                        text-slate-900 dark:text-slate-100
                        border border-blue-200/50 dark:border-blue-700/30
                        animate-fade-in">
          {bannerMessage}
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-full p-2 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-indigo-500">
          <Mail className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-slate-100">
          Get the daily briefing by email
        </h3>
      </div>

      <p className="mt-2 mb-6 text-sm sm:text-base text-muted leading-relaxed">
        One payments insight per day. No noise. Confirm via email.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="w-full rounded-xl px-4 py-3 text-base
                       bg-white/80 dark:bg-slate-900/40
                       border-2 border-slate-200/80 dark:border-slate-700/70
                       text-slate-950 dark:text-slate-100
                       placeholder:text-slate-400 dark:placeholder:text-slate-500
                       outline-none
                       focus:border-indigo-500 dark:focus:border-cyan-500
                       focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20
                       transition-all duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={status === "loading"}
          />
          {status === "success" && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 dark:text-green-400 animate-fade-in" />
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl px-6 py-3 text-base font-bold
                     bg-gradient-to-r from-slate-950 to-slate-800 text-white
                     hover:from-slate-900 hover:to-slate-700
                     dark:from-white dark:to-slate-100 dark:text-slate-950
                     dark:hover:from-slate-100 dark:hover:to-slate-200
                     transition-all duration-200
                     hover:scale-105 active:scale-95
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                     shadow-md hover:shadow-lg
                     flex items-center justify-center gap-2
                     min-w-[140px]"
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
      </form>

      {message && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium flex items-start gap-2 animate-fade-in ${
            status === "error"
              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50"
              : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50"
          }`}
        >
          {status === "error" ? (
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
          )}
          <span>{message}</span>
        </div>
      )}

      <p className="mt-4 text-xs text-muted flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600"></span>
        You can unsubscribe anytime with one click.
      </p>
    </div>
  );
}
