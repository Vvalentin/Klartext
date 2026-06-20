import { X, ExternalLink, ShieldAlert, Leaf, Activity } from 'lucide-react';
import { Dialog, DialogContent, IconButton, Chip } from '@mui/material';

interface Source {
  name: string;
  type: 'regulatory' | 'peer-reviewed' | 'government' | 'industry';
}

interface Ingredient {
  name: string;
  translation: string;
  hazard: 'high' | 'medium' | 'safe';
  category: 'health' | 'environment' | 'both';
  riskType: string;
  description: string;
  sources: Source[];
}

interface IngredientDetailModalProps {
  ingredient: Ingredient;
  onClose: () => void;
}

export function IngredientDetailModal({ ingredient, onClose }: IngredientDetailModalProps) {
  // Farben als Hex/sx, da MUI-Chip per className gesetzte Tailwind-Farben überschreibt
  const getHazardConfig = (hazard: string) => {
    switch(hazard) {
      case 'high': return { color: '#dc2626', text: 'Hohes Risiko', icon: ShieldAlert };
      case 'medium': return { color: '#f97316', text: 'Mittleres Risiko', icon: Activity };
      default: return { color: '#16a34a', text: 'Unbedenklich', icon: Leaf };
    }
  };

  const getSourceBadge = (type: string) => {
    switch(type) {
      case 'regulatory': return { bg: '#dbeafe', text: '#1e40af', label: 'BEHÖRDLICH' };
      case 'peer-reviewed': return { bg: '#f3e8ff', text: '#6b21a8', label: 'PEER-REVIEWED' };
      case 'government': return { bg: '#e0e7ff', text: '#3730a3', label: 'STAATLICH' };
      default: return { bg: '#f3f4f6', text: '#1f2937', label: 'INDUSTRIE' };
    }
  };

  const hazardConfig = getHazardConfig(ingredient.hazard);
  const HazardIcon = hazardConfig.icon;

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxHeight: '90vh',
          margin: 2
        }
      }}
    >
      <DialogContent className="p-0">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 pb-8">
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <X size={20} />
          </IconButton>

          <h2 className="text-xl font-semibold pr-8 mb-2">{ingredient.name}</h2>
          <p className="text-sm text-gray-300">{ingredient.translation}</p>

          <div className="mt-4">
            <Chip
              icon={<HazardIcon size={14} />}
              label={`${hazardConfig.text} – ${ingredient.category === 'both' ? 'Gesundheit & Umwelt' : ingredient.category === 'health' ? 'Gesundheit' : 'Umwelt'}`}
              sx={{
                height: '32px',
                backgroundColor: hazardConfig.color,
                color: 'white',
                fontWeight: 600,
                '& .MuiChip-label': { color: 'white' },
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Risk Type */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Risikoeinstufung
            </h3>
            <p className="text-base font-semibold text-gray-900">{ingredient.riskType}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Was ist das?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{ingredient.description}</p>
          </div>

          {/* Scientific Evidence */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Wissenschaftliche Quellen &amp; Evidenz
            </h3>
            <div className="space-y-3">
              {ingredient.sources.map((source, idx) => {
                const badge = getSourceBadge(source.type);
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    <ExternalLink size={16} className="text-blue-600 mt-0.5 flex-shrink-0 group-hover:text-blue-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{source.name}</p>
                      <Chip
                        label={badge.label}
                        size="small"
                        className="mt-1"
                        sx={{
                          height: '18px',
                          fontSize: '10px',
                          fontWeight: 600,
                          backgroundColor: badge.bg,
                          color: badge.text,
                          '& .MuiChip-label': { color: badge.text }
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Read Full Paper Button */}
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <ExternalLink size={18} />
            Vollständige Studie lesen
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
