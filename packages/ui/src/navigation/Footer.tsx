import Link from "next/link";
import { resolveHref, isCrossDomain } from "./siteConfig";

/* Resolves cross-app routes to absolute URLs on the other app's domain (plain
   <a>) and keeps same-app routes as client-side <Link>s. */
function FooterLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const resolved = resolveHref(href);
  if (isCrossDomain(href)) {
    return (
      <a href={resolved} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={resolved} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-fg/10 bg-bg py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-12 md:gap-16">
          <div className="col-span-12 md:col-span-4">
            <span className="font-mono text-[12px] uppercase tracking-[0.2em] font-medium block mb-4">LGIT Consult</span>
            <p className="text-sm text-fg/40 max-w-xs leading-relaxed">
              Creative consulting and digital agency based in Leipzig. Technology, campaigns, and joint ventures with artists and brands.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2 md:col-start-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/30 block mb-4">Navigation</span>
            <ul className="space-y-3">
              <li><FooterLink href="/" className="text-sm text-fg/40 transition-colors hover:text-fg">Home</FooterLink></li>
              <li><FooterLink href="/work" className="text-sm text-fg/40 transition-colors hover:text-fg">Work</FooterLink></li>
              <li><FooterLink href="/about" className="text-sm text-fg/40 transition-colors hover:text-fg">About</FooterLink></li>
              <li><FooterLink href="/journal" className="text-sm text-fg/40 transition-colors hover:text-fg">Journal</FooterLink></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/30 block mb-4">Services</span>
            <ul className="space-y-3">
              <li><FooterLink href="/services" className="text-sm text-fg/40 transition-colors hover:text-fg">Digital</FooterLink></li>
              <li><FooterLink href="/creative" className="text-sm text-fg/40 transition-colors hover:text-fg">Creative</FooterLink></li>
              <li><FooterLink href="/contact" className="text-sm text-fg/40 transition-colors hover:text-fg">Contact</FooterLink></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/30 block mb-4">Legal</span>
            <ul className="space-y-3">
              <li><FooterLink href="/legal/privacy" className="text-sm text-fg/40 transition-colors hover:text-fg">Privacy</FooterLink></li>
              <li><FooterLink href="/legal/terms" className="text-sm text-fg/40 transition-colors hover:text-fg">Terms</FooterLink></li>
              <li><FooterLink href="/legal/impressum" className="text-sm text-fg/40 transition-colors hover:text-fg">Impressum</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-fg/10 pt-8 flex justify-between items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/30">
            &copy; {currentYear} LGIT Consult
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/30">
            Leipzig
          </span>
        </div>
      </div>
    </footer>
  );
}
