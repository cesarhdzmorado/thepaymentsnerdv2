# Email System & Deliverability

Complete guide to email delivery, authentication, and compliance for The Payments Nerd newsletter.

## Overview

The newsletter uses **Resend** as the email service provider with custom domain authentication (`thepaymentsnerd.co`). The system implements industry-standard email authentication protocols (SPF, DKIM, DMARC) to ensure high deliverability, especially for strict providers like Apple iCloud Mail.

## Email Architecture

### Components

1. **Email Service:** Resend API
2. **Sending Domain:** `newsletter@thepaymentsnerd.co`
3. **Template Engine:** React Email components
4. **Delivery Trigger:** Vercel cron (daily at 7 AM UTC)
5. **Subscriber Database:** Supabase (PostgreSQL)
6. **Bounce Handling:** Resend webhooks

### Email Flow

```
Vercel Cron (7 AM UTC)
    ↓
/api/send-daily endpoint
    ↓
Fetch active subscribers from Supabase
    ↓
Render React Email template
    ↓
Send via Resend API
    ↓
Resend delivers with SPF/DKIM/DMARC
    ↓
Webhooks handle bounces/complaints
```

## Email Authentication Setup

To ensure deliverability (especially for Apple iCloud), you must configure email authentication.

### Required DNS Records

Add these records to your domain's DNS settings:

#### 1. SPF Record (Sender Policy Framework)

Validates that emails are sent from authorized servers.

```
Type: TXT
Name: @ (or root domain)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

#### 2. DKIM Record (DomainKeys Identified Mail)

Provides cryptographic authentication.

```
Type: TXT
Name: resend._domainkey
Value: [Provided by Resend - long cryptographic key]
TTL: 3600
```

**To get your DKIM key:**
1. Log into [Resend Dashboard](https://resend.com/domains)
2. Add or select `thepaymentsnerd.co`
3. Copy the DKIM value provided

#### 3. DMARC Record (Domain-based Message Authentication)

**Required for Apple iCloud delivery.**

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:newsletter@thepaymentsnerd.co; ruf=mailto:newsletter@thepaymentsnerd.co; fo=1
TTL: 3600
```

**DMARC Policy Levels:**
- `p=none` - Monitor only (recommended to start)
- `p=quarantine` - Send failing emails to spam
- `p=reject` - Reject failing emails entirely

**Best Practice:** Start with `p=none` and monitor DMARC reports for 1-2 weeks before upgrading to `p=quarantine` or `p=reject`.

#### 4. MX Record (for bounce handling)

```
Type: MX
Name: @ (or root domain)
Value: feedback-smtp.resend.com
Priority: 10
TTL: 3600
```

### Verifying DNS Configuration

After adding DNS records, verify propagation:

```bash
# Check DMARC
dig TXT _dmarc.thepaymentsnerd.co +short

# Check DKIM
dig TXT resend._domainkey.thepaymentsnerd.co +short

# Check SPF
dig TXT thepaymentsnerd.co +short

# Check MX
dig MX thepaymentsnerd.co +short
```

**Expected Results:**
- DMARC: `"v=DMARC1; p=none; ..."`
- DKIM: Long cryptographic key starting with `"k=rsa; p=..."`
- SPF: `"v=spf1 include:_spf.resend.com ~all"`
- MX: `10 feedback-smtp.resend.com.`

**DNS Propagation:** Can take up to 24 hours. Use [WhatsMyDNS](https://www.whatsmydns.net/) to check global propagation.

## Apple iCloud Compliance

Apple has strict requirements for email delivery to iCloud Mail (@icloud.com, @me.com, @mac.com).

### Requirements Checklist

| Requirement | Status | Implementation |
|------------|--------|----------------|
| **SPF Authentication** | ✅ | Configured via Resend |
| **DKIM Signature** | ✅ | Configured via Resend |
| **DMARC Policy** | ✅ | Manual DNS record |
| **DMARC Alignment** | ✅ | SPF/DKIM aligned with From: domain |
| **Opt-in Only** | ✅ | Double opt-in subscription flow |
| **Unsubscribe Link** | ✅ | List-Unsubscribe headers |
| **Consistent From** | ✅ | `newsletter@thepaymentsnerd.co` |
| **Reverse DNS** | ✅ | Managed by Resend |
| **RFC 5321/5322** | ✅ | Resend handles compliance |
| **Bounce Handling** | ✅ | Webhook integration |
| **Low Spam Rate** | ⚠️ | Monitor via Resend dashboard |

### Email Headers

The system includes all required headers for compliance:

```typescript
headers: {
  'X-Entity-Ref-ID': newsletter.publication_date,
  'List-Unsubscribe': `<https://thepaymentsnerd.co/api/unsubscribe?email=${email}&token=${token}>`,
  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
}
```

**Header Explanations:**
- `List-Unsubscribe`: One-click unsubscribe link (required by Gmail, Apple, etc.)
- `List-Unsubscribe-Post`: Enables one-click unsubscribe in email clients
- `X-Entity-Ref-ID`: Unique identifier for tracking

## Domain Verification (Resend)

### Step-by-Step Setup

#### 1. Access Resend Dashboard

1. Log into [Resend](https://resend.com/login)
2. Navigate to **Domains** (left sidebar)
3. Or go directly to: https://resend.com/domains

#### 2. Add Your Domain

**If domain is NOT listed:**
1. Click **"Add Domain"**
2. Enter: `thepaymentsnerd.co`
3. Click **"Add"**

**If domain shows "Pending" or "Failed":**
1. Click on `thepaymentsnerd.co`
2. Click **"View DNS Records"**

#### 3. Copy DNS Records

Resend will provide 3 DNS records:

1. **SPF (TXT)** - Authorizes Resend to send on your behalf
2. **DKIM (TXT)** - Cryptographic signature (unique long string)
3. **MX** - For bounce handling

**Keep this page open** while adding records to your DNS provider.

#### 4. Add Records to DNS Provider

**Common DNS Providers:**

**Vercel:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Domains → Manage DNS
3. Add each record

**Cloudflare:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select domain → DNS tab
3. Add records (set to "DNS only", not proxied)

**GoDaddy:**
1. Go to [GoDaddy Domains](https://dcc.godaddy.com/domains)
2. Manage DNS
3. Add records

**Not sure?** Check your domain registrar's documentation or use [WHOIS lookup](https://whois.domaintools.com/).

#### 5. Wait for Verification

- **Time:** 1-24 hours for DNS propagation
- **Status:** Check Resend dashboard for "Verified" badge
- **Verify manually:** Use `dig` commands above

#### 6. Add DMARC Record Manually

**Important:** Resend doesn't automatically add DMARC. You must add it manually:

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:newsletter@thepaymentsnerd.co
```

## Bounce Handling

The system uses Resend webhooks to handle bounces and complaints automatically.

### Webhook Configuration

**Endpoint:** `https://thepaymentsnerd.co/api/webhooks/resend`

**Configure in Resend:**
1. Go to [Resend Dashboard → Webhooks](https://resend.com/webhooks)
2. Click "Add Webhook"
3. Enter endpoint URL
4. Select events:
   - `email.bounced`
   - `email.complained`
   - `email.delivered` (optional)
5. Save and copy webhook secret
6. Add to `.env`:
   ```bash
   RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Bounce Types

**Hard Bounce:** Permanent failure
- Invalid email address
- Domain doesn't exist
- Mailbox disabled
- **Action:** Immediately mark as `bounced` and stop sending

**Soft Bounce:** Temporary failure
- Mailbox full
- Server temporarily down
- Message too large
- **Action:** Retry up to 3 times, then mark as `bounced`

### Implementation

See `web/app/api/webhooks/resend/route.ts` for webhook handler implementation.

## Testing Email Delivery

### 1. Test Email Endpoint

Send a test email to verify configuration:

```bash
# Start dev server
cd web
npm run dev

# Send test email
curl "http://localhost:3000/api/test-email?secret=YOUR_CRON_SECRET&to=your@email.com"
```

Replace:
- `YOUR_CRON_SECRET` with value from `.env`
- `your@email.com` with your test email

### 2. Preview Email Template

Generate HTML preview without sending:

```bash
cd web
npx tsx scripts/previewEmail.ts
```

This opens the email template in your browser.

### 3. Test iCloud Delivery

**Critical Test:** Send to Apple email addresses:

```bash
curl "http://localhost:3000/api/test-email?secret=YOUR_CRON_SECRET&to=yourname@icloud.com"
```

**Check:**
- Email arrives in inbox (not spam/junk)
- Headers show DKIM/SPF pass
- Unsubscribe link works

### 4. Check Email Headers

In Apple Mail or Gmail:
1. Open received email
2. View headers ("Show Original" in Gmail)
3. Look for:
   ```
   Authentication-Results: dkim=pass; spf=pass; dmarc=pass
   ```

If any show `fail`, review DNS configuration.

### 5. Monitor Resend Dashboard

Check [Resend Dashboard → Logs](https://resend.com/logs):
- Delivery rate
- Bounce rate
- Open rate (if tracking enabled)
- Error messages

## Troubleshooting

### Issue: Emails not sending

**Symptoms:** API returns errors, subscribers don't receive emails

**Solutions:**
1. Verify `RESEND_API_KEY` in `.env` is correct
2. Check domain is verified in Resend dashboard
3. Ensure `EMAIL_FROM` matches verified domain
4. Check Supabase has active subscribers:
   ```sql
   SELECT * FROM subscribers WHERE active = true AND confirmed = true;
   ```
5. Review Resend logs for specific errors

### Issue: Emails go to spam

**Symptoms:** Emails delivered but in spam/junk folder

**Solutions:**
1. Verify all DNS records are configured (SPF, DKIM, DMARC)
2. Check DMARC reports for alignment issues
3. Improve email content:
   - Remove spam trigger words
   - Maintain good text-to-image ratio
   - Include plain text version
4. Warm up domain (send to engaged users first)
5. Ask subscribers to mark as "Not Spam"

### Issue: iCloud bounces

**Symptoms:** `@icloud.com`, `@me.com`, `@mac.com` addresses bounce

**Solutions:**
1. Verify DMARC record exists and is valid
2. Ensure SPF/DKIM alignment with From: domain
3. Check Resend domain status is "Verified"
4. Wait 24-48 hours after DNS changes
5. Test with `dig` commands to verify DNS propagation
6. Contact Resend support if issue persists

### Issue: DNS records not propagating

**Symptoms:** `dig` commands return empty or old values

**Solutions:**
1. Wait up to 24 hours for global propagation
2. Use [WhatsMyDNS](https://www.whatsmydns.net/) to check multiple locations
3. Clear local DNS cache:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

   # Windows
   ipconfig /flushdns

   # Linux
   sudo systemd-resolve --flush-caches
   ```
4. Verify records are added to correct domain/subdomain
5. Check for typos in DNS values

### Issue: High bounce rate

**Symptoms:** More than 5% of emails bouncing

**Solutions:**
1. Enable webhook bounce handling
2. Remove invalid emails immediately
3. Implement double opt-in (already done)
4. Clean inactive subscribers (6+ months)
5. Validate email format before adding to database
6. Monitor soft bounce patterns

## DMARC Reports

After adding DMARC record, you'll receive daily aggregate reports at `newsletter@thepaymentsnerd.co`.

### Reading DMARC Reports

Reports are XML files showing:
- Number of emails sent
- SPF/DKIM pass/fail rates
- Sources of failed emails
- Receiving mail servers

### DMARC Analyzers (Free Tools)

- [DMARC Analyzer](https://www.dmarcanalyzer.com/)
- [Postmark DMARC Digests](https://dmarc.postmarkapp.com/)
- [Valimail](https://www.valimail.com/dmarc/)

### Upgrading DMARC Policy

Once SPF/DKIM consistently pass:

1. **After 1-2 weeks:** Upgrade to `p=quarantine`
   ```
   v=DMARC1; p=quarantine; rua=mailto:newsletter@thepaymentsnerd.co
   ```

2. **After 1 month:** Upgrade to `p=reject` (maximum security)
   ```
   v=DMARC1; p=reject; rua=mailto:newsletter@thepaymentsnerd.co
   ```

## Best Practices

### Content Quality

- ✅ Curated, high-value content
- ✅ Professional HTML design
- ✅ Proper text-to-HTML ratio
- ✅ No spam trigger words
- ✅ Consistent branding

### List Hygiene

- ✅ Double opt-in required
- ✅ One-click unsubscribe
- ✅ Remove hard bounces immediately
- ✅ Remove soft bounces after 3 attempts
- ✅ Clean inactive subscribers (6+ months)

### Sending Frequency

- ✅ Daily newsletter (consistent schedule)
- ✅ Don't send to unengaged users
- ✅ Respect user preferences
- ✅ Segment if needed (transactional vs. marketing)

### Monitoring

- ✅ Check Resend dashboard daily
- ✅ Monitor bounce rate (keep under 2%)
- ✅ Track delivery rate (aim for 98%+)
- ✅ Review DMARC reports weekly
- ✅ Watch for spam complaints

## Support Resources

### Resend
- **Documentation:** https://resend.com/docs
- **Support:** support@resend.com
- **Status:** https://status.resend.com
- **Domain Setup:** https://resend.com/docs/dashboard/domains/introduction

### Apple
- **Postmaster:** https://support.apple.com/en-us/102322
- **Contact:** icloudadmin@apple.com

### Email Tools
- **MXToolbox:** https://mxtoolbox.com/ (DNS/SPF/DKIM checker)
- **Mail Tester:** https://www.mail-tester.com/ (spam score)
- **DMARC Inspector:** https://dmarcian.com/dmarc-inspector/
- **DNS Propagation:** https://www.whatsmydns.net/

## Additional Notes

### Why DMARC is Critical

Apple iCloud Mail **requires** DMARC for inbox delivery. Without it, emails will bounce or go to spam regardless of SPF/DKIM configuration.

### Reverse DNS (rDNS)

Resend automatically configures reverse DNS for their sending IPs. You don't need to configure this manually. To verify:

1. Send a test email
2. View email headers
3. Find sending IP address
4. Use [MXToolbox Reverse Lookup](https://mxtoolbox.com/ReverseLookup.aspx)
5. Should resolve to Resend's domain

### Email Tracking

The system uses Resend's built-in tracking for:
- Opens (with Apple Mail Privacy Protection consideration)
- Clicks
- Bounces
- Complaints

**Note:** Apple Mail Privacy Protection affects open rate accuracy. Focus on clicks and engagement instead.

### Compliance

The email system complies with:
- **CAN-SPAM Act** (US)
- **GDPR** (EU) - if applicable
- **CASL** (Canada) - if applicable
- **Apple Mail Privacy Protection**
- **RFC 5321** (SMTP)
- **RFC 5322** (Email format)

## Summary

For successful email delivery:

1. **Verify domain in Resend** - Add SPF, DKIM, MX records
2. **Add DMARC manually** - Required for Apple iCloud
3. **Set up webhooks** - Handle bounces automatically
4. **Test thoroughly** - Send to iCloud, Gmail, Outlook
5. **Monitor daily** - Check Resend dashboard and DMARC reports
6. **Maintain list hygiene** - Remove bounces and inactive subscribers

**Timeline:** Setup takes 15-30 minutes + 1-24 hours for DNS propagation.
