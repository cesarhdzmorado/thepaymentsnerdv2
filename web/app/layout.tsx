// web/app/layout.tsx

import type { Metadata } from "next";
// Step 1: Import the font from next/font
import { Inter } from "next/font/google";
import "./globals.css";

// Step 2: Initialize the font with the desired settings
// 'subsets' tells Next.js to only load the characters we need (e.g., Latin alphabet).
const inter = Inter({ subsets: ["latin"] });

// Your existing metadata
export const metadata: Metadata = {
  title: "/thepaymentsnerd - Daily Payments News",
  description: "Your daily briefing on the world of payments, fintech, and financial innovation, powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Step 3: Apply the font's className to the body tag */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}