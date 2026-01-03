# Quick Fix: Test Email API

## Issue
The `/api/test-email` endpoint doesn't work in the browser because it requires a secret parameter.

## Solution 1: Add Secret to URL (Quick)

**Step 1:** Add this to your `.env.local` file:
```bash
TEST_EMAIL_SECRET=test123
```

**Step 2:** Use this URL in your browser:
```
https://thepaymentsnerd.co/api/test-email?to=your@icloud.com&secret=test123
```

Replace `your@icloud.com` with your actual iCloud email address.

---

## Solution 2: Use curl (Recommended)

```bash
curl "https://thepaymentsnerd.co/api/test-email?to=your@icloud.com&secret=test123"
```

---

## Solution 3: Simpler Test Endpoint (No Secret Required)

If you want a version without authentication for local testing only, I can create a separate endpoint:

`/api/test-email-simple?to=your@icloud.com`

This would only work in development mode (not production).

---

## Current Test Email API Requirements

The endpoint at `web/app/api/test-email/route.ts` requires:

1. **`to` parameter** - Your email address (must be valid email format)
2. **`secret` parameter** - Must match `TEST_EMAIL_SECRET` environment variable

**Example URL:**
```
https://thepaymentsnerd.co/api/test-email?to=cesar@icloud.com&secret=test123
```

**Security Note:** The secret prevents unauthorized users from sending test emails using your Resend quota.

---

## Alternative: Test via Resend Dashboard

**Easiest method** (no code needed):

1. Go to: https://resend.com/emails
2. Click "Send Email" or "Create Email"
3. Fill in:
   - **From:** `The Payments Nerd <newsletter@thepaymentsnerd.co>`
   - **To:** Your @icloud.com email
   - **Subject:** `Test Email - iCloud Delivery`
   - **Body:** Choose "HTML" and paste any HTML content (or use their template)
4. Click "Send"
5. Check your iCloud inbox within 1-2 minutes

This bypasses your app completely and tests Resend → iCloud delivery directly.

---

## Which Method Should You Use?

### Use Resend Dashboard if:
- ✅ You just want to test if iCloud delivery works
- ✅ You've set up DNS records and want quick verification
- ✅ You don't need the actual newsletter template

### Use curl/browser with secret if:
- ✅ You want to test the actual newsletter HTML template
- ✅ You want to see exactly what subscribers receive
- ✅ You're comfortable adding the secret to .env

### Want me to create a simple version if:
- ✅ You want to test frequently without typing the secret
- ✅ You're only testing in development (not production)

Let me know which you prefer!
