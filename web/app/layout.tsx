// web/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      {/* 
        This is the FIX. We apply the global dark theme to the body tag.
        Every page will inherit this, guaranteeing a consistent look.
      */}
      <body className={`${inter.className} bg-slate-900 text-slate-300`}>
        {children}
      </body>
    </html>
  );
}