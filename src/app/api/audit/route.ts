import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { assessAudit, type AuditImage } from "@/lib/audit/assess";

const imageSchema = z.object({
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  dataBase64: z.string().min(1),
});

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
  // Honeypot — humans leave it empty; bots fill it. Optional, never shown.
  company: z.string().optional().default(""),
  // Client-compressed photos (base64, no data: prefix). Capped to keep the
  // request well under the serverless body limit.
  images: z.array(imageSchema).max(6).optional().default([]),
});

// Where applications land. Override the brand strings via env once the product
// has its own name + a verified sending domain (see the holding/product brand note).
const TO_EMAIL = process.env.AUDIT_TO_EMAIL || "lennartgruendel@git-consult.group";
const FROM_EMAIL = process.env.AUDIT_FROM_EMAIL || "Patina <onboarding@resend.dev>";

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

    // Honeypot tripped → a bot. Accept silently (don't tip it off), but do not
    // log, email, or spend Opus tokens on it.
    if (application.company) {
      console.warn("Audit honeypot tripped — dropping submission.");
      return NextResponse.json(
        { success: true, message: "Application received." },
        { status: 200 }
      );
    }

    const { images } = application;
    const intake = {
      name: application.name,
      focus: application.focus,
      budget: application.budget,
      about: application.about,
      links: application.links,
    };
    const resendKey = process.env.RESEND_API_KEY;

    // Always log (without the base64 blobs) — a lead is never lost even if email fails.
    console.log("Audit application:", { ...intake, imageCount: images.length });

    // Immediate operator email — the raw application, sent in-request as the
    // reliable backup. The richer AI draft follows via after() below.
    if (resendKey) {
      const lines = [
        `New Audit application.`,
        ``,
        `Name:    ${intake.name}`,
        `Email:   ${application.email}`,
        `Focus:   ${intake.focus.join(", ")}`,
        `Budget:  ${intake.budget}`,
        `Photos:  ${images.length}`,
        ``,
        `About / where they want to land:`,
        intake.about,
        ``,
        intake.links ? `Links:\n${intake.links}` : `Links: —`,
        ``,
        images.length
          ? `An AI first-pass assessment follows in a separate email.`
          : `No photos attached — AI first-pass will be text-only.`,
      ];
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          replyTo: application.email,
          subject: `New Audit application — ${intake.name}`,
          text: lines.join("\n"),
        });
      } catch (err) {
        console.error("Audit email delivery failed (application still logged):", err);
      }
    } else {
      console.warn(
        "RESEND_API_KEY not set — Audit application logged only, no email sent."
      );
    }

    // The 80%: run the AI pre-process AFTER responding, so the applicant gets an
    // instant ack and never waits on the model. The draft + raw assessment land
    // in the operator's inbox to review and override (the operator review queue,
    // inbox-edition). Tokens are only spent on submissions that pass schema +
    // honeypot, never on raw bot spam. See docs/products/patina/DECISIONS.md.
    after(async () => {
      if (!process.env.ANTHROPIC_API_KEY) {
        console.warn("ANTHROPIC_API_KEY not set — skipping Audit AI pre-process.");
        return;
      }
      try {
        const assessment = await assessAudit(intake, images as AuditImage[]);

        const draft = [
          `AI first-pass assessment for ${intake.name} — review, override, then send.`,
          `This is the 80%. The eye is the product; nothing ships unrefined.`,
          ``,
          `SUMMARY`,
          assessment.summary,
          ``,
          `WHAT WORKS`,
          ...assessment.works.map((w) => `  • ${w}`),
          ``,
          `WHAT TO LOSE`,
          ...assessment.lose.map((l) => `  • ${l}`),
          ``,
          `DIRECTION`,
          ...assessment.direction.map((d) => `  ${d}`),
          ``,
          `STARTER LIST`,
          ...assessment.starter.map(
            (s) =>
              `  • ${s.piece} — ${s.where}${s.range ? ` (${s.range})` : ""}\n    ${s.why}`
          ),
          ``,
          `— Refine, then paste into the AuditDeliverable data to produce the client document.`,
        ].join("\n");

        if (resendKey) {
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: FROM_EMAIL,
            to: TO_EMAIL,
            replyTo: application.email,
            subject: `Audit AI draft — ${intake.name} (review before sending)`,
            text: draft,
          });
        } else {
          console.log("Audit AI draft (no RESEND_API_KEY to send it):\n", draft);
        }
      } catch (err) {
        console.error("Audit AI pre-process failed:", err);
      }
    });

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
