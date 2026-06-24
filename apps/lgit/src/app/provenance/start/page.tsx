import { Metadata } from "next";
import ProvenanceStart from "@/components/provenance/ProvenanceStart";

export const metadata: Metadata = {
  title: "Start the record · Provenance · Patina",
  description: "Photograph a collection; the eye reads it into a record.",
  robots: { index: false, follow: false },
};

export default function ProvenanceStartPage() {
  return <ProvenanceStart />;
}
