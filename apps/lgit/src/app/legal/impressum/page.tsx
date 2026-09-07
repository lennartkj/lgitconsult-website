// Rechtstexte ändern sich selten
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: 'Impressum | LGIT Consult',
    description: 'Angaben gemäß § 5 DDG und § 18 MStV.',
  };
}

export default function ImpressumPage() {
  return (
      <>
        <section className="py-24 md:py-32 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">Rechtliches</span>
                <h1 className="text-5xl md:text-6xl font-light tracking-tighter leading-[0.9] mb-6">Impressum</h1>
                <p className="text-base text-fg/50 leading-relaxed max-w-lg">
                  Angaben gemäß § 5 DDG und § 18 MStV
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl prose prose-lg">
              <h2>Angaben zum Diensteanbieter</h2>
              <p>
                <strong>LGIT Consult</strong> (Einzelunternehmen)<br />
                Inhaber: Lennart Karl Janis Gründel<br />
                Mädler-Passage, Aufgang B<br />
                Grimmaische Str. 2-4<br />
                04109 Leipzig
              </p>
              <p>
                Wirtschafts-Identifikationsnummer (W-IdNr.): <strong>DE453183691-00001</strong>
              </p>

              <h2>Kontakt</h2>
              <p>
                Telefon: +49 179 126 7379<br />
                E-Mail: info@git-consult.group
              </p>

              <p>
                <em>Hinweis: Dies ist die gesetzlich vorgeschriebene, ladungsfähige Anschrift.</em>
              </p>
            </div>
          </div>
        </section>
      </>
  );
}
