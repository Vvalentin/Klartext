// Scan-Verlauf: tatsächlich gescannte Produkte lokal speichern (localStorage).
// Funktioniert im Browser und im Capacitor-WebView.

import { Product } from './demoProduct';

export interface HistoryEntry {
  barcode: string;
  name: string;
  brand: string;
  image: string;
  healthScore: number;
  envScore: number;
  scannedAt: string; // ISO-Zeitstempel
}

const KEY = 'klartext_scan_history';
const MAX = 50;

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addToHistory(barcode: string, product: Product): void {
  const entry: HistoryEntry = {
    barcode,
    name: product.name,
    brand: product.brand,
    image: product.image,
    healthScore: product.healthScore,
    envScore: product.envScore,
    scannedAt: new Date().toISOString(),
  };
  // gleiches Produkt nicht doppelt -> alten Eintrag entfernen, neuen nach vorne
  const list = getHistory().filter((e) => e.barcode !== barcode);
  list.unshift(entry);
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    /* Speicher voll/nicht verfügbar -> ignorieren */
  }
}

/** Menschlich lesbarer relativer Zeitabstand, z.B. "vor 2 Stunden". */
export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.floor(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'gestern';
  return `vor ${d} Tagen`;
}
