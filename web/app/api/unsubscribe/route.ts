/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyToken } from "@/lib/emailTokens";

/**
 * GET handler - Shows confirmation page instead of immediately unsubscribing
 * This prevents corporate email security scanners from auto-unsubscribing users
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  try {
    if (!token) throw new Error("Missing token");

    // Verify token is valid before showing confirmation page
    const secret = process.env.SUBSCRIBE_TOKEN_SECRET!;
    const payload = verifyToken<{ email: string; purpose: string; exp: number }>(token, secret);
    if (payload.purpose !== "unsubscribe") throw new Error("Wrong token purpose");

    // Redirect to confirmation page (safe for email scanners to click)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${encodeURIComponent(token)}`);
  } catch (e: any) {
    console.error("Unsubscribe GET error:", e?.message || e);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?error=1`);
  }
}

/**
 * POST handler - Actually performs the unsubscribe action
 * Only triggered when user clicks "Confirm" button on the confirmation page
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  try {
    if (!token) throw new Error("Missing token");

    const secret = process.env.SUBSCRIBE_TOKEN_SECRET!;
    const payload = verifyToken<{ email: string; purpose: string; exp: number }>(token, secret);
    if (payload.purpose !== "unsubscribe") throw new Error("Wrong token purpose");

    const email = payload.email.toLowerCase().trim();

    const { error } = await supabaseAdmin
      .from("subscribers")
      .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
      .eq("email", email);

    if (error) {
      console.error("Unsubscribe update error:", error.message);
      return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
    }

    console.log(`✅ Unsubscribed: ${email}`);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Unsubscribe POST error:", e?.message || e);
    return NextResponse.json({ error: e?.message || "Invalid token" }, { status: 400 });
  }
}
