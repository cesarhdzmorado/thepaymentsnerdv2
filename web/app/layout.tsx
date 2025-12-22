// web/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavigationBar } from "@/components/NavigationBar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "/thepaymentsnerd - Daily Payments News",
  description:
    "Your daily briefing on the world of payments, fintech, and financial innovation, powered by AI.",
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
      </body>
    </html>
  );
}
