/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateDailyNewsletterEmail, generateEmailSubject } from "@/lib/emailTemplate";

/**
 * Test Email Endpoint
 *
 * This endpoint allows you to send a test newsletter email to yourself
 * without needing to be in the subscribers database.
 *
 * Usage:
 *   GET /api/test-email?to=your-email@example.com&secret=YOUR_TEST_SECRET
 *
 * Environment variables required:
 *   - TEST_EMAIL_SECRET: A secret token to protect this endpoint
 *   - RESEND_API_KEY: Your Resend API key
 *   - EMAIL_FROM: The sender email address
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const testEmail = searchParams.get("to");
    const secret = searchParams.get("secret");

    // Validate secret
    if (secret !== process.env.TEST_EMAIL_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate email parameter
    if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      return NextResponse.json(
        { error: "Invalid or missing 'to' email parameter" },
        { status: 400 }
      );
    }

    // Get latest newsletter
    const { data: newsletter, error: nErr } = await supabaseAdmin
      .from("newsletters")
      .select("publication_date, content")
      .order("publication_date", { ascending: false })
      .limit(1)
      .single();

    if (nErr || !newsletter) {
      return NextResponse.json(
        { error: "No newsletter found in database" },
        { status: 404 }
      );
    }

    // Generate email HTML and dynamic subject
    const emailHtml = await generateDailyNewsletterEmail({
      publicationDate: newsletter.publication_date,
      news: newsletter.content.news,
      perspective: newsletter.content.perspective,
      curiosity: newsletter.content.curiosity,
      whatsHot: newsletter.content.whats_hot,
      unsubscribeUrl: "https://example.com/unsubscribe?token=test-token",
      referralCode: "TESTCODE",
    });

    const emailSubject = await generateEmailSubject(newsletter.content.news);

    // Send test email
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const from = process.env.EMAIL_FROM!;

    const result = await resend.emails.send({
      from: `The Payments Nerd <${from}>`,
      to: testEmail,
      subject: `[TEST] ${emailSubject}`,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${testEmail}`,
      emailId: result.data?.id,
      newsletter: {
        date: newsletter.publication_date,
        newsCount: newsletter.content.news.length,
      },
    });
  } catch (e: any) {
    console.error("Test email error:", e.message);
    return NextResponse.json(
      { error: e.message || "Failed to send test email" },
      { status: 500 }
    );
  }
}
