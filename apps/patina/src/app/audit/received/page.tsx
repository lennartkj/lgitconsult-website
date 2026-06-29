import { Metadata } from "next";
import ReadIntake from "@/components/audit/ReadIntake";

export const metadata: Metadata = {
  title: "Your Read · Patina",
  description: "Your Read is being prepared, in confidence.",
  robots: { index: false, follow: false },
};

// Stripe returns the buyer here after a successful €150 Read payment (the
// Payment Link's success URL → …/audit/received). This is now the post-payment
// READ INTAKE (the deep unlock — QUESTIONS.md §3): it fires `read_paid` (the
// revenue event) on load AND collects R1–R6, reads the free-test answers the
// wizard pinned to localStorage, and submits ONE combined payload (the assess
// runs server-side on that combined picture). Reaching this page is the payment
// proxy in the Payment-Link MVP.
// fast-follow: gate this on a verified Checkout Session / webhook so the
// `read_paid` event can't be triggered by anyone hitting the URL directly.
export default function ReadReceivedPage() {
  return <ReadIntake />;
}
