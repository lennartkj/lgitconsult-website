import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { rateLimit, clientIp } from "@/lib/ratelimit";

// Lead intake for the /auftritt offer page (the one digital offer on
// git-consult.group). Pattern copied from /api/waitlist: zod → rate limit →
// Resend email with a console fallback so a lead is never lost.
//
// The email body carries the qualifying facts (region, project, budget) AND the
// ad attribution (gclid / utm_*), because the inbox is the durable conversion
// counter for the €500 probe — Vercel console logs are ephemeral.

const REGION_LABELS: Record<string, string> = {
  "stadt-leipzig": "Stadt Leipzig",
  "landkreis-leipzig": "Landkreis Leipzig",
  nordsachsen: "Landkreis Nordsachsen",
  "sachsen-sonst": "Anderswo in Sachsen",
  ausserhalb: "Außerhalb Sachsens",
};

const leadSchema = z.object({
  company: z.string().trim().min(2, { message: "Bitte den Namen des Unternehmens angeben." }).max(200),
  name: z.string().trim().min(2, { message: "Bitte Ihren Namen angeben." }).max(120),
  email: z.string().trim().email({ message: "Bitte eine gültige E-Mail-Adresse angeben." }),
  phone: z.string().trim().max(60).optional().default(""),
  industry: z.string().trim().max(120).optional().default(""),
  region: z.enum(["stadt-leipzig", "landkreis-leipzig", "nordsachsen", "sachsen-sonst", "ausserhalb"], {
    message: "Bitte den Standort auswählen.",
  }),
  project: z.enum(["website", "anwendung", "integration", "unklar"], {
    message: "Bitte das Vorhaben auswählen.",
  }),
  budget: z.enum(["unter-5000", "5000-15000", "ueber-15000", "unklar"], {
    message: "Bitte den Rahmen auswählen.",
  }),
  message: z.string().trim().min(10, { message: "Ein, zwei Sätze zum Vorhaben genügen." }).max(4000),
  // No consent checkbox: contact-form processing runs on Art. 6 (1) b/f DSGVO;
  // the form shows the notice + the link to the Datenschutzerklärung instead
  // (legal-copy pass, 2026-09-07).
  // Honeypot — real users never fill this. Accepted (not rejected) so a bot
  // that fills it gets the fake-success branch below instead of a 400 to retry.
  website: z.string().max(500).optional().default(""),
  attribution: z
    .object({
      gclid: z.string().max(200).optional(),
      utm_source: z.string().max(100).optional(),
      utm_medium: z.string().max(100).optional(),
      utm_campaign: z.string().max(200).optional(),
      utm_term: z.string().max(200).optional(),
      utm_content: z.string().max(200).optional(),
      landing: z.string().max(300).optional(),
      referrer: z.string().max(300).optional(),
    })
    .optional()
    .default({}),
});

const TO_EMAIL =
  process.env.AUFTRITT_TO_EMAIL ||
  process.env.WAITLIST_TO_EMAIL ||
  process.env.AUDIT_TO_EMAIL ||
  "lennartgruendel@git-consult.group";
const FROM_EMAIL =
  process.env.WAITLIST_FROM_EMAIL || "LGIT <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(`auftritt:${clientIp(request)}`, 8, 10 * 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, message: "Zu viele Anfragen. Bitte in ein paar Minuten noch einmal versuchen." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json();
    const result = leadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const lead = result.data;

    // Honeypot hit: pretend success, send nothing.
    if (lead.website) {
      return NextResponse.json({ success: true, message: "Danke." }, { status: 200 });
    }

    const ts = new Date().toISOString();
    // Always log as a backup — a lead is never lost even if email delivery fails.
    console.log("[auftritt-lead]", JSON.stringify({ ...lead, ts }));

    const a = lead.attribution ?? {};
    const lines = [
      `Erstgespräch angefragt — Auftritt (git-consult.group/auftritt)`,
      ``,
      `Unternehmen: ${lead.company}`,
      `Name:        ${lead.name}`,
      `E-Mail:      ${lead.email}`,
      `Telefon:     ${lead.phone || "—"}`,
      `Branche:     ${lead.industry || "—"}`,
      `Standort:    ${REGION_LABELS[lead.region] ?? lead.region}`,
      `Vorhaben:    ${lead.project}`,
      `Rahmen:      ${lead.budget}`,
      ``,
      `Worum es geht:`,
      lead.message,
      ``,
      `— Attribution —`,
      `gclid:        ${a.gclid || "—"}`,
      `utm_source:   ${a.utm_source || "—"}`,
      `utm_medium:   ${a.utm_medium || "—"}`,
      `utm_campaign: ${a.utm_campaign || "—"}`,
      `utm_term:     ${a.utm_term || "—"}`,
      `utm_content:  ${a.utm_content || "—"}`,
      `landing:      ${a.landing || "—"}`,
      `referrer:     ${a.referrer || "—"}`,
      `time:         ${ts}`,
    ];

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          replyTo: lead.email,
          subject: `Erstgespräch Auftritt — ${lead.company} (${REGION_LABELS[lead.region] ?? lead.region})`,
          text: lines.join("\n"),
        });
      } catch (err) {
        console.error("Auftritt lead email delivery failed (lead still logged):", err);
      }
    } else {
      console.warn("RESEND_API_KEY not set — Auftritt lead logged only, no email sent.");
    }

    return NextResponse.json(
      { success: true, message: "Danke. In der Regel melden wir uns innerhalb eines Werktags, spätestens innerhalb von drei Werktagen." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Auftritt lead:", error);
    return NextResponse.json(
      { success: false, message: "Da ist etwas schiefgelaufen. Bitte später noch einmal versuchen oder direkt an info@git-consult.group schreiben." },
      { status: 500 }
    );
  }
}
