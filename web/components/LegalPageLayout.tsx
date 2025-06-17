// web/components/LegalPageLayout.tsx
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { MoveLeft } from 'lucide-react'; // <-- Step 1: Import the icon

interface LegalPageLayoutProps {
  title: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased">
      <main className="max-w-3xl mx-auto p-4 sm:p-8">
        <header className="text-center mb-8"> {/* Adjusted margin bottom */}
          <div className="inline-block">
            <Link href="/" aria-label="Back to homepage">
              <Logo />
            </Link>
          </div>
        </header>
        
        {/* --- Step 2: Add the "Back to Home" link here --- */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
          >
            <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to main page</span>
          </Link>
        </div>
        {/* ------------------------------------------- */}

        <article className="text-slate-700">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">{title}</h1>
          {children}
        </article>

        <Footer />
      </main>
    </div>
  );
}