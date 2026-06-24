import { redirect } from "next/navigation";

// Rogue is the marketing/creative surface. Its canonical entry points are
// /creative and /services; the bare root sends visitors to the creative line.
export default function RogueRootPage() {
  redirect("/creative");
}
