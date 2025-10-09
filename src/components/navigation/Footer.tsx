import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-t-muted/40 bg-bg py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">LGIT Consult</h3>
            <p className="text-sm text-fg/70 max-w-xs">
              Professional IT consulting and development services for businesses of all sizes.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/work" className="transition-colors hover:text-accent">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-accent">
                  About
                </Link>
              </li>
              <li>
                <Link href="/journal" className="transition-colors hover:text-accent">
                  Journal
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="transition-colors hover:text-accent">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/privacy" className="transition-colors hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="transition-colors hover:text-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/impressum" className="transition-colors hover:text-accent">
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
