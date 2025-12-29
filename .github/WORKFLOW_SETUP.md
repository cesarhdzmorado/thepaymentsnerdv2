# 🤖 GitHub Actions Setup for Automated Newsletter Emails

## Overview

Your GitHub Actions workflow now automatically:
1. ✅ Generates newsletter content at **05:00 UTC daily**
2. ✅ Commits the newsletter to the repository
3. ✅ Syncs content to Supabase
4. ✅ Triggers Vercel deployment
5. ✅ **Sends emails to all active subscribers** ← NEW!

---

## 🔐 Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### Go to: `Settings → Secrets and variables → Actions → New repository secret`

**Existing secrets** (you should already have these):
- `OPENAI_API_KEY` - For AI newsletter generation
- `SERPER_API_KEY` - For web search during content generation
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `VERCEL_DEPLOY_HOOK_URL` - Vercel deployment webhook URL

**New secrets needed** for email sending:
- `CRON_SECRET` - Secret token to protect the `/api/send-daily` endpoint
  - Example: `your-secure-random-token-here-12345`
  - This should match the `CRON_SECRET` in your Vercel environment variables

- `NEXT_PUBLIC_SITE_URL` - Your production site URL
  - Example: `https://thepaymentsnerd.com`
  - This is where the workflow will call the `/api/send-daily` endpoint

---

## 🔧 Vercel Environment Variables

Make sure these are set in your **Vercel project** (Settings → Environment Variables):

```env
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=newsletter@yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
SUBSCRIBE_TOKEN_SECRET=your_token_secret
NEXT_PUBLIC_SITE_URL=https://thepaymentsnerd.com
CRON_SECRET=your-secure-random-token-here-12345
```

**Important:** The `CRON_SECRET` must match in both GitHub Secrets and Vercel!

---

## 📊 How It Works

### Daily Flow (05:00 UTC)

```
1. AI generates newsletter
   ↓
2. Commits newsletter.json
   ↓
3. Syncs to Supabase database
   ↓
4. Triggers Vercel deployment
   ↓
5. Waits 60 seconds for deployment
   ↓
6. Calls /api/send-daily endpoint
   ↓
7. Emails sent to all active subscribers! 🎉
```

### The Email Sending Step

```bash
curl -X GET \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  https://your-site.com/api/send-daily
```

**Success response:**
```json
{
  "ok": true,
  "sent": 42
}
```

---

## 🧪 Testing the Workflow

### Manual Test Run

You can test the entire workflow manually:

1. Go to: **Actions → Daily Newsletter Pipeline → Run workflow**
2. Click "Run workflow" on the main branch
3. Watch the workflow execute all steps
4. Check the "Send newsletter emails to subscribers" step logs

### Test Just Email Sending

To test only the email sending (without regenerating newsletter):

```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-production-site.com/api/send-daily
```

---

## ⏱️ Adjusting the Wait Time

The workflow waits 60 seconds after triggering deployment before sending emails. If your Vercel deployments take longer:

**Edit line 115 in `.github/workflows/generate_news.yml`:**
```yaml
run: sleep 60  # Change to 90, 120, etc.
```

---

## 🐛 Troubleshooting

### Emails not sending?

**Check GitHub Actions logs:**
1. Go to Actions tab in your repository
2. Click on the latest workflow run
3. Expand "Send newsletter emails to subscribers" step
4. Look for error messages

**Common issues:**

1. **401 Unauthorized**
   - Check that `CRON_SECRET` matches in GitHub and Vercel

2. **404 Not Found**
   - Verify `NEXT_PUBLIC_SITE_URL` is correct
   - Make sure the site is deployed

3. **No subscribers found**
   - Check Supabase `subscribers` table
   - Verify subscribers have `status = 'active'`

4. **Resend API errors**
   - Check `RESEND_API_KEY` is valid
   - Verify `EMAIL_FROM` is authorized in Resend

---

## 📈 Monitoring

After each run, check:
- ✅ GitHub Actions workflow completed successfully
- ✅ Newsletter appears on your website
- ✅ Email count in workflow logs matches your subscriber count
- ✅ Test subscriber received the email

---

## 🎯 Next Steps

1. **Add the required secrets to GitHub:**
   - `CRON_SECRET`
   - `NEXT_PUBLIC_SITE_URL`

2. **Verify Vercel environment variables** are set

3. **Run a manual test** from GitHub Actions

4. **Wait for tomorrow morning** (05:00 UTC) for the first automated send!

---

Happy automating! 🚀
