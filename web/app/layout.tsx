// web/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavigationBar } from "@/components/NavigationBar"; // Just import the Nav Bar
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <NavigationBar /> {/* Render the self-contained NavigationBar */}
        <main>{children}</main>
      </body>
    </html>
  );
}