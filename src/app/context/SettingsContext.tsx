import { createContext, useContext, useState, ReactNode } from 'react';

export type Diet = 'none' | 'vegetarian' | 'vegan';

interface SettingsContextValue {
  // Schutzbedürftige Gruppen
  pregnancy: boolean;
  setPregnancy: (v: boolean) => void;
  childMode: boolean;
  setChildMode: (v: boolean) => void;
  // Öko-Präferenzen
  avoidPalmOil: boolean;
  setAvoidPalmOil: (v: boolean) => void;
  // Ernährungsstil
  diet: Diet;
  setDiet: (v: Diet) => void;
  // Nährwerte in den Gesundheits-Score einrechnen
  considerSugar: boolean;
  setConsiderSugar: (v: boolean) => void;
  considerSalt: boolean;
  setConsiderSalt: (v: boolean) => void;
  considerSaturatedFat: boolean;
  setConsiderSaturatedFat: (v: boolean) => void;
  // Allergene
  allergens: string[];
  addAllergen: (name: string) => void;
  removeAllergen: (name: string) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

/** Gängige Lebensmittel- (EU-14) und Kosmetik-Allergene zur Auswahl. */
export const COMMON_ALLERGENS = [
  'Erdnüsse',
  'Gluten',
  'Schalenfrüchte (Nüsse)',
  'Milch (Laktose)',
  'Eier',
  'Soja',
  'Fisch',
  'Krebstiere',
  'Weichtiere',
  'Sellerie',
  'Senf',
  'Sesam',
  'Lupinen',
  'Sulfite (Schwefeldioxid)',
  'Duftstoffe',
  'Parabene',
  'Nickel',
  'Konservierungsstoffe',
];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [pregnancy, setPregnancy] = useState(false);
  const [childMode, setChildMode] = useState(true);
  const [avoidPalmOil, setAvoidPalmOil] = useState(true);
  const [diet, setDiet] = useState<Diet>('none');
  const [considerSugar, setConsiderSugar] = useState(false);
  const [considerSalt, setConsiderSalt] = useState(false);
  const [considerSaturatedFat, setConsiderSaturatedFat] = useState(false);
  const [allergens, setAllergens] = useState<string[]>([
    'Erdnüsse',
    'Gluten',
    'Duftstoffe',
    'Parabene',
  ]);

  const addAllergen = (name: string) =>
    setAllergens((prev) => (prev.includes(name) ? prev : [...prev, name]));
  const removeAllergen = (name: string) =>
    setAllergens((prev) => prev.filter((a) => a !== name));

  return (
    <SettingsContext.Provider
      value={{
        pregnancy,
        setPregnancy,
        childMode,
        setChildMode,
        avoidPalmOil,
        setAvoidPalmOil,
        diet,
        setDiet,
        considerSugar,
        setConsiderSugar,
        considerSalt,
        setConsiderSalt,
        considerSaturatedFat,
        setConsiderSaturatedFat,
        allergens,
        addAllergen,
        removeAllergen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
