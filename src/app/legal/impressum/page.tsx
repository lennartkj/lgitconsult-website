import { notFound } from "next/navigation";
import { type Variants } from "framer-motion"; // Importiert, falls Sie motion-Wrapper verwenden möchten

// Set revalidation time for ISR
export const revalidate = 3600; // Rechtstexte ändern sich selten

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Impressum | LGIT Consult',
    description: 'Angaben gemäß § 5 TMG und § 18 MStV.',
  };
}

// Server Component (kein "use client")
export default function ImpressumPage() {
  return (
      <>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Impressum
              </h1>
              <p className="text-lg text-fg/70">
                Angaben gemäß § 5 DDG und § 18 MStV
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Verwenden Sie eine einfache div anstelle von motion.div für statischen Inhalt */}
            <div className="max-w-3xl mx-auto prose prose-lg">
              <h2>Angaben zum Diensteanbieter</h2>
              <p>
                <strong>LGIT Consult</strong> (Einzelunternehmen)<br />
                Inhaber: Lennart Karl Janis Gründel <br/>
                Mädler-Passage, Aufgang B <br/>
                Grimmaische Str. 2-4 <br />
                04109 Leipzig
              </p>
              <p>
                Wirtschafts-Identifikationsnummer (W-IdNr.): **DE453183691-00001**
              </p>

              <h2>Kontakt</h2>
              <p>
                Telefon: +49 179 126 7379<br />
                E-Mail: info@git-consult.group<br />
              </p>

              <p>
                *Hinweis: Dies ist die gesetzlich vorgeschriebene, ladungsfähige Anschrift.*
              </p>
            </div>
          </div>
        </section>
      </>
  );
}
