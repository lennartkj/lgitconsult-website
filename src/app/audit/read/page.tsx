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
  body: "Not ready for the full Audit? Send a single surface — one room, your wardrobe, a handful of pieces — and get a one-page verdict from the eye. Faster, lighter, the same judgment.",
  noteLabel: "What do you want read?",
  notePlaceholder: "One room, your wardrobe, a few pieces…",
  cta: "Request the Read ▸",
  success: "Noted.",
  successBody:
    "The Read opens soon, by request. We will let you know the moment it is ready — quietly, by email.",
  consentText:
    "I agree that Patina may store and process this information to contact me about The Read, per the privacy policy.",
  backHref: "/audit",
  backLabel: "◂ The Audit",
};

export default function TheReadPage() {
  return <ClinicalCapture config={config} />;
}
