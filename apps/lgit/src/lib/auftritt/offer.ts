// ─────────────────────────────────────────────────────────────────────────────
// AUFTRITT — the one digital offer on git-consult.group (2026-09-07).
//
// Every number the /auftritt page shows lives HERE so the operator can change
// pricing or the grant facts in one place. Prices are PLACEHOLDERS grounded in
// the 2026 DACH market bands (business site €5–12k agency; custom MVP €20–45k)
// and are the operator's call — see docs/products/auftritt/DECISIONS.md in the
// rich-business-ventures workspace.
//
// Grant facts were verified on sab.sachsen.de on 2026-09-06. The Leipzig window
// can close any Monday: re-check the Antragsstopp list before every outbound
// wave and before any ad spend, and update GRANT.asOf.
// ─────────────────────────────────────────────────────────────────────────────

export type OfferKey = "website" | "anwendung" | "integration";

export interface Offer {
  key: OfferKey;
  name: string;
  what: string;
  lead: string;
  scope: string[];
  duration: string;
  /** Net price in EUR. `from` marks an "ab" price. */
  price: number;
  from?: boolean;
}

export const OFFERS: Offer[] = [
  {
    key: "website",
    name: "Der Auftritt",
    what: "Website",
    lead: "Die Seite, die nach dem aussieht, was Sie verlangen.",
    scope: [
      "Struktur, Konzept und Gestaltung im eigenen Ton",
      "Bis zu acht Seiten, Texte im Feinschliff",
      "Fotobriefing; eigene Fotografie auf Wunsch",
      "Klare Kontakt- und Terminwege",
      "Rechtstexte eingebunden (Impressum, Datenschutz — Texte von Ihrem Anwalt)",
      "Hosting eingerichtet, Einweisung, Übergabe",
    ],
    duration: "4 bis 6 Wochen",
    price: 6900,
  },
  {
    key: "anwendung",
    name: "Die Anwendung",
    what: "Webanwendung oder Kundenportal",
    lead: "Der Prozess, der heute per E-Mail und Excel läuft, als eigene Anwendung.",
    scope: [
      "Anforderungsworkshop und Datenmodell",
      "Login, Rollen und Rechte",
      "Ein Kernprozess: Buchung, Mandantenportal, Bestand, Bestellung",
      "Schnittstellen zu dem, was Sie schon nutzen",
      "Tests, Betrieb, Übergabe mit Dokumentation",
    ],
    duration: "8 bis 12 Wochen",
    price: 14900,
    from: true,
  },
  {
    key: "integration",
    name: "Die Integration",
    what: "KI in Ihrer bestehenden Software",
    lead: "Ein Anwendungsfall, sauber angebunden, statt einer Demo.",
    scope: [
      "Prozessaufnahme: wo Texte, Dokumente oder Anfragen Zeit fressen",
      "Ein Anwendungsfall, produktiv: Entwurf, Klassifikation, Zusammenfassung, Extraktion",
      "Anbindung an Ihre Systeme, kein Parallelbetrieb",
      "Datenschutz-Setup: EU-Hosting, Auftragsverarbeitung, Protokollierung",
      "Schulung des Teams",
    ],
    duration: "4 bis 8 Wochen",
    price: 9900,
    from: true,
  },
];

export const GRANT = {
  programme: "Digitalisierung Zuschuss EFRE 2021–2027",
  authority: "Sächsische Aufbaubank (SAB)",
  url: "https://www.sab.sachsen.de/f%C3%B6rderrichtlinie-digitalisierung-zuschuss-efre-2021-bis-2027",
  /** Date the facts below were last checked on the SAB page. */
  asOf: "6. September 2026",
  stopSince: "17. Juli 2026",
  regionsOpen: ["Stadt Leipzig", "Landkreis Leipzig", "Landkreis Nordsachsen"],
  /** The rate used for every "Ihr Anteil" example on the page (conservative). */
  exampleRate: 0.5,
  minProject: 5000,
  tiers: [
    {
      label: "Einführungsprojekte",
      who: "Kleinstunternehmen",
      rate: "bis zu 60 %",
      cap: "direkte Kosten bis 10.000 €",
    },
    {
      label: "Transformationsprojekte",
      who: "kleine Unternehmen",
      rate: "bis zu 50 %",
      cap: "bis 60.000 €",
    },
    {
      label: "Transformationsprojekte",
      who: "mittlere Unternehmen",
      rate: "bis zu 35 %",
      cap: "bis 100.000 €",
    },
  ],
  bonus: "plus 10 Prozentpunkte bei Tarifbindung während der Umsetzung",
  eligible: [
    "Planung und Konzeption",
    "technische Umsetzung",
    "Software und notwendige Hardware",
    "Schulung und Einführung",
  ],
  ineligible: [
    "reine Beratungskosten",
    "Standard-Bürosoftware und Betriebssysteme",
    "Maschinen und Geräte ohne IT-Charakter",
  ],
};

export const INDUSTRIES: { name: string; line: string }[] = [
  { name: "Kanzleien und Notariate", line: "Diskretion, die man sieht. Mandate kommen über Vertrauen, nicht über Banner." },
  { name: "Steuerberatung und Wirtschaftsprüfung", line: "Ordnung als Versprechen. Der Auftritt zeigt, wie Sie arbeiten." },
  { name: "Privatpraxen, Zahnmedizin, Ästhetik", line: "Selbstzahler entscheiden mit dem Auge. Terminbuchung auf Wunsch angebunden; Inhalte für Heilberufe setzen wir HWG- und berufsordnungskonform um, die fachliche Freigabe liegt bei Ihnen." },
  { name: "Architektur und Innenarchitektur", line: "Ihr Werk verdient eine Bühne ohne Rahmen." },
  { name: "Immobilien im Premiumsegment", line: "Objekte, die nach Wert aussehen. Exposés, die nicht nach Portal aussehen." },
  { name: "Galerien, Auktionshäuser, Manufakturen", line: "Provenienz und Ruhe. Das Objekt spricht, die Seite hält den Mund." },
  { name: "Boutique-Hotels und Gastronomie", line: "Direktbuchung statt Plattformprovision; ein Buchungssystem binden wir nach Bedarf an." },
];

export const REGIONS = [
  { value: "stadt-leipzig", label: "Stadt Leipzig", open: true },
  { value: "landkreis-leipzig", label: "Landkreis Leipzig", open: true },
  { value: "nordsachsen", label: "Landkreis Nordsachsen", open: true },
  { value: "sachsen-sonst", label: "Anderswo in Sachsen", open: false },
  { value: "ausserhalb", label: "Außerhalb Sachsens", open: false },
] as const;

export type RegionValue = (typeof REGIONS)[number]["value"];

export const PROJECT_TYPES = [
  { value: "website", label: "Website" },
  { value: "anwendung", label: "Webanwendung oder Kundenportal" },
  { value: "integration", label: "KI-Integration in bestehende Software" },
  { value: "unklar", label: "Noch unklar" },
] as const;

export const BUDGETS = [
  { value: "unter-5000", label: "unter 5.000 €" },
  { value: "5000-15000", label: "5.000 bis 15.000 €" },
  { value: "ueber-15000", label: "über 15.000 €" },
  { value: "unklar", label: "Noch unklar" },
] as const;

export function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ownShare(price: number, rate = GRANT.exampleRate): number {
  return Math.round(price * (1 - rate));
}
