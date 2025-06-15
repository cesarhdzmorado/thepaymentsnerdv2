// web/app/page.tsx

import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

// NEW: Add metadata for the page title and description
export const metadata: Metadata = {
  title: '/thepaymentsnerd',
  description: 'Stay ahead in fintech. 5 minutes a day. Powered by AI nerds.',
};

// This defines the "shape" of our data for TypeScript
interface NewsItem {
  title: string;
  body: string;
  source: string; // The data still exists, we just won't display it
}

interface Curiosity {
  text: string;
  source: string; // The data still exists, we just won't display it
}

interface NewsletterData {
  news: NewsItem[];
  curiosity: Curiosity;
}

// This function runs on the server when the site is built.
async function getNewsletterData(): Promise<NewsletterData | null> {
  const filePath = path.join(process.cwd(), 'public', 'newsletter.json');
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Could not read or parse newsletter data:", error);
    return null;
  }
}

// This is our main page component
export default async function HomePage() {
  const data = await getNewsletterData();

  if (!data) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-4">/thepaymentsnerd</h1>
        <p className="text-lg text-red-600">
          The newsletter data file (`web/public/newsletter.json`) was not found.
        </p>
        <p className="mt-2">
          Please run the AI script first by opening a new terminal and running `python -m ai.src.main` from the root directory.
        </p>
      </main>
    )
  }

  const { news, curiosity } = data;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <header className="text-center mb-12">
            {/* CHANGED: Title and punchy subtitle */}
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">/thepaymentsnerd</h1>
            <p className="mt-2 text-xl text-gray-500">Stay ahead in fintech. 5 minutes a day.</p>
          </header>

          <section>
            {/* CHANGED: Section title */}
            <h2 className="text-3xl font-bold border-b-2 border-blue-600 pb-2 mb-6">5 things you need to know today</h2>
            <div className="space-y-8">
              {news.map((item, index) => (
                <article key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.body}</p>
                  {/* REMOVED: The source link */}
                </article>
              ))}
            </div>
          </section>

          <section className="mt-16">
            {/* CHANGED: Section title */}
            <h2 className="text-3xl font-bold border-b-2 border-green-600 pb-2 mb-6">Interesting Fact of the Day</h2>
              <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-6 rounded-r-lg shadow-md">
                <p className="text-lg italic">"{curiosity.text}"</p>
                {/* REMOVED: The source link */}
              </div>
          </section>
        </div>
      </main>

      {/* NEW: Added a professional footer */}
      <footer className="w-full bg-white mt-24 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-gray-900 hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 hover:underline">Legal Terms</a>
            <a href="#" className="hover:text-gray-900 hover:underline">Cookies Policy</a>
          </div>
          <p>© {new Date().getFullYear()} thepaymentsnerd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
