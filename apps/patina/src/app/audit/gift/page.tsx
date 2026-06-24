import { Metadata } from "next";
import ClinicalCapture, {
  type CaptureConfig,
} from "@/components/audit/ClinicalCapture";

export const metadata: Metadata = {
  title: "Gift the Audit · Patina",
  description: "Give someone the eye — a private taste Audit, arranged discreetly.",
  robots: { index: false, follow: false },
};

const config: CaptureConfig = {
  product: "Patina · Gifted Audit",
  trackPrefix: "gift",
  kicker: "Patina · In Confidence",
  title: "Give the culture.",
  body: "Some things cannot be bought for oneself; they have to be given. The eye, over a home, a wardrobe, whatever someone collects — arranged in private, so they receive only the conclusion.",
  extraLabel: "Who is it for?",
  extraPlaceholder: "Their name",
  noteLabel: "Anything we should know?",
  notePlaceholder: "The occasion, the relationship.",
  cta: "Arrange it ▸",
  success: "Consider it done.",
  successBody:
    "We will be in touch privately, with how it works and how to give it.",
  consentText:
    "I agree that Patina may keep and use what I show, to arrange the gift, in confidence — per the privacy policy.",
  backHref: "/audit",
  backLabel: "◂ The Audit",
};

export default function GiftAuditPage() {
  return <ClinicalCapture config={config} />;
}
