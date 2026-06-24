"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Immersive, sealed-room clinical experiences carry no site chrome: the Audit
// (/audit*) and the Provenance cataloguing tool (/provenance/start).
const isImmersive = (pathname: string | null): boolean =>
  !!pathname &&
  (pathname === "/audit" ||
    pathname.startsWith("/audit/") ||
    pathname.startsWith("/provenance/start"));

export function ConditionalNavbar() {
  return isImmersive(usePathname()) ? null : <Navbar />;
}

export function ConditionalFooter() {
  return isImmersive(usePathname()) ? null : <Footer />;
}
