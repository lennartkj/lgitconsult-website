import { Metadata } from "next";
import ProductLanding, {
  ProductLandingConfig,
} from "@/components/product/ProductLanding";

export const metadata: Metadata = {
  title: "Patina — The eye, retained",
  description:
    "Patina is a private taste advisory for new wealth. What to keep, what to lose, what to acquire — so everything you own reads as money, never as new-money. The way in is the Audit.",
};

const config: ProductLandingConfig = {
  brand: "Patina",
  kicker: "An LGIT venture",
  status: "By application",
  headline: "The eye, retained.",
  lede:
    "Patina is a private taste advisory for people with new wealth and no time to learn taste. We decide what you acquire, what you keep, and what quietly gives you away — across art, design, objects, and presence.",
  pointsLabel: "What it is",
  points: [
    [
      "The verdict",
      "An honest read on where you stand — what already works, and what reads as trying too hard.",
    ],
    [
      "The direction",
      "A keepable document, in our register, that tells you exactly where to take it.",
    ],
    [
      "The acquisition",
      "We source and direct what to buy, where, and why each piece earns its place — without the inventory, the markups, or the guesswork.",
    ],
    [
      "The relationship",
      "An ongoing eye on your collection and your world. The machine does the scanning; the judgment is ours.",
    ],
  ],
  meta: "By application · Fee quoted on inquiry",
  cta: {
    mode: "link",
    href: "/audit",
    label: "Request the Audit",
  },
};

export default function PatinaPage() {
  return <ProductLanding config={config} />;
}
