"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

// The Audit is an immersive, sealed-room experience — no site chrome on /audit*.
// Everywhere else, the normal Navbar/Footer render unchanged.
const isImmersive = (pathname: string | null): boolean =>
  !!pathname && (pathname === "/audit" || pathname.startsWith("/audit/"));

export function ConditionalNavbar() {
  return isImmersive(usePathname()) ? null : <Navbar />;
}

export function ConditionalFooter() {
  return isImmersive(usePathname()) ? null : <Footer />;
}
