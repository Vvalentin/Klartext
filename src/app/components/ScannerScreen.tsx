import { useEffect, useRef, useState } from 'react';
import { Flashlight, Keyboard } from 'lucide-react';
import { IconButton } from '@mui/material';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';

interface ScannerScreenProps {
  onScanComplete?: (barcode?: string) => void;
}

export function ScannerScreen({ onScanComplete }: ScannerScreenProps) {
  const isNative = Capacitor.isNativePlatform();
  const scanning = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [browserError, setBrowserError] = useState<string | null>(null);

  const stopBrowserScan = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
  };

  const startBrowserScan = async () => {
    setBrowserError(null);
    const reader = new BrowserMultiFormatReader();
    try {
      const controls = await reader.decodeFromVideoDevice(
        undefined, // bevorzugt die Rückkamera, falls verfügbar
        videoRef.current!,
        (result, _err, ctrls) => {
          if (result) {
            ctrls.stop();
            controlsRef.current = null;
            onScanComplete?.(result.getText());
          }
        },
      );
      controlsRef.current = controls;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kamera konnte nicht gestartet werden';
      setBrowserError(message);
      console.warn('Kamera-Start fehlgeschlagen:', err);
    }
  };

  const handleScan = async () => {
    if (scanning.current) return;
    scanning.current = true;

    if (!isNative) {
      // Browser: ZXing übernimmt das Scannen kontinuierlich via Video-Stream.
      // Tippen startet den Scan neu, falls er gestoppt wurde.
      if (!controlsRef.current) {
        await startBrowserScan();
      }
      scanning.current = false;
      return;
    }

    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL,
        scanInstructions: 'Barcode im Rahmen ausrichten',
      });
      onScanComplete?.(result.ScanResult);
    } catch (err) {
      console.warn('Scan abgebrochen oder fehlgeschlagen:', err);
    } finally {
      scanning.current = false;
    }
  };

  useEffect(() => {
    if (isNative) {
      handleScan();
    } else {
      startBrowserScan();
    }
    return () => {
      stopBrowserScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative h-full bg-black flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleScan}
    >
      {/* Camera background: im Browser echter Video-Stream, sonst Gradient */}
      {!isNative ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      )}

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
        <div className="relative w-72 h-48 border-2 border-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-400" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-400" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-400" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-400" />

          <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-400 shadow-lg shadow-green-400/50 animate-pulse"
               style={{
                 animation: 'scan 2s ease-in-out infinite',
               }}
          />
        </div>

        <p className="mt-6 text-white text-center px-8">
          Barcode eines Lebensmittels oder Kosmetikprodukts scannen
        </p>
        <p className="mt-2 text-gray-400 text-sm">
          Barcode im Rahmen ausrichten
        </p>

        <div className="mt-8 bg-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2">
          <p className="text-green-200 text-sm">
            {isNative
              ? 'Kamera öffnet automatisch – tippen, um erneut zu scannen'
              : browserError
                ? 'Kamera nicht verfügbar – tippen für erneuten Versuch'
                : 'Halte einen Barcode in den Rahmen'}
          </p>
        </div>

        {browserError && (
          <p className="mt-3 text-red-300 text-xs text-center max-w-xs px-4">
            {browserError}
          </p>
        )}
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
