# iCloud Email Bounce Fix - Detailed Walkthrough

**Estimated Time:** 20-30 minutes + 1-24 hours DNS propagation
**Difficulty:** Intermediate
**Cost:** $0

---

## Prerequisites

Before you start, gather these credentials:
- [ ] Resend account login (email/password)
- [ ] DNS provider login (where you manage thepaymentsnerd.co DNS)
  - Could be: Vercel, Cloudflare, GoDaddy, Namecheap, Google Domains, etc.
- [ ] An @icloud.com email address for testing

---

## Step 1: Access Resend Dashboard (5 minutes)

### 1.1 Log into Resend
1. Go to **https://resend.com/login**
2. Enter your email and password
3. Complete 2FA if enabled
4. You should see the Resend dashboard

### 1.2 Navigate to Domains
1. In the left sidebar, click **"Domains"**
2. Or go directly to: **https://resend.com/domains**

### 1.3 Check Current Domain Status
Look for `thepaymentsnerd.co` in the list:

**Scenario A: Domain is listed and shows "Verified" ✅**
- Status badge will be green with checkmark
- Skip to Step 2 (DMARC setup)

**Scenario B: Domain is listed but shows "Pending" or "Failed" ⚠️**
- Status badge will be yellow or red
- Continue to Step 1.4

**Scenario C: Domain is not listed ❌**
- You'll see an empty list or other domains
- Continue to Step 1.4 to add it

### 1.4 Add or Re-verify Domain

#### If domain is NOT listed:
1. Click the **"Add Domain"** button (top right)
2. Enter: `thepaymentsnerd.co`
3. Click **"Add"** or **"Continue"**

#### If domain shows "Pending" or "Failed":
1. Click on `thepaymentsnerd.co` in the list
2. Look for **"View DNS Records"** or **"Configuration"** button
3. Click it to see the required records

### 1.5 Copy DNS Records from Resend

Resend will show you **3 DNS records** to add. Keep this page open!

**Record 1: SPF (TXT Record)**
```
Type: TXT
Name: send._domainkey (or could be just "send")
Value: v=spf1 include:resend.com ~all
TTL: 3600 (or 1 hour)
```

**Record 2: DKIM (TXT Record)**
```
Type: TXT
Name: resend._domainkey
Value: [Long cryptographic string like: "k=rsa; p=MIGfMA0GCSq..."]
TTL: 3600
```
⚠️ **Important:** This value will be unique to your account. Copy it exactly from Resend.

**Record 3: MX (Mail Exchange Record)**
```
Type: MX
Name: send (or send.thepaymentsnerd.co)
Value: feedback-smtp.resend.com
Priority: 10
TTL: 3600
```

**How to copy:**
- Each record should have a "Copy" button or icon
- Click it and paste into a text file temporarily
- Or keep the Resend tab open while adding to DNS

---

## Step 2: Add DNS Records (10-15 minutes)

Now you need to find where you manage DNS for `thepaymentsnerd.co`.

### 2.1 Identify Your DNS Provider

**Common scenarios:**

**A. If domain is on Vercel:**
1. Go to **https://vercel.com/dashboard**
2. Click on your project
3. Go to **Settings → Domains**
4. Find `thepaymentsnerd.co`
5. Click **"Edit"** or **"Manage DNS"**

**B. If domain is on Cloudflare:**
1. Go to **https://dash.cloudflare.com/**
2. Click on `thepaymentsnerd.co`
3. Click **"DNS"** tab in the top menu
4. You'll see "DNS Management" section

**C. If domain is on GoDaddy:**
1. Go to **https://dcc.godaddy.com/domains**
2. Find `thepaymentsnerd.co`
3. Click **"DNS"** or **"Manage DNS"**

**D. If domain is on Namecheap:**
1. Go to **https://ap.www.namecheap.com/**
2. Click **"Domain List"**
3. Click **"Manage"** next to thepaymentsnerd.co
4. Go to **"Advanced DNS"** tab

**E. If domain is on Google Domains:**
1. Go to **https://domains.google.com/**
2. Click on `thepaymentsnerd.co`
3. Click **"DNS"** in the left menu

**F. Not sure?**
- Check your email for domain purchase confirmation
- Look for receipts from domain registrar
- Use WHOIS lookup: **https://whois.domaintools.com/thepaymentsnerd.co**

### 2.2 Add Record 1: SPF (TXT Record)

Once you're in your DNS management interface:

1. Look for **"Add Record"** or **"Add DNS Record"** button
2. Click it
3. Fill in the form:

```
Record Type: TXT
Name/Host: send._domainkey
          (Some providers may show this as: send._domainkey.thepaymentsnerd.co)
          (Some may want just: send)
Value/Data: [Paste the SPF value from Resend]
            Should look like: v=spf1 include:resend.com ~all
TTL: 3600 (or 1 hour, or Auto)
```

4. Click **"Save"** or **"Add Record"**

**Provider-Specific Notes:**

**Cloudflare:**
- Name field: Enter `send._domainkey` (it will auto-append the domain)
- Make sure "Proxy status" is set to **"DNS only"** (gray cloud icon)

**Vercel:**
- Name field: Enter just `send`
- Type: TXT

**GoDaddy:**
- Host field: Enter `send._domainkey`
- TXT Value: Paste SPF value
- TTL: 1 hour

### 2.3 Add Record 2: DKIM (TXT Record)

1. Click **"Add Record"** again
2. Fill in:

```
Record Type: TXT
Name/Host: resend._domainkey
Value/Data: [Paste the LONG DKIM value from Resend]
            Should start with: k=rsa; p=MIGfMA0GCSq...
TTL: 3600
```

3. Click **"Save"**

⚠️ **Common Issue:** If the DKIM value is very long (256+ characters), some DNS providers may:
- Require you to split it into chunks
- Automatically handle it (most modern providers)
- Show an error about length

**If you get a length error:**
- Check if your DNS provider has a "Long TXT record" option
- Contact your DNS provider support
- Cloudflare/Vercel handle long records automatically

### 2.4 Add Record 3: MX (Mail Exchange)

1. Click **"Add Record"** again
2. Fill in:

```
Record Type: MX
Name/Host: send
Value/Data: feedback-smtp.resend.com
Priority: 10
TTL: 3600
```

3. Click **"Save"**

**Provider-Specific Notes:**

**Cloudflare:**
- Name: `send`
- Mail server: `feedback-smtp.resend.com`
- Priority: `10`
- Proxy status: **DNS only** (gray cloud)

**Vercel:**
- MX records might need to be added via CLI or custom DNS provider

**If your provider doesn't support MX records on subdomains:**
- This is less critical than SPF/DKIM
- Resend will still work, but bounce handling will be limited
- Focus on getting SPF and DKIM working first

### 2.5 Verify Records Were Added

After saving all 3 records, you should see them in your DNS records list:

```
Type    Name                          Value
TXT     send._domainkey              v=spf1 include:resend.com ~all
TXT     resend._domainkey            k=rsa; p=MIGfMA0GCSq...
MX      send                         feedback-smtp.resend.com (Priority: 10)
```

Take a screenshot or note that all 3 are present.

---

## Step 3: Add DMARC Record (5 minutes)

⚠️ **This is the most critical step for iCloud delivery!**

DMARC is **not** automatically added by Resend - you must add it manually.

### 3.1 Add DMARC TXT Record

In your DNS management interface (same place as Step 2):

1. Click **"Add Record"**
2. Fill in:

```
Record Type: TXT
Name/Host: _dmarc
Value/Data: v=DMARC1; p=none; rua=mailto:newsletter@thepaymentsnerd.co; ruf=mailto:newsletter@thepaymentsnerd.co; fo=1
TTL: 3600
```

3. Click **"Save"**

**What this means:**
- `v=DMARC1` - Version (required)
- `p=none` - Policy: Monitor mode (don't reject emails yet)
- `rua=mailto:...` - Send daily aggregate reports to this email
- `ruf=mailto:...` - Send forensic (detailed) reports to this email
- `fo=1` - Generate reports for any authentication failure

### 3.2 Verify DMARC Record Added

You should now see:

```
Type    Name                          Value
TXT     _dmarc                       v=DMARC1; p=none; rua=mailto:newsletter@...
```

**Total records added:** 4 (SPF, DKIM, MX, DMARC)

---

## Step 4: Wait for DNS Propagation (1-24 hours)

DNS changes don't happen instantly. They need to "propagate" across the internet.

### 4.1 Initial Wait
**Wait at least 1 hour** before testing.

**What's happening:**
- Your DNS provider is updating its records
- DNS servers worldwide are caching the changes
- Usually takes 1-6 hours, but can be up to 24 hours

### 4.2 Check Propagation Status

After 1 hour, check if your records are live:

**Option A: Online Tool (Easiest)**
1. Go to **https://www.whatsmydns.net/**
2. Enter: `_dmarc.thepaymentsnerd.co`
3. Select record type: **TXT**
4. Click **"Search"**
5. You should see your DMARC policy on multiple servers worldwide

Repeat for:
- `send._domainkey.thepaymentsnerd.co` (TXT)
- `resend._domainkey.thepaymentsnerd.co` (TXT)
- `send.thepaymentsnerd.co` (MX)

**Green checkmarks** = Record is live
**Red X marks** = Still propagating

**Option B: Command Line**
If you're comfortable with terminal:

```bash
# Check DMARC
dig TXT _dmarc.thepaymentsnerd.co +short

# Expected output:
# "v=DMARC1; p=none; rua=mailto:newsletter@thepaymentsnerd.co..."

# Check SPF
dig TXT send._domainkey.thepaymentsnerd.co +short

# Expected output:
# "v=spf1 include:resend.com ~all"

# Check DKIM
dig TXT resend._domainkey.thepaymentsnerd.co +short

# Expected output:
# "k=rsa; p=MIGfMA0GCSq..." (very long string)

# Check MX
dig MX send.thepaymentsnerd.co +short

# Expected output:
# "10 feedback-smtp.resend.com."
```

**If you see the expected output:** ✅ Records are live!
**If you see nothing or error:** ⏳ Wait longer (try again in 2-4 hours)

---

## Step 5: Verify Domain in Resend (5 minutes)

Once DNS has propagated (Step 4 shows green checkmarks):

### 5.1 Go Back to Resend Dashboard
1. Go to **https://resend.com/domains**
2. Find `thepaymentsnerd.co`

### 5.2 Trigger Verification
- If status still shows "Pending", click **"Verify"** or **"Check DNS"**
- Resend will scan your DNS records
- This usually takes 10-30 seconds

### 5.3 Check Status
Status should change to:
- **"Verified" ✅** - Perfect! Continue to Step 6
- **"Pending" ⏳** - DNS not fully propagated yet, wait 2-4 more hours
- **"Failed" ❌** - Check DNS records for typos, see Troubleshooting section

### 5.4 Verify SPF and DKIM Show as Configured
On the domain detail page in Resend, you should see:
- ✅ SPF: Configured
- ✅ DKIM: Configured
- ✅ MX: Configured (or optional)

---

## Step 6: Test Email Delivery to iCloud (10 minutes)

Now test if emails actually deliver to iCloud addresses.

### 6.1 Use the Test Email Endpoint

You have a test endpoint in your app: `/api/test-email`

**Option A: Via Browser**
1. Make sure you have a test newsletter in your database
2. Go to your site URL + `/api/test-email`
   Example: `https://thepaymentsnerd.co/api/test-email`
3. Add your iCloud email as query parameter:
   `https://thepaymentsnerd.co/api/test-email?to=your-email@icloud.com`

**Option B: Via curl**
```bash
curl "https://thepaymentsnerd.co/api/test-email?to=your-email@icloud.com"
```

**Option C: Via Resend Dashboard**
1. Go to **https://resend.com/emails**
2. Click **"Send Email"** or **"Create Email"**
3. Fill in:
   - From: `The Payments Nerd <newsletter@thepaymentsnerd.co>`
   - To: `your-email@icloud.com`
   - Subject: `Test Email - iCloud Delivery`
   - Body: Add any test content
4. Click **"Send"**

### 6.2 Check iCloud Inbox

**Within 1-2 minutes:**
1. Open **Mail** app on iPhone/iPad/Mac
2. Or go to **https://www.icloud.com/mail/**
3. Log in with your iCloud account
4. Check **Inbox** folder

**Success Scenarios:**
- ✅ Email appears in Inbox - **PERFECT!**
- ✅ Email appears in Junk/Spam folder - Not ideal, but it delivered (reputation needs time)

**Failure Scenarios:**
- ❌ Email doesn't arrive at all - Check Step 6.3
- ❌ Bounce notification received - Check Step 6.3

### 6.3 Check Resend Logs
If email didn't arrive:

1. Go to **https://resend.com/emails**
2. Find your test email in the list (should be at the top)
3. Click on it to see details
4. Check the **Status**:
   - **"Delivered"** ✅ - Email was accepted by Apple
   - **"Bounced"** ❌ - See bounce reason
   - **"Failed"** ❌ - See error message
   - **"Pending"** ⏳ - Still being processed

### 6.4 Interpret Results

**If status is "Delivered" but email not in inbox:**
- Check iCloud **Junk/Spam** folder
- Check iCloud **Deleted Items** (if auto-filtering enabled)
- Wait 5-10 minutes (sometimes delayed)

**If status is "Bounced":**
Look at the bounce message:
- `"550 5.7.1 SPF/DKIM check failed"` - DNS records not propagated yet
- `"550 5.7.1 Unauthenticated email"` - DMARC not set up correctly
- `"550 5.1.1 Recipient address rejected"` - Email address doesn't exist
- `"421 Service not available"` - Temporary issue, retry later

**If bounce mentions authentication:**
- Go back to Step 4 and verify all DNS records
- Wait another 4-6 hours for full global propagation
- Check DMARC analyzer: **https://mxtoolbox.com/dmarc.aspx**
  - Enter: `thepaymentsnerd.co`
  - Should show "DMARC Record found"

---

## Step 7: Test Multiple Apple Domains (5 minutes)

Apple owns multiple email domains. Test all of them:

### 7.1 Test @icloud.com
Already done in Step 6 ✅

### 7.2 Test @me.com
If you have access to an @me.com address:
1. Send test email to `your-email@me.com`
2. Verify delivery

### 7.3 Test @mac.com
If you have access to an @mac.com address:
1. Send test email to `your-email@mac.com`
2. Verify delivery

**Don't have these addresses?**
- Ask a friend/colleague with Apple email
- Or skip - @icloud.com is the main one to verify

---

## Step 8: Monitor DMARC Reports (24-48 hours)

After 24-48 hours, you should start receiving DMARC reports.

### 8.1 Check Your Email
1. Check `newsletter@thepaymentsnerd.co` inbox
2. Look for emails from:
   - `noreply@dmarc.icloud.com` (from Apple)
   - `noreply-dmarc-support@google.com` (from Gmail users)
   - Other email providers

### 8.2 Understand DMARC Reports
These emails will have:
- Subject: Like "Report domain: thepaymentsnerd.co Submitter: apple.com"
- Attachment: XML file (report.xml)
- Content: Daily aggregate of email authentication results

**What to look for in reports:**
- `<disposition>none</disposition>` - Emails were delivered (good!)
- `<dkim>pass</dkim>` - DKIM passed (good!)
- `<spf>pass</spf>` - SPF passed (good!)
- `<count>X</count>` - Number of emails sent

### 8.3 Use DMARC Report Analyzer (Optional)
If XML files are confusing:

1. Go to **https://dmarcian.com/dmarc-inspector/** (free tool)
2. Upload the XML file
3. Get human-readable report

**Or use:**
- **https://www.dmarcanalyzer.com/** (free tier available)
- Signup required but free for basic monitoring

### 8.4 What Success Looks Like
In DMARC reports:
- 100% of emails show `<dkim>pass</dkim>`
- 100% of emails show `<spf>pass</spf>`
- 0% failures
- No rejection/quarantine actions

---

## Step 9: Upgrade DMARC Policy (After 1-2 Weeks)

Once you've confirmed everything is working:

### 9.1 Monitor for 1-2 Weeks
- Check DMARC reports daily
- Verify no SPF/DKIM failures
- Verify no subscriber complaints about missing emails

### 9.2 Upgrade to p=quarantine (Optional)
After 1-2 weeks of successful monitoring:

1. Go back to your DNS provider
2. Find the DMARC TXT record (`_dmarc`)
3. Edit it:

**Change from:**
```
v=DMARC1; p=none; rua=mailto:newsletter@thepaymentsnerd.co; ruf=mailto:newsletter@thepaymentsnerd.co; fo=1
```

**Change to:**
```
v=DMARC1; p=quarantine; rua=mailto:newsletter@thepaymentsnerd.co; ruf=mailto:newsletter@thepaymentsnerd.co; fo=1; pct=10
```

**What changed:**
- `p=quarantine` - If email fails DMARC, send to spam (not reject)
- `pct=10` - Apply policy to only 10% of emails (gradual rollout)

4. Save the change
5. Monitor for another week
6. Gradually increase `pct` from 10 → 25 → 50 → 100

### 9.3 Final Policy: p=reject (Optional, Advanced)
After 4+ weeks of perfect delivery:

```
v=DMARC1; p=reject; rua=mailto:newsletter@thepaymentsnerd.co; ruf=mailto:newsletter@thepaymentsnerd.co; fo=1
```

**⚠️ Warning:** `p=reject` means emails that fail DMARC will be completely rejected. Only use this if you have:
- 100% SPF/DKIM pass rate for 4+ weeks
- No false positives in reports
- High confidence in your email infrastructure

**For most newsletters:** `p=quarantine` is sufficient and safer.

---

## Success Checklist

Use this to verify everything is complete:

### DNS Configuration
- [ ] SPF TXT record added and propagated
- [ ] DKIM TXT record added and propagated
- [ ] MX record added and propagated (optional but recommended)
- [ ] DMARC TXT record added and propagated
- [ ] All records verified via whatsmydns.net or dig commands

### Resend Configuration
- [ ] Domain `thepaymentsnerd.co` shows status "Verified" in Resend
- [ ] SPF shows as "Configured" in Resend
- [ ] DKIM shows as "Configured" in Resend

### Email Testing
- [ ] Test email sent to @icloud.com address
- [ ] Email received in iCloud inbox (or junk folder)
- [ ] No bounce messages received
- [ ] Test email sent to @me.com address (if available)
- [ ] Test email sent to @mac.com address (if available)

### Monitoring
- [ ] DMARC reports being received (after 24-48 hours)
- [ ] Reports show DKIM pass
- [ ] Reports show SPF pass
- [ ] No authentication failures in reports

### Long-term
- [ ] Monitor for 1-2 weeks
- [ ] Verify subscriber complaints are low/zero
- [ ] Consider upgrading DMARC policy to p=quarantine
- [ ] Document in your team's runbook

---

## Troubleshooting Common Issues

### Issue: "Domain verification failed in Resend"

**Cause:** DNS records not propagated or incorrect values

**Solutions:**
1. **Wait longer** - DNS can take 24 hours
2. **Check for typos** - Review each DNS record character by character
3. **Check DNS provider** - Ensure you added records to the correct domain
4. **Remove quotes** - Some DNS providers auto-add quotes, you might have double quotes
5. **Check case sensitivity** - Some values are case-sensitive
6. **Contact Resend support** - support@resend.com with screenshots

**Verification:**
```bash
# This command should return your records
dig TXT send._domainkey.thepaymentsnerd.co +short
dig TXT resend._domainkey.thepaymentsnerd.co +short
```

---

### Issue: "Emails still bouncing after DNS setup"

**Cause:** DNS propagated but DMARC policy might be failing

**Solutions:**
1. **Check DMARC alignment:**
   - Go to: https://mxtoolbox.com/SuperTool.aspx
   - Enter: `thepaymentsnerd.co`
   - Run DMARC check
   - Should show "DMARC record found" and "SPF and DKIM aligned"

2. **Check bounce message in Resend:**
   - Go to Resend → Emails
   - Click on bounced email
   - Read exact bounce reason
   - Google the error code for solutions

3. **Verify FROM domain matches:**
   - FROM address: `newsletter@thepaymentsnerd.co`
   - DKIM domain: `thepaymentsnerd.co`
   - SPF domain: `thepaymentsnerd.co`
   - All must match!

4. **Check sender reputation:**
   - Go to: https://senderscore.org/
   - Enter your sending IP (find in Resend email headers)
   - Score should be 80+ (100 is perfect)
   - If low, you may need to build reputation over time

---

### Issue: "DMARC reports show failures"

**Cause:** SPF or DKIM not aligning with FROM domain

**Solutions:**
1. **Check report details:**
   - Look at XML or use dmarcian.com to parse
   - Identify which failed: SPF or DKIM
   - Check the failing IPs/domains

2. **If DKIM failing:**
   - Verify DKIM record has no typos
   - Ensure DKIM selector matches (resend._domainkey)
   - Contact Resend support to verify DKIM signing

3. **If SPF failing:**
   - Verify SPF record includes `include:resend.com`
   - Check no other SPF records conflict
   - Verify domain alignment

4. **If both passing but alignment failing:**
   - Ensure FROM domain is exactly `thepaymentsnerd.co`
   - Not a subdomain like `mail.thepaymentsnerd.co`
   - Resend should handle alignment automatically

---

### Issue: "Emails go to iCloud spam folder"

**Cause:** Low sender reputation or content issues

**Solutions:**
1. **This is normal initially** - New domains have low reputation
2. **Build reputation gradually:**
   - Send to engaged subscribers first
   - Gradually increase volume over 2-4 weeks
   - Avoid sudden spikes in sending volume

3. **Improve content:**
   - Reduce promotional language
   - More plain text, less HTML
   - Clear, valuable subject lines
   - High text-to-image ratio

4. **Ask subscribers to:**
   - Mark emails as "Not Junk"
   - Add newsletter@thepaymentsnerd.co to contacts
   - Move emails from Spam to Inbox

5. **Monitor engagement:**
   - Track open rates
   - Remove unengaged subscribers (6+ months)
   - Send re-engagement campaigns

6. **Time will help:**
   - Sender reputation builds over weeks/months
   - Consistent sending schedule
   - Low spam complaint rate
   - High engagement rate

---

### Issue: "DNS records won't save in my provider"

**Provider-specific solutions:**

**Cloudflare:**
- Ensure proxy is OFF (gray cloud, not orange)
- DMARC record name should be `_dmarc` not `_dmarc.thepaymentsnerd.co`
- Long DKIM records are auto-handled

**Vercel:**
- May need to use external DNS provider for complex records
- Or add via Vercel CLI: `vercel dns add`
- MX records might not be supported

**GoDaddy:**
- Use "Advanced DNS" not "DNS Management"
- Some records require "Host" field to include subdomain
- TTL might default to 600 or 3600

**Namecheap:**
- Use "Advanced DNS" tab
- Host field should include subdomain
- DKIM might need record split if >255 chars

**Generic solution:**
- Contact your DNS provider support
- Share Resend's documentation: https://resend.com/docs/dashboard/domains/introduction
- Ask them to add records for you

---

### Issue: "Not receiving DMARC reports"

**Cause:** Reports take 24-48 hours or email filtering

**Solutions:**
1. **Wait longer** - First reports can take 48-72 hours
2. **Check spam folder** - DMARC reports often filtered
3. **Verify DMARC record:**
   ```bash
   dig TXT _dmarc.thepaymentsnerd.co +short
   ```
   Should include: `rua=mailto:newsletter@thepaymentsnerd.co`

4. **Check email capacity** - Ensure mailbox not full
5. **Try alternative reporting service:**
   - Signup for free DMARC monitoring: https://dmarcian.com/
   - Update DMARC record to include their reporting address

---

### Issue: "Multiple SPF records conflict"

**Cause:** You might have existing SPF records

**Solution:**
1. **Check current SPF records:**
   ```bash
   dig TXT thepaymentsnerd.co +short | grep spf
   ```

2. **Merge SPF records** - You can only have ONE SPF record per domain
   - If you see multiple, combine them:
   ```
   v=spf1 include:resend.com include:other-service.com ~all
   ```

3. **SPF record should be on root domain or subdomain:**
   - Option A: `thepaymentsnerd.co` (root domain)
   - Option B: `send._domainkey.thepaymentsnerd.co` (subdomain)
   - Resend usually uses subdomain approach

---

## Still Having Issues?

### Contact Resend Support
- Email: **support@resend.com**
- Include:
  - Domain name: `thepaymentsnerd.co`
  - Screenshot of DNS records
  - Screenshot of Resend verification status
  - Bounce message if applicable

### Contact Apple Postmaster
- Email: **icloudadmin@apple.com**
- Use only if:
  - All DNS records verified
  - Resend shows "Verified"
  - Still getting bounces specifically from Apple domains

### Check Email Authentication Tools
1. **MXToolbox SuperTool:** https://mxtoolbox.com/SuperTool.aspx
   - Test SPF, DKIM, DMARC in one place
2. **DMARC Analyzer:** https://www.dmarcanalyzer.com/
   - Free monitoring and reports
3. **Mail Tester:** https://www.mail-tester.com/
   - Send test email, get deliverability score
4. **Google Postmaster Tools:** https://postmaster.google.com/
   - Monitor sender reputation (works for Gmail, helpful overall)

---

## Expected Timeline Summary

| Day | Activity | Expected Result |
|-----|----------|----------------|
| Day 0 | Add all DNS records | Records saved in DNS provider |
| Day 0+1hr | Check DNS propagation | Some servers show records |
| Day 0+6hrs | Verify domain in Resend | Domain shows "Verified" |
| Day 0+6hrs | Send test email to iCloud | Email delivers (possibly to spam initially) |
| Day 1-2 | Monitor test emails | Emails consistently deliver |
| Day 2-3 | Receive first DMARC reports | Reports show SPF/DKIM pass |
| Week 1 | Monitor delivery rates | 95%+ delivery rate |
| Week 2+ | Build sender reputation | Emails land in inbox (not spam) |
| Week 4+ | Consider DMARC upgrade | Upgrade to p=quarantine if desired |

---

## Final Notes

- **Patience is key** - DNS propagation and sender reputation take time
- **Don't panic if emails go to spam initially** - This is normal for new senders
- **Document everything** - Save screenshots of your DNS records
- **Test before mass sending** - Verify with small test sends first
- **Monitor continuously** - Check DMARC reports weekly

**You've got this!** 🚀

The setup is straightforward - DNS records are the main work. Once propagated, iCloud delivery should work smoothly.

Questions? Refer back to the troubleshooting section or contact Resend support.
