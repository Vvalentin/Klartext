import { useState } from 'react';
import { ChevronRight, AlertTriangle, ShieldAlert, Leaf, ArrowLeft, Sprout, CheckCircle, Package, SearchX, Sparkles } from 'lucide-react';
import { Card, CardContent, Chip, IconButton, CircularProgress } from '@mui/material';
import { IngredientDetailModal } from './IngredientDetailModal';
import { useSettings } from '../context/SettingsContext';
import { Product } from '../data/demoProduct';
import { adjustHealthForNutrients } from '../services/productApi';
import { getRecommendations } from '../data/recommendations';

interface ProductResultScreenProps {
  product: Product | null;
  barcode?: string | null;
  loading?: boolean;
  error?: string | null;
  onBack?: () => void;
}

export function ProductResultScreen({ product, barcode, loading, error, onBack }: ProductResultScreenProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  const { diet, allergens, avoidPalmOil, considerSugar, considerSalt, considerSaturatedFat } = useSettings();

  const BackButton = () =>
    onBack ? (
      <IconButton
        onClick={onBack}
        sx={{
          position: 'absolute',
          left: 8,
          top: 8,
          backgroundColor: '#f3f4f6',
          '&:hover': { backgroundColor: '#e5e7eb' },
        }}
      >
        <ArrowLeft size={20} />
      </IconButton>
    ) : null;

  // Lade-Zustand
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 gap-4">
        <CircularProgress sx={{ color: '#16a34a' }} />
        <p className="text-gray-600">Produktdaten werden geladen …</p>
      </div>
    );
  }

  // Fehler / nicht gefunden
  if (error || !product) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="bg-white p-6 shadow-sm relative h-16">
          <BackButton />
        </div>
        <div className="flex flex-col items-center justify-center text-center px-8 mt-24">
          <SearchX className="text-gray-300 mb-4" size={64} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Produkt nicht gefunden</h3>
          <p className="text-sm text-gray-500">
            {error || 'Zu diesem Barcode liegen keine Daten in Open Food Facts / Open Beauty Facts vor.'}
          </p>
        </div>
      </div>
    );
  }

  const sortedIngredients = [...product.ingredients].sort((a, b) => {
    const hazardOrder = { high: 0, medium: 1, safe: 2 };
    return hazardOrder[a.hazard] - hazardOrder[b.hazard];
  });

  // Allergene im Produkt, die der Nutzer vermeiden möchte
  const matchedAllergens = product.allergens.filter((a) => allergens.includes(a));

  // Inhaltsstoffe, die nicht zum Ernährungsstil passen
  const dietConflicts = product.ingredients.filter((ing) => {
    if (!ing.diet) return false;
    if (diet === 'vegan') return ing.diet === 'non-vegan' || ing.diet === 'non-vegetarian';
    if (diet === 'vegetarian') return ing.diet === 'non-vegetarian';
    return false;
  });

  // Umwelt-Hochrisiko-Stoffe und Palmöl
  const envHazards = product.ingredients.filter(
    (i) => (i.category === 'environment' || i.category === 'both') && i.hazard === 'high'
  );
  const palmOil = product.ingredients.filter((i) => /palmöl/i.test(i.riskType));

  // Nährwerte optional in den Gesundheits-Score einrechnen (Profil-Einstellung).
  // Senkt den angezeigten Score bei hohem Zucker-/Salz-/Fettgehalt.
  const nutrient = adjustHealthForNutrients(product.healthScore, product.nutrientLevels, {
    sugar: considerSugar,
    salt: considerSalt,
    saturatedFat: considerSaturatedFat,
  });
  const healthScore = nutrient.score;
  const levelLabel = (l: string) => (l === 'high' ? 'hoch' : l === 'moderate' ? 'erhöht' : 'niedrig');

  const hasWarnings =
    matchedAllergens.length > 0 ||
    dietConflicts.length > 0 ||
    envHazards.length > 0 ||
    nutrient.flagged.length > 0 ||
    (avoidPalmOil && palmOil.length > 0);

  // Bessere Alternativen (nur bei schlecht bewerteten Produkten)
  const recommendations = getRecommendations(barcode ?? null, product);

  // Farbe nach Score-Schwellen: <36 rot, 36-49 orange, ab 50 grün
  const getScoreColor = (score: number) => {
    if (score < 36) return '#dc2626';
    if (score < 50) return '#ea580c';
    return '#16a34a';
  };

  // Risiko-Badge-Farben (als sx, da MUI-Chip Tailwind-Klassen überschreibt)
  const getHazardColor = (hazard: string) => {
    switch (hazard) {
      case 'high': return { bg: 'bg-red-50', border: 'border-red-300', badge: { backgroundColor: '#fee2e2', color: '#991b1b' } };
      case 'medium': return { bg: 'bg-orange-50', border: 'border-orange-300', badge: { backgroundColor: '#ffedd5', color: '#9a3412' } };
      default: return { bg: 'bg-green-50', border: 'border-green-300', badge: { backgroundColor: '#dcfce7', color: '#166534' } };
    }
  };

  const getHazardLabel = (hazard: string) => {
    switch (hazard) {
      case 'high': return 'HOHES RISIKO';
      case 'medium': return 'MITTLERES RISIKO';
      default: return 'UNBEDENKLICH';
    }
  };

  const ScoreGauge = ({ score, label, color }: { score: number; label: string; color: string }) => (
    <div className="flex-1 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 -rotate-90">
          <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
          <circle
            cx="64" cy="64" r="56"
            stroke={color} strokeWidth="12" fill="none"
            strokeDasharray={`${score * 3.51} 351`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-3xl font-bold" style={{ color }}>{score}</div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </div>
      <p className="text-center mt-2 text-sm font-medium text-gray-700">{label}</p>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      {/* Product Header */}
      <div className="bg-white p-6 shadow-sm relative">
        <BackButton />
        <div className="flex gap-4 mt-8">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Package className="text-gray-400" size={28} />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      <div className="px-4 pt-4 space-y-2">
        {matchedAllergens.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
            <ShieldAlert className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-red-900">🛑 Allergen-Warnung!</p>
              <p className="text-sm text-red-700">Enthält: {matchedAllergens.join(', ')}</p>
            </div>
          </div>
        )}

        {dietConflicts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
            <Sprout className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-red-900">
                🛑 Nicht {diet === 'vegan' ? 'vegan' : 'vegetarisch'}!
              </p>
              <p className="text-sm text-red-700">
                Enthält tierische Stoffe: {dietConflicts.map((i) => i.name).join(', ')}
              </p>
            </div>
          </div>
        )}

        {avoidPalmOil && palmOil.length > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg flex items-start gap-3">
            <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-orange-900">⚠️ Enthält Palmöl</p>
              <p className="text-sm text-orange-700">{palmOil.map((i) => i.name).join(', ')}</p>
            </div>
          </div>
        )}

        {envHazards.length > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg flex items-start gap-3">
            <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-orange-900">⚠️ Umweltbelastung</p>
              <p className="text-sm text-orange-700">{envHazards.map((i) => i.name).join(', ')}</p>
            </div>
          </div>
        )}

        {nutrient.flagged.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-amber-900">⚠️ Nährwerte senken den Gesundheits-Score</p>
              <p className="text-sm text-amber-700">
                {nutrient.flagged.map((f) => `${f.label} (${levelLabel(f.level)})`).join(', ')}
              </p>
            </div>
          </div>
        )}

        {!hasWarnings && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-green-900">Keine Warnungen für dein Profil</p>
              <p className="text-sm text-green-700">Keine deiner Allergene oder Präferenzen betroffen.</p>
            </div>
          </div>
        )}
      </div>

      {/* Dual Score Dashboard */}
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Leaf size={20} className="text-green-600" />
          Produktanalyse
        </h2>
        <div className="flex gap-3">
          <ScoreGauge score={healthScore} label="Gesundheits-Score" color={getScoreColor(healthScore)} />
          <ScoreGauge score={product.envScore} label="Umwelt-Score" color={getScoreColor(product.envScore)} />
        </div>
      </div>

      {/* Bessere Alternativen (nur bei schlechtem Produkt) */}
      {recommendations.length > 0 && (
        <div className="px-4 pt-6 pb-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles size={20} className="text-green-600" />
            Bessere Alternativen
          </h2>
          <div className="space-y-2">
            {recommendations.map((alt, idx) => (
              <Card key={idx} className="border border-green-200 bg-green-50" sx={{ boxShadow: 'none', borderRadius: '12px' }}>
                <CardContent className="p-3 flex gap-3 items-center">
                  {alt.image ? (
                    <img src={alt.image} alt={alt.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package className="text-gray-400" size={22} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{alt.name}</p>
                    <p className="text-xs text-gray-500 truncate">{alt.brand}</p>
                    <p className="text-xs text-green-700 mt-0.5">{alt.reason}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="text-xs text-gray-500">G {alt.healthScore}</span>
                    <span className="text-xs text-gray-500">U {alt.envScore}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients List */}
      <div className="px-4 pt-6 pb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Inhaltsstoff-Analyse</h2>
        <p className="text-xs text-gray-500 mb-4">Nach Risikostufe sortiert (höchstes zuerst)</p>

        {sortedIngredients.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Für dieses Produkt sind keine Inhaltsstoffe hinterlegt.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedIngredients.map((ingredient, idx) => {
              const colors = getHazardColor(ingredient.hazard);
              return (
                <Card
                  key={idx}
                  onClick={() => setSelectedIngredient(ingredient)}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${colors.bg} border ${colors.border}`}
                  sx={{ boxShadow: 'none' }}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{ingredient.name}</p>
                        <Chip
                          label={getHazardLabel(ingredient.hazard)}
                          size="small"
                          sx={{ height: '20px', fontSize: '10px', fontWeight: 600, ...colors.badge }}
                        />
                      </div>
                      {ingredient.translation && (
                        <p className="text-sm text-gray-600">{ingredient.translation}</p>
                      )}
                    </div>
                    <ChevronRight className="text-gray-400 flex-shrink-0 ml-2" size={20} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {selectedIngredient && (
        <IngredientDetailModal
          ingredient={selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
        />
      )}
    </div>
  );
}
