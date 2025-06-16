// web/app/page.tsx

import { supabase } from '@/lib/supabaseClient'; // Using the '@/' alias we set up!

// --- Define TypeScript types for our data ---
// This gives us autocompletion and type safety.
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
// This is a Server Component, so we can make it async and fetch data directly.
async function getLatestNewsletter(): Promise<Newsletter | null> {
  // Fetch from the 'newsletters' table, order by date descending, and get the first one.
  const { data, error } = await supabase
    .from('newsletters')
    .select('publication_date, content')
    .order('publication_date', { ascending: false })
    .limit(1)
    .single(); // .single() returns one object instead of an array of one

  if (error || !data) {
    console.error("Error fetching newsletter:", error?.message);
    return null; // Return null if there's an error or no data
  }

  return data as Newsletter;
}

// --- The Main Page Component ---
export default async function HomePage() {
  // Set revalidate to force Next.js to check for new data periodically (e.g., every 5 minutes).
  // This is called Incremental Static Regeneration (ISR).
  // Your site is static and fast, but updates automatically in the background.
  // When you redeploy on Vercel, it also forces a revalidation.
  // For frequent updates, you can lower this number. For daily, 3600 (1 hour) is fine.
  // To test changes immediately in development, just refresh the page.
  // NOTE: Next.js may cache aggressively in `dev` mode. Do a hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
  // if you don't see changes after uploading new data and refreshing.
  
  // As of Next.js 14, to opt into dynamic rendering for a page, you can export `revalidate`
  // or use `unstable_noStore` from 'next/cache' within your fetching function.
  // For simplicity, we rely on the default behavior and manual redeployment for now.
  
  const newsletter = await getLatestNewsletter();

  // If no newsletter is found, show a fallback message.
  if (!newsletter) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-50 text-slate-800">
        <h1 className="text-4xl font-bold mb-4">The Payments Nerd</h1>
        <p className="text-lg text-slate-600">No newsletter available. Please check back later.</p>
      </main>
    );
  }

  // Format the date for display
  const formattedDate = new Date(newsletter.publication_date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-slate-50 font-sans text-slate-800">
      <main className="max-w-3xl mx-auto p-4 sm:p-8">
        <header className="text-center border-b-2 border-slate-200 pb-8 mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            The Payments Nerd
          </h1>
          <p className="mt-4 text-lg text-slate-500">{formattedDate}</p>
        </header>

        <section id="news-items" className="space-y-8">
          {newsletter.content.news.map((item, index) => (
            <article key={index} className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h2>
              <p className="text-base leading-relaxed mb-4">{item.body}</p>
              <p className="text-sm font-medium text-slate-500">
                Source: <a href={`https://www.${item.source}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.source}</a>
              </p>
            </article>
          ))}
        </section>

        <section id="curiosity" className="mt-12 bg-blue-100 text-blue-900 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold mb-2">Did You Know?</h3>
          <p className="italic">"{newsletter.content.curiosity.text}"</p>
          <p className="text-sm text-right mt-2 font-medium">
            Source: <span className="text-blue-700">{newsletter.content.curiosity.source}</span>
          </p>
        </section>

        <footer className="mt-12 pt-8 border-t-2 border-slate-200 text-center text-slate-500">
          <p>© {new Date().getFullYear()} The Payments Nerd. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}