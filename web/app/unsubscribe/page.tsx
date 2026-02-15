"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { type ReactNode, useState, Suspense } from "react";
import Link from "next/link";

function UnsubscribeShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen px-4 py-8 sm:py-12">
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-grid-pattern opacity-35 dark:opacity-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 -z-30 glow-bg"
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const isConfirmed = searchParams.get("confirmed") === "1";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const isSuccess = success || isConfirmed;

  const handleUnsubscribe = async () => {
    if (!token) {
      setError("Invalid unsubscribe link");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/unsubscribe?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason || undefined,
          feedback: feedback || undefined,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Update URL to show confirmed state
        router.replace("/unsubscribe?confirmed=1");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to unsubscribe. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <UnsubscribeShell>
        <div className="w-full card-surface-strong p-8 sm:p-10 text-center">
          <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Invalid Link
          </h1>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            This unsubscribe link is invalid or has expired.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold
                       bg-gradient-to-r from-slate-900 to-slate-800 text-white
                       hover:from-slate-800 hover:to-slate-700
                       dark:from-slate-100 dark:to-slate-50 dark:text-slate-900
                       dark:hover:from-white dark:hover:to-slate-100
                       transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </UnsubscribeShell>
    );
  }

  if (isSuccess) {
    return (
      <UnsubscribeShell>
        <div className="w-full card-surface-strong p-8 sm:p-10 text-center">
          <div className="mb-4 text-green-600 dark:text-green-400">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
            You&apos;ve Been Unsubscribed
          </h1>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            You will no longer receive emails from The Payments Nerd.
          </p>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Changed your mind? You can always resubscribe at our homepage.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold
                       bg-gradient-to-r from-slate-900 to-slate-800 text-white
                       hover:from-slate-800 hover:to-slate-700
                       dark:from-slate-100 dark:to-slate-50 dark:text-slate-900
                       dark:hover:from-white dark:hover:to-slate-100
                       transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </UnsubscribeShell>
    );
  }

  const reasons = [
    { value: "too_frequent", label: "Emails are too frequent" },
    { value: "not_relevant", label: "Content isn't relevant to me" },
    { value: "too_long", label: "Emails are too long" },
    { value: "quality", label: "Quality doesn't meet my expectations" },
    { value: "other", label: "Other reason" },
  ];

  return (
    <UnsubscribeShell>
      <div className="w-full card-surface-strong p-8 sm:p-10">
        <h1 className="mb-4 text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
          Unsubscribe from The Payments Nerd?
        </h1>
        <p className="mb-6 text-center text-slate-600 dark:text-slate-300">
          We&apos;re sorry to see you go! You will no longer receive our daily payments insights.
        </p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Optional: Help us improve section */}
        <div className="mb-6 text-left">
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Help us improve (optional):
          </p>
          <div className="space-y-2">
            {reasons.map((r) => (
              <label key={r.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{r.label}</span>
              </label>
            ))}
          </div>

          {/* Optional feedback textarea */}
          <div className="mt-4">
            <label htmlFor="feedback" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Any additional thoughts? (optional)
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
                         text-slate-900 placeholder:text-slate-500 focus:border-transparent focus:ring-2 focus:ring-blue-500
                         dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder="Tell us what we could do better..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white
                       hover:bg-red-700 transition-colors
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Unsubscribe"}
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 bg-slate-100 px-6 py-3 text-center text-sm font-semibold
                       text-slate-900 hover:bg-slate-200 transition-colors
                       dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Keep Subscription
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          If you&apos;re having trouble, please contact us at{" "}
          <a href="mailto:cesar@thepaymentsnerd.co" className="text-blue-600 hover:underline dark:text-cyan-300">
            cesar@thepaymentsnerd.co
          </a>
        </p>
      </div>
    </UnsubscribeShell>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <UnsubscribeShell>
        <div className="w-full card-surface p-8 text-center text-slate-600 dark:text-slate-300">
          Loading...
        </div>
      </UnsubscribeShell>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
