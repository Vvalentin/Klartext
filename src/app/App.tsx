import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { ScannerScreen } from './components/ScannerScreen';
import { ProductResultScreen } from './components/ProductResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SearchScreen } from './components/SearchScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsProvider } from './context/SettingsContext';
import { fetchProduct } from './services/productApi';
import { Product, DEMO_PRODUCT, DEMO_BARCODE } from './data/demoProduct';
import { addToHistory } from './data/history';

export default function App() {
  const [activeTab, setActiveTab] = useState(1); // Start with Scanner
  const [showProductResult, setShowProductResult] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Produkt anzeigen. Mit Barcode -> echte Daten laden; ohne -> Demo-Produkt (z.B. Verlauf).
  const openProduct = async (scannedBarcode?: string) => {
    setShowProductResult(true);
    setBarcode(scannedBarcode ?? null);
    if (!scannedBarcode) {
      setProduct(DEMO_PRODUCT);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setProduct(null);
    try {
      const result = await fetchProduct(scannedBarcode);
      if (result) {
        setProduct(result);
        addToHistory(scannedBarcode, result);
      } else {
        setError(`Kein Produkt zu Barcode ${scannedBarcode} gefunden.`);
      }
    } catch (e) {
      console.error('Produktabruf fehlgeschlagen:', e);
      setError('Produktdaten konnten nicht geladen werden. Besteht eine Internetverbindung?');
    } finally {
      setLoading(false);
    }
  };

  const handleScanComplete = (barcode?: string) => {
    // Auf dem Gerät kommt ein echter Barcode; im Browser (Simulation) nutzen wir
    // einen bekannten Demo-Barcode, um die echte API zu testen.
    openProduct(barcode ?? DEMO_BARCODE);
  };

  const renderScreen = () => {
    if (showProductResult) {
      return (
        <ProductResultScreen
          product={product}
          barcode={barcode}
          loading={loading}
          error={error}
          onBack={() => setShowProductResult(false)}
        />
      );
    }

    switch (activeTab) {
      case 0:
        return <HistoryScreen onOpenProduct={(bc) => openProduct(bc)} />;
      case 1:
        return <ScannerScreen onScanComplete={handleScanComplete} />;
      case 2:
        return <SearchScreen />;
      case 3:
        return <ProfileScreen />;
      default:
        return <ScannerScreen onScanComplete={handleScanComplete} />;
    }
  };

  // Reset product result when changing tabs
  const handleTabChange = (newTab: number) => {
    setActiveTab(newTab);
    if (newTab !== 1) {
      setShowProductResult(false);
    }
  };

  return (
    <SettingsProvider>
      <div className="h-screen w-full max-w-md mx-auto bg-white relative overflow-hidden flex flex-col">
        {/* Main content area */}
        <div className="flex-1 overflow-hidden">
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        <BottomNav value={activeTab} onChange={handleTabChange} />
      </div>
    </SettingsProvider>
  );
}
