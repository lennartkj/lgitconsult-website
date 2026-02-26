"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchButton } from "@/components/search/SearchButton";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Journal", href: "/journal" },
  {
    name: "Services",
    children: [
      { name: "Digital", href: "/services" },
      { name: "Creative", href: "/creative" },
    ],
  },
  { name: "Contact", href: "/contact" },
];

function NavDropdown({ item }: { item: { name: string; children: { name: string; href: string }[] } }) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:text-fg/50 flex items-center gap-1"
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.name}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-40 rounded-lg border border-muted/40 bg-bg shadow-lg overflow-hidden"
          >
            {item.children.map((child) => (
              <Link
                key={child.name}
                href={child.href}
                className="block px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:bg-muted hover:text-fg/50"
                onClick={() => setOpen(false)}
              >
                {child.name}
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

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b border-b-muted/40 bg-bg/80 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-mono text-sm uppercase tracking-[0.15em] font-medium">
          LGIT Consult
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navItems.map((item) =>
                "children" in item && item.children ? (
                  <NavDropdown key={item.name} item={item as { name: string; children: { name: string; href: string }[] }} />
                ) : (
                  <li key={item.name}>
                    <Link
                      href={(item as { name: string; href: string }).href}
                      className="font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:text-fg/50"
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Search button - desktop */}
          <div className="hidden md:block">
            <SearchButton variant="icon" />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* Search button - mobile */}
          <SearchButton variant="icon" />

          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-t-muted/40 overflow-hidden"
          >
            <ul className="flex flex-col py-4 px-4 sm:px-6">
              {navItems.map((item) =>
                "children" in item && item.children ? (
                  <li key={item.name} className="py-1">
                    <span className="block py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40">
                      {item.name}
                    </span>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block py-2 pl-4 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:text-fg/50"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </li>
                ) : (
                  <li key={item.name}>
                    <Link
                      href={(item as { name: string; href: string }).href}
                      className="block py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors hover:text-fg/50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
