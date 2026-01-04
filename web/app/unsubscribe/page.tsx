"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      });

      if (response.ok) {
        setSuccess(true);
        // Update URL to show confirmed state
        router.replace("/unsubscribe?confirmed=1");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to unsubscribe. Please try again.");
      }
    } catch (err) {
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
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
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
            You've Been Unsubscribed
          </h1>
          <p className="text-stone-600 mb-6">
            You will no longer receive emails from The Payments Nerd.
          </p>
          <p className="text-sm text-stone-500 mb-6">
            Changed your mind? You can always resubscribe at our homepage.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-stone-900 mb-4">
          Unsubscribe from The Payments Nerd?
        </h1>
        <p className="text-stone-600 mb-6">
          We're sorry to see you go! You will no longer receive our daily payments insights.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Yes, Unsubscribe"}
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-stone-200 text-stone-900 font-medium rounded-lg hover:bg-stone-300 transition-colors"
          >
            Cancel
          </a>
        </div>

        <p className="text-xs text-stone-500 mt-6">
          If you're having trouble, please contact us at{" "}
          <a href="mailto:support@thepaymentsnerd.co" className="text-blue-600 hover:underline">
            support@thepaymentsnerd.co
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
