// web/components/NavigationBar.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CompactLogo } from './CompactLogo'; // Import the NEW compact logo

export function NavigationBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the nav bar only after scrolling down 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
        }
        bg-slate-50/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm
      `}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:p-12">
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label="Back to homepage">
            <CompactLogo />
          </Link>
          <div>
            {/* Future "Subscribe" button can go here */}
          </div>
        </div>
      </div>
    </nav>
  );
}