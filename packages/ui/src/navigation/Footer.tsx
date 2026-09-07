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

const linkClass = "text-sm text-fg/40 transition-colors hover:text-fg";
const headingClass = "font-mono text-[10px] uppercase tracking-[0.2em] text-fg/30 block mb-4";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-fg/10 bg-bg py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-12 md:gap-16">
          <div className="col-span-12 md:col-span-4">
            <span className="font-mono text-[12px] uppercase tracking-[0.2em] font-medium block mb-4">LGIT Consult</span>
            <p className="text-sm text-fg/40 max-w-xs leading-relaxed">
              Websites, Webanwendungen und KI-Integration zum Festpreis. Für Unternehmen in Leipzig, bei denen der Auftritt das Vertrauenssignal ist.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2 md:col-start-7">
            <span className={headingClass}>Seiten</span>
            <ul className="space-y-3">
              <li><FooterLink href="/" className={linkClass}>Start</FooterLink></li>
              <li><FooterLink href="/work" className={linkClass}>Projekte</FooterLink></li>
              <li><FooterLink href="/about" className={linkClass}>Über uns</FooterLink></li>
              <li><FooterLink href="/journal" className={linkClass}>Journal</FooterLink></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <span className={headingClass}>Angebot</span>
            <ul className="space-y-3">
              <li><FooterLink href="/auftritt" className={linkClass}>Der Auftritt</FooterLink></li>
              <li><FooterLink href="/auftritt#erstgespraech" className={linkClass}>Erstgespräch</FooterLink></li>
              <li><FooterLink href="/contact" className={linkClass}>Kontakt</FooterLink></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <span className={headingClass}>Rechtliches</span>
            <ul className="space-y-3">
              <li><FooterLink href="/legal/impressum" className={linkClass}>Impressum</FooterLink></li>
              <li><FooterLink href="/legal/privacy" className={linkClass}>Datenschutz</FooterLink></li>
              <li><FooterLink href="/legal/terms" className={linkClass}>AGB</FooterLink></li>
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
