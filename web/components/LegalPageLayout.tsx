// components/LegalPageLayout.tsx
import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';

interface LegalPageLayoutProps {
  title: string;
  children: ReactNode; // 'children' will be the content of our page
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased">
      <main className="max-w-3xl mx-auto p-4 sm:p-8">
        <header className="text-center mb-12">
          {/* We'll reuse our existing Logo component for consistency */}
          <div className="inline-block">
             <a href="/" aria-label="Back to homepage">
                <Logo />
             </a>
          </div>
        </header>
        
        <article className="text-slate-700">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">{title}</h1>
          {children}
        </article>

        {/* We'll reuse our existing Footer component */}
        <Footer />
      </main>
    </div>
  );
}