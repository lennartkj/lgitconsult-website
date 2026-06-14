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
  kicker: "Patina · The Audit",
  title: "Gift the Audit",
  body: "Give someone the eye — a private read of what to keep, what to lose, what to acquire. Arranged discreetly; they never see the machinery, only the verdict.",
  extraLabel: "Who is it for?",
  extraPlaceholder: "Their name",
  noteLabel: "Anything we should know?",
  notePlaceholder: "The occasion, the relationship, anything useful.",
  cta: "Request a gift ▸",
  success: "Noted.",
  successBody:
    "The gifted Audit is arranged privately, by request. We will be in touch with how it works and how to present it.",
  consentText:
    "I agree that Patina may store and process this information to arrange the gift, per the privacy policy.",
  backHref: "/audit",
  backLabel: "◂ The Audit",
};

export default function GiftAuditPage() {
  return <ClinicalCapture config={config} />;
}
