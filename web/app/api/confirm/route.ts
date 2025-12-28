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
      subject: "You're subscribed",
      html: `
        <div style="font-family:system-ui;line-height:1.4">
          <p>You’re in.</p>
          <p>You’ll get one payments insight per day (no noise).</p>
          <p style="color:#666;font-size:12px"><a href="${unsubUrl}">Unsubscribe</a></p>
        </div>
      `,
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?subscribed=1`);
  } catch (e: any) {
    console.error("Confirm route error:", e?.message || e);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?subscribed=0`);
  }
}
