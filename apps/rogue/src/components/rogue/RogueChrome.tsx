"use client";

/* ──────────────────────────────────────────────────────────────────────────
   ROGUE — own chrome  ·  "EUROPEAN SUMMER, SCORCHED"

   Rogue's OWN header + footer, decoupled from the shared @repo/ui Navbar/Footer.
   Rogue leads with its own world (home, creative, digital, brief) in the V2
   charred-couture identity — the glitch wordmark, ember accents, slow weighted
   motion, editorial-luxury register. A single discreet "by LGIT" link points
   back to git-consult.group (absolute, cross-domain), but the menu is Rogue's.

   This is fully self-contained in apps/rogue — packages/ui is untouched. The
   only thing imported read-only from @repo/ui is the LGIT domain (siteConfig),
   so the "by LGIT" link tracks the canonical host.

   Immersive routes (the audit / provenance-style sealed rooms) carry no chrome,
   mirroring the shared ConditionalChrome behaviour — kept here so swapping in
   Rogue's chrome doesn't regress that. Rogue owns no immersive routes today, but
   the guard is cheap and future-proofs the swap.
   ────────────────────────────────────────────────────────────────────────── */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DOMAINS } from "@repo/ui/navigation/siteConfig";
import { Wordmark } from "./atmosphere";
import styles from "./rogueChrome.module.css";

/* The LGIT holding site — discreet "by LGIT" attribution. Read-only from the
   shared config so it stays in sync with the canonical host. */
const LGIT_URL = DOMAINS.lgit;

/* Rogue's own nav world. All routes are relative (same domain, rogue.berlin);
   `external` links leave the domain and render as a plain <a>. */
type NavItem = { name: string; href: string; external?: boolean };

const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Creative", href: "/creative" },
  { name: "Digital", href: "/services" },
  { name: "Brief", href: "mailto:hello@rogue.berlin?subject=ROGUE%20BRIEF", external: true },
];

/* Immersive (sealed-room) routes carry no chrome — matches the shared
   ConditionalChrome logic so the swap is behaviour-preserving. */
function isImmersive(pathname: string | null): boolean {
  return (
    !!pathname &&
    (pathname === "/audit" ||
      pathname.startsWith("/audit/") ||
      pathname.startsWith("/provenance/start"))
  );
}

/* A nav link that renders a real <a> for external/cross-domain/mailto targets
   and a client-side <Link> for in-app routes. */
function RogueLink({
  item,
  className,
  onClick,
  children,
}: {
  item: NavItem;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (item.external || !item.href.startsWith("/")) {
    return (
      <a href={item.href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

/* ── HEADER ─────────────────────────────────────────────────────────────── */

export function RogueHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close the menu on Escape, and route changes.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isImmersive(pathname)) return null;

  const isActive = (href: string) =>
    href.startsWith("/") &&
    (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <>
      <motion.header
        className={styles.header}
        initial={reduce ? false : { y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.bar}>
          {/* Brand — the V2 glitch wordmark, linking home. */}
          <Link href="/" className={styles.brand} aria-label="Rogue — home">
            <Wordmark text="ROGUE" className={styles.brandMark} />
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <RogueLink
                    item={item}
                    className={`${styles.navLink} ${
                      isActive(item.href) ? styles.navLinkActive : ""
                    }`}
                  >
                    {item.name}
                  </RogueLink>
                </li>
              ))}
              <li aria-hidden="true" className={styles.navDivider} />
              <li>
                <a
                  href={LGIT_URL}
                  className={styles.byLgit}
                  rel="noopener"
                >
                  by LGIT
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="rogue-mobile-menu"
            onClick={() => setMobileOpen((p) => !p)}
            className={styles.toggle}
          >
            <motion.span
              className={styles.toggleBar}
              animate={mobileOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className={styles.toggleBar}
              animate={mobileOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="rogue-mobile-menu"
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Rogue menu"
          >
            <nav aria-label="Mobile" className={styles.overlayNav}>
              <ul className={styles.overlayList}>
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.name}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduce ? 0 : 0.1 + i * 0.07,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <RogueLink
                      item={item}
                      className={styles.overlayLink}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className={styles.overlayIndex}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.overlayName}>{item.name}</span>
                    </RogueLink>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className={styles.overlayFoot}>
              <span className={styles.overlayMeta}>ROGUE — LEIPZIG · EUROPE</span>
              <a href={LGIT_URL} className={styles.overlayByLgit} rel="noopener">
                by LGIT ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── FOOTER ─────────────────────────────────────────────────────────────── */

export function RogueFooter() {
  const pathname = usePathname();
  if (isImmersive(pathname)) return null;

  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrandCol}>
            <Wordmark text="ROGUE" className={styles.footerMark} />
            <p className={styles.footerBlurb}>
              A European guerrilla and experiential agency for brands that refuse
              to be ignored. Based in Leipzig, working Berlin to the
              Mediterranean.
            </p>
          </div>

          <nav className={styles.footerNav} aria-label="Footer">
            <span className={styles.footerColHead}>Agency</span>
            <ul className={styles.footerColList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <RogueLink item={item} className={styles.footerLink}>
                    {item.name}
                  </RogueLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.footerNav} aria-label="Contact">
            <span className={styles.footerColHead}>Reach us</span>
            <ul className={styles.footerColList}>
              <li>
                <a
                  href="mailto:hello@rogue.berlin"
                  className={styles.footerLink}
                >
                  hello@rogue.berlin
                </a>
              </li>
              <li>
                <a href={LGIT_URL} className={styles.footerLink} rel="noopener">
                  git-consult.group ↗
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.footerMeta}>
            ROGUE © {year} — A LGIT AGENCY
          </span>
          <span className={styles.footerMeta}>EUROPEAN SUMMER, SCORCHED</span>
        </div>
      </div>
    </footer>
  );
}
