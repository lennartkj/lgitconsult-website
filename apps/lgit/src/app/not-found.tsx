import type { Metadata } from "next";
import { Button } from "@repo/ui/ui/Button";

export const metadata: Metadata = {
  title: "Seite nicht gefunden | LGIT Consult",
  description: "Die angeforderte Seite existiert nicht.",
};

// Server component; the App Router renders it for every unmatched route.
export default function NotFound() {
  return (
    <section className="py-32 md:py-48 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">404</span>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
              Diese Seite gibt es nicht.
            </h1>
            <p className="text-base md:text-lg text-fg/50 leading-relaxed max-w-lg mb-10">
              Die Adresse ist veraltet oder falsch geschrieben. Das Angebot, die Projekte und der Kontakt sind über die Navigation erreichbar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/">Zur Startseite</Button>
              <Button href="/auftritt" variant="outline">Zum Angebot</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
