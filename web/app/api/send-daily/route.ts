/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { makeToken } from "@/lib/emailTokens";
import { generateDailyNewsletterEmail } from "@/lib/emailTemplate";

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

    for (const sub of subscribers ?? []) {
      const unsubToken = makeToken(sub.email, "unsubscribe", secret, 365 * 24);
      const unsubUrl = `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

      const emailHtml = generateDailyNewsletterEmail({
        publicationDate: newsletter.publication_date,
        news: newsletter.content.news,
        curiosity: newsletter.content.curiosity,
        unsubscribeUrl: unsubUrl,
      });

      await resend.emails.send({
        from,
        to: sub.email,
        subject: `The Payments Nerd — ${newsletter.publication_date}`,
        html: emailHtml,
      });

      sent++;
    }

    return NextResponse.json({ ok: true, sent });
  } catch (e: any) {
    console.error("Daily send error:", e.message);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
