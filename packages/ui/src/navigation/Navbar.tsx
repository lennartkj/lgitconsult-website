"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resolveHref, isCrossDomain } from "./siteConfig";

/* Renders a nav link, rewriting cross-app routes to an absolute URL on the
   other app's domain (a plain <a>, since it leaves this domain) and keeping
   same-app routes as client-side <Link>s. */
function NavLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const resolved = resolveHref(href);
  if (isCrossDomain(href)) {
    return (
      <a href={resolved} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={resolved} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

// One site, one offer (2026-09-07): the chrome carries the six pages of the
// digital line and nothing else. The Creative line lives on rogue.berlin and
// is no longer linked from git-consult.group.
const navItems = [
  { name: "Start", href: "/" },
  { name: "Angebot", href: "/auftritt" },
  { name: "Projekte", href: "/work" },
  { name: "Über uns", href: "/about" },
  { name: "Journal", href: "/journal" },
  { name: "Kontakt", href: "/contact" },
];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className="sticky top-0 z-40 w-full border-b border-fg/10 bg-bg/80 backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="container mx-auto flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink href="/" className="font-mono text-[12px] uppercase tracking-[0.2em] font-medium">
            LGIT
          </NavLink>

          <nav className="hidden md:block" aria-label="Hauptnavigation">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    href={item.href}
                    className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg/50 transition-colors hover:text-fg"
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center md:hidden">
            <button
              aria-label="Menü öffnen oder schließen"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative z-50 w-6 h-6 flex flex-col justify-center items-center"
            >
              <motion.span
                className="block w-5 h-px bg-fg absolute"
                animate={mobileOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-5 h-px bg-fg absolute"
                animate={mobileOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu — full-screen overlay, numbered items, staggered */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-bg flex flex-col justify-center px-8"
          >
            <motion.nav
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-label="Hauptnavigation"
            >
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <motion.li key={item.name} variants={staggerItem}>
                    <NavLink
                      href={item.href}
                      className="flex items-baseline gap-4 py-3 group"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="font-mono text-[11px] text-fg/30 w-6">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-3xl md:text-4xl font-light tracking-tight group-hover:text-fg/60 transition-colors">
                        {item.name}
                      </span>
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 left-8"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/30">
                LGIT Consult — Leipzig
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
