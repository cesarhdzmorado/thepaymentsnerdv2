// web/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // We define 'sans' as our body font and 'heading' for titles.
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-lexend)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config