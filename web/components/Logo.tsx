// web/components/Logo.tsx
// Brand wordmark with typewriter animation and light + dark gradients.

'use client';

import { useState, useEffect } from 'react';

export function Logo() {
  const fullText = '/thepaymentsnerd';
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip animation for reduced motion users
      setDisplayText(fullText);
      setShowCursor(false);
      setIsComplete(true);
      return;
    }

    // Typewriter effect
    let currentIndex = 0;
    const typingSpeed = 80; // milliseconds per character

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsComplete(true);

        // Keep cursor blinking for 2 more seconds, then hide
        setTimeout(() => {
          setShowCursor(false);
        }, 2000);
      }
    }, typingSpeed);

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530); // Standard cursor blink rate

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <h1
      className="
        font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter
        bg-clip-text text-transparent
        bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900
        dark:bg-gradient-to-r dark:from-slate-100 dark:via-cyan-200 dark:to-indigo-200
      "
    >
      {displayText}
      {!isComplete && (
        <span
          className={`
            inline-block w-[3px] h-[0.85em] ml-1 -mb-1
            bg-gradient-to-b from-blue-600 to-indigo-600
            dark:from-cyan-400 dark:to-indigo-400
            transition-opacity duration-100
            ${showCursor ? 'opacity-100' : 'opacity-0'}
          `}
          aria-hidden="true"
        />
      )}
    </h1>
  );
}
