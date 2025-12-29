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
import { ScrollToTop } from "@/components/ScrollToTop";
import { NewsletterNavigation } from "@/components/NewsletterNavigation";
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

// --- Data Fetching Functions ---
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

async function getNewsletterByDate(date: string): Promise<Newsletter | null> {
  const { data, error } = await supabase
    .from("newsletters")
    .select("publication_date, content")
    .eq("publication_date", date)
    .single();

  if (error || !data) {
    console.error("Error fetching newsletter for date:", date, error?.message);
    return null;
  }

  return data as Newsletter;
}

async function getAdjacentDates(currentDate: string): Promise<{ prev: string | null; next: string | null }> {
  // Get previous newsletter date
  const { data: prevData } = await supabase
    .from("newsletters")
    .select("publication_date")
    .lt("publication_date", currentDate)
    .order("publication_date", { ascending: false })
    .limit(1)
    .single();

  // Get next newsletter date
  const { data: nextData } = await supabase
    .from("newsletters")
    .select("publication_date")
    .gt("publication_date", currentDate)
    .order("publication_date", { ascending: true })
    .limit(1)
    .single();

  return {
    prev: prevData?.publication_date || null,
    next: nextData?.publication_date || null,
  };
}

// --- The Main Page Component ---
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const requestedDate = params.date;

  // Fetch newsletter based on date parameter or get latest
  const newsletter = requestedDate
    ? await getNewsletterByDate(requestedDate)
    : await getLatestNewsletter();

  // Get adjacent dates for navigation
  const adjacentDates = newsletter
    ? await getAdjacentDates(newsletter.publication_date)
    : { prev: null, next: null };

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
    <div className="relative mx-auto max-w-4xl px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16 pt-24 sm:pt-28">
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
      <header className="relative mb-0 pb-16 text-center">
        <div className="mb-6 animate-fade-in-up">
          <Logo />
        </div>

        <p className="mx-auto mb-8 max-w-2xl text-xl sm:text-2xl font-medium text-muted leading-relaxed animate-fade-in-up delay-100">
          Your daily briefing on the world of payments
        </p>

        {/* Date pill */}
        <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 card-surface animate-fade-in-up delay-200 hover:scale-105 transition-transform duration-200">
          <Calendar className="h-4 w-4 text-blue-600 dark:text-cyan-300" />
          <span className="text-sm font-semibold">{formattedDate}</span>
        </div>

        {/* Subscribe */}
        <div className="mx-auto mt-10 max-w-2xl animate-fade-in-up delay-300">
          <Suspense fallback={null}>
            <SubscribeForm source="homepage_header" />
          </Suspense>
        </div>
      </header>

      {/* News */}
      <section id="news-items" className="mb-24 space-y-6">
        {newsletter.content.news.map((item, index) => {
          const delay = `${400 + index * 100}ms`;
          return (
            <article
              key={index}
              className="group relative overflow-hidden card-surface
                         transition-all duration-300 ease-out
                         hover:-translate-y-1 hover:shadow-xl
                         animate-fade-in-up"
              style={{ animationDelay: delay }}
            >
            <div className="relative p-6 sm:p-10">
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Icon */}
                <div
                  className="flex-shrink-0 rounded-xl p-3 text-white shadow-md
                             bg-gradient-to-br from-blue-600 to-indigo-600
                             dark:from-cyan-500 dark:to-indigo-500
                             transition-all duration-300
                             group-hover:scale-110 group-hover:rotate-3"
                >
                  <BookOpen className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider
                                  bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-cyan-300
                                  transition-colors duration-300">
                    Topic #{index + 1}
                  </div>

                  <h2
                    className="mb-4 text-2xl sm:text-3xl font-bold leading-tight
                               text-slate-950 dark:text-slate-100
                               transition-colors duration-300
                               group-hover:text-blue-700
                               dark:group-hover:text-cyan-300"
                  >
                    {item.title}
                  </h2>

                  <p className="mb-6 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {item.body}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium text-muted">
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    <span>Source:</span>

                    <a
                      href={`https://www.${item.source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold
                                 text-blue-700 hover:underline hover:text-indigo-700
                                 dark:text-cyan-300 dark:hover:text-cyan-200
                                 transition-all duration-300 group/link"
                    >
                      {item.source}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* bottom sheen */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px
                         bg-gradient-to-r from-transparent via-blue-200/70 to-transparent
                         dark:via-cyan-700/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
          </article>
        );
        })}
      </section>

      {/* Curiosity */}
      <section
        id="curiosity"
        className="relative animate-fade-in-up"
        style={{ animationDelay: `${400 + newsletter.content.news.length * 100}ms` }}
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 scale-105 rounded-3xl blur-3xl
                     bg-gradient-to-r from-amber-400/15 via-orange-400/15 to-yellow-400/15
                     dark:from-amber-300/12 dark:via-orange-300/12 dark:to-yellow-300/12
                     animate-pulse-glow"
          aria-hidden="true"
        />

        <div className="relative p-8 sm:p-12 text-center card-surface-strong group hover:scale-[1.02] transition-transform duration-500">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div
              className="rounded-full p-4 text-white shadow-lg
                         bg-gradient-to-br from-amber-500 to-orange-600
                         dark:from-amber-400 dark:to-orange-500
                         transition-transform duration-300 group-hover:rotate-12"
            >
              <Lightbulb className="h-7 w-7" />
            </div>

            <h3
              className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent
                         bg-gradient-to-r from-amber-700 via-orange-700 to-amber-700
                         dark:from-amber-300 dark:via-orange-300 dark:to-amber-300"
            >
              Did You Know?
            </h3>
          </div>

          <blockquote className="space-y-6 max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl leading-relaxed font-medium italic text-slate-900 dark:text-slate-100 relative">
              <span className="absolute -left-4 -top-6 text-6xl text-amber-200 dark:text-amber-800 opacity-50 select-none">&ldquo;</span>
              {newsletter.content.curiosity.text}
            </p>
            <cite className="inline-block text-base sm:text-lg font-semibold not-italic
                           text-amber-800 dark:text-amber-200
                           px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20">
              — {newsletter.content.curiosity.source}
            </cite>
          </blockquote>
        </div>
      </section>

      <div className="mt-20">
        <Footer />
      </div>

      {/* Scroll to top button */}
      <ScrollToTop />

      {/* Newsletter navigation arrows */}
      <NewsletterNavigation
        prevDate={adjacentDates.prev}
        nextDate={adjacentDates.next}
        currentDate={newsletter.publication_date}
      />
    </div>
  );
}

