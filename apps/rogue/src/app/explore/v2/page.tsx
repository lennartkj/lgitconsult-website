import type { Metadata } from "next";
import V2Concept from "./V2Concept";

// Sandbox exploration — keep it out of the index.
export const metadata: Metadata = {
  title: "Rogue — Explore V2 (Scorched)",
  robots: { index: false },
};

export default function Page() {
  return <V2Concept />;
}
