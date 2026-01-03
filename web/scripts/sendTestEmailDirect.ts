/**
 * Direct Test Email Script
 *
 * Sends a test email using sample newsletter data without needing database access
 *
 * Usage: npx tsx scripts/sendTestEmailDirect.ts [email@example.com]
 */

import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
const envPath = path.join(__dirname, "..", ".env.local");
console.log("🔍 Debug Info:");
console.log(`   __dirname: ${__dirname}`);
console.log(`   Trying to load .env from: ${envPath}`);

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.log(`   ❌ Error loading .env: ${result.error.message}`);
} else {
  console.log(`   ✅ .env file loaded successfully`);
}

console.log(`   RESEND_API_KEY found: ${process.env.RESEND_API_KEY ? 'YES' : 'NO'}`);
console.log(`   EMAIL_FROM found: ${process.env.EMAIL_FROM ? 'YES' : 'NO'}`);
console.log("");

import { Resend } from "resend";
import { generateDailyNewsletterEmail, generateEmailSubject } from "../lib/emailTemplate";

const TEST_EMAIL = process.argv[2] || "cesc_haz@hotmail.es";
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const EMAIL_FROM = process.env.EMAIL_FROM!;

// Sample newsletter data
const sampleNewsletter = {
  publicationDate: new Date().toISOString().split('T')[0],
  intro: "Three infrastructure announcements today, and they're all saying the same thing: payments is becoming a feature, not a product.",
  perspective: "Every major player is betting that embedded payments will replace standalone payment products. The question isn't whether this happens, but how fast — and who gets left behind.",
  news: [
    {
      title: "PayPal Launches New Cross-Border Payment Solution for SMEs",
      body: "PayPal has unveiled a new service aimed at small and medium enterprises, reducing cross-border transaction fees by 30%. The platform now supports instant settlements in over 100 currencies, marking a significant step in democratizing global commerce.",
      source: "https://pymnts.com"
    },
    {
      title: "Central Bank Digital Currencies Gain Momentum in Asia-Pacific",
      body: "Five major economies in the Asia-Pacific region announced collaborative efforts to develop interoperable CBDC frameworks. The initiative aims to streamline cross-border transactions and reduce settlement times from days to seconds.",
      source: "https://finextra.com"
    },
    {
      title: "Visa Reports 23% Growth in Contactless Payment Adoption",
      body: "Visa's Q4 earnings revealed a substantial increase in contactless transactions, with tap-to-pay now representing 65% of all in-person card payments globally. The surge is attributed to enhanced security features and consumer preference for speed.",
      source: "https://financialtimes.com"
    },
    {
      title: "Buy Now Pay Later Market Faces New Regulatory Scrutiny",
      body: "Regulators in the UK and EU are proposing stricter guidelines for BNPL providers, including mandatory credit checks and transparent fee disclosures. Industry leaders anticipate compliance costs but welcome standardization.",
      source: "https://finextra.com"
    },
    {
      title: "Blockchain Payment Network Achieves 50,000 Transactions Per Second",
      body: "A new layer-2 blockchain solution demonstrated unprecedented transaction throughput in live testing, positioning itself as a viable alternative to traditional payment rails. Major financial institutions are reportedly exploring integration.",
      source: "https://coindesk.com"
    }
  ],
  curiosity: {
    text: "The first credit card was introduced in 1950 by Diners Club and could only be used at 27 restaurants in New York City. Today, there are over 2.8 billion credit cards in circulation worldwide.",
    source: "https://example.com/financial-history"
  },
  unsubscribeUrl: "https://www.thepaymentsnerd.co/unsubscribe?token=test",
  referralCode: "TESTCODE123"
};

async function sendTestEmail() {
  try {
    console.log(`📧 Sending test email to: ${TEST_EMAIL}`);
    console.log("");

    // Generate email HTML
    const emailHtml = await generateDailyNewsletterEmail(sampleNewsletter);
    const emailSubject = generateEmailSubject(sampleNewsletter.news);

    // Send email
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: `The Payments Nerd <${EMAIL_FROM}>`,
      to: TEST_EMAIL,
      subject: `[TEST] ${emailSubject}`,
      html: emailHtml,
    });

    if (result.data?.id) {
      console.log("✅ Test email sent successfully!");
      console.log(`📬 Email ID: ${result.data.id}`);
      console.log(`📮 Sent to: ${TEST_EMAIL}`);
      console.log(`📋 Subject: [TEST] ${emailSubject}`);
    } else if (result.error) {
      console.error("❌ Error sending email:", result.error.message);
      process.exit(1);
    }
  } catch (error: any) {
    console.error("❌ Failed to send test email:", error.message);
    process.exit(1);
  }
}

sendTestEmail();
