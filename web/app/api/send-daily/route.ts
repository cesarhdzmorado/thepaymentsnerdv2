/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { makeToken } from "@/lib/emailTokens";
import { generateDailyNewsletterEmail, generateEmailSubject } from "@/lib/emailTemplate";

export async function GET(req: Request) {
  try {
    // Optional protection: secret token
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1) Get latest newsletter
    const { data: newsletter, error: nErr } = await supabaseAdmin
      .from("newsletters")
      .select("publication_date, content")
      .order("publication_date", { ascending: false })
      .limit(1)
      .single();

    if (nErr || !newsletter) {
      throw new Error("No newsletter found");
    }

    // 2) Get active subscribers
    const { data: subscribers, error: sErr } = await supabaseAdmin
      .from("subscribers")
      .select("email")
      .eq("status", "active");

    if (sErr) {
      throw new Error("Failed to load subscribers");
    }

    const resend = new Resend(process.env.RESEND_API_KEY!);
    const from = process.env.EMAIL_FROM!;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    const secret = process.env.SUBSCRIBE_TOKEN_SECRET!;

    let sent = 0;
    let failed = 0;
    const errors: Array<{ email: string; error: string }> = [];

    // Generate dynamic subject line from newsletter content
    const emailSubject = generateEmailSubject(newsletter.content.news);

    console.log(`Starting daily send for ${subscribers?.length || 0} subscribers`);

    for (const sub of subscribers ?? []) {
      try {
        console.log(`Processing subscriber: ${sub.email}`);

        const unsubToken = makeToken(sub.email, "unsubscribe", secret, 365 * 24);
        const unsubUrl = `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

        const emailHtml = await generateDailyNewsletterEmail({
          publicationDate: newsletter.publication_date,
          intro: newsletter.content.intro,
          news: newsletter.content.news,
          perspective: newsletter.content.perspective,
          curiosity: newsletter.content.curiosity,
          unsubscribeUrl: unsubUrl,
        });

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

        if (result.data?.id) {
          sent++;
          console.log(`✅ Sent to ${sub.email} (ID: ${result.data.id})`);
        } else if (result.error) {
          failed++;
          const errorMsg = result.error.message || 'Unknown Resend error';
          errors.push({ email: sub.email, error: errorMsg });
          console.error(`❌ Resend error for ${sub.email}:`, errorMsg);
        }
      } catch (error: any) {
        failed++;
        const errorMsg = error.message || 'Unknown error';
        errors.push({ email: sub.email, error: errorMsg });
        console.error(`❌ Exception for ${sub.email}:`, errorMsg, error.stack);
      }
    }

    console.log(`Daily send complete: ${sent} sent, ${failed} failed`);

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      total: subscribers?.length || 0,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (e: any) {
    console.error("Daily send error:", e.message);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
