/* ─────────────────────────────────────────────────────────────────────────
   ROGUE — Explore V1 · "NOCTURNAL NEON / 5-Gum after dark"
   Server shell: owns the route metadata (noindex — sandbox) and renders the
   client concept. Exploration V1 of 3. Self-contained; touches no shared
   files or tokens.
   ──────────────────────────────────────────────────────────────────────── */

import type { Metadata } from "next";
import RogueExploreV1Concept from "./concept";

export const metadata: Metadata = {
  title: "Rogue — Explore V1 · Nocturnal Neon",
  robots: { index: false },
};

export default function RogueExploreV1Page() {
  return <RogueExploreV1Concept />;
}
