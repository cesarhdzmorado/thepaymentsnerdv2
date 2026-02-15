'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsletterNavigationProps {
  prevDate: string | null;
  nextDate: string | null;
  currentDate: string;
}

export function NewsletterNavigation({
  prevDate,
  nextDate,
  currentDate,
}: NewsletterNavigationProps) {
  const router = useRouter();
  const [todayLocal, setTodayLocal] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setTodayLocal(`${year}-${month}-${day}`);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft' && prevDate) {
        router.push(`/?date=${prevDate}`);
      } else if (e.key === 'ArrowRight' && nextDate) {
        router.push(`/?date=${nextDate}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevDate, nextDate, router]);

  const formatDateLabel = (date: string) => {
    const d = new Date(`${date}T00:00:00`);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Previous Day Arrow */}
      {prevDate && (
        <button
          onClick={() => router.push(`/?date=${prevDate}`)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50
                     group flex items-center gap-2 px-4 py-3
                     card-surface hover:scale-105
                     transition-all duration-300 ease-out
                     hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     animate-fade-in"
          aria-label="Previous day's newsletter"
        >
          <ChevronLeft className="h-6 w-6 text-blue-600 dark:text-cyan-300
                                  group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="hidden md:block text-sm font-semibold text-muted">
            {formatDateLabel(prevDate)}
          </span>
        </button>
      )}

      {/* Next Day Arrow */}
      {nextDate && (
        <button
          onClick={() => router.push(`/?date=${nextDate}`)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50
                     group flex items-center gap-2 px-4 py-3
                     card-surface hover:scale-105
                     transition-all duration-300 ease-out
                     hover:shadow-xl
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     animate-fade-in"
          aria-label="Next day's newsletter"
        >
          <span className="hidden md:block text-sm font-semibold text-muted">
            {formatDateLabel(nextDate)}
          </span>
          <ChevronRight className="h-6 w-6 text-blue-600 dark:text-cyan-300
                                   group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      )}

      {/* Mobile: Show "Today" button if viewing past newsletter */}
      {todayLocal !== null && currentDate !== todayLocal && (
        <button
          onClick={() => router.push('/')}
          className="fixed bottom-24 right-4 z-50
                     px-4 py-2 text-sm font-semibold
                     card-surface hover:scale-105
                     transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     md:hidden"
        >
          Today
        </button>
      )}

      {/* Keyboard hint (desktop only) */}
      <div className="hidden lg:block fixed bottom-8 left-1/2 -translate-x-1/2 z-40
                      px-4 py-2 text-xs text-muted
                      card-surface opacity-60 hover:opacity-100 transition-opacity">
        Use ← → arrow keys to navigate
      </div>
    </>
  );
}
