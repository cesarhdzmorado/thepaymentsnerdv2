// web/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // This tells Tailwind to scan all these files for class names.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // This line is crucial for the 'prose' classes to work.
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config