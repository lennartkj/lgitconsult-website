import { Metadata } from "next";
import GiftAudit from "@/components/audit/GiftAudit";

export const metadata: Metadata = {
  title: "Gift the Audit · Patina",
  description: "Give someone the eye — a private taste Audit, arranged discreetly.",
  robots: { index: false, follow: false },
};

export default function GiftAuditPage() {
  return <GiftAudit />;
}
