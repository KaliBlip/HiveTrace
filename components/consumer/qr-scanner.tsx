'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Camera, Upload } from 'lucide-react';
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
    // Check for BarcodeDetector support
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

    // Continue scanning
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
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>
            Use your device camera or upload an image to scan a honey batch QR code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!scanning ? (
            <div className="space-y-4">
              <Button
                onClick={startCamera}
                disabled={isLoading || !cameraSupported}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Camera className="w-4 h-4" />
                Start Camera
              </Button>

              {cameraSupported && (
                <>
                  <div className="text-center text-muted-foreground text-sm">or</div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-primary/50 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary rounded-lg pointer-events-none" />
              </div>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="w-full"
              >
                Stop Scanning
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground text-center">
        {barcodeDetectorSupported
          ? 'Your device supports QR code scanning'
          : 'QR code detection requires a modern browser'}
      </p>
    </div>
  );
}
