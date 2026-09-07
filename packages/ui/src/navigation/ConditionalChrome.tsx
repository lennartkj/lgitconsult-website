"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Immersive, sealed-room experiences carry no site chrome. Today that is only
// the Audit funnel (/audit*), which on git-consult.group redirects to
// patina.berlin; the rule is kept so a locally rendered /audit stays chromeless.
const isImmersive = (pathname: string | null): boolean =>
  !!pathname && (pathname === "/audit" || pathname.startsWith("/audit/"));

export function ConditionalNavbar() {
  return isImmersive(usePathname()) ? null : <Navbar />;
}

export function ConditionalFooter() {
  return isImmersive(usePathname()) ? null : <Footer />;
}
