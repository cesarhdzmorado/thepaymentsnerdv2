'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonClasses, cardClasses } from './ui';

interface NewsletterNavigationProps {
  prevDate: string | null;
  nextDate: string | null;
  currentDate: string;
  position?: 'top' | 'bottom';
}

export function NewsletterNavigation({
  prevDate,
  nextDate,
  currentDate,
  position = 'bottom',
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
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

  const showTodayButton = todayLocal !== null && currentDate !== todayLocal;
  const hasControls = Boolean(prevDate || nextDate || showTodayButton);

  if (!hasControls && position === 'top') {
    return null;
  }

  return (
    <div className={position === 'top' ? 'mb-10' : 'mt-14'}>
      {hasControls && (
        <nav
          className={cardClasses({
            className:
              'mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 p-3',
          })}
          aria-label="Newsletter archive navigation"
        >
          <div className="flex items-center gap-2">
            {prevDate ? (
              <button
                onClick={() => router.push(`/?date=${prevDate}`)}
                className={buttonClasses({ variant: 'secondary', size: 'sm' })}
                aria-label="Previous day's newsletter"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{formatDateLabel(prevDate)}</span>
              </button>
            ) : (
              <span className="px-2 text-xs text-slate-400 dark:text-slate-600">
                Start
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showTodayButton && (
              <button
                onClick={() => router.push('/')}
                className={buttonClasses({ variant: 'ghost', size: 'sm' })}
              >
                Today
              </button>
            )}

            {nextDate ? (
              <button
                onClick={() => router.push(`/?date=${nextDate}`)}
                className={buttonClasses({ variant: 'secondary', size: 'sm' })}
                aria-label="Next day's newsletter"
              >
                <span>{formatDateLabel(nextDate)}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <span className="px-2 text-xs text-slate-400 dark:text-slate-600">
                Latest
              </span>
            )}
          </div>
        </nav>
      )}

      {position === 'bottom' && hasControls && (
        <p className="mt-3 text-center text-xs text-muted">
          Tip: Use ← → arrow keys to navigate the archive
        </p>
      )}
    </div>
  );
}
