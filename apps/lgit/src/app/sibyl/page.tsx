import { Metadata } from "next";
import ProductLanding, {
  ProductLandingConfig,
} from "@/components/product/ProductLanding";

export const metadata: Metadata = {
  title: "Sibyl — Taste, bottled",
  description:
    "Sibyl is the eye, made into a product — a taste engine that ranks, recommends, and tells you what's worth having. In development. Join the waitlist.",
};

const config: ProductLandingConfig = {
  brand: "Sibyl",
  kicker: "An LGIT venture",
  status: "In development",
  headline: "Taste, bottled.",
  lede:
    "Sibyl is the eye made into a product — a taste engine trained on a single, coherent point of view. Ask it what's worth having, what to pass on, and what comes next. Judgment at the speed of software.",
  pointsLabel: "What it is",
  points: [
    [
      "A point of view, not an average",
      "Most recommendation engines optimise for the crowd. Sibyl optimises for one eye — coherent, opinionated, and unafraid to say no.",
    ],
    [
      "Knows the difference",
      "Trained to read quality, condition, rarity, and taste together — to tell the grail from the trophy from the trap.",
    ],
    [
      "The eye, at scale",
      "What an advisory delivers to one client, Sibyl delivers to many — the productisation of a judgment that doesn't usually scale.",
    ],
  ],
  meta: "Earliest stage · Join the list to shape it",
  cta: {
    mode: "waitlist",
    product: "Sibyl",
    label: "Join the waitlist",
    success: "Noted.",
    notePrompt: "What would you want it to judge?",
  },
};

export default function SibylPage() {
  return <ProductLanding config={config} />;
}
