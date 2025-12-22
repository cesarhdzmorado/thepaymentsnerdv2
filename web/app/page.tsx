// web/app/page.tsx

import { supabase } from "@/lib/supabaseClient";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { ArrowRight, BookOpen, Lightbulb, Calendar, ExternalLink } from "lucide-react";

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

  // --- "No Newsletter" Fallback Page ---
  if (!newsletter) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center
        bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
      >
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          No Newsletter Available
        </h1>
        <p className="mt-4 max-w-md text-lg text-slate-600 dark:text-slate-300">
          We’re working on bringing you the latest payment industry insights. Please check back soon!
        </p>
      </main>
    );
  }

  const formattedDate = new Date(newsletter.publication_date + "T00:00:00").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="relative mx-auto max-w-4xl p-2 sm:p-16 lg:p-16 pt-28">
      {/* Background grid — tuned for dark mode */}
      <div
        className="absolute inset-0 top-0 bg-grid-pattern opacity-35 dark:opacity-20 pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative mb-0 pb-12 text-center">
        {/* Glow blob */}
        <div
          className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-8 rounded-full blur-3xl -z-10
          bg-gradient-to-r from-blue-400/20 to-indigo-400/20
          dark:from-cyan-400/10 dark:to-indigo-400/10"
          aria-hidden="true"
        />

        <div className="mb-4">
          <Logo />
        </div>

        <p className="mx-auto mb-6 max-w-2xl text-xl font-medium text-slate-600 dark:text-slate-300">
          Your daily briefing on the world of payments
        </p>

        {/* Date pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-lg border
          bg-white/70 border-slate-200/60 backdrop-blur-sm
          dark:bg-slate-900/60 dark:border-slate-800/80"
        >
          <Calendar className="h-4 w-4 text-blue-600 dark:text-cyan-300" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {formattedDate}
          </span>
        </div>
      </header>

      {/* News */}
      <section id="news-items" className="mb-20 space-y-8">
        {newsletter.content.news.map((item, index) => (
          <article
            key={index}
            className="
              group relative overflow-hidden rounded-2xl border transition-all duration-300 ease-in-out
              bg-white/75 border-slate-200/60 backdrop-blur-sm
              hover:bg-white/90 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10

              dark:bg-slate-900/55 dark:border-slate-800/80
              dark:hover:bg-slate-900/75 dark:hover:shadow-none
            "
          >
            <div className="relative p-8 sm:p-10">
              <div className="flex items-start gap-6">
                {/* Icon tile */}
                <div
                  className="
                    flex-shrink-0 rounded-xl p-3 text-white shadow-md transition-transform duration-300
                    bg-gradient-to-br from-blue-500 to-indigo-600
                    group-hover:scale-110

                    dark:from-cyan-500 dark:to-indigo-500
                  "
                >
                  <BookOpen className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-600/80 dark:text-cyan-300/90">
                    Topic #{index + 1}
                  </div>

                  <h2
                    className="
                      mb-4 text-2xl sm:text-3xl font-bold transition-colors duration-300
                      text-slate-900 group-hover:text-indigo-800

                      dark:text-slate-100 dark:group-hover:text-white
                    "
                  >
                    {item.title}
                  </h2>

                  <p className="mb-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {item.body}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <ExternalLink className="h-4 w-4" />
                    <span>Source:</span>

                    <a
                      href={`https://www.${item.source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex items-center gap-1 font-semibold transition-colors duration-300 underline-offset-4
                        text-blue-600 hover:text-indigo-600 hover:underline

                        dark:text-cyan-300 dark:hover:text-cyan-200
                      "
                    >
                      {item.source}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* subtle bottom sheen for dark mode */}
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
          className="
            absolute inset-0 scale-105 rounded-3xl blur-2xl
            bg-gradient-to-r from-amber-400/10 via-orange-400/10 to-yellow-400/10
            dark:from-amber-300/10 dark:via-orange-300/10 dark:to-yellow-300/10
          "
          aria-hidden="true"
        />

        <div
          className="
            relative rounded-3xl p-8 sm:p-12 text-center shadow-xl border backdrop-blur-sm
            bg-white/80 border-slate-200/60
            dark:bg-slate-900/60 dark:border-slate-800/80 dark:shadow-none
          "
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div
              className="
                rounded-full p-3 text-white shadow-lg
                bg-gradient-to-br from-amber-500 to-orange-600
                dark:from-amber-400 dark:to-orange-500
              "
            >
              <Lightbulb className="h-7 w-7" />
            </div>

            <h3
              className="
                text-3xl font-bold bg-clip-text text-transparent
                bg-gradient-to-r from-amber-700 to-orange-700
                dark:from-amber-300 dark:to-orange-300
              "
            >
              Did You Know?
            </h3>
          </div>

          <blockquote className="space-y-4">
            <p className="text-xl sm:text-2xl leading-relaxed font-medium italic text-slate-800 dark:text-slate-100">
              {`"${newsletter.content.curiosity.text}"`}
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
