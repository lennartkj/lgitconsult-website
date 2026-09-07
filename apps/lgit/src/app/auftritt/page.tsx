import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/auftritt/LeadForm";
import { GRANT, INDUSTRIES, OFFERS, formatEur, ownShare } from "@/lib/auftritt/offer";

// /auftritt — the ONE digital offer on git-consult.group (2026-09-07).
// German page on an otherwise English site by decision: its buyers are Leipzig
// firms, and the hook (the SAB grant) is a Saxon fact. Rendered in the clinical
// Patina register (.audit-clinical from the shared globals) — the register that
// sells "look like money" — and wrapped in lang="de" because the root layout is
// lang="en". All numbers come from src/lib/auftritt/offer.ts.

export const metadata: Metadata = {
  title: "Websites, Webanwendungen und KI-Integration für Leipziger Unternehmen — SAB-gefördert | LGIT Consult",
  description:
    "Festpreis-Projekte für Kanzleien, Praxen, Architekten, Immobilien und Manufakturen in Leipzig. In Stadt und Landkreis Leipzig sowie Nordsachsen derzeit mit 35 bis 60 % der förderfähigen Kosten über den SAB-Digitalisierungszuschuss bezuschussbar, vorbehaltlich Bewilligung. Erstgespräch kostenlos.",
  keywords: [
    "Digitalisierung Zuschuss Sachsen",
    "SAB Digitalisierungsförderung Leipzig",
    "Digitalisierungszuschuss Leipzig",
    "Website erstellen lassen Leipzig",
    "Webagentur Leipzig",
    "Webanwendung entwickeln lassen Leipzig",
    "KI Integration Mittelstand Leipzig",
    "Kanzlei Website Leipzig",
    "Praxis Website Leipzig",
  ],
  alternates: { canonical: "https://git-consult.group/auftritt" },
  openGraph: {
    title: "Sieht Ihr Auftritt nach dem aus, was Sie verlangen?",
    description:
      "Websites, Webanwendungen und KI-Integration zum Festpreis für Leipziger Unternehmen. Derzeit mit 35 bis 60 % der förderfähigen Kosten SAB-bezuschussbar, vorbehaltlich Bewilligung.",
    type: "website",
    locale: "de_DE",
    url: "https://git-consult.group/auftritt",
  },
};

const eyebrow = "font-mono text-[11px] uppercase tracking-[0.2em] text-subtle";
const h2 = "text-3xl md:text-5xl font-light tracking-tighter leading-[1.05]";

export default function AuftrittPage() {
  const share = (price: number) => formatEur(ownShare(price));
  const pct = Math.round(GRANT.exampleRate * 100);

  return (
    <div lang="de" className="audit-clinical">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <header className="pt-24 md:pt-36 pb-16 md:pb-24 border-b border-[color:var(--fg)]/15">
          <p className={eyebrow}>LGIT Consult · Leipzig · Websites, Webanwendungen, KI-Integration</p>
          <h1 className="mt-8 max-w-4xl text-5xl md:text-7xl lg:text-[5.5rem] font-light tracking-tighter leading-[0.95] text-balance">
            Sieht Ihr Auftritt nach dem aus, was Sie verlangen?
          </h1>
          <p className="mt-10 max-w-2xl text-lg md:text-xl leading-relaxed text-foreground/75">
            Mandanten, Patienten und Käufer prüfen Sie zuerst im Netz. Was sie dort sehen, entscheidet, ob Ihr
            Preis plausibel wirkt. Wir bauen den Auftritt, der das aushält: Website, Webanwendung oder
            KI-Integration, zum Festpreis, für Unternehmen in Leipzig.
          </p>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-foreground/70">
            Für Betriebe in {GRANT.regionsOpen.join(", ")} sind derzeit{" "}
            <strong className="font-medium text-foreground">35 bis 60 % der förderfähigen Kosten</strong> über
            den SAB-Digitalisierungszuschuss bezuschussbar; die Quote hängt von Unternehmensgröße und Projektart
            ab. Über die Förderung entscheidet allein die SAB, ein Rechtsanspruch besteht nicht. Stand {GRANT.asOf}.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="#erstgespraech" className="ac-btn inline-block text-center font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4">
              Erstgespräch anfragen
            </a>
            <a href="#foerderung" className="ac-link inline-block text-center font-mono text-[12px] uppercase tracking-[0.2em] px-2 py-4">
              Zur Förderung, nüchtern ↓
            </a>
          </div>
        </header>

        {/* ── The tell ─────────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 border-b border-[color:var(--fg)]/15">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <p className={eyebrow}>Das Tell</p>
              <h2 className={`${h2} mt-4`}>Jeder Auftritt hat eines.</h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6 space-y-6 text-[17px] leading-relaxed text-foreground/80">
              <p>
                Das Stockfoto vom Händedruck. Der Baukasten-Footer. Die Öffnungszeiten von 2019. Das
                Kontaktformular, das ins Leere läuft. Niemand spricht es aus, aber jeder liest es in drei
                Sekunden: Hier wird gespart, wo man es sieht.
              </p>
              <p>
                Bei einer Kanzlei, einer Praxis, einem Architekturbüro ist das kein Schönheitsfehler. Es ist ein
                Preisnachlass, den Sie nie beschlossen haben.
              </p>
              <p>
                Wir nehmen das Tell heraus. Nicht mit mehr Dekoration, sondern mit weniger: Typografie, Ruhe, ein
                klarer Weg zur Anfrage, und Technik, die im Hintergrund einfach funktioniert.
              </p>
            </div>
          </div>
        </section>

        {/* ── Who ──────────────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 border-b border-[color:var(--fg)]/15">
          <p className={eyebrow}>Für wen</p>
          <h2 className={`${h2} mt-4 max-w-3xl`}>Unternehmen, bei denen der Auftritt das Vertrauenssignal ist.</h2>
          <dl className="mt-14 border-t border-[color:var(--fg)]/15">
            {INDUSTRIES.map((i) => (
              <div key={i.name} className="grid grid-cols-12 gap-4 py-6 border-b border-[color:var(--fg)]/10">
                <dt className="col-span-12 md:col-span-5 text-lg md:text-xl font-light tracking-tight">{i.name}</dt>
                <dd className="col-span-12 md:col-span-6 md:col-start-7 text-[15px] leading-relaxed text-foreground/70">{i.line}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-2xl text-[14px] leading-relaxed text-subtle">
            Wer die günstigste Website sucht, ist bei einem Baukasten besser aufgehoben. Wir sagen das im
            Erstgespräch offen.
          </p>
        </section>

        {/* ── Offers ───────────────────────────────────────────────────────── */}
        <section id="angebot" className="py-20 md:py-28 border-b border-[color:var(--fg)]/15">
          <p className={eyebrow}>Drei Formate, Festpreis</p>
          <h2 className={`${h2} mt-4 max-w-3xl`}>Sie wissen vorher, was es kostet und was Sie bekommen.</h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-[color:var(--fg)]/15 border border-[color:var(--fg)]/15">
            {OFFERS.map((o) => (
              <article key={o.key} className="bg-[color:var(--bg)] p-7 md:p-8 flex flex-col">
                <p className={eyebrow}>{o.what}</p>
                <h3 className="mt-3 text-2xl md:text-3xl font-light tracking-tight">{o.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-foreground/70">{o.lead}</p>
                <ul className="mt-6 space-y-2 text-[14px] leading-relaxed text-foreground/80">
                  {o.scope.map((s) => (
                    <li key={s} className="flex gap-3">
                      <span aria-hidden="true" className="text-subtle">—</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">{o.duration}</p>
                  <p className="mt-3 text-3xl font-light tracking-tight tabular-nums">
                    {o.from ? <span className="text-base align-middle mr-1 text-subtle">ab</span> : null}
                    {formatEur(o.price)}
                  </p>
                  <p className="mt-1 text-[13px] text-subtle">netto, zzgl. gesetzlicher USt.</p>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-foreground/80 border-t border-[color:var(--fg)]/10 pt-4">
                    Unverbindliches Rechenbeispiel bei einer Quote von {pct} %: Eigenanteil {o.from ? "ab " : ""}
                    <span className="font-medium tabular-nums">{share(o.price)}</span> auf Basis des Nettopreises
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-[13px] leading-relaxed text-subtle">
            Alle Preise verstehen sich netto zuzüglich gesetzlicher Umsatzsteuer. Das Angebot richtet sich
            ausschließlich an Unternehmer im Sinne von § 14 BGB, einschließlich Freiberuflern. Die Rechenbeispiele
            sind keine Zusage: Sie begleichen die Rechnung zunächst vollständig, der Zuschuss wird nach Ihrem
            Verwendungsnachweis von der SAB ausgezahlt. Die Quote hängt von Unternehmensgröße und Projektart ab
            (Kleinstunternehmen bei Einführungsprojekten bis zu 60 %, mittlere Unternehmen bis zu 35 %); ob
            Umsatzsteuer förderfähig ist, hängt von Ihrer Vorsteuerabzugsberechtigung ab. Über die Förderung
            entscheidet allein die SAB; ein Rechtsanspruch besteht nicht. Laufende Kosten (Hosting, Domain,
            Wartung) weisen wir im Angebot gesondert aus. Was nicht in ein Format passt, bekommt ein eigenes
            Festpreisangebot.
          </p>
        </section>

        {/* ── Grant, plainly ───────────────────────────────────────────────── */}
        <section id="foerderung" className="py-20 md:py-28 border-b border-[color:var(--fg)]/15">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <p className={eyebrow}>Die Förderung, nüchtern</p>
              <h2 className={`${h2} mt-4`}>Was die SAB zahlt, und was nicht.</h2>
              <p className="mt-6 text-[14px] leading-relaxed text-subtle">
                Stand {GRANT.asOf}, nach der Richtlinie auf sab.sachsen.de. Verbindlich ist allein die SAB.
              </p>
            </div>
            <dl className="col-span-12 md:col-span-7 md:col-start-6 border-t border-[color:var(--fg)]/15 text-[15px] leading-relaxed">
              <Row k="Programm">{GRANT.programme}, {GRANT.authority}</Row>
              <Row k="Wer">Kleine und mittlere Unternehmen sowie Freiberufler mit Sitz oder Betriebsstätte in Sachsen.</Row>
              <Row k="Wo derzeit beantragbar">
                {GRANT.regionsOpen.join(", ")}. In den übrigen sächsischen Regionen gilt seit dem {GRANT.stopSince} ein
                Antragsstopp. Das Leipziger Fenster kann jederzeit schließen.
              </Row>
              <Row k="Wie viel">
                <ul className="space-y-1">
                  {GRANT.tiers.map((t) => (
                    <li key={`${t.label}-${t.who}`}>
                      <span className="font-medium">{t.rate}</span> — {t.label}, {t.who}, {t.cap}
                    </li>
                  ))}
                  <li className="text-foreground/70">{GRANT.bonus}</li>
                </ul>
              </Row>
              <Row k="Mindestgröße">{formatEur(GRANT.minProject)} förderfähige Kosten.</Row>
              <Row k="Förderfähig">{GRANT.eligible.join(" · ")}</Row>
              <Row k="Nicht förderfähig">{GRANT.ineligible.join(" · ")}</Row>
              <Row k="Reihenfolge">
                Antrag <em>vor</em> Projektbeginn. Erst die Bewilligung, dann der Auftrag. Der Zuschuss wird nach
                Ihrem Verwendungsnachweis ausgezahlt.
              </Row>
              <Row k="Unsere Rolle">
                Wir sind kein Fördermittelberater und stellen keinen Antrag für Sie. Wir liefern die Umsetzung
                sowie das Festpreisangebot und die Leistungsbeschreibung, die Sie als Anlage für Ihren Antrag
                brauchen.
              </Row>
              <Row k="Quelle">
                <a href={GRANT.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  Förderrichtlinie Digitalisierung Zuschuss EFRE 2021–2027 (sab.sachsen.de)
                </a>
              </Row>
            </dl>
          </div>
        </section>

        {/* ── Reference ────────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 border-b border-[color:var(--fg)]/15">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <p className={eyebrow}>Referenz</p>
              <h2 className={`${h2} mt-4`}>Gebaut, in Betrieb, bezahlt.</h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <h3 className="text-2xl md:text-3xl font-light tracking-tight">XTE Webcourse, HTWK Leipzig</h3>
              <p className="mt-5 text-[16px] leading-relaxed text-foreground/80">
                Eine Lernplattform für technisches Englisch, als externer Auftragnehmer zum Festpreis gebaut und
                in Abschnitten erweitert, so wie die Fakultät neues Material brauchte: Kursverwaltung, fünfzehn
                Aufgabenformen, C-Tests mit Sofortbewertung, Karteikarten-Trainer, Fortschritt, Zertifikate,
                Auswertungen für Lehrende, Administration. Zuletzt ein KI-Agent, der aus Quelltexten neue
                Aufgaben entwirft.
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-subtle">
                React und TypeScript, Kotlin auf Spring, Anmeldung über Hochschul-SSO (SAML2) und OAuth2. In
                Produktion an der HTWK Leipzig.
              </p>
              <Link href="/work#xte-webcourse" className="ac-link mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.2em]">
                Zum Projekt ▸
              </Link>
            </div>
          </div>
        </section>

        {/* ── Process ──────────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 border-b border-[color:var(--fg)]/15">
          <p className={eyebrow}>Ablauf</p>
          <h2 className={`${h2} mt-4 max-w-3xl`}>Sechs Schritte, kein Überraschungspreis.</h2>
          <ol className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-[15px] leading-relaxed">
            <Step n="1" t="Erstgespräch">30 Minuten, kostenlos, per Telefon oder in der Mädler-Passage. Wir sagen Ihnen, ob es passt.</Step>
            <Step n="2" t="Konzept und Festpreisangebot">Unverbindlich und kostenfrei, in der Regel innerhalb einer Woche nach dem Erstgespräch. Mit einer Leistungsbeschreibung, die als Antragsanlage taugt.</Step>
            <Step n="3" t="Ihr Antrag bei der SAB">Sie stellen ihn, vor Projektbeginn. Wir liefern unser Festpreisangebot und die Leistungsbeschreibung als Anlage.</Step>
            <Step n="4" t="Bewilligung, dann Auftrag">Kein Start vor der Bewilligung, wenn Sie fördern lassen. Ohne Förderung: Start nach Auftrag. Änderungen am Umfang vereinbaren wir vorher schriftlich.</Step>
            <Step n="5" t="Umsetzung">Feste Abnahmepunkte. Sie sehen den Stand, nicht nur das Ergebnis.</Step>
            <Step n="6" t="Übergabe und Einweisung">Dokumentation, Schulung, Betrieb. Nach vollständiger Zahlung erhalten Sie die uneingeschränkten, übertragbaren Nutzungsrechte an den für Sie erstellten Inhalten und den Quellcode; Rechte Dritter (Schriften, Bibliotheken, Bildmaterial) richten sich nach deren Lizenzen.</Step>
          </ol>
        </section>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <section id="erstgespraech" className="py-20 md:py-28">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <p className={eyebrow}>Erstgespräch</p>
              <h2 className={`${h2} mt-4`}>Sagen Sie uns, worum es geht.</h2>
              <p className="mt-6 text-[15px] leading-relaxed text-foreground/70">
                In der Regel antworten wir innerhalb eines Werktags, spätestens innerhalb von drei Werktagen.
                Wenn es nicht passt, sagen wir das auch.
              </p>
              <p className="mt-8 text-[14px] leading-relaxed text-subtle">
                LGIT Consult · Mädler-Passage, Aufgang B · Grimmaische Str. 2-4 · 04109 Leipzig
                <br />
                info@git-consult.group · +49 179 126 7379
              </p>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <LeadForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-4 py-5 border-b border-[color:var(--fg)]/10">
      <dt className="col-span-12 md:col-span-4 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle pt-1">{k}</dt>
      <dd className="col-span-12 md:col-span-8 text-foreground/85">{children}</dd>
    </div>
  );
}

function Step({ n, t, children }: { n: string; t: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-12 gap-4 border-t border-[color:var(--fg)]/15 pt-5">
      <span className="col-span-2 md:col-span-1 font-mono text-[12px] text-subtle tabular-nums">{n.padStart(2, "0")}</span>
      <div className="col-span-10 md:col-span-11">
        <h3 className="text-lg font-light tracking-tight">{t}</h3>
        <p className="mt-2 text-foreground/70">{children}</p>
      </div>
    </li>
  );
}
