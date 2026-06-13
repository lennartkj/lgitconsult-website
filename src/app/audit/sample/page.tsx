import { Metadata } from "next";
import AuditDeliverable, { AuditData } from "@/components/audit/AuditDeliverable";

export const metadata: Metadata = {
  title: "The Audit — Sample | LGIT",
  description: "A sample Audit deliverable.",
  robots: { index: false, follow: false },
};

// Sample data — illustrates the deliverable template. Real Audits are generated
// per client (AI pre-process → operator approval), not hard-coded.
const sample: AuditData = {
  client: "M.",
  date: "June 2026",
  summary:
    "You have the means and the instinct — what's missing is restraint and coherence. Here is what already reads right, what's quietly giving you away, and where to take it.",
  works: [
    "The watch is correct, and worn rather than flashed — keep doing exactly that.",
    "Your instinct toward monochrome is sound; we build on it.",
  ],
  lose: [
    "The visible logos. They do the precise opposite of what you want.",
    "The matched, showroom-new furniture set — it reads as bought, not chosen.",
    "Anything acquired because it was trending this year.",
  ],
  direction: [
    "The move is from flash to restraint. Old money is recognised by what it leaves out; new money gives itself away by addition. We are going to subtract, then anchor.",
    "Build each room and each look around one or two excellent things and give them space. A few considered pieces with patina will outclass a wall of new and expensive every time.",
    "Coherence is the whole game: one era, one palette, one register, holding together. Where you reach for something loud, reach instead for the quietest version that still has presence.",
  ],
  starter: [
    {
      piece: "Dieter Rams 606 Universal Shelving (Vitsœ)",
      where: "Vitsœ, direct",
      why: "The anchor. Buy once, add to it for life; quiet authority in any room.",
      range: "€2–6k",
    },
    {
      piece: "Daido Moriyama — gelatin silver print",
      where: "Phillips / specialist dealers",
      why: "Grain as material truth. Signals an eye, not wall-filler.",
      range: "€3–12k",
    },
    {
      piece: "Helmut Lang archive (late-90s)",
      where: "Grailed / archive dealers",
      why: "The cornerstone of quiet taste — austere, anti-hype, unmistakable to those who know.",
      range: "€300–2k",
    },
    {
      piece: "Leica M6 (clean, used)",
      where: "Specialist / Kleinanzeigen",
      why: "An object that reads as knowing, not as spending.",
      range: "€2.5–4k",
    },
  ],
};

export default function AuditSamplePage() {
  return <AuditDeliverable audit={sample} />;
}
