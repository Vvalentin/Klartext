// Geteilte Produkt-Typen + Demo-Produkt (Fallback, wenn kein Netz / kein echtes Produkt)

export interface Source {
  name: string;
  type: 'regulatory' | 'peer-reviewed' | 'government' | 'industry';
}

export interface Ingredient {
  name: string;
  translation: string;
  hazard: 'high' | 'medium' | 'safe';
  category: 'health' | 'environment' | 'both';
  /** tierischer Ursprung -> für Ernährungsstil-Warnung */
  diet?: 'non-vegetarian' | 'non-vegan';
  riskType: string;
  description: string;
  sources: Source[];
}

export type NutrientLevel = 'low' | 'moderate' | 'high';

/** Nährwert-Ampel aus Open Food Facts (nutrient_levels), pro 100 g/ml. */
export interface NutrientLevels {
  sugars?: NutrientLevel;
  salt?: NutrientLevel;
  saturatedFat?: NutrientLevel;
}

export interface Product {
  name: string;
  brand: string;
  image: string;
  healthScore: number;
  envScore: number;
  /** im Produkt enthaltene Allergene (deutsche Labels, Abgleich mit Nutzer-Allergenen) */
  allergens: string[];
  ingredients: Ingredient[];
  /** Nährwert-Ampel (nur Lebensmittel); fließt optional in den Gesundheits-Score ein */
  nutrientLevels?: NutrientLevels;
}

const OCEAN_FRESH_IMAGE = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400';

/** Demo-Produkt aus dem ursprünglichen Prototyp (Kosmetik). */
export const DEMO_PRODUCT: Product = {
  name: 'Ocean Fresh Waschgel',
  brand: 'CleanBeauty Co.',
  image: OCEAN_FRESH_IMAGE,
  healthScore: 42,
  envScore: 35,
  allergens: ['Duftstoffe'],
  ingredients: [
    {
      name: 'Polyethylen (Mikroperlen)',
      translation: 'Kunststoff-Mikropartikel',
      hazard: 'high',
      category: 'environment',
      riskType: 'Flüssige Mikroplastik',
      description:
        'Winzige Kunststoffpartikel, die Gewässer verschmutzen und in die Nahrungskette gelangen. Sie sind nicht biologisch abbaubar und reichern sich in Meereslebewesen an.',
      sources: [
        { name: 'ECHA – Europäische Chemikalienagentur', type: 'regulatory' },
        { name: 'Marine Pollution Bulletin (2024)', type: 'peer-reviewed' },
        { name: 'UNEP-Bericht zu Mikroplastik', type: 'government' },
      ],
    },
    {
      name: 'Natriumlaurethsulfat',
      translation: 'Schaumbildner',
      hazard: 'medium',
      category: 'health',
      riskType: 'Hautreizend',
      description:
        'Ein Tensid, das natürliche Hautfette entfernen und bei empfindlichen Personen Reizungen verursachen kann.',
      sources: [
        { name: 'Cosmetic Ingredient Review', type: 'peer-reviewed' },
        { name: 'Journal of Dermatology (2023)', type: 'peer-reviewed' },
      ],
    },
    {
      name: 'Parfum (Duftstoffe)',
      translation: 'Synthetischer Duft',
      hazard: 'medium',
      category: 'health',
      riskType: 'Allergen & Hormonell Wirksam',
      description:
        'Sammelbezeichnung für nicht offengelegte chemische Gemische, die Allergene und hormonstörende Verbindungen enthalten können.',
      sources: [
        { name: 'SCCS – Wissenschaftlicher Ausschuss für Verbrauchersicherheit', type: 'regulatory' },
        { name: 'Environmental Health Perspectives', type: 'peer-reviewed' },
      ],
    },
    {
      name: 'Triclosan',
      translation: 'Antibakterielles Mittel',
      hazard: 'high',
      category: 'both',
      riskType: 'Hormonstörer & Aquatisches Gift',
      description:
        'Eine antimikrobielle Chemikalie, die die Hormonregulation stört und für Wasserökosysteme hochgiftig ist.',
      sources: [
        { name: 'FDA-Sicherheitsbewertung', type: 'regulatory' },
        { name: 'Environmental Science & Technology', type: 'peer-reviewed' },
        { name: 'EFSA-Expertenbericht', type: 'regulatory' },
      ],
    },
    {
      name: 'Glycerin',
      translation: 'Feuchtigkeitsspender',
      hazard: 'safe',
      category: 'health',
      diet: 'non-vegan',
      riskType: 'Unbedenklich',
      description:
        'Ein natürlicher Feuchthalter, der Feuchtigkeit in die Haut zieht. Allgemein als sicher anerkannt. Kann tierischen oder pflanzlichen Ursprungs sein.',
      sources: [{ name: 'FDA GRAS-Datenbank', type: 'regulatory' }],
    },
    {
      name: 'Aloe Barbadensis Extrakt',
      translation: 'Aloe-Vera-Extrakt',
      hazard: 'safe',
      category: 'both',
      riskType: 'Unbedenklich & Umweltfreundlich',
      description:
        'Pflanzlicher Wirkstoff mit beruhigenden Eigenschaften. Biologisch abbaubar und nicht toxisch.',
      sources: [{ name: 'International Aloe Science Council', type: 'industry' }],
    },
  ],
};

/** Bekannter Food-Barcode (deutsche Nutella) zum Testen der echten API in der Web-Vorschau.
 *  Deutscher OFF-Eintrag (lang=de) -> Inhaltsstoffe auf Deutsch statt Französisch. */
export const DEMO_BARCODE = '4008400401621';
