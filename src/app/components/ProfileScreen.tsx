import { Plus, Baby, Heart, Leaf, ChevronRight, Check, Sprout, Carrot, Candy, CookingPot, Droplets } from 'lucide-react';
import {
  Switch,
  Card,
  CardContent,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';
import { useSettings, COMMON_ALLERGENS, Diet } from '../context/SettingsContext';

export function ProfileScreen() {
  const {
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
  } = useSettings();

  const [allergenDialogOpen, setAllergenDialogOpen] = useState(false);

  const switchSx = {
    '& .MuiSwitch-switchBase.Mui-checked': { color: '#16a34a' },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#16a34a' },
  };

  const dietOptions: { value: Diet; label: string; desc: string; icon: typeof Leaf }[] = [
    { value: 'none', label: 'Keine Einschränkung', desc: 'Alle Produkte ohne Ernährungs-Warnung', icon: Carrot },
    { value: 'vegetarian', label: 'Vegetarisch', desc: 'Warnung bei Fleisch, Fisch & Gelatine', icon: Leaf },
    { value: 'vegan', label: 'Vegan', desc: 'Warnung bei allen tierischen Stoffen', icon: Sprout },
  ];

  // Nährwerte, die optional in den Gesundheits-Score einfließen
  const macroOptions: {
    checked: boolean;
    setChecked: (v: boolean) => void;
    label: string;
    desc: string;
    icon: typeof Leaf;
    color: string;
    bg: string;
  }[] = [
    { checked: considerSugar, setChecked: setConsiderSugar, label: 'Hoher Zuckeranteil', desc: 'Score senken bei viel Zucker', icon: Candy, color: 'text-pink-600', bg: 'bg-pink-100' },
    { checked: considerSalt, setChecked: setConsiderSalt, label: 'Hoher Salzanteil', desc: 'Score senken bei viel Salz', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100' },
    { checked: considerSaturatedFat, setChecked: setConsiderSaturatedFat, label: 'Gesättigte Fettsäuren', desc: 'Score senken bei viel gesätt. Fett', icon: CookingPot, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 pb-8">
        <div className="flex items-center gap-4">
          <Avatar
            sx={{
              width: 72,
              height: 72,
              backgroundColor: 'white',
              color: '#16a34a',
              fontSize: '32px',
              fontWeight: 600,
            }}
          >
            JD
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">Mein Profil</h1>
            <p className="text-green-100 text-sm mt-1">Gesundheitswarnungen personalisieren</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Schutzbedürftige Gruppen */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Baby className="text-green-700" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Persönliche Schutzeinstellungen</h2>
          </div>

          <Card className="shadow-sm" sx={{ borderRadius: '12px' }}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="text-pink-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Schwangerschafts-Modus</p>
                    <p className="text-xs text-gray-500">Warnungen für Schwangere anzeigen</p>
                  </div>
                </div>
                <Switch checked={pregnancy} onChange={(e) => setPregnancy(e.target.checked)} sx={switchSx} />
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Baby className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Kindersicherer Modus</p>
                    <p className="text-xs text-gray-500">Produkte für Kinder hervorheben</p>
                  </div>
                </div>
                <Switch checked={childMode} onChange={(e) => setChildMode(e.target.checked)} sx={switchSx} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ernährungsstil */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="text-green-700" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Ernährungsstil</h2>
          </div>

          <Card className="shadow-sm" sx={{ borderRadius: '12px' }}>
            <CardContent className="p-4 space-y-2">
              <p className="text-sm text-gray-600 mb-1">
                Beim Scannen vor unpassenden Inhaltsstoffen warnen
              </p>
              {dietOptions.map((opt) => {
                const Icon = opt.icon;
                const active = diet === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDiet(opt.value)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                      active
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        active ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      <Icon className={active ? 'text-green-600' : 'text-gray-500'} size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                    {active && <Check className="text-green-600 flex-shrink-0" size={20} />}
                  </button>
                );
              })}

              {/* Nährwerte in den Gesundheits-Score einrechnen */}
              <div className="pt-3 mt-1 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-0.5">In den Gesundheits-Score einrechnen</p>
                <p className="text-xs text-gray-500 mb-2">
                  Bei hohem Gehalt sinkt der Gesundheits-Score des Produkts
                </p>
                {macroOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <div key={opt.label} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${opt.bg}`}>
                          <Icon className={opt.color} size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.desc}</p>
                        </div>
                      </div>
                      <Switch checked={opt.checked} onChange={(e) => opt.setChecked(e.target.checked)} sx={switchSx} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* My Allergens */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="text-green-700" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Meine Allergene</h2>
          </div>

          <Card className="shadow-sm" sx={{ borderRadius: '12px' }}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-3">
                Produkte mit diesen Stoffen lösen Warnungen aus
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {allergens.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Noch keine Allergene ausgewählt</p>
                )}
                {allergens.map((allergen) => (
                  <Chip
                    key={allergen}
                    label={allergen}
                    onDelete={() => removeAllergen(allergen)}
                    sx={{
                      backgroundColor: '#fef2f2',
                      color: '#991b1b',
                      fontWeight: 500,
                      '& .MuiChip-deleteIcon': {
                        color: '#991b1b',
                        '&:hover': { color: '#7f1d1d' },
                      },
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setAllergenDialogOpen(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-700 hover:bg-green-50 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus size={18} />
                Allergen hinzufügen
              </button>
            </CardContent>
          </Card>
        </section>

        {/* Eco Preferences */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="text-green-700" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Öko-Präferenzen</h2>
          </div>

          <Card className="shadow-sm" sx={{ borderRadius: '12px' }}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Leaf className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Palmöl strikt vermeiden</p>
                    <p className="text-xs text-gray-500">Produkte mit Palmöl-Derivaten kennzeichnen</p>
                  </div>
                </div>
                <Switch checked={avoidPalmOil} onChange={(e) => setAvoidPalmOil(e.target.checked)} sx={switchSx} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Additional Settings */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weitere Einstellungen</h2>

          <Card className="shadow-sm" sx={{ borderRadius: '12px' }}>
            <CardContent className="p-0">
              {['Benachrichtigungen', 'Daten & Datenschutz', 'Über & Hilfe'].map((item, idx, arr) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                    idx !== arr.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <p className="font-medium text-gray-900">{item}</p>
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Allergen-Auswahl Dialog */}
      <Dialog
        open={allergenDialogOpen}
        onClose={() => setAllergenDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: '16px', margin: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Allergen auswählen</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <List sx={{ py: 0 }}>
            {COMMON_ALLERGENS.map((name) => {
              const selected = allergens.includes(name);
              return (
                <ListItemButton
                  key={name}
                  onClick={() => (selected ? removeAllergen(name) : addAllergen(name))}
                >
                  <ListItemText
                    primary={name}
                    primaryTypographyProps={{
                      sx: { fontWeight: selected ? 600 : 400, color: selected ? '#15803d' : '#111827' },
                    }}
                  />
                  {selected && <Check className="text-green-600" size={18} />}
                </ListItemButton>
              );
            })}
          </List>
        </DialogContent>
        <button
          onClick={() => setAllergenDialogOpen(false)}
          className="m-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          Fertig
        </button>
      </Dialog>
    </div>
  );
}
