import { redirect } from "next/navigation";

// The Patina brand home is canonically /patina (the route Patina owns in the
// shared siteConfig). The apex (patina.berlin/) sends visitors there so there is
// a single canonical URL for the landing.
export default function RootPage() {
  redirect("/patina");
}
