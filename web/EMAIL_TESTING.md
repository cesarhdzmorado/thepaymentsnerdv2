# 📧 Email Newsletter Testing Guide

This guide will help you test the new daily newsletter email template with the referral system and updated signature.

## ✨ What's New

Your newsletter now includes:
- ✅ **New Signature**: "Made with ❤️ for the payments community" by Cesar Hernandez (with LinkedIn link)
- ✅ **Referral Section**: "Share the Nerd's take" with personalized referral links
- ✅ **Gamification**: "Your payments friends get smarter, you get rewarded. Win-win."
- ✅ **Social Sharing**: X and LinkedIn logos with referral tracking

## 🎨 Method 1: Preview in Browser (Instant - Recommended)

The fastest way to see how the email looks:

```bash
npm run email:preview
```

This creates `email-preview.html` in the web directory. Open it in your browser to see the full design with sample data.

**✅ Already generated!** Open this file now:
```
/home/user/thepaymentsnerdv2/web/email-preview.html
```

## 📨 Method 2: Send Test Email to Yourself (Easy)

✅ **Environment already configured!** All required variables are in `.env.local`

### Quick Send

Send a test email with sample newsletter data:

```bash
# Send to default email (cesc_haz@hotmail.es)
npm run email:test

# Or specify a different email
npm run email:test your.email@example.com
```

This script (`scripts/sendTestEmailDirect.ts`) uses sample data and doesn't require the database.

### Alternative: Test via API (Requires Newsletter in Database)

If you have newsletters in your Supabase database:

```bash
# Start dev server
npm run dev

# In another terminal, send test email
npm run email:test:api

# Or to a different email
./scripts/sendTestEmail.sh your.email@example.com
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test email sent to your@email.com",
  "emailId": "...",
  "newsletter": {
    "date": "2026-01-03",
    "newsCount": 5
  }
}
```

## 🚀 Method 3: Test Production Daily Send

This tests the actual cron job that sends to all subscribers:

### Setup

Make sure your `.env.local` has:
```env
CRON_SECRET=your-cron-secret-token
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your-sender-email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUBSCRIBE_TOKEN_SECRET=your-subscribe-token-secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
```

### Test the Daily Send

1. **Subscribe yourself first** (if not already subscribed):
   - Visit your website
   - Enter your email in the subscribe form
   - Confirm your subscription via the email link

2. **Trigger the daily send manually**:
   ```bash
   curl -H "Authorization: Bearer your-cron-secret-token" \
        http://localhost:3000/api/send-daily
   ```

**Expected Response:**
```json
{
  "ok": true,
  "sent": 1
}
```

Check your inbox! 🎉

## 🔍 What to Check in the Email

When testing, verify the **new features**:

- ✅ **New Signature Section**:
  - "Made with ❤️ for the payments community"
  - "by Cesar Hernandez" with LinkedIn link to https://www.linkedin.com/in/cesarhernandezm
- ✅ **Share the Nerd's take Section**:
  - Heading: "Share the Nerd's take"
  - Subtext: "Your payments friends get smarter, you get rewarded. Win-win."
  - Incentive text about unlocking exclusive content
  - Personalized referral link (e.g., https://www.thepaymentsnerd.co/subscribe?ref=TESTCODE123)
  - X and LinkedIn logo buttons (⚠️ will show broken images until you add logo files)
- ✅ All 5 news items with titles, body text, and sources
- ✅ "Did You Know?" section
- ✅ Footer with unsubscribe link
- ✅ Responsive design (test on mobile and desktop)

## ⚠️ Important: Logo Images

The X and LinkedIn logos won't display until you add the image files:

1. **Download logos:**
   - X Logo: https://about.twitter.com/en/who-we-are/brand-toolkit
   - LinkedIn Logo: https://brand.linkedin.com/downloads

2. **Save as (32x32px):**
   - `web/public/images/x-logo.png`
   - `web/public/images/linkedin-logo.png`

3. **Deploy to production**

The emails reference these URLs:
- `https://www.thepaymentsnerd.co/images/x-logo.png`
- `https://www.thepaymentsnerd.co/images/linkedin-logo.png`

## 🎯 Online Email Testing Tools

For comprehensive email client testing, use these free tools:

1. **PutsMail** (https://putsmail.com/tests/new)
   - Paste your HTML
   - Send to your email
   - Free and simple

2. **Litmus** (https://litmus.com/)
   - Professional email testing
   - See previews in 90+ email clients
   - Free trial available

3. **Email on Acid** (https://www.emailonacid.com/)
   - Comprehensive testing
   - Spam filter testing
   - Free trial available

## 🐛 Troubleshooting

### Email not sending?
- Check your Resend API key is valid
- Verify EMAIL_FROM is authorized in Resend
- Check Resend dashboard for error logs

### Email looks broken?
- Some email clients strip CSS - this is normal
- The template uses table-based layout for maximum compatibility
- Test in multiple clients to ensure broad support

### Newsletter not found?
- Make sure you've run the AI pipeline at least once
- Check if newsletter.json exists in /web/public/
- Verify the newsletter was synced to Supabase

## 📊 Current Newsletter Data

The latest newsletter in your system:
- **Date:** 2025-12-29
- **News Items:** 5
- **Topics:** FASB digital assets, Rezolve blockchain, Coupang data breach, Stablecoins for cross-border payments, AI startup funding
- **Curiosity:** Global blockchain market growth

---

Happy testing! 🎉
