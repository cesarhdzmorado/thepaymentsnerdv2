// web/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    // This wildcard pattern is essential for scanning all your pages
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config