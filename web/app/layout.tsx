// web/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google' // Import the fonts
import './globals.css'

// Set up the fonts with their corresponding CSS variables
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  weight: ['400', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: '/thepaymentsnerd',
  description: 'The signal, not the noise. Daily fintech intelligence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* 
        THIS IS THE MOST IMPORTANT PART:
        1. We pass the font variables to the entire HTML document.
        2. We apply the dark background 'bg-slate-900' to the body.
        3. We set the default text color to 'text-slate-300'.
      */}
      <body className={`${inter.variable} ${lexend.variable} font-sans bg-slate-900 text-slate-300`}>
        {children}
      </body>
    </html>
  )
}