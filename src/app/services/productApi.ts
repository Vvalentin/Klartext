// Echte Produktdaten von Open Food Facts (Lebensmittel) und Open Beauty Facts (Kosmetik).
// Beide Datenbanken sind Open Source, kostenlos und ohne API-Key nutzbar.

import { Product, Ingredient, NutrientLevel, NutrientLevels } from '../data/demoProduct';
import { lookupHazard } from '../data/hazardDatabase';

const OFF_BASE = 'https://world.openfoodfacts.org/api/v2/product';
const OBF_BASE = 'https://world.openbeautyfacts.org/api/v2/product';

const FIELDS = [
  'product_name',
  'product_name_de',
  'generic_name',
  'generic_name_de',
  'brands',
  'image_front_url',
  'image_url',
  'image_front_small_url',
  'image_small_url',
  'ingredients',
  'ingredients_text',
  'ingredients_text_de',
  'allergens_tags',
  'additives_tags',
  'nutriscore_grade',
  'ecoscore_grade',
  'environmental_score_grade',
  'nova_group',
  'nutrient_levels',
].join(',');

// OFF-Allergen-Tags -> deutsche Labels (passend zu COMMON_ALLERGENS im SettingsContext)
const ALLERGEN_MAP: Record<string, string> = {
  milk: 'Milch (Laktose)',
  gluten: 'Gluten',
  peanuts: 'Erdnüsse',
  nuts: 'Schalenfrüchte (Nüsse)',
  'tree-nuts': 'Schalenfrüchte (Nüsse)',
  eggs: 'Eier',
  soybeans: 'Soja',
  soy: 'Soja',
  fish: 'Fisch',
  crustaceans: 'Krebstiere',
  molluscs: 'Weichtiere',
  celery: 'Sellerie',
  mustard: 'Senf',
  'sesame-seeds': 'Sesam',
  sesame: 'Sesam',
  lupin: 'Lupinen',
  'sulphur-dioxide-and-sulphites': 'Sulfite (Schwefeldioxid)',
};

// Häufig kritisch diskutierte Zusatzstoffe (E-Nummer -> Bewertung)
const CONTROVERSIAL_ADDITIVES: Record<string, { hazard: 'high' | 'medium'; note: string }> = {
  e171: { hazard: 'high', note: 'Titandioxid – in der EU als Lebensmittelzusatz nicht mehr zugelassen (mögliche Genotoxizität).' },
  e102: { hazard: 'medium', note: 'Tartrazin (Azo-Farbstoff) – kann bei Empfindlichen Reaktionen auslösen.' },
  e104: { hazard: 'medium', note: 'Chinolingelb (Azo-Farbstoff) – kann Hyperaktivität fördern.' },
  e110: { hazard: 'medium', note: 'Gelborange S (Azo-Farbstoff) – kann Hyperaktivität fördern.' },
  e122: { hazard: 'medium', note: 'Azorubin (Azo-Farbstoff) – kann Hyperaktivität fördern.' },
  e124: { hazard: 'medium', note: 'Cochenillerot A (Azo-Farbstoff) – kann Hyperaktivität fördern.' },
  e129: { hazard: 'medium', note: 'Allurarot AC (Azo-Farbstoff) – kann Hyperaktivität fördern.' },
  e150d: { hazard: 'medium', note: 'Zuckerkulör (Ammoniak-Sulfit) – kann 4-MEI enthalten.' },
  e211: { hazard: 'medium', note: 'Natriumbenzoat – kann mit Vitamin C Benzol bilden.' },
  e250: { hazard: 'medium', note: 'Natriumnitrit (Pökelstoff) – Bildung von Nitrosaminen möglich.' },
  e251: { hazard: 'medium', note: 'Natriumnitrat (Pökelstoff) – Bildung von Nitrosaminen möglich.' },
  e320: { hazard: 'medium', note: 'BHA – als möglicherweise krebserregend eingestuft.' },
  e321: { hazard: 'medium', note: 'BHT – Verdacht auf hormonelle Wirkung.' },
  e621: { hazard: 'medium', note: 'Mononatriumglutamat – Geschmacksverstärker, bei Empfindlichen Reaktionen möglich.' },
  e951: { hazard: 'medium', note: 'Aspartam (Süßstoff) – Bewertung umstritten.' },
};

function gradeToScore(grade?: string): number | null {
  if (!grade) return null;
  switch (grade.toLowerCase()) {
    case 'a': return 90;
    case 'b': return 75;
    case 'c': return 55;
    case 'd': return 40;
    case 'e': return 20;
    default: return null;
  }
}

function cleanName(text: string): string {
  const t = text.replace(/_/g, '').trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function mapAllergens(tags?: string[]): string[] {
  if (!tags) return [];
  const result = new Set<string>();
  for (const tag of tags) {
    const key = tag.replace(/^[a-z]{2}:/, ''); // "en:milk" -> "milk"
    const label = ALLERGEN_MAP[key];
    if (label) result.add(label);
  }
  return [...result];
}

interface BuildOpts {
  eNumber?: string | null;
  palmOil?: boolean;
  diet?: Ingredient['diet'];
}

// Baut einen Inhaltsstoff aus einem Rohnamen. Reihenfolge der Bewertung:
//   1) kritische E-Nummer (Food-Zusatzstoff)
//   2) Treffer in der kuratierten Schadstoff-DB (INCI/Trivialname/Synonym)
//   3) sonstige (zugelassene) E-Nummer
//   4) Palmöl-Flag (überschreibt "safe")
//   5) sonst unbedenklich
function buildIngredient(rawName: string, opts: BuildOpts = {}): Ingredient {
  const eNumber = opts.eNumber ?? null;

  let hazard: Ingredient['hazard'] = 'safe';
  let category: Ingredient['category'] = 'health';
  let riskType = 'Unbedenklich';
  let translation = '';
  let description = 'Keine besonderen Risiken in den Open-Facts-Daten hinterlegt.';
  let sources: Ingredient['sources'] = [{ name: 'Open Food Facts', type: 'industry' }];

  const critical = eNumber ? CONTROVERSIAL_ADDITIVES[eNumber] : undefined;
  const dbHit = lookupHazard(rawName);

  if (critical) {
    hazard = critical.hazard;
    riskType = `Kritischer Zusatzstoff (${eNumber!.toUpperCase()})`;
    translation = 'Lebensmittelzusatzstoff';
    description = critical.note;
    sources = [SRC_EFSA, SRC_OFF];
  } else if (dbHit) {
    hazard = dbHit.hazard;
    category = dbHit.category;
    riskType = dbHit.riskType;
    translation = dbHit.translation;
    description = dbHit.description;
    sources = dbHit.sources;
  } else if (eNumber) {
    riskType = `Zusatzstoff (${eNumber.toUpperCase()})`;
    translation = 'Lebensmittelzusatzstoff';
    description = 'Zugelassener Lebensmittelzusatzstoff. Keine besondere Warnung hinterlegt.';
  }

  if (opts.palmOil) {
    // Palmöl = starkes Umweltrisiko (Entwaldung). Immer 'high', damit der
    // Umwelt-Score deutlich fällt. Reines Palmöl trifft NUR die Umwelt; bestand
    // schon ein Gesundheits-/Beides-Risiko (DB-Treffer), bleibt das erhalten.
    const hadPriorHazard = hazard !== 'safe';
    hazard = 'high';
    category = hadPriorHazard ? (category === 'environment' ? 'environment' : 'both') : 'environment';
    riskType = riskType === 'Unbedenklich' ? 'Palmöl-Derivat' : `${riskType} · Palmöl`;
    translation = translation || 'Palmöl-Inhaltsstoff';
    description =
      'Aus Palmöl gewonnen – wird mit Entwaldung und Umweltbelastung in Verbindung gebracht. ' +
      (description === 'Keine besonderen Risiken in den Open-Facts-Daten hinterlegt.' ? '' : description);
  }

  return {
    name: cleanName(rawName),
    translation,
    hazard,
    category,
    diet: opts.diet,
    riskType,
    description: description.trim(),
    sources,
  };
}

const SRC_OFF = { name: 'Open Food Facts', type: 'industry' as const };
const SRC_EFSA = { name: 'EFSA – Europäische Behörde für Lebensmittelsicherheit', type: 'regulatory' as const };

function mapIngredients(raw: any): Ingredient[] {
  const source: any[] = Array.isArray(raw.ingredients) ? raw.ingredients : [];

  const fromStructured: Ingredient[] = source
    .map((ing) => {
      const text: string = ing.text || ing.id || '';
      const id: string = (ing.id || '').toLowerCase(); // z.B. "en:e171" oder "en:sugar"
      const eMatch = id.match(/e\d+[a-z]?$/);
      const eNumber = eMatch ? eMatch[0] : null;

      let diet: Ingredient['diet'];
      if (ing.vegetarian === 'no') diet = 'non-vegetarian';
      else if (ing.vegan === 'no') diet = 'non-vegan';

      return buildIngredient(text, { eNumber, palmOil: ing.from_palm_oil === 'yes', diet });
    })
    .filter((i) => i.name.length > 0);

  if (fromStructured.length > 0) return fromStructured.slice(0, 40);

  // Fallback: unstrukturierter Zutatentext (häufig bei Kosmetik aus Open Beauty Facts).
  // Auch dieser Pfad läuft durch die Schadstoff-DB, damit INCI-Namen erkannt werden.
  const textList = raw.ingredients_text_de || raw.ingredients_text || '';
  if (!textList) return [];
  return textList
    .split(/,|•|\n/) // Komma, Bullet oder Zeilenumbruch
    .map((s: string) => s.replace(/\[[^\]]*\]|\([^)]*%\)/g, '').trim()) // Klammer-Mengenangaben weg
    .filter(Boolean)
    .slice(0, 60)
    .map((name: string) => buildIngredient(name));
}

// Score aus den Inhaltsstoffen ableiten (Konzept v1, siehe Miro-Board):
// Start bei 100, je Stoff ein Abzug. Ein einzelner Hochrisiko-Stoff (rot) kostet
// direkt 55 Punkte, ein mittleres Risiko 25 (Gesundheit) bzw. 30 (Umwelt).
// Getrennte Konten für Gesundheit und Umwelt; category 'both' zählt auf beide.
const DEDUCTIONS = {
  health: { high: 55, medium: 25, safe: 0 },
  environment: { high: 55, medium: 30, safe: 0 },
} as const;

function computeScores(ingredients: Ingredient[]): { healthScore: number; envScore: number } {
  let health = 100;
  let env = 100;
  for (const ing of ingredients) {
    if (ing.category === 'health' || ing.category === 'both') health -= DEDUCTIONS.health[ing.hazard];
    if (ing.category === 'environment' || ing.category === 'both') env -= DEDUCTIONS.environment[ing.hazard];
  }
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  return { healthScore: clamp(health), envScore: clamp(env) };
}

function mapNutrientLevels(nl: any): NutrientLevels | undefined {
  if (!nl || typeof nl !== 'object') return undefined;
  const norm = (v: any): NutrientLevel | undefined =>
    v === 'low' || v === 'moderate' || v === 'high' ? v : undefined;
  const levels: NutrientLevels = {
    sugars: norm(nl.sugars),
    salt: norm(nl.salt),
    saturatedFat: norm(nl['saturated-fat']),
  };
  if (!levels.sugars && !levels.salt && !levels.saturatedFat) return undefined;
  return levels;
}

// Welche Nährwerte fließen in den Gesundheits-Score ein (Profil-Einstellung).
export interface NutrientToggles {
  sugar: boolean;
  salt: boolean;
  saturatedFat: boolean;
}

const NUTRIENT_PENALTY: Record<NutrientLevel, number> = { high: 35, moderate: 12, low: 0 };

/**
 * Senkt den (inhaltsstoffbasierten) Gesundheits-Score anhand der Nährwert-Ampel –
 * aber nur für die im Profil aktivierten Nährwerte. Reine Funktion, wird beim
 * Anzeigen aufgerufen, damit ein Umschalten im Profil sofort wirkt.
 */
export function adjustHealthForNutrients(
  baseHealth: number,
  levels: NutrientLevels | undefined,
  toggles: NutrientToggles
): { score: number; flagged: { label: string; level: NutrientLevel }[] } {
  if (!levels) return { score: baseHealth, flagged: [] };
  const flagged: { label: string; level: NutrientLevel }[] = [];
  let penalty = 0;
  const consider = (on: boolean, level: NutrientLevel | undefined, label: string) => {
    if (!on || !level) return;
    const p = NUTRIENT_PENALTY[level];
    if (p > 0) {
      penalty += p;
      flagged.push({ label, level });
    }
  };
  consider(toggles.sugar, levels.sugars, 'Zucker');
  consider(toggles.salt, levels.salt, 'Salz');
  consider(toggles.saturatedFat, levels.saturatedFat, 'Gesättigte Fettsäuren');
  return { score: Math.max(0, baseHealth - penalty), flagged };
}

function mapProduct(raw: any): Product {
  const name =
    raw.product_name_de || raw.product_name || raw.generic_name_de || raw.generic_name || 'Unbekanntes Produkt';

  const ingredients = mapIngredients(raw);

  // Primär: Scores aus den Inhaltsstoffen. Fallback (keine Inhaltsstoffe): Nutri-/Eco-Score.
  let healthScore: number;
  let envScore: number;
  if (ingredients.length > 0) {
    const scores = computeScores(ingredients);
    healthScore = scores.healthScore;
    envScore = scores.envScore;
  } else {
    healthScore =
      gradeToScore(raw.nutriscore_grade) ??
      (raw.nova_group ? [85, 65, 45, 25][raw.nova_group - 1] ?? 50 : 50);
    envScore = gradeToScore(raw.ecoscore_grade) ?? gradeToScore(raw.environmental_score_grade) ?? 50;
  }

  return {
    name,
    brand: (raw.brands || '').split(',')[0].trim() || 'Unbekannte Marke',
    image: raw.image_front_url || raw.image_url || raw.image_front_small_url || raw.image_small_url || '',
    healthScore,
    envScore,
    allergens: mapAllergens(raw.allergens_tags),
    ingredients,
    nutrientLevels: mapNutrientLevels(raw.nutrient_levels),
  };
}

async function tryFetch(base: string, barcode: string): Promise<Product | null> {
  const res = await fetch(`${base}/${encodeURIComponent(barcode)}.json?fields=${FIELDS}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 1 || !data.product) return null;
  return mapProduct(data.product);
}

/**
 * Lädt ein Produkt anhand des Barcodes: erst Open Food Facts (Lebensmittel),
 * dann Open Beauty Facts (Kosmetik). Gibt null zurück, wenn nichts gefunden wurde.
 */
export async function fetchProduct(barcode: string): Promise<Product | null> {
  const food = await tryFetch(OFF_BASE, barcode);
  if (food) return food;
  const beauty = await tryFetch(OBF_BASE, barcode);
  if (beauty) return beauty;
  return null;
}
