import { Metadata } from "next";
import ProductLanding, {
  ProductLandingConfig,
} from "@/components/product/ProductLanding";

export const metadata: Metadata = {
  title: "Coterie — A members' club for serious collectors",
  description:
    "Coterie is an invite-only club where collectors are ranked not on what they spend, but on what they choose. Status conferred by the eye. Request an invitation.",
};

const config: ProductLandingConfig = {
  brand: "Coterie",
  kicker: "An LGIT venture",
  status: "In development",
  headline: "Taste, made visible.",
  lede:
    "An invite-only club for serious collectors. Catalogue what you own, and be measured not on what you spent — anyone can spend — but on what you chose. The one form of status money can't buy directly.",
  pointsLabel: "What it is",
  points: [
    [
      "Your collection, ranked",
      "Your holdings become your profile. Leaderboards by category, rarity, and — the one that matters — curation. Best-curated, not most expensive.",
    ],
    [
      "Status conferred by the eye",
      "Grails, completed sets, collection of the month — featured and judged by the curator, not by a popularity vote.",
    ],
    [
      "A room worth being in",
      "Discreet, gated, and dense by design. Members trade, compare, and are seen by the few people whose opinion they actually want.",
    ],
  ],
  meta: "By invitation · Founding membership opening soon",
  cta: {
    mode: "waitlist",
    product: "Coterie",
    label: "Request an invitation",
    success: "Noted.",
    notePrompt: "What do you collect?",
  },
};

export default function CoteriePage() {
  return <ProductLanding config={config} />;
}
