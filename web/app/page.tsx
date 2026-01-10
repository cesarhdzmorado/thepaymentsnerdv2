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
import { ShareButtons } from "@/components/ShareButtons";
import { ensureHttps } from "@/lib/publicationNames";
import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  Calendar,
  ExternalLink,
} from "lucide-react";

// --- TypeScript types ---
interface Source {
  name: string;
  url: string;
}

interface NewsItem {
  title: string;
  body: string;
  source: Source;
}

interface Curiosity {
  text: string;
  source: Source;
}

interface NewsletterContent {
  intro?: string;
  news: NewsItem[];
  perspective?: string;
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

async function getSubscriberCount(): Promise<number> {
  const { count, error } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching subscriber count:", error.message);
    return 0;
  }

  console.log("📊 Subscriber count fetched:", count);
  return count || 0;
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

  // Get subscriber count for social proof
  const subscriberCount = await getSubscriberCount();
  console.log("📊 Using subscriber count for display:", subscriberCount, "Show count?", subscriberCount > 10);

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

  // Split news into hero story and quick hits (matching newsletter structure)
  const heroStory = newsletter.content.news[0];
  const quickHits = newsletter.content.news.slice(1);

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
          Five critical payments insights. Zero noise. Daily.
        </p>

        {/* Social Proof - Subscriber Count */}
        <div className="mb-6 animate-fade-in-up delay-150">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {subscriberCount > 10
              ? `Join ${subscriberCount.toLocaleString()}+ payment professionals`
              : "Be among the first to join"}
          </p>
        </div>

        {/* Date pill */}
        <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 card-surface animate-fade-in-up delay-200 hover:scale-105 transition-transform duration-200">
          <Calendar className="h-4 w-4 text-blue-600 dark:text-cyan-300" />
          <span className="text-sm font-semibold">{formattedDate}</span>
        </div>

        {/* Subscribe Form */}
        <div className="mx-auto mt-10 max-w-xl animate-fade-in-up delay-300">
          <Suspense fallback={null}>
            <SubscribeForm source="homepage" />
          </Suspense>
        </div>

        {/* Share Buttons */}
        <div className="mx-auto mt-8 flex justify-center animate-fade-in-up delay-400">
          <ShareButtons />
        </div>
      </header>

      {/* TODAY'S LEAD STORY */}
      <section id="lead-story" className="mb-16 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent dark:via-cyan-500/30" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            Today&rsquo;s Lead Story
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent dark:via-cyan-500/30" />
        </div>

        <article
          className="group relative overflow-hidden card-surface
                     transition-all duration-300 ease-out
                     hover:-translate-y-2 hover:shadow-2xl
                     hover:scale-[1.01]"
        >
          {/* Dramatic gradient glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

          {/* Accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600 dark:from-cyan-500 dark:via-indigo-500 dark:to-purple-500" aria-hidden="true" />

          <div className="relative p-6 sm:p-12 pl-8 sm:pl-14">
            <div className="flex items-start gap-4 sm:gap-8">
              {/* Enhanced icon for hero story */}
              <div
                className="flex-shrink-0 rounded-2xl p-4 text-white shadow-xl
                           bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600
                           dark:from-cyan-500 dark:via-indigo-500 dark:to-purple-500
                           transition-all duration-300
                           group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl"
              >
                <BookOpen className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="mb-4 text-2xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight
                             bg-clip-text text-transparent bg-gradient-to-r
                             from-slate-900 via-blue-900 to-indigo-900
                             dark:from-slate-100 dark:via-cyan-300 dark:to-indigo-300
                             transition-all duration-300"
                >
                  {heroStory.title}
                </h3>

                <p className="mb-5 text-base sm:text-xl leading-relaxed text-slate-700 dark:text-slate-300
                              transition-colors duration-300
                              group-hover:text-slate-900 dark:group-hover:text-slate-200">
                  {heroStory.body}
                </p>

                <div className="flex items-center gap-2 text-sm font-medium text-muted">
                  <ExternalLink className="h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span>Source:</span>

                  <a
                    href={ensureHttps(heroStory.source.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold
                               text-blue-700 hover:underline hover:text-indigo-700
                               dark:text-cyan-300 dark:hover:text-cyan-200
                               transition-all duration-300 group/link
                               hover:gap-2"
                  >
                    {heroStory.source.name}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced bottom sheen with gradient */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1
                       bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
                       dark:from-cyan-500 dark:via-indigo-500 dark:to-purple-500
                       opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
            aria-hidden="true"
          />
        </article>
      </section>

      {/* ALSO WORTH KNOWING */}
      <section id="quick-hits" className="mb-24 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            Also Worth Knowing
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {quickHits.map((item, index) => {
            const delay = `${600 + index * 100}ms`;
            return (
              <article
                key={index}
                className="group relative overflow-hidden card-surface
                           transition-all duration-300 ease-out
                           hover:-translate-y-1 hover:shadow-xl
                           animate-fade-in-up"
                style={{ animationDelay: delay }}
              >
                {/* Subtle gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

                <div className="relative p-6">
                  <div className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider
                                  bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300
                                  transition-all duration-300
                                  group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
                    #{index + 2}
                  </div>

                  <h3
                    className="mb-3 text-lg sm:text-xl font-display font-semibold leading-tight
                               text-slate-900 dark:text-slate-100
                               transition-all duration-300
                               group-hover:text-blue-700
                               dark:group-hover:text-cyan-300"
                  >
                    {item.title}
                  </h3>

                  <p className="mb-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400
                                transition-colors duration-300
                                group-hover:text-slate-800 dark:group-hover:text-slate-300">
                    {item.body}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-medium text-muted">
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    <a
                      href={ensureHttps(item.source.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold
                                 text-blue-600 hover:underline hover:text-indigo-600
                                 dark:text-cyan-400 dark:hover:text-cyan-300
                                 transition-all duration-300 group/link
                                 hover:gap-1.5"
                    >
                      {item.source.name}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
                    </a>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5
                             bg-gradient-to-r from-transparent via-slate-400/50 to-transparent
                             dark:via-slate-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </section>

      {/* DID YOU KNOW? */}
      <section
        id="curiosity"
        className="relative animate-fade-in-up"
        style={{ animationDelay: "1000ms" }}
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
              — <a
                  href={ensureHttps(newsletter.content.curiosity.source.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-all duration-300"
                >
                  {newsletter.content.curiosity.source.name}
                </a>
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

