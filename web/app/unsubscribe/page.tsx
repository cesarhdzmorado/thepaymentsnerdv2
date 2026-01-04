"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  // If already unsubscribed (from redirect), show success
  useEffect(() => {
    if (searchParams.get("confirmed") === "1") {
      setSuccess(true);
    }
  }, [searchParams]);

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

  if (!token && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Invalid Link</h1>
          <p className="text-stone-600 mb-6">
            This unsubscribe link is invalid or has expired.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4 text-green-600">
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
          <h1 className="text-2xl font-bold text-stone-900 mb-4">
            You&apos;ve Been Unsubscribed
          </h1>
          <p className="text-stone-600 mb-6">
            You will no longer receive emails from The Payments Nerd.
          </p>
          <p className="text-sm text-stone-500 mb-6">
            Changed your mind? You can always resubscribe at our homepage.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
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
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-4 text-center">
          Unsubscribe from The Payments Nerd?
        </h1>
        <p className="text-stone-600 mb-6 text-center">
          We&apos;re sorry to see you go! You will no longer receive our daily payments insights.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Optional: Help us improve section */}
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-stone-700 mb-3">
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
                  className="w-4 h-4 text-blue-600 border-stone-300 focus:ring-blue-500"
                />
                <span className="text-sm text-stone-700">{r.label}</span>
              </label>
            ))}
          </div>

          {/* Optional feedback textarea */}
          <div className="mt-4">
            <label htmlFor="feedback" className="block text-sm font-medium text-stone-700 mb-2">
              Any additional thoughts? (optional)
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Tell us what we could do better..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Confirm Unsubscribe"}
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-stone-200 text-stone-900 font-medium rounded-lg hover:bg-stone-300 transition-colors text-center"
          >
            Keep Subscription
          </Link>
        </div>

        <p className="text-xs text-stone-500 mt-6 text-center">
          If you&apos;re having trouble, please contact us at{" "}
          <a href="mailto:cesar@thepaymentsnerd.co" className="text-blue-600 hover:underline">
            cesar@thepaymentsnerd.co
          </a>
        </p>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-600">Loading...</div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
