/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyToken, makeToken } from "@/lib/emailTokens";
import { Resend } from "resend";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  try {
    if (!token) throw new Error("Missing token");

    const secret = process.env.SUBSCRIBE_TOKEN_SECRET!;
    const payload = verifyToken<{ email: string; purpose: string; exp: number }>(token, secret);
    if (payload.purpose !== "confirm") throw new Error("Wrong token purpose");

    const email = payload.email.toLowerCase().trim();

    // First, check if already confirmed to prevent duplicate welcome emails
    const { data: existingSubscriber } = await supabaseAdmin
      .from("subscribers")
      .select("status, confirmed_at, referral_code")
      .eq("email", email)
      .single();

    // If already active/confirmed, just redirect without sending another email
    const alreadyConfirmed = existingSubscriber?.status === "active" && existingSubscriber?.confirmed_at;

    if (!alreadyConfirmed) {
      // Update to active status
      const { error } = await supabaseAdmin
        .from("subscribers")
        .update({ status: "active", confirmed_at: new Date().toISOString() })
        .eq("email", email);

      if (error) console.error("Confirm update error:", error.message);
    }

    // Only send welcome email if this is the first confirmation
    if (!alreadyConfirmed) {
      const resend = new Resend(process.env.RESEND_API_KEY!);
      const from = process.env.EMAIL_FROM!;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
      const unsubToken = makeToken(email, "unsubscribe", secret, 365 * 24);
      const unsubUrl = `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

      // Generate referral URL for this subscriber
      const referralCode = existingSubscriber?.referral_code;
      const referralUrl = referralCode ? `${siteUrl}?ref=${referralCode}` : siteUrl;

      await resend.emails.send({
        from,
        to: email,
        subject: "Welcome to /thepaymentsnerd",
        html: `
          <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto; line-height: 1.6; max-width: 520px;">
            <p>Welcome 👋</p>

            <p>
              You're now subscribed to <strong>/thepaymentsnerd</strong>.
            </p>

            <p>
              <strong>📬 What to expect:</strong>
            </p>

            <ul>
              <li>Daily at 9:30 AM GMT (Mon-Fri)</li>
              <li>5 hand-picked signals from payments & fintech</li>
              <li>3-minute read, zero fluff</li>
              <li>Curated daily, never generic press releases</li>
            </ul>

            <p>
              I built this for myself—my daily filter through 50+ payments sources to find what actually matters. Makes me smarter every morning. Sharing in case it helps you too.
            </p>

            <p>
              <strong>✓ Your first issue arrives tomorrow at 9:30 AM GMT</strong><br/>
              <strong>✓ Whitelist this email to never miss it</strong><br/>
              <strong>✓ One-click unsubscribe anytime</strong>
            </p>

            ${referralCode ? `
            <div style="margin-top: 32px; padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111827;">
                💙 Share with your network
              </p>
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #4b5563;">
                Know someone who'd benefit from daily payments insights? Share your unique link:
              </p>
              <p style="margin: 0; padding: 10px; background-color: #ffffff; border: 1px solid #d1d5db; border-radius: 6px; font-family: monospace; font-size: 12px; word-break: break-all;">
                <a href="${referralUrl}" style="color: #2563eb; text-decoration: none;">${referralUrl}</a>
              </p>
            </div>
            ` : ''}

            <p style="margin-top: 24px;">
              — César
            </p>

            <p style="margin-top: 8px; color: #666; font-size: 14px;">
              P.S. Questions? Just reply.
            </p>

            <p style="margin-top:24px;color:#666;font-size:12px">
              <a href="${unsubUrl}">Unsubscribe</a>
            </p>
          </div>
        `,
      });
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?subscribed=1`);
  } catch (e: any) {
    console.error("Confirm route error:", e?.message || e);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?subscribed=0`);
  }
}
