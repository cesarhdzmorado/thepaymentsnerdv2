/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";;
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

    const { error } = await supabaseAdmin
      .from("subscribers")
      .update({ status: "active", confirmed_at: new Date().toISOString() })
      .eq("email", email);

    if (error) console.error("Confirm update error:", error.message);

    // Optional welcome email
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const from = process.env.EMAIL_FROM!;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    const unsubToken = makeToken(email, "unsubscribe", secret, 365 * 24);
    const unsubUrl = `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

    await resend.emails.send({
      from,
      to: email,
      subject: "Welcome to /thepaymentsnerd",
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto; line-height: 1.6; max-width: 520px;">
          <p>Welcome 👋</p>

          <p>
            You’re now subscribed to <strong>/thepaymentsnerd</strong>.
          </p>

          <p>
            Every day, you’ll get:
          </p>

          <ul>
            <li>5 <strong>important signals</strong> from payments and fintech</li>
            <li>No press releases, no fluff</li>
            <li>Written by a human, not scraped</li>
          </ul>

          <p>
            This exists because payments news are either:
            <br/>• too shallow
            <br/>• too salesy
            <br/>• or too late
          </p>

          <p>
            If you ever feel it’s not useful, one click unsubscribes you.
          </p>

          <p>
            — César
            <br/>
            <span style="color:#666;font-size:12px">
          </p>

          <p style="margin-top:24px;color:#666;font-size:12px">
            <a href="${unsubUrl}">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?subscribed=1`);
  } catch (e: any) {
    console.error("Confirm route error:", e?.message || e);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?subscribed=0`);
  }
}
