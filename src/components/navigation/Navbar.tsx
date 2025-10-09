"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchButton } from "@/components/search/SearchButton";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Journal", href: "/journal" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b border-b-muted/40 bg-bg/80 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          LGIT Consult
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-accent"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
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

          <button aria-label="Toggle menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
