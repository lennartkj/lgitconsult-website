import { Metadata } from "next";
import AuditWizard from "@/components/audit/AuditWizard";

export const metadata: Metadata = {
  title: "The Audit · Patina",
  description:
    "Patina — a private taste audit. Look like money, never like an idiot. By application.",
};

export default function AuditPage() {
  return <AuditWizard />;
}
