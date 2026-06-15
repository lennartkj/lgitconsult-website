import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { rateLimit, clientIp } from "@/lib/ratelimit";

// Generic waitlist intake — shared by the pre-launch B2C product landings
// (Coterie, Provenance, Sibyl). Patina has its own richer funnel at /api/audit.
const waitlistSchema = z.object({
  product: z.string().min(1, { message: "Missing product" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  note: z.string().optional().default(""),
  consent: z
    .boolean()
    .refine((val) => val === true, { message: "Consent is required" }),
});

// Where signups land. Override per-brand via env once each product has its own
// verified sending domain (see the holding/product brand note in the docs).
const TO_EMAIL =
  process.env.WAITLIST_TO_EMAIL ||
  process.env.AUDIT_TO_EMAIL ||
  "lennartgruendel@git-consult.group";
const FROM_EMAIL =
  process.env.WAITLIST_FROM_EMAIL || "LGIT <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(`waitlist:${clientIp(request)}`, 10, 10 * 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json();
    const result = waitlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const signup = result.data;

    // Always log as a backup — a lead is never lost even if email delivery fails.
    console.log("Waitlist signup:", signup);

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const lines = [
        `New ${signup.product} waitlist signup.`,
        ``,
        `Product: ${signup.product}`,
        `Name:    ${signup.name}`,
        `Email:   ${signup.email}`,
        ``,
        signup.note ? `Note:\n${signup.note}` : `Note: —`,
      ];
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          replyTo: signup.email,
          subject: `New ${signup.product} waitlist — ${signup.name}`,
          text: lines.join("\n"),
        });
      } catch (err) {
        // Don't fail the signer — the signup is already logged as backup.
        console.error(
          "Waitlist email delivery failed (signup still logged):",
          err
        );
      }
    } else {
      console.warn(
        "RESEND_API_KEY not set — waitlist signup logged only, no email sent."
      );
    }

    return NextResponse.json(
      { success: true, message: "You're on the list." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing waitlist signup:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "There was an error processing your request. Please try again later.",
      },
      { status: 500 }
    );
  }
}
