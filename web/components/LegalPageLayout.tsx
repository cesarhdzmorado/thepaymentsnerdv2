// web/components/LegalPageLayout.tsx
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';
import { Footer } from '@/components/Footer';
import { MoveLeft } from 'lucide-react';

interface LegalPageLayoutProps {
  title: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
      {/* Background grid + soft glow (matching main page) */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-grid-pattern opacity-35 dark:opacity-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 -z-30 glow-bg"
        aria-hidden="true"
      />

      <main className="relative max-w-3xl mx-auto p-4 sm:p-8">
        <header className="text-center mb-8">
          <div className="inline-block">
            <Link href="/" aria-label="Back to homepage">
              <Logo />
            </Link>
          </div>
        </header>

        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted hover:text-[var(--foreground)] transition-colors group"
          >
            <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to main page</span>
          </Link>
        </div>

        <article className="card-surface p-6 sm:p-10 text-[var(--foreground)]">
          <h1 className="text-3xl font-extrabold text-[var(--foreground)] mb-6">{title}</h1>
          <div className="prose-legal">
            {children}
          </div>
        </article>

        <div className="mt-12">
          <Footer />
        </div>
      </main>
    </div>
  );
}
