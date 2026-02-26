import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-t-muted/40 bg-bg py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-mono text-sm uppercase tracking-[0.15em] font-medium">LGIT Consult</h3>
            <p className="text-sm text-fg/50 max-w-xs leading-relaxed">
              Creative consulting and digital agency based in Leipzig. Technology, campaigns, and joint ventures with artists and brands.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-fg/50 transition-colors hover:text-fg">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/work" className="text-fg/50 transition-colors hover:text-fg">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-fg/50 transition-colors hover:text-fg">
                  About
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-fg/50 transition-colors hover:text-fg">
                  Journal
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-fg/50 transition-colors hover:text-fg">
                  Digital
                </Link>
              </li>
              <li>
                <Link href="/creative" className="text-fg/50 transition-colors hover:text-fg">
                  Creative
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-fg/50 transition-colors hover:text-fg">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/40">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/privacy" className="text-fg/50 transition-colors hover:text-fg">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-fg/50 transition-colors hover:text-fg">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/impressum" className="text-fg/50 transition-colors hover:text-fg">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-t-muted/40 pt-8 text-center text-sm text-fg/70">
          <p>© {currentYear} LGIT Consult. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
