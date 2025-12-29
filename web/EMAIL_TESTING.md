# 📧 Email Newsletter Testing Guide

This guide will help you test the new daily newsletter email template.

## 🎨 Method 1: Preview in Browser (Instant)

The fastest way to see how the email looks:

```bash
cd web
npx tsx scripts/previewEmail.ts
```

This creates `email-preview.html` in the web directory. Open it in your browser to see the full design with sample data.

**✅ Already generated!** Open this file now:
```
/home/user/thepaymentsnerdv2/web/email-preview.html
```

## 📨 Method 2: Send Test Email to Yourself

### Setup

1. Add this to your `.env.local` file:
   ```env
   TEST_EMAIL_SECRET=your-secret-test-token-here
   ```

2. Make sure you have these existing variables:
   ```env
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=your-sender-email@example.com
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
   ```

### Send Test Email

Start your development server:
```bash
npm run dev
```

Then make a GET request:
```bash
curl "http://localhost:3000/api/test-email?to=YOUR_EMAIL@example.com&secret=your-secret-test-token-here"
```

Or visit in your browser:
```
http://localhost:3000/api/test-email?to=YOUR_EMAIL@example.com&secret=your-secret-test-token-here
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test email sent to your@email.com",
  "emailId": "...",
  "newsletter": {
    "date": "2025-12-29",
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

When testing, verify:

- ✅ Logo displays correctly with gradient
- ✅ Date badge shows the correct date with calendar icon
- ✅ All 5 news items appear with:
  - Blue gradient book icons
  - "TOPIC #1" badges
  - Titles, body text, and sources
- ✅ "Did You Know?" section with lightbulb icon
- ✅ Footer with unsubscribe link
- ✅ Responsive design (test on mobile and desktop)
- ✅ Works in different email clients:
  - Gmail
  - Outlook
  - Apple Mail
  - Mobile email apps

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
