import { Metadata } from "next";
import ReadReceived from "@/components/audit/ReadReceived";

export const metadata: Metadata = {
  title: "Your Read · Patina",
  description: "Your Read is being prepared, in confidence.",
  robots: { index: false, follow: false },
};

// Stripe returns the buyer here after a successful €150 Read payment (the
// Payment Link's success URL → …/audit/received). This page fires `read_paid`
// (the revenue event) on load. It is the page Stripe redirects to on success;
// reaching it is the proxy for payment in the Payment-Link MVP.
// fast-follow: gate this on a verified Checkout Session / webhook so the
// `read_paid` event can't be triggered by anyone hitting the URL directly.
export default function ReadReceivedPage() {
  return <ReadReceived />;
}
