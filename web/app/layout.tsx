// web/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavigationBar } from "@/components/NavigationBar";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "/thepaymentsnerd - Daily Payments News",
  description:
    "Your daily briefing on the world of payments, fintech, and financial innovation, powered by AI.",
  openGraph: {
    title: "/thepaymentsnerd - Daily Payments News",
    description:
      "Your daily briefing on the world of payments, fintech, and financial innovation, powered by AI.",
    url: "https://thepaymentsnerd.com",
    siteName: "/thepaymentsnerd",
    type: "website",
    images: [
      {
        url: "https://thepaymentsnerd.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "/thepaymentsnerd - Daily Payments News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "/thepaymentsnerd - Daily Payments News",
    description:
      "Your daily briefing on the world of payments, fintech, and financial innovation, powered by AI.",
    images: ["https://thepaymentsnerd.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={[
          inter.className,
          "min-h-screen antialiased",
          // force the entire app to respect your CSS variables in globals.css
          "bg-[var(--background)] text-[var(--foreground)]",
        ].join(" ")}
      >
        <div className="min-h-screen">
          <NavigationBar />

          {/* Give the page a consistent padded container */}
          <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
