import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

// The Audit application schema — mirrors the intake fields in AuditContent.
const auditSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  focus: z.array(z.string()).min(1, { message: "Select at least one focus" }),
  budget: z.string().min(1, { message: "Please select a budget range" }),
  about: z.string().min(10, { message: "Tell us a little more (10+ characters)" }),
  links: z.string().optional().default(""),
  consent: z
    .boolean()
    .refine((val) => val === true, { message: "Consent is required" }),
});

// Where applications land. Override the brand strings via env once the product
// has its own name + a verified sending domain (see the holding/product brand note).
const TO_EMAIL = process.env.AUDIT_TO_EMAIL || "lennartgruendel@git-consult.group";
const FROM_EMAIL = process.env.AUDIT_FROM_EMAIL || "Audit <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = auditSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const application = result.data;

    // Always log as a backup — a lead is never lost even if email delivery fails.
    console.log("Audit application:", application);

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const lines = [
        `New Audit application.`,
        ``,
        `Name:    ${application.name}`,
        `Email:   ${application.email}`,
        `Focus:   ${application.focus.join(", ")}`,
        `Budget:  ${application.budget}`,
        ``,
        `About / where they want to land:`,
        application.about,
        ``,
        application.links ? `Links:\n${application.links}` : `Links: —`,
      ];
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          replyTo: application.email,
          subject: `New Audit application — ${application.name}`,
          text: lines.join("\n"),
        });
      } catch (err) {
        // Don't fail the applicant — the application is already logged as backup.
        console.error("Audit email delivery failed (application still logged):", err);
      }
    } else {
      console.warn(
        "RESEND_API_KEY not set — Audit application logged only, no email sent."
      );
    }

    // TODO (next): persist the application + kick off the AI pre-process
    // (src/lib/audit/assess.ts) into an operator review queue.

    return NextResponse.json(
      { success: true, message: "Application received." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing audit application:", error);
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
