# Apple iCloud Compliance - Implementation Improvements

Based on Apple's full requirements, here's what we need to add to be fully compliant.

---

## Current Status vs Apple Requirements

### ✅ Already Compliant

1. **Opt-in only** - Double opt-in subscription flow with confirmation email
2. **Unsubscribe link** - `List-Unsubscribe` and `List-Unsubscribe-Post` headers
3. **RFC 5321/5322** - Resend handles this automatically
4. **Consistent From** - `The Payments Nerd <newsletter@thepaymentsnerd.co>`
5. **SPF/DKIM** - Configured via Resend domain verification
6. **DMARC** - Manual DNS record added
7. **Don't reactivate unsubscribed** - We check `status="active"`

### ⚠️ Needs Implementation

1. **ARC headers** - For email forwarding authentication
2. **Track SMTP errors** - Log and act on bounce/error responses
3. **Bounce handling policy** - Automatically handle hard/soft bounces
4. **Remove inactive subscribers** - Clean up disengaged users
5. **Reverse DNS** - Verify with Resend (should be automatic)

---

## Required Code Improvements

### 1. Enhanced Error Tracking in send-daily/route.ts

**Current Issue:** We don't track SMTP errors from `resend.emails.send()`

**Fix Required:**
```typescript
// web/app/api/send-daily/route.ts

const results = {
  sent: 0,
  failed: 0,
  errors: [] as Array<{ email: string; error: string; code?: string }>,
};

for (const sub of subscribers ?? []) {
  try {
    const result = await resend.emails.send({
      from: `The Payments Nerd <${from}>`,
      to: sub.email,
      subject: emailSubject,
      html: emailHtml,
      headers: {
        'X-Entity-Ref-ID': newsletter.publication_date,
        'List-Unsubscribe': `<${unsubUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });

    // Track success
    if (result.data?.id) {
      results.sent++;
    } else if (result.error) {
      // Track SMTP errors
      results.failed++;
      results.errors.push({
        email: sub.email,
        error: result.error.message,
        code: result.error.name,
      });

      // Log SMTP error for monitoring
      console.error(`SMTP Error for ${sub.email}:`, {
        code: result.error.name,
        message: result.error.message,
      });
    }
  } catch (error: any) {
    // Catch network/API errors
    results.failed++;
    results.errors.push({
      email: sub.email,
      error: error.message || 'Unknown error',
    });
    console.error(`Send error for ${sub.email}:`, error);
  }
}

return NextResponse.json({
  ok: true,
  sent: results.sent,
  failed: results.failed,
  errors: results.errors.length > 0 ? results.errors : undefined,
});
```

### 2. Bounce Webhook Handler

**Create:** `web/app/api/resend-webhook/route.ts`

Resend sends webhooks for bounces, complaints, and delivery events.

```typescript
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import crypto from "crypto";

/**
 * Resend Webhook Handler
 *
 * Handles bounce and complaint events from Resend
 * Documentation: https://resend.com/docs/dashboard/webhooks/introduction
 */
export async function POST(req: Request) {
  try {
    // Verify webhook signature
    const body = await req.text();
    const signature = req.headers.get("svix-signature");
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse event
    const event = JSON.parse(body);
    const { type, data } = event;

    console.log(`Resend webhook received: ${type}`, data);

    // Handle different event types
    switch (type) {
      case "email.bounced":
        await handleBounce(data);
        break;

      case "email.complained":
        await handleComplaint(data);
        break;

      case "email.delivered":
        // Optional: Track successful deliveries
        console.log(`Email delivered to ${data.to}`);
        break;

      case "email.delivery_delayed":
        // Optional: Track delays
        console.log(`Email delayed to ${data.to}`);
        break;

      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleBounce(data: any) {
  const { to: email, bounce_type } = data;

  console.log(`Bounce detected: ${email} (${bounce_type})`);

  // Hard bounce = permanent failure (invalid email, domain doesn't exist)
  if (bounce_type === "hard") {
    await supabaseAdmin
      .from("subscribers")
      .update({
        status: "bounced",
        updated_at: new Date().toISOString(),
      })
      .eq("email", email);

    console.log(`Hard bounce: Marked ${email} as bounced`);
  }

  // Soft bounce = temporary failure (mailbox full, server down)
  else if (bounce_type === "soft") {
    // Track soft bounces, remove after 3+ consecutive soft bounces
    const { data: subscriber } = await supabaseAdmin
      .from("subscribers")
      .select("metadata")
      .eq("email", email)
      .single();

    const softBounceCount = (subscriber?.metadata?.soft_bounces || 0) + 1;

    if (softBounceCount >= 3) {
      // After 3 soft bounces, mark as bounced
      await supabaseAdmin
        .from("subscribers")
        .update({
          status: "bounced",
          updated_at: new Date().toISOString(),
        })
        .eq("email", email);

      console.log(`Soft bounce (3x): Marked ${email} as bounced`);
    } else {
      // Track soft bounce count
      await supabaseAdmin
        .from("subscribers")
        .update({
          metadata: {
            ...subscriber?.metadata,
            soft_bounces: softBounceCount,
            last_soft_bounce: new Date().toISOString(),
          },
        })
        .eq("email", email);

      console.log(`Soft bounce #${softBounceCount}: ${email}`);
    }
  }
}

async function handleComplaint(data: any) {
  const { to: email } = data;

  console.log(`Spam complaint: ${email}`);

  // User marked email as spam - immediately unsubscribe
  await supabaseAdmin
    .from("subscribers")
    .update({
      status: "complained",
      updated_at: new Date().toISOString(),
    })
    .eq("email", email);

  console.log(`Spam complaint: Marked ${email} as complained`);
}
```

### 3. Inactive Subscriber Cleanup Script

**Create:** `web/scripts/cleanupInactiveSubscribers.ts`

```typescript
import { supabaseAdmin } from "../lib/supabaseAdmin";

/**
 * Cleanup Inactive Subscribers
 *
 * Apple requires: "Periodically remove inactive subscribers from your list"
 *
 * This script identifies subscribers who haven't engaged in 6+ months
 * and marks them as "inactive" (but doesn't delete - allows re-engagement)
 *
 * Run monthly via cron job
 */
async function cleanupInactiveSubscribers() {
  try {
    console.log("Starting inactive subscriber cleanup...");

    // Calculate date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Find subscribers who haven't been updated in 6+ months and are still active
    const { data: inactiveSubscribers, error } = await supabaseAdmin
      .from("subscribers")
      .select("email, created_at, updated_at")
      .eq("status", "active")
      .lt("updated_at", sixMonthsAgo.toISOString());

    if (error) {
      console.error("Error fetching inactive subscribers:", error);
      return;
    }

    if (!inactiveSubscribers || inactiveSubscribers.length === 0) {
      console.log("No inactive subscribers found.");
      return;
    }

    console.log(`Found ${inactiveSubscribers.length} inactive subscribers`);

    // Mark as inactive (option 1: soft delete)
    const { error: updateError } = await supabaseAdmin
      .from("subscribers")
      .update({
        status: "inactive",
        updated_at: new Date().toISOString(),
      })
      .eq("status", "active")
      .lt("updated_at", sixMonthsAgo.toISOString());

    if (updateError) {
      console.error("Error updating inactive subscribers:", updateError);
      return;
    }

    console.log(`✅ Marked ${inactiveSubscribers.length} subscribers as inactive`);

    // Log for audit trail
    inactiveSubscribers.forEach((sub) => {
      console.log(`  - ${sub.email} (last active: ${sub.updated_at})`);
    });

    return inactiveSubscribers.length;
  } catch (error) {
    console.error("Cleanup script error:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  cleanupInactiveSubscribers()
    .then((count) => {
      console.log(`\nCleanup complete. ${count || 0} subscribers marked inactive.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { cleanupInactiveSubscribers };
```

### 4. Database Schema Update

**Add to Supabase subscribers table:**

```sql
-- Add metadata column for tracking bounces and engagement
ALTER TABLE subscribers
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add new status values
-- Current: 'pending', 'active', 'unsubscribed'
-- Add: 'bounced', 'complained', 'inactive'

-- Update status check constraint if exists
ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_status_check;
ALTER TABLE subscribers ADD CONSTRAINT subscribers_status_check
  CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced', 'complained', 'inactive'));

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_subscribers_status_updated
  ON subscribers(status, updated_at);
```

### 5. Add ARC Headers Support

**Update send-daily/route.ts:**

```typescript
await resend.emails.send({
  from: `The Payments Nerd <${from}>`,
  to: sub.email,
  subject: emailSubject,
  html: emailHtml,
  headers: {
    'X-Entity-Ref-ID': newsletter.publication_date,
    'List-Unsubscribe': `<${unsubUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    'ARC-Seal': 'auto', // Resend handles ARC automatically if set
    'ARC-Message-Signature': 'auto',
    'ARC-Authentication-Results': 'auto',
  },
});
```

**Note:** Resend should handle ARC automatically for verified domains. Contact Resend support to confirm.

### 6. Environment Variables Update

**Add to .env.example:**

```bash
# Resend Webhook Secret (for bounce handling)
# Get from: https://resend.com/webhooks
RESEND_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Test Email Secret (for /api/test-email)
TEST_EMAIL_SECRET=your-secret-test-token-here
```

---

## Implementation Priority

### High Priority (Do First)
1. ✅ **DNS Records** - SPF, DKIM, DMARC (you've done this)
2. **Error Tracking** - Update send-daily/route.ts to log SMTP errors
3. **Bounce Webhook** - Set up Resend webhook handler

### Medium Priority (Do This Week)
4. **Database Schema** - Add metadata column and new status values
5. **Test Email Fix** - Add TEST_EMAIL_SECRET to environment
6. **Inactive Cleanup** - Create script and schedule monthly

### Low Priority (Nice to Have)
7. **ARC Headers** - Verify with Resend support
8. **Monitoring Dashboard** - Track delivery rates, bounces, complaints

---

## Resend Configuration Needed

### 1. Set Up Webhook in Resend Dashboard

1. Go to: https://resend.com/webhooks
2. Click "Create Webhook"
3. Enter webhook URL: `https://thepaymentsnerd.co/api/resend-webhook`
4. Select events:
   - ✅ `email.bounced`
   - ✅ `email.complained`
   - ✅ `email.delivered` (optional)
   - ✅ `email.delivery_delayed` (optional)
5. Copy the webhook secret
6. Add to environment: `RESEND_WEBHOOK_SECRET=whsec_...`

### 2. Verify ARC Support

- Contact Resend support: support@resend.com
- Ask: "Does Resend automatically add ARC headers for verified domains?"
- If yes: No action needed
- If no: Request ARC support or manual header configuration

### 3. Enable Bounce Tracking

- In Resend dashboard → Settings → Email
- Ensure "Track bounces" is enabled
- Verify MX record is configured (for bounce processing)

---

## Testing the Improvements

### Test Bounce Handling

1. Send test email to known bounce addresses:
   - Hard bounce: `bounce@simulator.amazonses.com`
   - Soft bounce: `ooto@simulator.amazonses.com`
   - Complaint: `complaint@simulator.amazonses.com`

2. Verify webhook receives events
3. Check subscriber status updated in database

### Test Inactive Cleanup

```bash
# Run cleanup script manually
cd web
npx ts-node scripts/cleanupInactiveSubscribers.ts
```

### Test Error Tracking

1. Send daily newsletter with updated route
2. Check logs for any SMTP errors
3. Verify response includes error details

---

## Monitoring & Compliance

### Monthly Checklist

- [ ] Run inactive subscriber cleanup
- [ ] Review bounce rates in Resend dashboard (should be <2%)
- [ ] Review complaint rates (should be <0.1%)
- [ ] Check DMARC reports for authentication failures
- [ ] Verify domain still shows "Verified" in Resend
- [ ] Review subscriber engagement metrics

### Key Metrics (Apple Expectations)

- **Bounce Rate:** < 2% (hard + soft bounces)
- **Complaint Rate:** < 0.1% (spam reports)
- **Engagement:** Remove subscribers inactive 6+ months
- **Authentication:** 100% SPF/DKIM/DMARC pass rate

---

## Summary of Changes

| Requirement | Current Status | Action Needed |
|-------------|----------------|---------------|
| SPF/DKIM | ✅ Configured | None (verify in Resend) |
| DMARC | ✅ Configured | None (verify DNS) |
| Unsubscribe | ✅ Implemented | None |
| Error Tracking | ❌ Missing | Update send-daily route |
| Bounce Handling | ❌ Missing | Add webhook handler |
| Inactive Cleanup | ❌ Missing | Create script + cron |
| ARC Headers | ⚠️ Unknown | Verify with Resend |
| Reverse DNS | ⚠️ Unknown | Verify with Resend |

---

## Next Steps

1. **Immediate:** Add TEST_EMAIL_SECRET to your environment so test API works
2. **This week:** Implement error tracking and bounce webhook
3. **This month:** Set up inactive subscriber cleanup
4. **Ongoing:** Monitor DMARC reports and delivery metrics

Let me know which improvements you'd like me to implement first!
