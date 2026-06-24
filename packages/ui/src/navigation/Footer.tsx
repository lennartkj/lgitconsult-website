import Link from "next/link";

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
              <li><Link href="/" className="text-sm text-fg/40 transition-colors hover:text-fg">Home</Link></li>
              <li><Link href="/work" className="text-sm text-fg/40 transition-colors hover:text-fg">Work</Link></li>
              <li><Link href="/about" className="text-sm text-fg/40 transition-colors hover:text-fg">About</Link></li>
              <li><Link href="/journal" className="text-sm text-fg/40 transition-colors hover:text-fg">Journal</Link></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/30 block mb-4">Services</span>
            <ul className="space-y-3">
              <li><Link href="/services" className="text-sm text-fg/40 transition-colors hover:text-fg">Digital</Link></li>
              <li><Link href="/creative" className="text-sm text-fg/40 transition-colors hover:text-fg">Creative</Link></li>
              <li><Link href="/contact" className="text-sm text-fg/40 transition-colors hover:text-fg">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/30 block mb-4">Legal</span>
            <ul className="space-y-3">
              <li><Link href="/legal/privacy" className="text-sm text-fg/40 transition-colors hover:text-fg">Privacy</Link></li>
              <li><Link href="/legal/terms" className="text-sm text-fg/40 transition-colors hover:text-fg">Terms</Link></li>
              <li><Link href="/legal/impressum" className="text-sm text-fg/40 transition-colors hover:text-fg">Impressum</Link></li>
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
