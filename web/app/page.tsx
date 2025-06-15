// web/app/page.tsx

import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '/thepaymentsnerd',
  description: 'The signal, not the noise. Daily fintech intelligence.',
};

// --- Helper: Icon Components ---
const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-3 text-blue-400"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z"/><path d="M15 2v20"/><path d="M8 7h5"/><path d="M8 12h5"/><path d="M8 17h5"/></svg>
);
const FactIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-3 text-green-400"><path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M12 21a9 9 0 0 0 0-18H6.5a1 1 0 0 0 0 2H12a7 7 0 0 1 0 14h-3a1 1 0 0 0 0 2h3Z"/></svg>
);
// NEW: A calendar icon for the date
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);


// --- Data Fetching Logic (unchanged) ---
interface NewsItem { title: string; body: string; source: string; }
interface Curiosity { text: string; source: string; }
interface NewsletterData { news: NewsItem[]; curiosity: Curiosity; }

async function getNewsletterData(): Promise<NewsletterData | null> {
  const filePath = path.join(process.cwd(), 'public', 'newsletter.json');
  if (!fs.existsSync(filePath)) { return null; }
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Could not read or parse newsletter data:", error);
    return null;
  }
}

// --- Main Page Component ---
export default async function HomePage() {
  const data = await getNewsletterData();
  
  // NEW: Get and format today's date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!data) {
    // ... (error message code is unchanged)
    return (
      <main className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4">/thepaymentsnerd</h1>
          <p className="text-lg text-red-500">
            The newsletter data file (`web/public/newsletter.json`) was not found.
          </p>
          <p className="mt-2 text-slate-400">
            Please run the AI script first to generate the daily news.
          </p>
        </div>
      </main>
    )
  }

  const { news, curiosity } = data;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-300">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
          
          <header className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              /thepaymentsnerd
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-xl mx-auto italic">
              The signal, not the noise. Daily fintech intelligence.
            </p>

            {/* NEW: Today's date display */}
            <div className="mt-8 flex justify-center items-center gap-x-2">
              <CalendarIcon />
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                {formattedDate}
              </p>
            </div>
          </header>

          {/* ... (The rest of the news and fact sections are unchanged) ... */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white flex items-center border-b border-slate-700 pb-4 mb-8">
              <NewsIcon />
              5 things you need to know today
            </h2>
            <div className="space-y-6">
              {news.map((item, index) => (
                <article 
                  key={index} 
                  className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors duration-300"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white flex items-center border-b border-slate-700 pb-4 mb-8">
              <FactIcon />
              Interesting fact of the day
            </h2>
            <div className="bg-gradient-to-br from-green-500/10 to-slate-800/10 p-6 rounded-xl border border-slate-700 ring-1 ring-inset ring-green-500/20">
              <p className="text-lg italic text-green-300">
                “{curiosity.text}”
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* ... (Footer is unchanged) ... */}
      <footer className="w-full mt-24 py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
            <a href="#" className="hover:text-slate-300 hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 hover:underline">Legal Terms</a>
            <a href="#" className="hover:text-slate-300 hover:underline">Cookies Policy</a>
            <a href="https://github.com/cesarhdzmorado/thepaymentsnerdv2" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 hover:underline">Repository</a>
          </div>
          <p>© {new Date().getFullYear()} thepaymentsnerd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}