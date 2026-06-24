import type { Metadata } from "next";
import RogueHome from "@/components/rogue/RogueHome";

// Rogue's front door on rogue.berlin. Promoted from explore/v2 ("European
// Summer, Scorched") to the real landing — a proper home reads better than a
// bare redirect, and it carries the identity before /creative + /services.
export const metadata: Metadata = {
  title: { absolute: "Rogue — European Guerrilla & Experiential Agency" },
  description:
    "A European guerrilla and experiential agency for brands that refuse to be ignored. Unsanctioned moments, installations and stunts — Berlin to the Mediterranean, based in Leipzig.",
  keywords: [
    "guerrilla marketing agency",
    "experiential marketing Europe",
    "brand activation Berlin",
    "guerrilla campaign agency",
    "experiential agency Europe",
    "stunt marketing",
    "Rogue",
  ],
};

export default function RogueRootPage() {
  return <RogueHome />;
}
