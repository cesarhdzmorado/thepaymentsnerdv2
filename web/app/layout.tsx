// web/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Imports the Tailwind foundation

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "/thepaymentsnerd",
  description: "The signal, not the noise. Daily fintech intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // THE FIX: We apply the theme classes to the <html> tag itself.
    // This is the highest level possible and will not be overridden.
    <html lang="en" className="bg-slate-900 text-slate-300">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}