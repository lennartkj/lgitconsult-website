import type { Metadata } from "next";
import EigenV3 from "./Eigen";

// Sandbox exploration route — keep it out of the index.
export const metadata: Metadata = {
  title: "Rogue — Eigen (explore v3)",
  robots: { index: false },
};

export default function Page() {
  return <EigenV3 />;
}
