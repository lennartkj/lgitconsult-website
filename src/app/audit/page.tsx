import { Metadata } from "next";
import AuditContent from "@/components/audit/AuditContent";

export const metadata: Metadata = {
  title: "The Audit | LGIT",
  description:
    "A private taste audit. Look like money, never like an idiot. By application.",
};

export default function AuditPage() {
  return <AuditContent />;
}
