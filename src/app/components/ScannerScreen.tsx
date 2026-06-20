import { useEffect, useRef } from 'react';
import { Flashlight, Keyboard } from 'lucide-react';
import { IconButton } from '@mui/material';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';

interface ScannerScreenProps {
  onScanComplete?: (barcode?: string) => void;
}

export function ScannerScreen({ onScanComplete }: ScannerScreenProps) {
  const isNative = Capacitor.isNativePlatform();
  const scanning = useRef(false);

  const handleScan = async () => {
    if (scanning.current) return; // Doppel-Öffnen der Kamera verhindern
    scanning.current = true;
    if (!isNative) {
      // Im Browser keine Kamera -> Scan simulieren
      scanning.current = false;
      onScanComplete?.();
      return;
    }

    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL,
        scanInstructions: 'Barcode im Rahmen ausrichten',
      });
      // result.ScanResult enthält den gescannten Code (EAN/GTIN)
      onScanComplete?.(result.ScanResult);
    } catch (err) {
      // Nutzer hat abgebrochen oder Berechtigung verweigert -> nichts tun
      console.warn('Scan abgebrochen oder fehlgeschlagen:', err);
    } finally {
      scanning.current = false;
    }
  };

  // Auf dem Gerät die Kamera direkt beim Öffnen des Scan-Screens starten,
  // ohne dass der Nutzer erst tippen muss. Tippen bleibt als Fallback erhalten
  // (z. B. wenn der Scan abgebrochen wurde).
  useEffect(() => {
    if (isNative) handleScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative h-full bg-black flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleScan}
    >
      {/* Camera background simulation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />

      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <IconButton sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <Flashlight size={24} />
        </IconButton>
        <IconButton sx={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <Keyboard size={24} />
        </IconButton>
      </div>

      {/* Scanning frame */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Scanning overlay */}
        <div className="relative w-72 h-48 border-2 border-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-400" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-400" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-400" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-400" />

          {/* Scanning line animation */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-400 shadow-lg shadow-green-400/50 animate-pulse"
               style={{
                 animation: 'scan 2s ease-in-out infinite',
               }}
          />
        </div>

        {/* Instruction text */}
        <p className="mt-6 text-white text-center px-8">
          Barcode eines Lebensmittels oder Kosmetikprodukts scannen
        </p>
        <p className="mt-2 text-gray-400 text-sm">
          Barcode im Rahmen ausrichten
        </p>

        {/* Demo hint */}
        <div className="mt-8 bg-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2">
          <p className="text-green-200 text-sm">
            {isNative ? 'Kamera öffnet automatisch – tippen, um erneut zu scannen' : 'Tippen zum Scan simulieren'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 2px); }
        }
      `}</style>
    </div>
  );
}
