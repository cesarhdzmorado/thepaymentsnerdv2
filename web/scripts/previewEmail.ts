/**
 * Email Preview Utility
 *
 * This script generates a preview HTML file of the daily newsletter email
 * that you can open in a browser to see how it looks.
 *
 * Usage:
 *   npx tsx scripts/previewEmail.ts
 *
 * This will create a file called email-preview.html that you can open in your browser.
 */

import { generateDailyNewsletterEmail } from "../lib/emailTemplate";
import * as fs from "fs";
import * as path from "path";

// Sample newsletter data for preview
const sampleNewsletter = {
  publicationDate: "2025-12-29",
  news: [
    {
      title: "PayPal Launches New Cross-Border Payment Solution for SMEs",
      body: "PayPal has unveiled a new service aimed at small and medium enterprises, reducing cross-border transaction fees by 30%. The platform now supports instant settlements in over 100 currencies, marking a significant step in democratizing global commerce.",
      source: "pymnts.com"
    },
    {
      title: "Central Bank Digital Currencies Gain Momentum in Asia-Pacific",
      body: "Five major economies in the Asia-Pacific region announced collaborative efforts to develop interoperable CBDC frameworks. The initiative aims to streamline cross-border transactions and reduce settlement times from days to seconds.",
      source: "finextra.com"
    },
    {
      title: "Visa Reports 23% Growth in Contactless Payment Adoption",
      body: "Visa's Q4 earnings revealed a substantial increase in contactless transactions, with tap-to-pay now representing 65% of all in-person card payments globally. The surge is attributed to enhanced security features and consumer preference for speed.",
      source: "financialtimes.com"
    },
    {
      title: "Buy Now Pay Later Market Faces New Regulatory Scrutiny",
      body: "Regulators in the UK and EU are proposing stricter guidelines for BNPL providers, including mandatory credit checks and transparent fee disclosures. Industry leaders anticipate compliance costs but welcome standardization.",
      source: "finextra.com"
    },
    {
      title: "Blockchain Payment Network Achieves 50,000 Transactions Per Second",
      body: "A new layer-2 blockchain solution demonstrated unprecedented transaction throughput in live testing, positioning itself as a viable alternative to traditional payment rails. Major financial institutions are reportedly exploring integration.",
      source: "coindesk.com"
    }
  ],
  curiosity: {
    text: "The first credit card was introduced in 1950 by Diners Club and could only be used at 27 restaurants in New York City. Today, there are over 2.8 billion credit cards in circulation worldwide.",
    source: "Financial History Archives"
  },
  unsubscribeUrl: "https://example.com/unsubscribe?token=sample"
};

// Generate the email HTML
const emailHtml = generateDailyNewsletterEmail(sampleNewsletter);

// Write to file
const outputPath = path.join(__dirname, "..", "email-preview.html");
fs.writeFileSync(outputPath, emailHtml, "utf-8");

console.log("✅ Email preview generated successfully!");
console.log(`📧 Open this file in your browser: ${outputPath}`);
console.log("\nTip: You can also use online email testing tools like:");
console.log("  • https://putsmail.com/tests/new");
console.log("  • https://litmus.com/");
console.log("  • https://www.emailonacid.com/");
