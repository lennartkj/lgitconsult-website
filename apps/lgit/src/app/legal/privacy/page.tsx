import Link from "next/link";

// Datenschutzerklärung für git-consult.group. Geschrieben aus dem Code heraus
// (Stand 7. September 2026): Vercel-Hosting, das Erstgespräch-Formular auf
// /auftritt (Resend als Auftragsverarbeiter, Attribution aus der URL, keine
// Speicherung auf dem Endgerät), der cookielose Ereigniszähler /api/track,
// selbst gehostete Schriften, keine Cookies, keine Drittanbieter-Tags, kein
// Vorschau-Modus mehr (2026-09-07 entfernt).
//
// ENTWURF, anwaltliche Prüfung ausstehend (Ledger D3). Offene Punkte stehen
// als HTML-Kommentare an der jeweiligen Stelle und in
// docs/products/auftritt/TASKS.md; im Text selbst gibt es keine Platzhalter.
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: 'Datenschutzerklärung | LGIT Consult',
    description: 'Wie git-consult.group personenbezogene Daten verarbeitet: Hosting, Kontakt, Erstgespräch-Formular, Reichweitenmessung ohne Cookies, Ihre Rechte.',
  };
}

export default function PrivacyPage() {
  return (
      <>
        <section className="py-24 md:py-32 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">Rechtliches</span>
                <h1 className="text-5xl md:text-6xl font-light tracking-tighter leading-[0.9] mb-6">Datenschutzerklärung</h1>
                <p className="text-base text-fg/50 leading-relaxed max-w-lg">
                  Diese Website setzt keine Cookies, bindet keine Analyse- oder Werbedienste Dritter ein und speichert nichts auf Ihrem Endgerät. Was trotzdem verarbeitet wird, steht hier.
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg/40 mt-6">Stand: 7. September 2026</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl prose prose-lg">

              <h2>1. Verantwortlicher</h2>
              <p>
                LGIT Consult (Einzelunternehmen)<br />
                Inhaber: Lennart Karl Janis Gründel<br />
                Mädler-Passage, Aufgang B<br />
                Grimmaische Str. 2-4<br />
                04109 Leipzig<br />
                E-Mail: info@git-consult.group<br />
                Telefon: +49 179 126 7379
              </p>
              {/* TODO Anwalt: Benennungspflicht DSB (§ 38 BDSG) ausgeschlossen? Einzelunternehmen, keine 20 Personen, keine Kerntätigkeit Art. 35/37 — Einschätzung bestätigen. */}
              <p>
                Ein Datenschutzbeauftragter ist nicht benannt; eine Pflicht zur Benennung besteht nicht.
              </p>

              <h2>2. Grundsätze</h2>
              <ul>
                <li>Diese Website setzt keine Cookies und greift nicht auf Speicher Ihres Endgeräts zu (§ 25 TDDDG findet daher keine Anwendung).</li>
                <li>Es werden keine Analyse-, Werbe- oder Social-Media-Dienste Dritter geladen. Es gibt keine Google-Tags, keine Conversion-Pixel und keine eingebetteten Videos.</li>
                <li>Schriften werden von unserem eigenen Server ausgeliefert, nicht von einem Schriften-Dienst.</li>
                <li>Daten werden nur verarbeitet, soweit es für den Betrieb der Website, die Beantwortung Ihrer Anfrage oder die Erfüllung gesetzlicher Pflichten erforderlich ist.</li>
              </ul>

              <h2>3. Hosting und Server-Protokolle</h2>
              <p>
                Die Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Beim Aufruf einer Seite verarbeitet Vercel die Daten, die Ihr Browser technisch übermittelt: IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, Statuscode, übertragene Datenmenge, Browsertyp und Betriebssystem sowie die zuvor besuchte Seite (Referrer). Diese Daten werden in Server-Protokollen kurzzeitig gespeichert, um die Website auszuliefern, ihre Stabilität und Sicherheit zu gewährleisten und Fehler zu analysieren.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren und stabilen Betrieb). Die Protokolle werden nach kurzer Zeit gelöscht und nicht mit anderen Daten zusammengeführt.
              </p>
              {/* TODO Anwalt/Operator: Vercel-Region der Functions (Standard: USA) und Log-Aufbewahrung im gebuchten Plan prüfen; Vercel-DPA angenommen? DPF-Zertifizierung von Vercel Inc. auf dataprivacyframework.gov verifizieren, sonst SCC benennen. */}
              <p>
                Mit Vercel besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Soweit Daten in den USA verarbeitet werden, stützt sich die Übermittlung auf den Angemessenheitsbeschluss der EU-Kommission zum EU-US Data Privacy Framework, dem Vercel angehört, sowie ergänzend auf die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).
              </p>

              <h2>4. Kontakt per E-Mail oder Telefon</h2>
              <p>
                Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir die Angaben, die Sie uns dabei machen (Name, Kontaktdaten, Inhalt der Anfrage), um die Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn die Anfrage auf einen Vertrag zielt, sonst Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
              </p>
              {/* TODO Operator: E-Mail-Anbieter für info@git-consult.group benennen (Auftragsverarbeiter) und AVV prüfen. */}
              <p>
                Die Daten werden gelöscht, sobald die Anfrage abschließend bearbeitet ist und kein Vertragsverhältnis entsteht, spätestens zwölf Monate nach der letzten Kommunikation. Kommt ein Vertrag zustande, bewahren wir die Korrespondenz im Rahmen der handels- und steuerrechtlichen Aufbewahrungspflichten auf (sechs beziehungsweise zehn Jahre, § 257 HGB, § 147 AO).
              </p>

              <h2>5. Anfrage eines Erstgesprächs über das Formular auf /auftritt</h2>
              <p>
                Über das Formular auf der Angebotsseite können Sie ein Erstgespräch anfragen. Dabei verarbeiten wir die Angaben, die Sie in das Formular eintragen: Unternehmen, Name, E-Mail-Adresse, optional Telefonnummer und Branche, Standort (Region), Art des Vorhabens, Budgetrahmen und Ihre Nachricht.
              </p>
              <p>
                Wenn Sie über eine Anzeige oder einen Link mit Kampagnenparametern auf die Seite gekommen sind, übermittelt das Formular zusätzlich die in der Adresszeile enthaltenen Kampagnenkennungen (zum Beispiel <code>gclid</code>, <code>utm_source</code>, <code>utm_campaign</code>), die aufgerufene Adresse und die verweisende Seite. Diese Angaben werden nicht auf Ihrem Endgerät gespeichert, sondern nur beim Absenden der Anfrage aus der Adresszeile gelesen und mit der Anfrage übermittelt. Sie dienen dazu, zu erkennen, über welchen Weg Anfragen zu uns kommen, damit wir Werbekosten sinnvoll einsetzen.
              </p>
              <p>
                Rechtsgrundlage für die Verarbeitung der Formularangaben ist Art. 6 Abs. 1 lit. b DSGVO (Maßnahmen vor Vertragsschluss auf Ihre Anfrage). Rechtsgrundlage für die Zuordnung zur Kampagne ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Wirksamkeitskontrolle eigener Werbung). Sie können dieser Zuordnung jederzeit widersprechen (siehe Abschnitt 8); Sie können die Anfrage auch ohne Kampagnenparameter stellen, indem Sie die Seite direkt aufrufen.
              </p>
              {/* TODO Anwalt/Operator: Resend-Anschrift verifizieren, DPA mit Resend abschließen, DPF-Status von Resend prüfen; andernfalls bleibt es bei SCC. */}
              <p>
                Die Anfrage wird als E-Mail an uns zugestellt. Für den Versand dieser E-Mail nutzen wir den Dienst Resend (Resend Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA) als Auftragsverarbeiter nach Art. 28 DSGVO; die Übermittlung in die USA stützt sich auf die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO). Zur Absicherung gegen Zustellfehler wird der Inhalt der Anfrage zusätzlich kurzzeitig in den Server-Protokollen des Hostings (Abschnitt 3) abgelegt. Zum Schutz vor Missbrauch wird die Zahl der Anfragen je IP-Adresse für zehn Minuten im Arbeitsspeicher des Servers gezählt; danach wird der Zähler verworfen.
              </p>
              <p>
                Wir speichern die Anfrage, bis das Erstgespräch stattgefunden hat und klar ist, ob ein Vertrag zustande kommt, längstens zwölf Monate nach der letzten Kommunikation. Kommt ein Vertrag zustande, gilt Abschnitt 4 entsprechend.
              </p>

              <h2>6. Reichweitenmessung ohne Cookies</h2>
              <p>
                Auf der Angebotsseite zählen wir, wie viele Besucher die Seite aufrufen, das Formular beginnen und absenden. Dazu sendet Ihr Browser ein Ereignis an unseren eigenen Server, das nur den Namen des Ereignisses, den Seitenpfad und beim Absenden die gewählten Kategorien (Standort, Art des Vorhabens, Budgetrahmen) enthält. Es werden kein Cookie, keine Kennung und kein Fingerabdruck verwendet; einzelne Besucher können daraus nicht wiedererkannt werden. Die Ereignisse werden in den Server-Protokollen abgelegt und nach kurzer Zeit gelöscht.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse daran, zu wissen, ob die Angebotsseite verständlich ist). Da nicht auf Ihr Endgerät zugegriffen wird, ist keine Einwilligung nach § 25 TDDDG erforderlich.
              </p>

              <h2>7. Externe Links</h2>
              <p>
                Die Website verlinkt auf externe Seiten, etwa die Förderrichtlinie der Sächsischen Aufbaubank. Beim bloßen Anzeigen unserer Seite werden keine Daten an diese Anbieter übertragen; erst wenn Sie einen Link anklicken, verlassen Sie unsere Website, und es gelten die Datenschutzhinweise des jeweiligen Anbieters.
              </p>

              <h2>8. Ihre Rechte</h2>
              <p>
                Sie haben gegenüber uns das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3).
              </p>
              <p>
                <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Soweit wir Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch einlegen. Wir verarbeiten die Daten dann nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen, die Ihre Interessen überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.
              </p>
              <p>
                Für alle Anliegen genügt eine E-Mail an info@git-consult.group oder ein Brief an die oben genannte Anschrift.
              </p>
              {/* TODO Operator: Anschrift der Aufsichtsbehörde verifizieren (datenschutz.sachsen.de). */}
              <p>
                Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Für uns zuständig ist die Sächsische Datenschutz- und Transparenzbeauftragte, Devrientstraße 5, 01067 Dresden, www.datenschutz.sachsen.de.
              </p>

              <h2>9. Keine automatisierten Entscheidungen, Datensicherheit</h2>
              <p>
                Wir treffen keine automatisierten Entscheidungen im Einzelfall und führen kein Profiling durch (Art. 22 DSGVO). Die Übertragung zwischen Ihrem Browser und der Website ist per TLS verschlüsselt.
              </p>

              <h2>10. Änderungen</h2>
              <p>
                Diese Erklärung beschreibt den Stand der Website am oben genannten Datum. Ändert sich die Technik, etwa durch ein neues Formular oder einen neuen Dienstleister, wird sie angepasst. Die jeweils aktuelle Fassung finden Sie unter dieser Adresse. Angaben zum Anbieter stehen im{" "}
                <Link href="/legal/impressum">Impressum</Link>.
              </p>
            </div>
          </div>
        </section>
      </>
  );
}
