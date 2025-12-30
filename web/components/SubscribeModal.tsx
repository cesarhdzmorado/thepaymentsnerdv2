"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SubscribeForm } from "./SubscribeForm";

export function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already seen the modal this session
    const hasSeenModal = sessionStorage.getItem("subscribeModalShown");

    if (!hasSeenModal && !hasShown) {
      // Show modal after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("subscribeModalShown", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasShown]);

  const closeModal = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 z-10"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>

          {/* Content */}
          <div className="p-6">
            <SubscribeForm source="modal_popup" />
          </div>
        </div>
      </div>
    </>
  );
}

// Add button component for manual trigger
export function SubscribeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-cyan-500 dark:to-indigo-500 dark:hover:from-cyan-600 dark:hover:to-indigo-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
      >
        Subscribe to Newsletter
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl pointer-events-auto animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 z-10"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>

              {/* Content */}
              <div className="p-6">
                <SubscribeForm source="subscribe_button" />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
