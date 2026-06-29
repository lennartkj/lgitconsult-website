import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { assessAudit, type AuditImage } from "@/lib/audit/assess";
import { rateLimit, clientIp } from "@/lib/ratelimit";

const imageSchema = z.object({
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  dataBase64: z.string().min(1),
});

// The Audit application — the intake is now a taste-profile test (AuditWizard):
// name + email + budget + a derived taste type, plus two human "flavour" answers
// (childhood sweet, what they saw in the pattern). focus/about are legacy-optional.
const auditSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  // The dual offer: "read" = the €150 Read (→ Stripe), "audit" = a by-application
  // Audit enquiry (no payment). The operator triages by this so a Read and an Audit
  // application never get confused. Defaults to "read" (the primary path).
  intent: z.enum(["read", "audit"]).optional().default("read"),
  budget: z.string().optional().default(""),
  tasteType: z.string().optional().default(""),
  sweet: z.string().optional().default(""),
  seen: z.string().optional().default(""),
  focus: z.array(z.string()).optional().default([]),
  about: z.string().optional().default(""),
  links: z.string().optional().default(""),
  consent: z.boolean().refine((val) => val === true, { message: "Consent is required" }),
  company: z.string().optional().default(""), // honeypot
  images: z.array(imageSchema).max(6).optional().default([]),
});

const TO_EMAIL = process.env.AUDIT_TO_EMAIL || "lennartgruendel@git-consult.group";
const FROM_EMAIL = process.env.AUDIT_FROM_EMAIL || "Patina <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  try {
    // Rate limit before any work — protects the Opus call from scripted abuse.
    const rl = rateLimit(`audit:${clientIp(request)}`, 5, 10 * 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please wait a moment and try again." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json();
    const result = auditSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const application = result.data;

    // Honeypot → bot. Accept silently; do not log, email, or spend tokens.
    if (application.company) {
      console.warn("Audit honeypot tripped — dropping submission.");
      return NextResponse.json({ success: true, message: "Application received." }, { status: 200 });
    }

    const { images } = application;
    const intake = {
      name: application.name,
      intent: application.intent,
      focus: application.focus,
      budget: application.budget,
      about: application.about,
      links: application.links,
      tasteType: application.tasteType,
      sweet: application.sweet,
      seen: application.seen,
    };
    const resendKey = process.env.RESEND_API_KEY;

    console.log("Audit application:", { ...intake, imageCount: images.length });

    if (resendKey) {
      const isAuditApply = intake.intent === "audit";
      const lines = [
        isAuditApply ? `New Audit application (by application — NO payment).` : `New Read order (€150 — pays at Stripe).`,
        ``,
        `Path:    ${isAuditApply ? "Audit application" : "Read (€150)"}`,
        `Name:    ${intake.name}`,
        `Email:   ${application.email}`,
        intake.tasteType ? `Type:    ${intake.tasteType}` : `Type:    —`,
        `Budget:  ${intake.budget || "—"}`,
        `Photos:  ${images.length}`,
        ``,
        intake.sweet ? `Childhood sweet: ${intake.sweet}` : ``,
        intake.seen ? `Saw in the pattern: ${intake.seen}` : ``,
        ``,
        images.length
          ? `An AI first-pass assessment follows in a separate email.`
          : `No photos attached — AI first-pass will be text-only.`,
      ].filter((l) => l !== ``);
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          replyTo: application.email,
          subject: `${isAuditApply ? "New Audit application" : "New Read order (€150)"} — ${intake.name}${intake.tasteType ? ` (${intake.tasteType})` : ""}`,
          text: lines.join("\n"),
        });
      } catch (err) {
        console.error("Audit email delivery failed (application still logged):", err);
      }
    } else {
      console.warn("RESEND_API_KEY not set — Audit application logged only, no email sent.");
    }

    // The 80%: AI first-pass after the response, only on screened submissions.
    after(async () => {
      if (!process.env.ANTHROPIC_API_KEY) {
        console.warn("ANTHROPIC_API_KEY not set — skipping Audit AI pre-process.");
        return;
      }
      try {
        const assessment = await assessAudit(intake, images as AuditImage[]);
        const draft = [
          `AI first-pass assessment for ${intake.name}${intake.tasteType ? ` — ${intake.tasteType}` : ""}. Review, override, then send.`,
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
            (s) => `  • ${s.piece} — ${s.where}${s.range ? ` (${s.range})` : ""}\n    ${s.why}`
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

    return NextResponse.json({ success: true, message: "Application received." }, { status: 200 });
  } catch (error) {
    console.error("Error processing audit application:", error);
    return NextResponse.json(
      { success: false, message: "There was an error processing your request. Please try again later." },
      { status: 500 }
    );
  }
}
