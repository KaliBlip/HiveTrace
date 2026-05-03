'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Camera, Upload, StopCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

interface QRScannerProps {
  onScan: (data: string) => void;
  isLoading?: boolean;
}

export function QRScanner({ onScan, isLoading = false }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraSupported, setCameraSupported] = useState(true);
  const [barcodeDetectorSupported, setBarcodeDetectorSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      setBarcodeDetectorSupported(true);
    }
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setScanning(true);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraSupported(false);
        setError('Camera is not supported on this device');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanQRCode();
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      setScanning(false);
      setCameraSupported(false);
    }
  };

  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    try {
      if (barcodeDetectorSupported && window.BarcodeDetector) {
        const detector = new window.BarcodeDetector({
          formats: ['qr_code'],
        });

        const barcodes = await detector.detect(canvas);
        if (barcodes && barcodes.length > 0) {
          const qrData = barcodes[0]?.rawValue || barcodes[0]?.data || '';
          if (qrData) {
            onScan(qrData);
            stopCamera();
            return;
          }
        }
      }
    } catch (err) {
      console.error('[v0] QR detection error:', err);
    }

    if (scanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const stopCamera = () => {
    setScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        if (barcodeDetectorSupported && window.BarcodeDetector) {
          const detector = new window.BarcodeDetector({
            formats: ['qr_code'],
          });

          const barcodes = await detector.detect(canvas);
          if (barcodes && barcodes.length > 0) {
            const qrData = barcodes[0]?.rawValue || barcodes[0]?.data || '';
            if (qrData) {
              onScan(qrData);
            } else {
              setError('No QR code data found in the image');
            }
          } else {
            setError('No QR code found in the image');
          }
        } else {
          setError('QR code detection not supported on this device');
        }
      };

      img.onerror = () => {
        setError('Failed to load image');
      };

      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image');
    }
  };

  return (
    <Card className="bg-card border-border shadow-2xl rounded-[2rem] overflow-hidden">
      <CardContent className="p-8 lg:p-12 space-y-8">
        {error && (
          <Alert variant="destructive" className="rounded-2xl border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-bold">{error}</AlertDescription>
          </Alert>
        )}

        {!scanning ? (
          <div className="space-y-6">
            <div className="aspect-square bg-secondary/50 border-4 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground p-12 text-center space-y-4">
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center">
                <Camera className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="font-bold uppercase tracking-widest text-xs">Camera Ready</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={startCamera}
                disabled={isLoading || !cameraSupported}
                className="h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-2xl gap-3 shadow-xl shadow-primary/20 transition-all"
              >
                <Camera className="w-5 h-5" />
                Start Scan
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                variant="outline"
                className="h-16 border-2 border-border hover:bg-secondary font-bold uppercase tracking-widest rounded-2xl gap-3 transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-black shadow-inner">
              <video
                ref={videoRef}
                className="w-full h-full object-cover grayscale contrast-125"
              />
              {/* High-tech Scan Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-12 border-2 border-primary/50 rounded-3xl">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
                  
                  {/* Scanning Line Animation */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <div className="absolute inset-0 bg-primary/5"></div>
              </div>
            </div>
            
            <Button
              onClick={stopCamera}
              className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl gap-3 shadow-xl transition-all"
            >
              <StopCircle className="w-5 h-5" />
              Stop Scanning
            </Button>
          </div>
        )}

        <div className="pt-6 border-t border-border text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {barcodeDetectorSupported
              ? 'Hardware Acceleration Active'
              : 'Software Verification Mode'}
          </p>
        </div>
      </CardContent>
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}

