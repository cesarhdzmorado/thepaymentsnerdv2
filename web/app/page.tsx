// web/app/page.tsx

import { supabase } from '@/lib/supabaseClient';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
// We need to import the new icons we'll be using
import { ArrowRight, BookOpen, Lightbulb, Calendar, ExternalLink } from 'lucide-react';

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


// --- The Main Page Component (FULLY UPGRADED!) ---
export default async function HomePage() {
  const newsletter = await getLatestNewsletter();

  // --- Enhanced "No Newsletter" Fallback Page ---
  if (!newsletter) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-6">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-800">No Newsletter Available</h1>
            <p className="text-lg text-slate-600 max-w-md">
              We’re working on bringing you the latest payment industry insights. Please check back soon!
            </p>
          </div>
          <div className="animate-pulse">
            <div className="h-2 bg-slate-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(newsletter.publication_date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Subtle background pattern from globals.css */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

      <main className="relative max-w-4xl mx-auto p-4 sm:p-8 lg:p-12">
        
        {/* --- Enhanced Header --- */}
        <header className="text-center pb-12 mb-16 relative">
          {/* Animated background blob for a modern feel */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
            /thepaymentsnerd
          </h1>

          <p className="text-xl text-slate-600 font-medium mb-6 max-w-2xl mx-auto">
            Your daily briefing on the world of payments.
          </p>

          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200/50">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-700">{formattedDate}</span>
          </div>
        </header>

        {/* --- Enhanced News Section --- */}
        <section id="news-items" className="space-y-8 mb-20">
          {newsletter.content.news.map((item, index) => (
            <article 
              key={index} 
              className="group relative bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 rounded-2xl border border-slate-200/60 overflow-hidden"
            >
              <div className="relative p-8 sm:p-10">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-blue-600/80 uppercase tracking-wider mb-3">
                      Topic #{index + 1}
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 group-hover:text-indigo-800 transition-colors duration-300">
                      {item.title}
                    </h2>
                    
                    <p className="text-lg leading-relaxed text-slate-700 mb-6">
                      {item.body}
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <ExternalLink className="h-4 w-4" />
                      <span>Source:</span>
                      <a 
                        href={`https://www.${item.source}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-indigo-600 font-semibold transition-colors duration-300 hover:underline"
                      >
                        {item.source}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* --- Enhanced Curiosity Section --- */}
        <section id="curiosity" className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/10 to-yellow-400/10 rounded-3xl blur-2xl transform scale-105"></div>
          
          <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 sm:p-12 text-center shadow-xl">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full shadow-lg">
                <Lightbulb className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                Did You Know?
              </h3>
            </div>
            
            <blockquote className="space-y-4">
              <p className="text-xl sm:text-2xl leading-relaxed text-slate-800 font-medium italic">
              {`"${newsletter.content.curiosity.text}"`}
              </p>
              <cite className="inline-block text-base font-semibold text-amber-800 not-italic">
                — {newsletter.content.curiosity.source}
              </cite>
            </blockquote>
          </div>
        </section>

        {/* --- Footer with Spacing --- */}
        <div className="mt-20">
          <Footer />
        </div>
      </main>
    </div>
  );
}