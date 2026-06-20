// Dummy-Katalog für den „Entdecken"-Tab: beliebte Kategorien mit jeweils einer
// Auswahl gut bewerteter Produkte (Pitch-/Demo-Daten, keine echte API).

export interface CatalogProduct {
  name: string;
  brand: string;
  image: string;
  healthScore: number;
  envScore: number;
  /** Preis in Euro (Demo) */
  price: number;
  /** Nutzerbewertung 0–5 (Demo) */
  rating: number;
  /** Kurzbegründung, warum das Produkt gut abschneidet */
  highlight: string;
}

export interface Category {
  name: string;
  count: number;
  icon: string;
  products: CatalogProduct[];
}

/** Produkt inkl. Kategorie-Zuordnung – für die kategorieübergreifende Filterung. */
export interface CatalogProductWithCategory extends CatalogProduct {
  category: string;
  categoryIcon: string;
}

// Bild-URLs (Unsplash, in der Vorschau auf Erreichbarkeit geprüft).
// Bei Ladefehler greift im UI ein Platzhalter-Icon.
const IMG = {
  face: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
  serum: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
  shampoo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400',
  soap: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400',
  sun: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
  baby: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
  tooth: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
  food: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  jar: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400',
  nuts: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
  drink: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
  clean: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400',
  // Schöne, „grün"/natürlich wirkende Verpackung (für Greenwashing-Beispiel)
  greenwash: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=400',
  // Unscheinbare, schlichte Verpackung (für „gut, aber sieht schlecht aus")
  plain: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400',
  // Weitere Kosmetik-Optiken für Varianz
  cream2: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
  tubes: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
  serum2: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=400',
  set: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400',
};

export const POPULAR_CATEGORIES: Category[] = [
  {
    name: 'Gesichtspflege',
    count: 1234,
    icon: '🧴',
    products: [
      { name: 'Sanfte Feuchtigkeitscreme', brand: 'Weleda', image: IMG.face, healthScore: 92, envScore: 88, price: 12.95, rating: 4.6, highlight: 'Ohne Mikroplastik & Duftstoff-Allergene' },
      { name: 'Bio-Gesichtsserum', brand: 'Dr. Hauschka', image: IMG.serum, healthScore: 89, envScore: 90, price: 32.00, rating: 4.7, highlight: 'Natürliche Wirkstoffe, vegan' },
      { name: 'Mildes Reinigungsgel', brand: 'Lavera', image: IMG.soap, healthScore: 86, envScore: 84, price: 6.49, rating: 4.3, highlight: 'Sulfatfrei, biologisch abbaubar' },
      { name: 'Aqua Boost Naturcreme', brand: 'NatureGlow', image: IMG.greenwash, healthScore: 12, envScore: 16, price: 11.99, rating: 3.8, highlight: 'Wirbt mit „Natur", enthält aber Mikroplastik, Parabene & Silikone' },
      { name: 'Apotheken-Repair-Serum', brand: 'DermaLab', image: IMG.plain, healthScore: 99, envScore: 96, price: 22.90, rating: 4.9, highlight: 'Spitzenwerte trotz unscheinbarer Verpackung' },
      { name: 'Tagescreme LSF 15', brand: 'Solea', image: IMG.cream2, healthScore: 64, envScore: 58, price: 5.95, rating: 4.0, highlight: 'Solider UV-Schutz, einzelne Duftstoff-Allergene' },
      { name: 'Anti-Falten-Nachtcreme', brand: 'AgeLess', image: IMG.tubes, healthScore: 44, envScore: 40, price: 16.95, rating: 3.7, highlight: 'Enthält Parabene & PEG-Emulgatoren' },
      { name: 'Aloe-Feuchtigkeitsgel', brand: 'PureLeaf', image: IMG.serum2, healthScore: 80, envScore: 74, price: 7.49, rating: 4.3, highlight: 'Leicht, ohne Mikroplastik' },
      { name: 'Bio-Gesichtsöl', brand: 'Primavera', image: IMG.set, healthScore: 91, envScore: 93, price: 19.90, rating: 4.6, highlight: 'Reines Pflanzenöl, vegan' },
      { name: 'Mizellen-Reinigungswasser', brand: 'Sensiderm', image: IMG.serum, healthScore: 83, envScore: 62, price: 6.99, rating: 4.4, highlight: 'Mild, aber in Einwegplastik' },
      { name: 'Reichhaltige Pflegecreme', brand: 'Bébé', image: IMG.face, healthScore: 56, envScore: 52, price: 4.49, rating: 3.9, highlight: 'Okay-Basis, enthält Paraffin' },
      { name: 'Vitamin-C-Serum', brand: 'GlowLab', image: IMG.jar, healthScore: 88, envScore: 78, price: 12.00, rating: 4.7, highlight: 'Hochdosiert, recycelbares Glas' },
      { name: 'Peeling mit Mikroperlen', brand: 'FreshScrub', image: IMG.shampoo, healthScore: 24, envScore: 20, price: 5.49, rating: 3.4, highlight: 'Enthält Polyethylen-Mikroplastik' },
    ],
  },
  {
    name: 'Haarpflege',
    count: 892,
    icon: '💆',
    products: [
      { name: 'Sulfatfreies Shampoo', brand: 'Alverde', image: IMG.shampoo, healthScore: 90, envScore: 87, price: 3.95, rating: 4.4, highlight: 'Ohne SLS/SLES & Silikone' },
      { name: 'Naturkosmetik-Spülung', brand: 'Logona', image: IMG.jar, healthScore: 85, envScore: 89, price: 5.49, rating: 4.2, highlight: 'Ohne Mikroplastik, vegan' },
      { name: 'Festes Shampoo', brand: 'Lamazuna', image: IMG.soap, healthScore: 88, envScore: 95, price: 9.90, rating: 4.5, highlight: 'Plastikfrei, 0 % Palmöl' },
    ],
  },
  {
    name: 'Körperpflege',
    count: 756,
    icon: '🧼',
    products: [
      { name: 'Naturseife Lavendel', brand: 'Sonett', image: IMG.soap, healthScore: 94, envScore: 93, price: 3.50, rating: 4.8, highlight: 'Reine Pflanzenöle, palmölfrei' },
      { name: 'Bio-Bodylotion', brand: 'Weleda', image: IMG.face, healthScore: 88, envScore: 86, price: 11.95, rating: 4.6, highlight: 'Ohne Parabene & Mineralöl' },
      { name: 'Deo ohne Aluminium', brand: 'Wolkenseifen', image: IMG.jar, healthScore: 87, envScore: 90, price: 8.90, rating: 4.5, highlight: 'Aluminiumfrei, plastikfrei' },
    ],
  },
  {
    name: 'Sonnenpflege',
    count: 445,
    icon: '☀️',
    products: [
      { name: 'Mineralische Sonnencreme', brand: 'Eco Cosmetics', image: IMG.sun, healthScore: 86, envScore: 88, price: 14.95, rating: 4.3, highlight: 'Ohne chem. UV-Filter, riffsicher' },
      { name: 'Sonnenmilch LSF 30', brand: 'Lavera', image: IMG.face, healthScore: 84, envScore: 85, price: 12.49, rating: 4.2, highlight: 'Oxybenzon-frei, korallensicher' },
    ],
  },
  {
    name: 'Babyprodukte',
    count: 338,
    icon: '👶',
    products: [
      { name: 'Baby-Pflegecreme', brand: 'Weleda', image: IMG.baby, healthScore: 95, envScore: 91, price: 7.95, rating: 4.8, highlight: 'Ohne Duftstoffe & Konservierer' },
      { name: 'Sanftes Baby-Waschgel', brand: 'Alverde', image: IMG.soap, healthScore: 91, envScore: 88, price: 3.45, rating: 4.6, highlight: 'Sulfatfrei, hautneutral' },
    ],
  },
  {
    name: 'Zahnpflege',
    count: 412,
    icon: '🪥',
    products: [
      { name: 'Zahnpasta ohne Mikroplastik', brand: 'Ben & Anna', image: IMG.tooth, healthScore: 90, envScore: 92, price: 4.99, rating: 4.4, highlight: 'Ohne Mikroplastik & SLS' },
      { name: 'Zahnputztabletten', brand: 'Denttabs', image: IMG.jar, healthScore: 88, envScore: 96, price: 6.95, rating: 4.3, highlight: 'Plastikfrei, fluoridoptional' },
    ],
  },
  {
    name: 'Lebensmittel',
    count: 2150,
    icon: '🥗',
    products: [
      { name: 'Haselnussmus pur', brand: 'dm Bio', image: IMG.nuts, healthScore: 88, envScore: 90, price: 4.95, rating: 4.5, highlight: '100 % Haselnuss, keine Zusatzstoffe' },
      { name: 'Bio Nuss-Nougat-Creme', brand: 'Rapunzel', image: IMG.jar, healthScore: 72, envScore: 80, price: 4.49, rating: 4.4, highlight: 'Ohne Palmöl' },
      { name: 'Haferflocken', brand: 'Kölln', image: IMG.food, healthScore: 95, envScore: 89, price: 1.99, rating: 4.7, highlight: 'Ein Inhaltsstoff, niedriger Zucker' },
    ],
  },
  {
    name: 'Getränke',
    count: 980,
    icon: '🥤',
    products: [
      { name: 'Mineralwasser still', brand: 'Vio', image: IMG.drink, healthScore: 99, envScore: 82, price: 0.85, rating: 4.5, highlight: 'Ohne Zucker & Zusatzstoffe' },
      { name: 'Ungesüßter Eistee', brand: 'Pukka', image: IMG.drink, healthScore: 92, envScore: 85, price: 3.29, rating: 4.2, highlight: 'Kein zugesetzter Zucker' },
    ],
  },
  {
    name: 'Haushalt & Reinigung',
    count: 624,
    icon: '🧽',
    products: [
      { name: 'Öko-Spülmittel', brand: 'Sonett', image: IMG.clean, healthScore: 89, envScore: 94, price: 3.99, rating: 4.7, highlight: 'Biologisch abbaubar, vegan' },
      { name: 'Allzweckreiniger', brand: 'Frosch', image: IMG.clean, healthScore: 85, envScore: 90, price: 2.49, rating: 4.5, highlight: 'Ohne bedenkliche Tenside' },
    ],
  },
];

/** Alle Katalog-Produkte flach, mit Kategorie-Info – Basis für die Filterung. */
export const ALL_CATALOG_PRODUCTS: CatalogProductWithCategory[] = POPULAR_CATEGORIES.flatMap((c) =>
  c.products.map((p) => ({ ...p, category: c.name, categoryIcon: c.icon }))
);

/** Höchster Preis im Katalog – für die obere Grenze des Preis-Filters. */
export const MAX_CATALOG_PRICE = Math.ceil(
  ALL_CATALOG_PRODUCTS.reduce((max, p) => Math.max(max, p.price), 0)
);
