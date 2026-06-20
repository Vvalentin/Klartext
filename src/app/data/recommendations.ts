// Gemockte Produktempfehlungen für den Pitch.
// Wenn ein Produkt schlecht abschneidet, werden bessere Alternativen angezeigt.
// Für bestimmte Barcodes hinterlegte Alternativen; sonst eine generische Demo-Liste.

import { Product } from './demoProduct';

export interface Alternative {
  name: string;
  brand: string;
  image: string;
  healthScore: number;
  envScore: number;
  reason: string;
}

// Bekannte, funktionierende Bild-URLs (im Projekt bereits getestet)
const IMG_NATURAL = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400';
const IMG_JAR = 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=400';
const IMG_FRESH = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400';

// Kuratierte Nutella-Alternativen (für FR- und DE-Barcode der Nutella)
const NUTELLA_ALTERNATIVES: Alternative[] = [
  {
    name: 'Bio Nuss-Nougat-Creme (ohne Palmöl)',
    brand: 'Rapunzel',
    image: IMG_JAR,
    healthScore: 62,
    envScore: 80,
    reason: 'Ohne Palmöl, geringere Umweltbelastung',
  },
  {
    name: 'Haselnussmus pur',
    brand: 'dm Bio',
    image: IMG_NATURAL,
    healthScore: 88,
    envScore: 90,
    reason: '100 % Haselnuss, keine Zusatzstoffe',
  },
];

// Barcode -> konkrete Alternativen (für den Pitch später erweiterbar)
const SPECIFIC: Record<string, Alternative[]> = {
  '3017620422003': NUTELLA_ALTERNATIVES, // Nutella (FR/international)
  '4008400401621': NUTELLA_ALTERNATIVES, // Nutella (DE, Demo-Barcode)
};

// Generische Demo-Alternativen für alle übrigen schlecht bewerteten Produkte
const GENERIC: Alternative[] = [
  {
    name: 'Bio-Alternative ohne Zusatzstoffe',
    brand: 'Demo-Marke',
    image: IMG_NATURAL,
    healthScore: 84,
    envScore: 88,
    reason: 'Keine kritischen Zusatzstoffe',
  },
  {
    name: 'Nachhaltige Variante',
    brand: 'Demo-Marke',
    image: IMG_FRESH,
    healthScore: 76,
    envScore: 91,
    reason: 'Umweltfreundlichere Zusammensetzung',
  },
];

/**
 * Liefert Empfehlungen:
 * - Für gezielt hinterlegte Barcodes IMMER die kuratierten Alternativen (fürs Pitch).
 * - Sonst die generische Demo-Liste, wenn das Produkt schlecht abschneidet
 *   (Gesundheits- oder Umwelt-Score unter 50).
 */
export function getRecommendations(barcode: string | null, product: Product): Alternative[] {
  if (barcode && SPECIFIC[barcode]) return SPECIFIC[barcode];
  const isBad = product.healthScore < 50 || product.envScore < 50;
  return isBad ? GENERIC : [];
}
