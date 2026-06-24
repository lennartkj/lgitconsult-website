"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchButton } from "../search/SearchButton";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Journal", href: "/journal" },
  {
    name: "Services",
    children: [
      { name: "Digital", href: "/services", description: "Web development, mobile apps, UI/UX, IT consulting" },
      { name: "Creative", href: "/creative", description: "Campaigns, photography, music, video, creative direction" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

// All items flattened for mobile numbering
const mobileItems = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Journal", href: "/journal" },
  { name: "Digital", href: "/services" },
  { name: "Creative", href: "/creative" },
  { name: "Contact", href: "/contact" },
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

function NavDropdown({ item }: { item: { name: string; children: { name: string; href: string; description: string }[] } }) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg/50 transition-colors hover:text-fg flex items-center gap-1"
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.name}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 mt-4 w-72 border border-fg/10 bg-bg"
          >
            {item.children.map((child, idx) => (
              <Link
                key={child.name}
                href={child.href}
                className={`block px-6 py-5 transition-colors hover:bg-muted ${idx > 0 ? "border-t border-fg/10" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] block mb-1">{child.name}</span>
                <span className="text-[12px] text-fg/40 leading-relaxed">{child.description}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

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
          <Link href="/" className="font-mono text-[12px] uppercase tracking-[0.2em] font-medium">
            LGIT
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:block">
              <ul className="flex items-center gap-8">
                {navItems.map((item) =>
                  "children" in item && item.children ? (
                    <NavDropdown key={item.name} item={item as { name: string; children: { name: string; href: string; description: string }[] }} />
                  ) : (
                    <li key={item.name}>
                      <Link
                        href={(item as { name: string; href: string }).href}
                        className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg/50 transition-colors hover:text-fg"
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <div className="hidden md:block">
              <SearchButton variant="icon" />
            </div>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <SearchButton variant="icon" />

            <button
              aria-label="Toggle menu"
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
            >
              <ul className="space-y-1">
                {mobileItems.map((item, index) => (
                  <motion.li key={item.name} variants={staggerItem}>
                    <Link
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
                    </Link>
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
