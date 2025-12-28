/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyToken } from "@/lib/emailTokens";

export async function GET(req: Request) {
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

    if (error) console.error("Unsubscribe update error:", error.message);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?unsubscribed=1`);
  } catch (e: any) {
    console.error("Unsubscribe route error:", e?.message || e);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?unsubscribed=0`);
  }
}
