// web/app/page.tsx

import { supabase } from '@/lib/supabaseClient';
import { Logo } from '@/components/Logo'; // <-- Import Logo
import { Footer } from '@/components/Footer'; // <-- Import Footer
import { ArrowRight, BookOpen, Lightbulb } from 'lucide-react'; // <-- Import icons

// --- TypeScript types (no change here) ---
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

// --- Data Fetching Function (no change here) ---
async function getLatestNewsletter(): Promise<Newsletter | null> {
  const { data, error } = await supabase
    .from('newsletters')
    .select('publication_date, content')
    .order('publication_date', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error("Error fetching newsletter:", error?.message);
    return null;
  }
  return data as Newsletter;
}

// --- The Main Page Component (UPDATED!) ---
export default async function HomePage() {
  const newsletter = await getLatestNewsletter();

  if (!newsletter) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-50 text-slate-800">
        <Logo />
        <p className="mt-6 text-lg text-slate-600">No newsletter available. Please check back later.</p>
      </main>
    );
  }

  const formattedDate = new Date(newsletter.publication_date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased">
      <main className="max-w-3xl mx-auto p-4 sm:p-8">
        <header className="text-center border-b-2 border-slate-200 pb-8 mb-12">
          {/* The Logo icon, centered */}
          <div className="flex justify-center mb-4">
            <Logo />
          </div>

          {/* The main title, now much larger and separate */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            The Payments Nerd
          </h1>

          {/* Subtitle and date remain the same */}
          <p className="mt-4 text-lg text-slate-500">Your daily briefing on the world of payments.</p>
          <p className="mt-2 text-sm text-slate-400">{formattedDate}</p>
        </header> 

        <section id="news-items" className="space-y-10">
          {newsletter.content.news.map((item, index) => (
            // NEW: Added a subtle hover effect and transition
            <article key={index} className="group transition-all duration-300 hover:bg-white hover:shadow-xl hover:scale-[1.02] bg-white p-6 rounded-lg shadow-md border border-slate-200">
              <div className="flex items-start gap-4">
                {/* NEW: Added an icon to the headline */}
                <div className="text-blue-600 mt-1">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h2>
                  <p className="text-base leading-relaxed mb-4">{item.body}</p>
                  <p className="text-sm font-medium text-slate-500">
                    Source: 
                    {/* NEW: Added an arrow icon to the link */}
                    <a href={`https://www.${item.source}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline ml-1">
                      {item.source}
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* NEW: Updated styling for the curiosity section */}
        <section id="curiosity" className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-lg border border-blue-200 text-center">
          <div className="flex justify-center items-center gap-3 mb-3">
            <Lightbulb className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-900">Did You Know?</h3>
          </div>
          <blockquote className="text-blue-900/80">
            <p className="italic">{`"${newsletter.content.curiosity.text}"`}</p>
            <cite className="text-sm not-italic mt-2 block">
              — {newsletter.content.curiosity.source}
            </cite>
          </blockquote>
        </section>

        {/* Use the new Footer component */}
        <Footer />
      </main>
    </div>
  );
}