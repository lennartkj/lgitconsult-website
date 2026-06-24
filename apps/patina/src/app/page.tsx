import { redirect } from "next/navigation";

// Patina is the funnel — there is no brand landing. The apex (patina.berlin/)
// sends visitors straight into the Audit. Audit IS the entry.
export default function RootPage() {
  redirect("/audit");
}
