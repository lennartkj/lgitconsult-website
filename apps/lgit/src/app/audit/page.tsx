import { Metadata } from "next";
import AuditWizard from "@/components/audit/AuditWizard";

// Read STRIPE_READ_PAYMENT_LINK at REQUEST time, not build time — so setting the
// env var takes effect on any deploy without a no-cache rebuild.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Audit · Patina",
  description:
    "Patina — a private taste audit. Look like money, never like an idiot. By application.",
};

export default function AuditPage() {
  // Server-only env (never NEXT_PUBLIC) → passed to the client wizard as a prop.
  // The €150 Read checkout (the money moment). If unset, the wizard degrades to
  // capture-only ("we'll be in touch") so the site is safe before keys are set.
  // fast-follow: replace the static Payment Link with a Stripe Checkout Session
  // + webhook to auto-gate delivery on confirmed payment.
  const readPaymentLink = process.env.STRIPE_READ_PAYMENT_LINK ?? "";
  return <AuditWizard readPaymentLink={readPaymentLink} />;
}
