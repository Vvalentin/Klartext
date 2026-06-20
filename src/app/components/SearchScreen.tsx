import { Search, TrendingUp, Package, ArrowLeft, ChevronRight, SlidersHorizontal, Star, X } from 'lucide-react';
import { TextField, Card, CardContent, Chip, IconButton, Slider } from '@mui/material';
import { useState, useMemo } from 'react';
import {
  POPULAR_CATEGORIES,
  ALL_CATALOG_PRODUCTS,
  MAX_CATALOG_PRICE,
  Category,
  CatalogProduct,
} from '../data/catalog';

const trendingSearches = [
  'Mikroplastik in Kosmetik',
  'Palmöl-freie Produkte',
  'Duftstoff-Allergene',
  'Parabene',
  'Sulfatfreies Shampoo'
];

// Farbe nach Score-Schwellen (analog ProductResultScreen)
const scoreColor = (score: number) => {
  if (score < 36) return '#dc2626';
  if (score < 50) return '#ea580c';
  return '#16a34a';
};

const formatPrice = (p: number) => `${p.toFixed(2).replace('.', ',')} €`;

// ---------------------------------------------------------------------------
// Filter (wiederverwendbar: Entdecken-Hauptansicht + Kategorie-Detailansicht)
// ---------------------------------------------------------------------------
export interface Filters {
  maxPrice: number;
  minEnv: number;
  minHealth: number;
  minRating: number;
}

const DEFAULT_FILTERS: Filters = {
  maxPrice: MAX_CATALOG_PRICE,
  minEnv: 0,
  minHealth: 0,
  minRating: 0,
};

const countActiveFilters = (f: Filters) =>
  (f.maxPrice < MAX_CATALOG_PRICE ? 1 : 0) +
  (f.minEnv > 0 ? 1 : 0) +
  (f.minHealth > 0 ? 1 : 0) +
  (f.minRating > 0 ? 1 : 0);

const isFiltersActive = (f: Filters) => countActiveFilters(f) > 0;

function applyFilters<T extends CatalogProduct>(products: T[], f: Filters): T[] {
  return products
    .filter(
      (p) =>
        p.price <= f.maxPrice &&
        p.envScore >= f.minEnv &&
        p.healthScore >= f.minHealth &&
        p.rating >= f.minRating
    )
    .sort((a, b) => b.rating - a.rating);
}

const greenSliderSx = {
  color: '#16a34a',
  '& .MuiSlider-thumb': { backgroundColor: '#16a34a' },
};

function FilterButton({ open, count, onClick }: { open: boolean; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
        open || count > 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
      }`}
      aria-label="Filter"
    >
      <SlidersHorizontal size={20} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function FilterPanel({
  filters,
  setFilters,
  onReset,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onReset: () => void;
}) {
  return (
    <Card sx={{ borderRadius: '12px' }} className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Filter</h3>
          <button onClick={onReset} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <X size={14} /> Zurücksetzen
          </button>
        </div>

        {/* Preis */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Max. Preis</span>
            <span className="font-medium text-gray-900">
              {filters.maxPrice >= MAX_CATALOG_PRICE ? 'beliebig' : formatPrice(filters.maxPrice)}
            </span>
          </div>
          <Slider
            value={filters.maxPrice}
            min={0}
            max={MAX_CATALOG_PRICE}
            step={0.5}
            onChange={(_, v) => setFilters({ ...filters, maxPrice: v as number })}
            sx={greenSliderSx}
          />
        </div>

        {/* Umweltscore */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Min. Umwelt-Score</span>
            <span className="font-medium text-gray-900">{filters.minEnv > 0 ? `ab ${filters.minEnv}` : 'beliebig'}</span>
          </div>
          <Slider
            value={filters.minEnv}
            min={0}
            max={100}
            step={5}
            onChange={(_, v) => setFilters({ ...filters, minEnv: v as number })}
            sx={greenSliderSx}
          />
        </div>

        {/* Gesundheitsscore */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Min. Gesundheits-Score</span>
            <span className="font-medium text-gray-900">{filters.minHealth > 0 ? `ab ${filters.minHealth}` : 'beliebig'}</span>
          </div>
          <Slider
            value={filters.minHealth}
            min={0}
            max={100}
            step={5}
            onChange={(_, v) => setFilters({ ...filters, minHealth: v as number })}
            sx={greenSliderSx}
          />
        </div>

        {/* Bewertung */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Min. Bewertung</span>
            <span className="font-medium text-gray-900 flex items-center gap-0.5">
              {filters.minRating > 0 ? (
                <>
                  ab {filters.minRating.toFixed(1)} <Star size={12} className="text-amber-500" fill="currentColor" />
                </>
              ) : (
                'beliebig'
              )}
            </span>
          </div>
          <Slider
            value={filters.minRating}
            min={0}
            max={5}
            step={0.5}
            onChange={(_, v) => setFilters({ ...filters, minRating: v as number })}
            sx={greenSliderSx}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Package className="text-gray-400" size={24} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
    />
  );
}

/** Produktkarte mit Preis, Bewertung und Dual-Score. */
function ProductCard({ product, categoryLabel }: { product: CatalogProduct; categoryLabel?: string }) {
  return (
    <Card className="border border-green-200 bg-green-50" sx={{ boxShadow: 'none', borderRadius: '12px' }}>
      <CardContent className="p-3 flex gap-3 items-center">
        <ProductImage src={product.image} alt={product.name} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{product.name}</p>
          <p className="text-xs text-gray-500 truncate">
            {product.brand}
            {categoryLabel ? ` · ${categoryLabel}` : ''}
          </p>
          <p className="text-xs text-green-700 mt-0.5 truncate">{product.highlight}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-semibold text-gray-900">{formatPrice(product.price)}</span>
            <span className="flex items-center gap-0.5 text-xs text-amber-600">
              <Star size={12} fill="currentColor" />
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs font-semibold" style={{ color: scoreColor(product.healthScore) }}>
            G {product.healthScore}
          </span>
          <span className="text-xs font-semibold" style={{ color: scoreColor(product.envScore) }}>
            U {product.envScore}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/** Katalog-Ansicht: Produkte einer Kategorie – mit eigenem Filter. */
function CategoryCatalog({ category, onBack }: { category: Category; onBack: () => void }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const active = isFiltersActive(filters);
  const products = useMemo(
    () => (active ? applyFilters(category.products, filters) : category.products),
    [category, filters, active]
  );

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      <div className="bg-white p-6 pb-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <IconButton onClick={onBack} sx={{ backgroundColor: '#f3f4f6', '&:hover': { backgroundColor: '#e5e7eb' } }}>
              <ArrowLeft size={20} />
            </IconButton>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-3xl">{category.icon}</span>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-gray-900 truncate">{category.name}</h1>
                <p className="text-sm text-gray-500">Empfohlene Produkte</p>
              </div>
            </div>
          </div>
          <FilterButton open={showFilters} count={countActiveFilters(filters)} onClick={() => setShowFilters((v) => !v)} />
        </div>
      </div>

      {showFilters && (
        <div className="px-4 pt-4">
          <FilterPanel filters={filters} setFilters={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
        </div>
      )}

      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-green-700" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Gut bewertet</h2>
          </div>
          {active && <span className="text-sm text-gray-500">{products.length} Treffer</span>}
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Keine Produkte entsprechen den Filtern. Passe die Kriterien an.</p>
        ) : (
          <div className="space-y-2">
            {products.map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const active = isFiltersActive(filters);
  const results = useMemo(() => applyFilters(ALL_CATALOG_PRODUCTS, filters), [filters]);

  if (selectedCategory) {
    return <CategoryCatalog category={selectedCategory} onBack={() => setSelectedCategory(null)} />;
  }

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 pb-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Entdecken</h1>

        <div className="flex items-center gap-2">
          <TextField
            fullWidth
            placeholder="Produkte oder Inhaltsstoffe suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: <Search className="text-gray-400 mr-2" size={20} />,
              sx: { borderRadius: '12px', backgroundColor: '#f9fafb', '& fieldset': { border: 'none' } },
            }}
          />
          <FilterButton open={showFilters} count={countActiveFilters(filters)} onClick={() => setShowFilters((v) => !v)} />
        </div>
      </div>

      {/* Filter-Panel */}
      {showFilters && (
        <div className="px-4 pt-4">
          <FilterPanel filters={filters} setFilters={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
        </div>
      )}

      <div className="px-4 py-6 space-y-6">
        {active ? (
          /* Gefilterte Produkte (kategorieübergreifend) */
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Passende Produkte</h2>
              <span className="text-sm text-gray-500">{results.length} Treffer</span>
            </div>
            {results.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Keine Produkte entsprechen den Filtern. Passe die Kriterien an.</p>
            ) : (
              <div className="space-y-2">
                {results.map((product, idx) => (
                  <ProductCard key={idx} product={product} categoryLabel={product.category} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Trending Searches */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-green-700" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Trending-Suchen</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, idx) => (
                  <Chip
                    key={idx}
                    label={term}
                    onClick={() => setSearchQuery(term)}
                    sx={{
                      backgroundColor: '#f0fdf4',
                      color: '#15803d',
                      fontWeight: 500,
                      '&:hover': { backgroundColor: '#dcfce7' },
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Popular Categories */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Package className="text-green-700" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Beliebte Kategorien</h2>
              </div>
              <div className="space-y-2">
                {POPULAR_CATEGORIES.map((category, idx) => (
                  <Card
                    key={idx}
                    onClick={() => setSelectedCategory(category)}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    sx={{ borderRadius: '12px' }}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{category.icon}</div>
                        <div>
                          <p className="font-semibold text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">{category.count.toLocaleString('de-DE')} Produkte</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <ChevronRight className="text-green-700" size={18} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
