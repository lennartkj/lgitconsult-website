import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { assessAudit, type AuditImage } from "@/lib/audit/assess";
import { rateLimit, clientIp } from "@/lib/ratelimit";

const imageSchema = z.object({
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  dataBase64: z.string().min(1),
  // R5 · captioned photos (read-intake phase only). The surface the photo shows
  // and an optional client note, so the assess can cite specific images.
  surface: z.string().optional().default(""),
  caption: z.string().optional().default(""),
});

// The Audit application — the intake is now a taste-profile test (AuditWizard):
// name + email + budget + a derived taste type, plus two human "flavour" answers
// (childhood sweet, what they saw in the pattern). focus/about are legacy-optional.
//
// TWO PHASES (the `phase` discriminator):
//   · "order"       — the free-test submit (default). The operator gets the order +
//                     lead instantly; NO assess (the near-blind first pass is gone).
//   · "read-intake" — the post-payment deep intake (R1–R6). Carries the free-test
//                     answers (by email) + the deep answers; the meaningful assess
//                     runs HERE on the COMBINED picture, and a second email is sent.
const auditSchema = z.object({
  phase: z.enum(["order", "read-intake"]).optional().default("order"),
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
  // F1 · why-now trigger (free test) · F3 · the oblique tell (free test).
  trigger: z.string().optional().default(""),
  tell: z.string().optional().default(""),
  // Read-intake (R1–R6) deep fields.
  audience: z.string().optional().default(""),   // R2 · the feared eye
  unsurePiece: z.string().optional().default(""), // R6 · the sting
  focus: z.array(z.string()).optional().default([]),
  about: z.string().optional().default(""),
  links: z.string().optional().default(""),
  consent: z.boolean().optional().default(false),
  company: z.string().optional().default(""), // honeypot
  images: z.array(imageSchema).max(6).optional().default([]),
}).superRefine((data, ctx) => {
  // Consent is collected once, at the free-test "order" phase. The post-payment
  // read-intake carries the same client forward (matched by email) and must not be
  // gated on re-consenting.
  if (data.phase !== "read-intake" && data.consent !== true) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["consent"], message: "Consent is required" });
  }
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
    const isReadIntake = application.phase === "read-intake";
    const isAuditApply = application.intent === "audit";

    // The combined intake handed to the eye. Maps the wizard/intake field names onto
    // assess.ts's AuditIntake (tell → oblique). On the read-intake phase this carries
    // BOTH the free-test answers (sent again from localStorage) and the deep answers.
    const intake = {
      name: application.name,
      intent: application.intent,
      focus: application.focus,
      budget: application.budget,
      budgetBand: application.budget, // R4 banded value arrives in `budget`
      about: application.about,
      links: application.links,
      tasteType: application.tasteType,
      sweet: application.sweet,
      seen: application.seen,
      trigger: application.trigger,
      oblique: application.tell,
      audience: application.audience,
      unsurePiece: application.unsurePiece,
    };
    const resendKey = process.env.RESEND_API_KEY;

    console.log("Audit application:", { phase: application.phase, ...intake, imageCount: images.length });

    // ── The instant operator email (the order/lead). Always sent; phase-aware.
    // On "order" it's the new Read order / Audit application; on "read-intake" it's
    // the full deep intake (the AI draft on the COMBINED picture follows separately).
    if (resendKey) {
      const lines = isReadIntake
        ? [
            `Read intake received (post-payment) — the full picture.`,
            `An AI draft on the COMBINED intake (free test + this) follows in a separate email.`,
            ``,
            `Name:     ${intake.name}`,
            `Email:    ${application.email}`,
            intake.tasteType ? `Type:     ${intake.tasteType}` : `Type:     —`,
            ``,
            intake.trigger ? `Why now (trigger): ${intake.trigger}` : ``,
            intake.about ? `What changed (in full): ${intake.about}` : ``,
            intake.audience ? `Audience they fear: ${intake.audience}` : ``,
            intake.focus.length ? `Eye on: ${intake.focus.join(", ")}` : ``,
            intake.budgetBand ? `Budget band: ${intake.budgetBand}` : ``,
            intake.unsurePiece ? `THE UNSURE PIECE: ${intake.unsurePiece}` : ``,
            intake.oblique ? `Shown no one: ${intake.oblique}` : ``,
            `Photos:   ${images.length}${images.length ? " (captioned)" : ""}`,
            ...images.map((img, i) => `  Photo ${i + 1}: ${img.surface || "—"}${img.caption ? ` — "${img.caption}"` : ""}`),
          ].filter((l) => l !== ``)
        : [
            isAuditApply ? `New Audit application (by application — NO payment).` : `New Read order (€150 — pays at Stripe).`,
            ``,
            `Path:    ${isAuditApply ? "Audit application" : "Read (€150)"}`,
            `Name:    ${intake.name}`,
            `Email:   ${application.email}`,
            intake.tasteType ? `Type:    ${intake.tasteType}` : `Type:    —`,
            intake.trigger ? `Why now:  ${intake.trigger}` : ``,
            `Photos:  ${images.length}`,
            ``,
            intake.sweet ? `Childhood sweet: ${intake.sweet}` : ``,
            intake.seen ? `Saw in the pattern: ${intake.seen}` : ``,
            intake.oblique ? `Shown no one: ${intake.oblique}` : ``,
            ``,
            isAuditApply
              ? `The operator closes the Audit by call — no AI draft on this lead.`
              : `The deep Read intake + AI draft follow once they complete the post-payment intake.`,
          ].filter((l) => l !== ``);
      const subject = isReadIntake
        ? `Read intake (full) — ${intake.name}${intake.tasteType ? ` (${intake.tasteType})` : ""}`
        : `${isAuditApply ? "New Audit application" : "New Read order (€150)"} — ${intake.name}${intake.tasteType ? ` (${intake.tasteType})` : ""}`;
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          replyTo: application.email,
          subject,
          text: lines.join("\n"),
        });
      } catch (err) {
        console.error("Audit email delivery failed (application still logged):", err);
      }
    } else {
      console.warn("RESEND_API_KEY not set — Audit application logged only, no email sent.");
    }

    // ── The 80%: the AI first-pass. It now runs ONLY on the read-intake phase, on the
    // COMBINED picture (type + trigger + audience + focus + budget + captioned photos
    // + the unsure piece) — never the near-blind initial submit. The "order" phase
    // (and the by-application Audit path) sends the operator the lead instantly and
    // does NOT spend tokens; the meaningful draft is produced post-intake.
    if (isReadIntake) {
      after(async () => {
        if (!process.env.ANTHROPIC_API_KEY) {
          console.warn("ANTHROPIC_API_KEY not set — skipping Audit AI pre-process.");
          return;
        }
        try {
          const assessment = await assessAudit(intake, images as AuditImage[]);
          const draft = [
            `AI draft (Read) for ${intake.name}${intake.tasteType ? ` — ${intake.tasteType}` : ""}. Review, override, then send.`,
            `Built from the COMBINED intake (free test + post-payment Read intake). This is the 80%; the eye is the product, nothing ships unrefined.`,
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
              subject: `Read AI draft — ${intake.name} (review before sending)`,
              text: draft,
            });
          } else {
            console.log("Read AI draft (no RESEND_API_KEY to send it):\n", draft);
          }
        } catch (err) {
          console.error("Audit AI pre-process failed:", err);
        }
      });
    }

    return NextResponse.json({ success: true, message: "Application received." }, { status: 200 });
  } catch (error) {
    console.error("Error processing audit application:", error);
    return NextResponse.json(
      { success: false, message: "There was an error processing your request. Please try again later." },
      { status: 500 }
    );
  }
}
