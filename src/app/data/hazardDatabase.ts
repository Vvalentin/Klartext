// Kuratierte Schadstoff-/Toxikologie-Datenbank für Klartext.
//
// Open Food Facts / Open Beauty Facts liefern KEINE toxikologische Bewertung pro
// Inhaltsstoff – nur Namen (meist als INCI-Bezeichnung) und ein paar Tags. Diese
// Datei schließt die Lücke: eine handgepflegte Wissensbasis, die einen Inhaltsstoff
// anhand seines Namens (INCI, Trivialname, Synonyme, E-Nummer) einem Risikoeintrag
// mit echten regulatorischen Quellen zuordnet.
//
// Die Bewertungen folgen veröffentlichten Einstufungen von ECHA (CMR/SVHC),
// EU-Kosmetikverordnung (Anhang II/III), SCCS-Gutachten, EFSA, IARC und FDA.
// Sie ersetzen keine vollständige Toxikologie-DB, sind aber transparent,
// quellenbasiert und leicht erweiterbar (einfach Einträge ergänzen).

import { Ingredient, Source } from './demoProduct';

export interface HazardEntry {
  /** Suchmuster (kleingeschrieben, akzentfrei). Treffer = normalisierter Name enthält ein Muster. */
  patterns: string[];
  /** Anzeigename (überschreibt den Rohnamen nicht – nur als deutsche Erläuterung). */
  translation: string;
  hazard: Ingredient['hazard'];
  category: Ingredient['category'];
  riskType: string;
  description: string;
  sources: Source[];
}

const SRC = {
  echa: { name: 'ECHA – Europäische Chemikalienagentur', type: 'regulatory' as const },
  euCosmetics: { name: 'EU-Kosmetikverordnung 1223/2009', type: 'regulatory' as const },
  sccs: { name: 'SCCS – Ausschuss für Verbrauchersicherheit', type: 'regulatory' as const },
  efsa: { name: 'EFSA – Europäische Behörde für Lebensmittelsicherheit', type: 'regulatory' as const },
  iarc: { name: 'IARC – Internationale Krebsforschungsagentur', type: 'government' as const },
  fda: { name: 'FDA-Sicherheitsbewertung', type: 'regulatory' as const },
  cir: { name: 'Cosmetic Ingredient Review', type: 'peer-reviewed' as const },
  unep: { name: 'UNEP-Bericht zu Mikroplastik', type: 'government' as const },
  est: { name: 'Environmental Science & Technology', type: 'peer-reviewed' as const },
  ehp: { name: 'Environmental Health Perspectives', type: 'peer-reviewed' as const },
};

// Reihenfolge ist relevant: spezifische Muster VOR generischen.
// lookupHazard gibt den ersten Treffer zurück.
export const HAZARD_DB: HazardEntry[] = [
  // ---------------------------------------------------------------------------
  // Mikroplastik (Umwelt) – feste Kunststoffpartikel in Kosmetik
  // ---------------------------------------------------------------------------
  {
    // PEG zuerst, damit "polyethylene glycol" NICHT als Mikroplastik gilt.
    patterns: ['polyethylene glycol', 'peg-', 'peg/', 'ppg-', 'macrogol'],
    translation: 'PEG/PPG – Emulgator',
    hazard: 'medium',
    category: 'health',
    riskType: 'Möglich verunreinigt (1,4-Dioxan)',
    description:
      'Polyethylenglykole können herstellungsbedingt mit 1,4-Dioxan (von der IARC als möglicherweise krebserregend eingestuft) und Ethylenoxid verunreinigt sein und die Hautbarriere durchlässiger machen.',
    sources: [SRC.iarc, SRC.cir],
  },
  {
    patterns: ['polyethylene terephthalate', 'pet,', 'polyethyleneterephthalate'],
    translation: 'PET – Kunststoff-Mikropartikel',
    hazard: 'high',
    category: 'environment',
    riskType: 'Festes Mikroplastik',
    description:
      'Fester Kunststoff (Glitzer/Filmbildner), der nicht biologisch abbaubar ist, Gewässer verschmutzt und sich in der Nahrungskette anreichert.',
    sources: [SRC.echa, SRC.unep],
  },
  {
    patterns: ['polyethylene', 'polypropylene', 'nylon-12', 'nylon-6', 'nylon-66', 'polymethyl methacrylate', 'pmma', 'polyurethane', 'acrylates copolymer', 'acrylates crosspolymer', 'polyquaternium'],
    translation: 'Kunststoff-Mikropartikel',
    hazard: 'high',
    category: 'environment',
    riskType: 'Festes Mikroplastik',
    description:
      'Winzige, nicht biologisch abbaubare Kunststoffpartikel, die Gewässer verschmutzen und in die Nahrungskette gelangen. Die ECHA hat ein EU-weites Verbot von bewusst zugesetztem Mikroplastik beschlossen.',
    sources: [SRC.echa, SRC.unep, { name: 'Marine Pollution Bulletin', type: 'peer-reviewed' }],
  },

  // ---------------------------------------------------------------------------
  // Silikone (D4/D5/D6) – persistent, teils hormonell/PBT
  // ---------------------------------------------------------------------------
  {
    patterns: ['cyclotetrasiloxane', 'cyclopentasiloxane', 'cyclohexasiloxane', 'cyclomethicone'],
    translation: 'Cyclosiloxan (Silikon)',
    hazard: 'high',
    category: 'both',
    riskType: 'Hormonell wirksam & umweltpersistent',
    description:
      'D4/D5/D6 sind in der EU als PBT/vPvB (persistent, bioakkumulierbar) bzw. fortpflanzungsgefährdend eingestuft und in Rinse-off-Kosmetik beschränkt. Reichern sich in Gewässern an.',
    sources: [SRC.echa, SRC.euCosmetics],
  },

  // ---------------------------------------------------------------------------
  // Parabene – Konservierung, Verdacht auf hormonelle Wirkung
  // ---------------------------------------------------------------------------
  {
    patterns: ['propylparaben', 'butylparaben', 'isopropylparaben', 'isobutylparaben', 'pentylparaben', 'benzylparaben'],
    translation: 'Paraben (Konservierungsstoff)',
    hazard: 'high',
    category: 'health',
    riskType: 'Hormonell wirksam (Östrogen)',
    description:
      'Langkettige Parabene stehen im Verdacht, östrogenartig zu wirken. Mehrere (z. B. Isopropyl-/Isobutylparaben) sind in der EU-Kosmetik verboten, andere mengenmäßig beschränkt.',
    sources: [SRC.sccs, SRC.euCosmetics, SRC.ehp],
  },
  {
    patterns: ['methylparaben', 'ethylparaben', 'paraben'],
    translation: 'Paraben (Konservierungsstoff)',
    hazard: 'medium',
    category: 'health',
    riskType: 'Möglich hormonell wirksam',
    description:
      'Kurzkettige Parabene gelten in zugelassenen Mengen als verträglicher, stehen aber wegen möglicher schwacher Hormonwirkung in der Diskussion.',
    sources: [SRC.sccs, SRC.cir],
  },

  // ---------------------------------------------------------------------------
  // Antimikrobiell / Hormonstörer
  // ---------------------------------------------------------------------------
  {
    patterns: ['triclosan', 'triclocarban'],
    translation: 'Antibakterielles Mittel',
    hazard: 'high',
    category: 'both',
    riskType: 'Hormonstörer & aquatisches Gift',
    description:
      'Antimikrobielle Chemikalie, die die Hormonregulation stört, Resistenzen fördern kann und für Wasserökosysteme hochgiftig ist. In vielen Produkten verboten.',
    sources: [SRC.fda, SRC.est, SRC.echa],
  },

  // ---------------------------------------------------------------------------
  // UV-Filter mit Hormonverdacht / Korallenschäden
  // ---------------------------------------------------------------------------
  {
    patterns: ['benzophenone-3', 'oxybenzone', 'benzophenone-1', 'ethylhexyl methoxycinnamate', 'octinoxate', 'homosalate', '4-methylbenzylidene camphor'],
    translation: 'Chemischer UV-Filter',
    hazard: 'high',
    category: 'both',
    riskType: 'Hormonell wirksam & korallenschädlich',
    description:
      'Diese UV-Filter stehen im Verdacht, hormonell zu wirken; das SCCS hat Höchstmengen gesenkt. Sie schädigen zudem Korallenriffe (in einigen Regionen verboten).',
    sources: [SRC.sccs, SRC.ehp, SRC.est],
  },

  // ---------------------------------------------------------------------------
  // Formaldehyd-Abspalter
  // ---------------------------------------------------------------------------
  {
    patterns: ['formaldehyde', 'dmdm hydantoin', 'imidazolidinyl urea', 'diazolidinyl urea', 'quaternium-15', 'sodium hydroxymethylglycinate', 'bronopol', '2-bromo-2-nitropropane'],
    translation: 'Formaldehyd-Abspalter (Konservierung)',
    hazard: 'high',
    category: 'health',
    riskType: 'Krebsverdacht & Allergen',
    description:
      'Setzt langsam Formaldehyd frei, das von der IARC als krebserregend (Gruppe 1) eingestuft ist und Kontaktallergien auslösen kann.',
    sources: [SRC.iarc, SRC.sccs, SRC.euCosmetics],
  },

  // ---------------------------------------------------------------------------
  // Tenside / hautreizend
  // ---------------------------------------------------------------------------
  {
    patterns: ['sodium laureth sulfate', 'sodium lauryl sulfate', 'ammonium lauryl sulfate', 'sodium lauryl sulfoacetate'],
    translation: 'Schaumbildner (Tensid)',
    hazard: 'medium',
    category: 'health',
    riskType: 'Hautreizend',
    description:
      'Starkes Tensid, das natürliche Hautfette entfernt und bei empfindlichen Personen Reizungen verursachen kann. Sulfate können zudem mit 1,4-Dioxan verunreinigt sein.',
    sources: [SRC.cir, { name: 'Journal of Dermatology', type: 'peer-reviewed' }],
  },
  {
    patterns: ['cocamidopropyl betaine', 'cocamide dea', 'cocamide mea'],
    translation: 'Tensid (aus Kokosöl)',
    hazard: 'medium',
    category: 'health',
    riskType: 'Kontaktallergen',
    description:
      'Mildes Tensid, das durch Herstellungsrückstände (z. B. Amidoamin) sensibilisierend wirken kann; Cocamide DEA ist als möglicherweise krebserregend eingestuft.',
    sources: [SRC.cir, SRC.iarc],
  },

  // ---------------------------------------------------------------------------
  // Duftstoffe & deklarationspflichtige Allergene
  // ---------------------------------------------------------------------------
  {
    patterns: ['parfum', 'fragrance', 'aroma'],
    translation: 'Synthetischer Duft',
    hazard: 'medium',
    category: 'health',
    riskType: 'Allergen & ggf. hormonell',
    description:
      'Sammelbezeichnung für nicht vollständig offengelegte Duftgemische, die Allergene und potenziell hormonstörende Verbindungen (z. B. Moschus-Verbindungen) enthalten können.',
    sources: [SRC.sccs, SRC.ehp],
  },
  {
    patterns: ['limonene', 'linalool', 'citronellol', 'geraniol', 'eugenol', 'coumarin', 'citral', 'cinnamal', 'benzyl salicylate', 'hydroxycitronellal', 'isoeugenol'],
    translation: 'Deklarationspflichtiger Duftstoff',
    hazard: 'medium',
    category: 'health',
    riskType: 'Kontaktallergen',
    description:
      'In der EU einzeln kennzeichnungspflichtiger Duftstoff, weil er bei sensibilisierten Personen Kontaktallergien auslösen kann. Oxidiert an der Luft zu stärkeren Allergenen.',
    sources: [SRC.sccs, SRC.euCosmetics],
  },

  // ---------------------------------------------------------------------------
  // Sonstige bedenkliche Kosmetik-Stoffe
  // ---------------------------------------------------------------------------
  {
    patterns: ['butylated hydroxyanisole', 'bha,', 'butylated hydroxytoluene', 'bht,'],
    translation: 'Antioxidans (Konservierung)',
    hazard: 'medium',
    category: 'both',
    riskType: 'Krebsverdacht & umweltbedenklich',
    description:
      'BHA ist von der IARC als möglicherweise krebserregend eingestuft; BHT steht im Verdacht hormoneller Wirkung und gilt als umweltbedenklich.',
    sources: [SRC.iarc, SRC.echa],
  },
  {
    patterns: ['phenoxyethanol'],
    translation: 'Konservierungsstoff',
    hazard: 'medium',
    category: 'health',
    riskType: 'Reizend (Höchstmenge geregelt)',
    description:
      'In der EU auf 1 % begrenzter Konservierungsstoff. Allgemein verträglich, kann aber Haut/Augen reizen; das BfR rät zur Vorsicht bei Säuglingsprodukten.',
    sources: [SRC.sccs, SRC.euCosmetics],
  },
  {
    patterns: ['aluminum chlorohydrate', 'aluminium chlorohydrate', 'aluminum chloride', 'aluminium zirconium'],
    translation: 'Antitranspirant-Wirkstoff',
    hazard: 'medium',
    category: 'health',
    riskType: 'Umstrittene Aluminium-Aufnahme',
    description:
      'Aluminiumsalze in Antitranspirantien werden über die Aufnahme diskutiert. Das BfR hält eine gesundheitliche Beeinträchtigung über Deos inzwischen für unwahrscheinlich, die Gesamtaufnahme bleibt aber relevant.',
    sources: [SRC.sccs, { name: 'BfR – Bundesinstitut für Risikobewertung', type: 'government' }],
  },
  {
    patterns: ['resorcinol', 'p-phenylenediamine', 'phenylenediamine', 'toluene-2,5-diamine'],
    translation: 'Haarfärbe-/Oxidationsmittel',
    hazard: 'high',
    category: 'health',
    riskType: 'Starkes Allergen',
    description:
      'In Haarfärbemitteln verbreitete Stoffe, die stark sensibilisieren (Kontaktallergie) und teils hormonell diskutiert werden. Mengen in der EU geregelt.',
    sources: [SRC.sccs, SRC.euCosmetics],
  },

  // ---------------------------------------------------------------------------
  // Lebensmittel: kritische Zusatzstoffe (auch ohne erkannte E-Nummer per Name)
  // ---------------------------------------------------------------------------
  {
    patterns: ['titanium dioxide', 'titaniumdioxide', 'dioxyde de titane'],
    translation: 'Weißpigment (E171)',
    hazard: 'high',
    category: 'health',
    riskType: 'Mögliche Genotoxizität (E171)',
    description:
      'Titandioxid (E171) ist als Lebensmittelzusatz in der EU seit 2022 nicht mehr zugelassen, weil eine Genotoxizität nicht ausgeschlossen werden kann. In Kosmetik weiterhin als UV-Filter erlaubt.',
    sources: [SRC.efsa, SRC.euCosmetics],
  },
  {
    patterns: ['aspartame', 'aspartam'],
    translation: 'Süßstoff (E951)',
    hazard: 'medium',
    category: 'health',
    riskType: 'Möglich krebserregend (IARC 2B)',
    description:
      'Die IARC stuft Aspartam als „möglicherweise krebserregend" (Gruppe 2B) ein; die EFSA hält die zulässige Tagesdosis (40 mg/kg) bislang aufrecht. Nicht für Menschen mit Phenylketonurie geeignet.',
    sources: [SRC.iarc, SRC.efsa],
  },
  {
    patterns: ['sodium nitrite', 'potassium nitrite', 'sodium nitrate', 'natriumnitrit'],
    translation: 'Pökelstoff (E249–E252)',
    hazard: 'medium',
    category: 'health',
    riskType: 'Nitrosamin-Bildung möglich',
    description:
      'Nitritpökelsalze können beim Erhitzen krebserregende Nitrosamine bilden. Die EFSA empfiehlt, die Aufnahme zu begrenzen; verarbeitetes Fleisch ist von der IARC als krebserregend (Gruppe 1) eingestuft.',
    sources: [SRC.efsa, SRC.iarc],
  },
  {
    patterns: ['monosodium glutamate', 'glutamate monosodique'],
    translation: 'Geschmacksverstärker (E621)',
    hazard: 'medium',
    category: 'health',
    riskType: 'Empfindlichkeitsreaktionen möglich',
    description:
      'Mononatriumglutamat gilt allgemein als sicher; die EFSA hat 2017 eine Gruppen-Tagesdosis abgeleitet, die mit stark gewürzten Lebensmitteln überschritten werden kann.',
    sources: [SRC.efsa],
  },
];

/** Normalisiert einen Inhaltsstoffnamen für den Mustervergleich. */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Akzente entfernen
    .replace(/_/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sucht zu einem Inhaltsstoffnamen den passenden Schadstoff-Eintrag.
 * Gibt den ersten Treffer (spezifisch vor generisch) oder null zurück.
 */
export function lookupHazard(name: string): HazardEntry | null {
  const n = normalizeName(name) + ','; // Komma-Anhang macht "bha," / "pet," matchbar
  for (const entry of HAZARD_DB) {
    if (entry.patterns.some((p) => n.includes(p))) return entry;
  }
  return null;
}
