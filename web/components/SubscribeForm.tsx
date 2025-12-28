"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

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
    <div className="card-surface p-6 sm:p-8">
      {bannerMessage && (
        <div className="mb-4 rounded-xl px-4 py-3 text-sm font-semibold bg-slate-100/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100">
          {bannerMessage}
        </div>
      )}

      <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-slate-100">
        Get the daily briefing by email
      </h3>

      <p className="mt-2 text-sm sm:text-base text-muted">
        One payments insight per day. No noise. Confirm via email.
      </p>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="w-full rounded-xl px-4 py-3 text-base bg-white/80 dark:bg-slate-900/40
                     border border-slate-200/80 dark:border-slate-700/70
                     text-slate-950 dark:text-slate-100
                     outline-none focus:ring-2 focus:ring-indigo-500/30"
          disabled={status === "loading"}
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl px-5 py-3 text-base font-bold
                     bg-slate-950 text-white hover:bg-slate-800
                     dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200
                     transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm font-semibold ${
            status === "error" ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {message}
        </p>
      )}

      <p className="mt-3 text-xs text-muted">You can unsubscribe anytime with one click.</p>
    </div>
  );
}
