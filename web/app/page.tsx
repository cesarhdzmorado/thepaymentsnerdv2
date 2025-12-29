// web/app/page.tsx

export const revalidate = 900;

import { Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Calendar } from "lucide-react";

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

export default async function HomePage() {
  const newsletter = await getLatestNewsletter();

  if (!newsletter) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold">No Newsletter Available</h1>
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
    <div className="relative mx-auto max-w-4xl pt-28">
      <header className="text-center">
        <Logo />

        <p className="mt-6 text-xl">
          Your daily briefing on the world of payments
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <Suspense fallback={null}>
            <SubscribeForm source="homepage_header" />
          </Suspense>
        </div>
      </header>

      <section className="mt-16 space-y-8">
        {newsletter.content.news.map((item, index) => (
          <article key={index}>
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <p className="mt-2">{item.body}</p>
            <a
              href={`https://www.${item.source}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.source}
            </a>
          </article>
        ))}
      </section>

      <Footer />
    </div>
  );
}
