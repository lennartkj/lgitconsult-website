import { Metadata } from "next";
import ProductLanding, {
  ProductLandingConfig,
} from "@/components/product/ProductLanding";

export const metadata: Metadata = {
  title: "Provenance — The system of record for a serious collection",
  description:
    "Provenance catalogues, values, and documents a collection — and advises what to acquire next. Intelligence and documentation, wrapped in the eye. Join the waitlist.",
};

const config: ProductLandingConfig = {
  brand: "Provenance",
  kicker: "An LGIT venture",
  status: "In development",
  headline: "Know what you own.",
  lede:
    "The managed system of record for a serious collection. We catalogue it, keep its value live, produce the documentation insurers ask for — and advise what to acquire next. Wrapped in the eye.",
  pointsLabel: "What it is",
  points: [
    [
      "Catalogued",
      "Photograph the collection; it is identified, tagged, and organised into a living catalogue — no more chaos, no more guesswork about what you have.",
    ],
    [
      "Valued, continuously",
      "Comparable sales are tracked so each piece — and the collection as a whole — carries a current, defensible value.",
    ],
    [
      "Documented",
      "Insurance schedules, provenance files, condition reports — the paperwork that protects valuable things, generated and kept current.",
    ],
    [
      "Advised",
      "Given what you own and where the market is moving: what's appreciating, what to hedge, what to acquire next. The judgment is ours; the certification, when you need it, stays with a licensed appraiser.",
    ],
  ],
  meta: "Documentation & intelligence — not certified appraisal · Onboarding soon",
  cta: {
    mode: "waitlist",
    product: "Provenance",
    label: "Join the waitlist",
    success: "Noted.",
    notePrompt: "What's in your collection?",
  },
};

export default function ProvenancePage() {
  return <ProductLanding config={config} />;
}
