import { Clock, ChevronRight, Package } from 'lucide-react';
import { getHistory, relativeTime } from '../data/history';

interface HistoryScreenProps {
  onOpenProduct?: (barcode: string) => void;
}

export function HistoryScreen({ onOpenProduct }: HistoryScreenProps) {
  const history = getHistory();

  const getScoreColor = (score: number) => {
    if (score >= 50) return 'text-green-600';
    if (score >= 36) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Clock className="text-green-700" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Scan-Verlauf</h1>
            <p className="text-sm text-gray-500">Ihre letzten Produktanalysen</p>
          </div>
        </div>
      </div>

      {/* History List */}
      {history.length > 0 ? (
        <div className="px-4 py-6 space-y-3">
          {history.map((item) => (
            <div
              key={item.barcode}
              onClick={() => onOpenProduct?.(item.barcode)}
              className="bg-white rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg active:scale-[0.99] transition-all duration-150"
            >
              <div className="p-4 flex gap-4 items-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package className="text-gray-400" size={24} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{item.brand}</p>
                  <p className="text-xs text-gray-400 mt-1">{relativeTime(item.scannedAt)}</p>

                  <div className="flex gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Gesundheit:</span>
                      <span className={`text-sm font-semibold ${getScoreColor(item.healthScore)}`}>
                        {item.healthScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Umwelt:</span>
                      <span className={`text-sm font-semibold ${getScoreColor(item.envScore)}`}>
                        {item.envScore}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 flex-shrink-0" size={20} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 text-center px-8">
          <Clock className="text-gray-300 mb-4" size={64} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Noch keine Scans</h3>
          <p className="text-sm text-gray-500">
            Scannen Sie Produkte, um Ihren Verlauf hier zu sehen
          </p>
        </div>
      )}
    </div>
  );
}
