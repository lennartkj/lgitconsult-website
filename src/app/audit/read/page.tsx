import { Metadata } from "next";
import ClinicalCapture, {
  type CaptureConfig,
} from "@/components/audit/ClinicalCapture";

export const metadata: Metadata = {
  title: "The Read · Patina",
  description: "A fast, single-surface verdict from the eye — a lighter taste of the Audit.",
  robots: { index: false, follow: false },
};

// Fake-door for the tripwire product (MARKET.md §2 #4) — demand-test before building.
const config: CaptureConfig = {
  product: "Patina · The Read",
  trackPrefix: "read",
  kicker: "Patina · The Read",
  title: "The Read",
  body: "Less than the full eye. One thing — a room, a wardrobe, a few pieces. Send it, and a single page comes back: what is right, what is not, and what to do next.",
  noteLabel: "What do you want read?",
  notePlaceholder: "One room. Your wardrobe. A few pieces.",
  cta: "Send it ▸",
  success: "Noted.",
  successBody:
    "The Read opens soon, by invitation. We will let you know when, quietly.",
  consentText:
    "I agree that Patina may keep and use what I show, to contact me about The Read, in confidence — per the privacy policy.",
  backHref: "/audit",
  backLabel: "◂ The Audit",
};

export default function TheReadPage() {
  return <ClinicalCapture config={config} />;
}
