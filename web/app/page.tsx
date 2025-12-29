// web/app/page.tsx

// ---- ISR CONFIG ----
// Page will be cached and revalidated automatically.
// This prevents “stuck on last deployment” while avoiding fully-dynamic rendering.
export const revalidate = 900; // 15 minutes (change to 3600 for 1 hour if you prefer)

import { Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { SubscribeForm } from "@/components/SubscribeForm";
import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  Calendar,
  ExternalLink,
} from "lucide-react";

// --- TypeScript types ---
interface NewsItem {
  title: string;
  body: string;
  source: string;
}

interface Curiosity {
  text: string;
  source: string;
}

interface NewsletterContent {
  news: NewsItem[];
  curiosity: Curiosity;
}

interface Newsletter {
  publication_date: string;
  content: NewsletterContent;
}

// --- Data Fetching Function ---
// IMPORTANT: do NOT wrap in cache() or unstable_cache()
// ISR handles caching at the page level
async function getLatestNewsletter(): Promise<Newsletter | null> {
  const { data, error } = await supabase
    .from("newsletters")
    .select("publication_date, content")
    .order("publication_date", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error("Error fetching newsletter:", error?.message);
    return null;
  }

  return data as Newsletter;
}

// --- The Main Page Component ---
export default async function HomePage() {
  const newsletter = await getLatestNewsletter();

  // --- "No Newsletter" Fallback ---
  if (!newsletter) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center glow-bg">
        <h1 className="text-2xl font-bold">No Newsletter Available</h1>
        <p className="mt-4 max-w-md text-lg text-muted">
          We’re working on bringing you the latest payment industry insights.
          Please check back soon!
        </p>
      </main>
    );
  }

  const formattedDate = new Date(
    `${newsletter.publication_date}T00:00:00`
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative mx-auto max-w-4xl p-2 sm:p-16 lg:p-16 pt-28">
      {/* Background grid + soft glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-grid-pattern opacity-35 dark:opacity-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-30 glow-bg"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative mb-0 pb-12 text-center">
        <div className="mb-4">
          <Logo />
        </div>

        <p className="mx-auto mb-6 max-w-2xl text-xl font-medium text-muted">
          Your daily briefing on the world of payments
        </p>

        {/* Date pill */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 card-surface">
          <Calendar className="h-4 w-4 text-blue-600 dark:text-cyan-300" />
          <span className="text-sm font-semibold">{formattedDate}</span>
        </div>

        {/* Subscribe */}
        <div className="mx-auto mt-8 max-w-2xl">
          <Suspense fallback={null}>
            <SubscribeForm source="homepage_header" />
          </Suspense>
        </div>
      </header>

      {/* News */}
      <section id="news-items" className="mb-20 space-y-8">
        {newsletter.content.news.map((item, index) => (
          <article
            key={index}
            className="group relative overflow-hidden card-surface
                       transition-transform duration-300 ease-out
                       hover:-translate-y-1"
          >
            <div className="relative p-8 sm:p-10">
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div

