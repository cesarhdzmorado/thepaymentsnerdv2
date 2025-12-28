// web/app/page.tsx

// ---- ISR CONFIG ----
// Page will be cached and revalidated automatically.
// This prevents “stuck on last deployment” while avoiding fully-dynamic rendering.
export const revalidate = 900; // 15 minutes (change to 3600 for 1 hour if you prefer)

import { supabase } from "@/lib/supabaseClient";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
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
                  className="flex-shrink-0 rounded-xl p-3 text-white shadow-md
                             bg-gradient-to-br from-blue-600 to-indigo-600
                             dark:from-cyan-500 dark:to-indigo-500
                             transition-transform duration-300
                             group-hover:scale-110"
                >
                  <BookOpen className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-700/80 dark:text-cyan-300/90">
                    Topic #{index + 1}
                  </div>

                  <h2
                    className="mb-4 text-2xl sm:text-3xl font-bold
                               text-slate-950 dark:text-slate-100
                               transition-colors duration-300
                               group-hover:text-indigo-800
                               dark:group-hover:text-white"
                  >
                    {item.title}
                  </h2>

                  <p className="mb-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {item.body}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted">
                    <ExternalLink className="h-4 w-4" />
                    <span>Source:</span>

                    <a
                      href={`https://www.${item.source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold
                                 text-blue-700 hover:underline hover:text-indigo-700
                                 dark:text-cyan-300 dark:hover:text-cyan-200
                                 transition-colors duration-300"
                    >
                      {item.source}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* bottom sheen */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px
                         bg-gradient-to-r from-transparent via-slate-200/70 to-transparent
                         dark:via-slate-700/60"
              aria-hidden="true"
            />
          </article>
        ))}
      </section>

      {/* Curiosity */}
      <section id="curiosity" className="relative">
        <div
          className="pointer-events-none absolute inset-0 -z-10 scale-105 rounded-3xl blur-2xl
                     bg-gradient-to-r from-amber-400/10 via-orange-400/10 to-yellow-400/10
                     dark:from-amber-300/10 dark:via-orange-300/10 dark:to-yellow-300/10"
          aria-hidden="true"
        />

        <div className="relative p-8 sm:p-12 text-center card-surface-strong">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div
              className="rounded-full p-3 text-white shadow-lg
                         bg-gradient-to-br from-amber-500 to-orange-600
                         dark:from-amber-400 dark:to-orange-500"
            >
              <Lightbulb className="h-7 w-7" />
            </div>

            <h3
              className="text-3xl font-bold bg-clip-text text-transparent
                         bg-gradient-to-r from-amber-700 to-orange-700
                         dark:from-amber-300 dark:to-orange-300"
            >
              Did You Know?
            </h3>
          </div>

          <blockquote className="space-y-4">
            <p className="text-xl sm:text-2xl leading-relaxed font-medium italic text-slate-900 dark:text-slate-100">
              “{newsletter.content.curiosity.text}”
            </p>
            <cite className="inline-block text-base font-semibold not-italic text-amber-800 dark:text-amber-200">
              — {newsletter.content.curiosity.source}
            </cite>
          </blockquote>
        </div>
      </section>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
