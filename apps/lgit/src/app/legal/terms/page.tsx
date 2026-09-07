import Link from "next/link";

// Allgemeine Geschäftsbedingungen für das Auftritt-Angebot (Websites,
// Webanwendungen, KI-Integration zum Festpreis, B2B). Sie dürfen /auftritt an
// keiner Stelle widersprechen: Festpreis per Angebot, Änderungen vorher
// schriftlich, kein Start vor Bewilligung bei Förderprojekten, kein
// Fördermittelberater, Nutzungsrechte mit vollständiger Zahlung,
// Drittkomponenten nach deren Lizenzen, Referenznennung nur mit Zustimmung.
//
// ENTWURF, anwaltliche Prüfung ausstehend (Ledger D3). Prüfpunkte als
// HTML-Kommentare an der Stelle; im Text selbst keine Platzhalter.
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: 'Allgemeine Geschäftsbedingungen | LGIT Consult',
    description: 'AGB von LGIT Consult, Leipzig, für Websites, Webanwendungen und KI-Integration zum Festpreis. Gültig für Unternehmer im Sinne von § 14 BGB.',
  };
}

export default function TermsPage() {
  return (
      <>
        <section className="py-24 md:py-32 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12">
              <div className="col-span-12 md:col-span-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">Rechtliches</span>
                <h1 className="text-5xl md:text-6xl font-light tracking-tighter leading-[0.9] mb-6">Allgemeine Geschäftsbedingungen</h1>
                <p className="text-base text-fg/50 leading-relaxed max-w-lg">
                  Für Websites, Webanwendungen und KI-Integration von LGIT Consult, Leipzig. Sie gelten gegenüber Unternehmern; Verträge mit Verbrauchern schließen wir nicht.
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg/40 mt-6">Stand: 7. September 2026</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl prose prose-lg">

              <h2>§ 1 Geltungsbereich</h2>
              <p>
                (1) Diese Bedingungen gelten für alle Verträge zwischen LGIT Consult, Inhaber Lennart Karl Janis Gründel, Mädler-Passage, Aufgang B, Grimmaische Str. 2-4, 04109 Leipzig (im Folgenden „Auftragnehmer“), und seinen Kunden über die Konzeption und Erstellung von Websites, Webanwendungen und Software-Integrationen einschließlich KI-Komponenten sowie die damit verbundenen Leistungen wie Einrichtung, Dokumentation, Einweisung und Übergabe.
              </p>
              <p>
                (2) Angebote richten sich ausschließlich an Unternehmer im Sinne von § 14 BGB, einschließlich Freiberufler, sowie an juristische Personen des öffentlichen Rechts und öffentlich-rechtliche Sondervermögen. Verträge mit Verbrauchern werden nicht geschlossen.
              </p>
              <p>
                (3) Abweichende oder ergänzende Bedingungen des Kunden werden nur Vertragsbestandteil, wenn der Auftragnehmer ihnen ausdrücklich in Textform zugestimmt hat.
              </p>

              <h2>§ 2 Angebot und Vertragsschluss</h2>
              <p>
                (1) Das Erstgespräch und das darauf folgende Konzept mit Festpreisangebot sind für den Kunden unverbindlich und kostenfrei.
              </p>
              {/* TODO Anwalt: Bindefrist bei Förderprojekten (bis Bewilligungsentscheidung, längstens sechs Monate) angemessen? */}
              <p>
                (2) Das Festpreisangebot enthält eine Leistungsbeschreibung mit Umfang, Abnahmepunkten, voraussichtlichem Zeitfenster und Preis. Es gilt 30 Tage ab Angebotsdatum, sofern es nichts anderes bestimmt. Beantragt der Kunde für das Vorhaben eine Förderung, gilt das Angebot bis zur Entscheidung der Bewilligungsstelle, längstens sechs Monate ab Angebotsdatum.
              </p>
              <p>
                (3) Der Vertrag kommt zustande, wenn der Kunde das Angebot in Textform (E-Mail genügt) annimmt oder der Auftragnehmer die Bestellung des Kunden in Textform bestätigt.
              </p>

              <h2>§ 3 Leistungsumfang und Änderungen</h2>
              <p>
                (1) Umfang und Beschaffenheit der Leistung ergeben sich abschließend aus der Leistungsbeschreibung des Angebots. Nicht aufgeführte Leistungen sind nicht geschuldet.
              </p>
              <p>
                (2) Wünscht der Kunde nach Vertragsschluss Änderungen oder Erweiterungen, vereinbaren die Parteien diese vor der Umsetzung in Textform, einschließlich der Auswirkungen auf Preis und Zeitfenster. Ohne eine solche Vereinbarung entstehen keine Mehrkosten und keine zusätzlichen Leistungspflichten.
              </p>
              <p>
                (3) Der Auftragnehmer darf für Teilleistungen, etwa Fotografie oder Text, Subunternehmer einsetzen. Er bleibt für die vertragsgemäße Leistung verantwortlich.
              </p>
              <p>
                (4) Rechtstexte für den Auftritt des Kunden (Impressum, Datenschutzerklärung, eigene Geschäftsbedingungen) sowie die rechtliche Zulässigkeit der vom Kunden beigestellten oder freigegebenen Inhalte, insbesondere nach Heilmittelwerbe-, Berufs-, Marken- und Urheberrecht, liegen in der Verantwortung des Kunden. Der Auftragnehmer bindet die Rechtstexte ein, erbringt aber keine Rechtsberatung.
              </p>

              <h2>§ 4 Mitwirkung des Kunden</h2>
              <p>
                (1) Der Kunde stellt die für die Umsetzung erforderlichen Inhalte (Texte, Bilder, Logos, Daten), Zugänge (Domain, Hosting, Drittsysteme) und Freigaben rechtzeitig bereit und benennt eine Ansprechperson, die Entscheidungen treffen kann.
              </p>
              <p>
                (2) Der Kunde sichert zu, an den bereitgestellten Inhalten die für die vereinbarte Nutzung erforderlichen Rechte zu besitzen, und stellt den Auftragnehmer von Ansprüchen Dritter frei, die auf einer Verletzung dieser Zusicherung beruhen.
              </p>
              <p>
                (3) Verzögert sich die Mitwirkung, verschieben sich die betroffenen Termine entsprechend. Mehraufwand, der durch verspätete oder unvollständige Mitwirkung entsteht, kann der Auftragnehmer nach vorheriger Ankündigung in Textform gesondert berechnen.
              </p>

              <h2>§ 5 Termine</h2>
              <p>
                (1) Zeitfenster im Angebot sind Planungsangaben. Verbindliche Fertigstellungstermine bedürfen einer ausdrücklichen Vereinbarung in Textform.
              </p>
              <p>
                (2) Beantragt der Kunde für das Vorhaben eine Förderung, beginnt die Umsetzung erst nach Bewilligung durch die Bewilligungsstelle und Auftragserteilung, sofern die Parteien nichts anderes vereinbaren.
              </p>

              <h2>§ 6 Abnahme</h2>
              <p>
                (1) Der Auftragnehmer stellt die Leistung zu den vereinbarten Abnahmepunkten (Teilabnahmen) und nach Fertigstellung (Gesamtabnahme) zur Abnahme bereit.
              </p>
              <p>
                (2) Der Kunde prüft die Leistung innerhalb von 14 Tagen nach Bereitstellung und erklärt die Abnahme oder teilt wesentliche Mängel in Textform mit. Unwesentliche Mängel berechtigen nicht zur Verweigerung der Abnahme; sie werden im Rahmen der Gewährleistung behoben.
              </p>
              {/* TODO Anwalt: fiktive Abnahme nach § 640 Abs. 2 BGB und produktive Nutzung als Abnahme im B2B-Verhältnis prüfen. */}
              <p>
                (3) Die Leistung gilt als abgenommen, wenn der Kunde innerhalb einer vom Auftragnehmer nach Ablauf der Prüffrist gesetzten angemessenen Nachfrist weder die Abnahme erklärt noch einen wesentlichen Mangel benennt, oder wenn der Kunde die Leistung produktiv nutzt.
              </p>

              <h2>§ 7 Vergütung und Zahlung</h2>
              {/* TODO Operator/Anwalt: Umsatzsteuer-Status klären (Regelbesteuerung oder § 19 UStG); die Formulierung "zuzüglich gesetzlicher Umsatzsteuer" setzt Regelbesteuerung voraus und muss zum Impressum und zur Angebotsseite passen. */}
              <p>
                (1) Es gilt der im Angebot genannte Festpreis. Alle Preise verstehen sich netto zuzüglich der gesetzlichen Umsatzsteuer.
              </p>
              <p>
                (2) Der Zahlungsplan ergibt sich aus dem Angebot. Enthält es keinen, wird die Vergütung in drei gleichen Teilen fällig: bei Auftragserteilung, beim ersten vereinbarten Abnahmepunkt und bei Gesamtabnahme. Rechnungen sind innerhalb von 14 Tagen nach Zugang ohne Abzug zahlbar.
              </p>
              <p>
                (3) Laufende Kosten wie Hosting, Domain, Lizenzen Dritter und Wartung sind nicht Teil des Festpreises. Sie werden im Angebot gesondert ausgewiesen oder gesondert vereinbart.
              </p>
              <p>
                (4) Bei Zahlungsverzug gelten die gesetzlichen Verzugszinsen (§ 288 Abs. 2 BGB) und die Verzugspauschale (§ 288 Abs. 5 BGB). Der Kunde kann nur mit unbestrittenen oder rechtskräftig festgestellten Forderungen aufrechnen.
              </p>

              <h2>§ 8 Fördermittel</h2>
              <p>
                (1) Der Auftragnehmer ist kein Fördermittelberater. Er stellt keinen Förderantrag für den Kunden und berät nicht zu Förderrecht. Hinweise auf Förderprogramme auf der Website oder im Angebot sind allgemeine, mit einem Stand-Datum versehene Informationen und keine Zusage einer Förderung.
              </p>
              <p>
                (2) Der Kunde stellt den Förderantrag selbst und vor Projektbeginn. Antrag, Fristen, Vorhabenbeginn, Verwendungsnachweis und die Einhaltung der Förderbedingungen liegen in seiner Verantwortung.
              </p>
              <p>
                (3) Die Vergütung ist unabhängig davon geschuldet, ob eine Förderung bewilligt oder ausgezahlt wird. Der Kunde begleicht die Rechnungen des Auftragnehmers vollständig; die Auszahlung einer Förderung erfolgt durch die Bewilligungsstelle an den Kunden.
              </p>
              <p>
                (4) Wird eine beantragte Förderung abgelehnt, bevor die Umsetzung begonnen hat, kann jede Partei vom Vertrag zurücktreten. Bis dahin gesondert beauftragte und erbrachte Leistungen werden vergütet.
              </p>
              <p>
                (5) Der Auftragnehmer stellt die für Antrag und Verwendungsnachweis üblichen Unterlagen bereit: das Festpreisangebot, die Leistungsbeschreibung sowie Rechnungen mit Leistungszeitraum und Leistungsbeschreibung.
              </p>

              <h2>§ 9 Nutzungsrechte</h2>
              <p>
                (1) Mit vollständiger Zahlung der Vergütung erhält der Kunde das ausschließliche, zeitlich und räumlich unbeschränkte, übertragbare Recht, die für ihn individuell erstellten Inhalte (Gestaltung, Texte, Grafiken) und den für ihn individuell erstellten Quellcode zu nutzen, zu vervielfältigen, zu bearbeiten und öffentlich zugänglich zu machen.
              </p>
              <p>
                (2) Bis zur vollständigen Zahlung räumt der Auftragnehmer dem Kunden ein einfaches, widerrufliches Nutzungsrecht zu Prüf-, Abnahme- und Betriebszwecken ein.
              </p>
              <p>
                (3) Komponenten Dritter, insbesondere Open-Source-Bibliotheken und Frameworks, Schriften, Bildmaterial und Dienste, unterliegen den Lizenzbedingungen ihrer jeweiligen Rechteinhaber. Der Auftragnehmer benennt sie in der Dokumentation.
              </p>
              <p>
                (4) Der Auftragnehmer darf allgemeine Kenntnisse, Methoden und nicht kundenspezifische, wiederverwendbare Bausteine, die bei der Umsetzung entstehen oder verwendet werden, für andere Projekte weiterverwenden, soweit dadurch keine Geschäftsgeheimnisse des Kunden offenbart werden.
              </p>

              <h2>§ 10 Gewährleistung</h2>
              {/* TODO Anwalt: Verkürzung der Gewährleistungsfrist auf zwölf Monate ab Abnahme gegenüber Unternehmern (Werkvertrag, § 634a BGB) prüfen. */}
              <p>
                (1) Mängel der abgenommenen Leistung beseitigt der Auftragnehmer zunächst durch Nachbesserung. Schlägt die Nachbesserung zweimal fehl, kann der Kunde die Vergütung mindern oder, bei wesentlichen Mängeln, vom Vertrag zurücktreten. Die Gewährleistungsfrist beträgt zwölf Monate ab Abnahme.
              </p>
              <p>
                (2) Keine Gewährleistung besteht für Mängel, die auf Änderungen durch den Kunden oder Dritte, auf Änderungen von Drittdiensten, Browsern oder Plattformen nach der Abnahme, auf unterlassene Wartung oder auf vom Kunden beigestellte Inhalte zurückgehen. Wartung und Pflege nach der Übergabe sind gesondert zu vereinbaren.
              </p>
              <p>
                (3) Bei KI-Komponenten schuldet der Auftragnehmer die vereinbarte Anbindung und Funktion, nicht die inhaltliche Richtigkeit, Vollständigkeit oder Eignung einzelner Ausgaben eines KI-Modells. Der Kunde prüft solche Ausgaben, bevor er sie verwendet.
              </p>
              <p>
                (4) Ist der Kunde Kaufmann, gilt § 377 HGB: Offensichtliche Mängel sind unverzüglich nach Abnahme, versteckte Mängel unverzüglich nach Entdeckung in Textform anzuzeigen.
              </p>

              <h2>§ 11 Haftung</h2>
              <p>
                (1) Der Auftragnehmer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit, für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, nach dem Produkthaftungsgesetz, bei Übernahme einer Garantie und bei arglistig verschwiegenen Mängeln.
              </p>
              {/* TODO Anwalt: Haftungshöchstgrenze (Auftragswert) bei einfacher Fahrlässigkeit im B2B-Verhältnis prüfen. */}
              <p>
                (2) Bei einfacher Fahrlässigkeit haftet der Auftragnehmer nur für die Verletzung wesentlicher Vertragspflichten, also solcher Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags erst ermöglicht und auf deren Einhaltung der Kunde regelmäßig vertrauen darf. Diese Haftung ist auf den vertragstypischen, bei Vertragsschluss vorhersehbaren Schaden begrenzt, höchstens auf die Vergütung des betroffenen Auftrags.
              </p>
              <p>
                (3) Für den Verlust von Daten haftet der Auftragnehmer im Rahmen von Absatz 2 nur in der Höhe, die bei ordnungsgemäßer, regelmäßiger Datensicherung durch den Kunden zur Wiederherstellung erforderlich wäre.
              </p>
              <p>
                (4) Die Haftungsbeschränkungen gelten auch zugunsten der Mitarbeiter, Erfüllungsgehilfen und Subunternehmer des Auftragnehmers.
              </p>

              <h2>§ 12 Vertraulichkeit und Datenschutz</h2>
              <p>
                (1) Die Parteien behandeln alle im Rahmen des Vertrags erlangten Geschäftsgeheimnisse und als vertraulich gekennzeichneten Informationen der anderen Partei vertraulich. Diese Pflicht gilt drei Jahre über das Vertragsende hinaus.
              </p>
              <p>
                (2) Verarbeitet der Auftragnehmer im Auftrag des Kunden personenbezogene Daten, etwa beim Betrieb einer Anwendung mit Kundendaten, schließen die Parteien vor Beginn der Verarbeitung einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Wie der Auftragnehmer Daten auf dieser Website verarbeitet, steht in der{" "}
                <Link href="/legal/privacy">Datenschutzerklärung</Link>.
              </p>

              <h2>§ 13 Referenzen</h2>
              <p>
                Der Auftragnehmer nennt den Kunden nur mit dessen vorheriger Zustimmung in Textform als Referenz (Name, Logo, Beschreibung des Projekts, Abbildungen). Die Zustimmung kann jederzeit mit Wirkung für die Zukunft widerrufen werden.
              </p>

              <h2>§ 14 Kündigung</h2>
              <p>
                Kündigt der Kunde den Vertrag vor Fertigstellung (§ 648 BGB), werden die bis dahin abgenommenen Abnahmepunkte vollständig und der begonnene Abnahmepunkt nach dem Stand der Arbeiten vergütet; im Übrigen gilt § 648 Satz 2 BGB. Das Recht beider Parteien zur Kündigung aus wichtigem Grund bleibt unberührt.
              </p>

              <h2>§ 15 Schlussbestimmungen</h2>
              <p>
                (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
              </p>
              <p>
                (2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Leipzig ausschließlicher Gerichtsstand für alle Streitigkeiten aus dem Vertrag.
              </p>
              <p>
                (3) Änderungen und Ergänzungen des Vertrags bedürfen der Textform. Das gilt auch für die Aufhebung dieses Textformerfordernisses.
              </p>
              <p>
                (4) Sollte eine Bestimmung dieser Bedingungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Anstelle der unwirksamen Bestimmung gilt die gesetzliche Regelung.
              </p>
              <p>
                Angaben zum Anbieter stehen im <Link href="/legal/impressum">Impressum</Link>.
              </p>
            </div>
          </div>
        </section>
      </>
  );
}
