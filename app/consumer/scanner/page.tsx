'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, ImagePlus, Keyboard, ScanLine, ShieldCheck, X, AlertCircle, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

export default function ScannerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [barcodeDetectorSupported, setBarcodeDetectorSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      setBarcodeDetectorSupported(true);
    }
  }, []);

  const verifyValue = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (trimmed.includes('/verify/')) {
      router.push(`/verify/${trimmed.split('/verify/')[1]}`);
      return;
    }
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  }, [router]);

  /* ── Camera control ─────────────────────────────────── */

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  }, []);

  const scanLoop = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    try {
      if (barcodeDetectorSupported && window.BarcodeDetector) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await detector.detect(canvas);
        if (barcodes?.length > 0) {
          const data = barcodes[0]?.rawValue || barcodes[0]?.data || '';
          if (data) {
            stopCamera();
            verifyValue(data);
            return;
          }
        }
      }
    } catch {
      /* detection error, continue scanning */
    }

    animFrameRef.current = requestAnimationFrame(scanLoop);
  }, [barcodeDetectorSupported, stopCamera, verifyValue]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera not supported on this device.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
        animFrameRef.current = requestAnimationFrame(scanLoop);
      }
    } catch {
      setError('Camera access denied. Check browser permissions.');
    }
  }, [scanLoop]);

  /* Auto-start camera in camera mode */
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  /* ── File upload ────────────────────────────────────── */

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (barcodeDetectorSupported && window.BarcodeDetector) {
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await detector.detect(canvas);
          if (barcodes?.length > 0) {
            const data = barcodes[0]?.rawValue || barcodes[0]?.data || '';
            if (data) {
              verifyValue(data);
              return;
            }
          }
          setError('No QR code found in that image.');
        } else {
          setError('QR detection is not supported on this browser.');
        }
      };
      img.onerror = () => setError('Failed to load image.');

      const reader = new FileReader();
      reader.onload = (ev) => { img.src = ev.target?.result as string; };
      reader.readAsDataURL(file);
    } catch {
      setError('Failed to process the image.');
    }
  };

  /* ── Render ─────────────────────────────────────────── */

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

      {/* ━━ Top Bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Back button */}
        <Link
          href="/shop"
          className="grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <ArrowLeft className="size-5" />
        </Link>

        {/* Camera / Manual toggle */}
        <div className="flex items-center gap-0.5 rounded-full border border-white/15 bg-white/8 p-1 backdrop-blur-md">
          <button
            onClick={() => setMode('camera')}
            className={[
              'flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all',
              mode === 'camera'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white',
            ].join(' ')}
          >
            <ScanLine className="size-3.5" />
            Camera
          </button>
          <button
            onClick={() => setMode('manual')}
            className={[
              'flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all',
              mode === 'manual'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white',
            ].join(' ')}
          >
            <Keyboard className="size-3.5" />
            Manual
          </button>
        </div>

        {/* Shield icon */}
        <div className="grid size-10 place-items-center rounded-full bg-white/10 backdrop-blur-md">
          <ShieldCheck className="size-5 text-primary" />
        </div>
      </header>

      {/* ━━ Viewfinder Area ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative flex-1 overflow-hidden">
        {mode === 'camera' ? (
          <>
            {/* Live camera feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* QR Frame Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              {/* Dim outer region */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Clear viewfinder cutout – simulated via border trick */}
              <div className="relative w-[72vw] max-w-[320px] aspect-square">
                {/* Clear center (punch through the dim) */}
                <div className="absolute inset-0 rounded-3xl bg-black/0 ring-[9999px] ring-black/40" />

                {/* Corner brackets */}
                <div className="absolute -top-1 -left-1 w-10 h-10 border-t-[3px] border-l-[3px] border-primary rounded-tl-2xl" />
                <div className="absolute -top-1 -right-1 w-10 h-10 border-t-[3px] border-r-[3px] border-primary rounded-tr-2xl" />
                <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-[3px] border-l-[3px] border-primary rounded-bl-2xl" />
                <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-[3px] border-r-[3px] border-primary rounded-br-2xl" />

                {/* Scanning Line Animation */}
                <div className="absolute left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_16px_rgba(251,191,36,0.7)] animate-[scan_2s_ease-in-out_infinite] rounded-full" />
              </div>
            </div>

            {/* Instruction text */}
            <div className="absolute top-6 left-0 right-0 z-20 text-center pointer-events-none">
              <p className="inline-block rounded-full bg-black/50 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                Align QR code inside frame
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="absolute top-16 left-4 right-4 z-20 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-950/80 px-4 py-3 backdrop-blur-md">
                <AlertCircle className="size-4 shrink-0 text-red-400" />
                <p className="text-sm font-semibold text-red-200">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white">
                  <X className="size-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* ── Manual entry mode ─────────────────────────── */
          <div className="flex h-full flex-col items-center justify-center px-6">
            <div className="w-full max-w-md space-y-8 text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-white/8 border border-white/10">
                <Zap className="size-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold tracking-tight">Manual verification</h2>
                <p className="text-sm text-white/50 leading-relaxed">
                  Enter the hash, URL, or batch code printed on the product label.
                </p>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="HT-2026-GVA-041"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verifyValue(manualInput)}
                  className="h-14 w-full rounded-2xl border border-white/15 bg-white/8 px-5 text-center font-mono text-base uppercase tracking-widest text-white placeholder:text-white/25 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50 backdrop-blur"
                />
                <Button
                  onClick={() => verifyValue(manualInput)}
                  disabled={!manualInput.trim()}
                  className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs gap-2"
                >
                  <ShieldCheck className="size-4" />
                  Verify batch
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-8 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-950/80 px-4 py-3 backdrop-blur-md max-w-md w-full">
                <AlertCircle className="size-4 shrink-0 text-red-400" />
                <p className="text-sm font-semibold text-red-200">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white">
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ━━ Bottom Action Bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {mode === 'camera' && (
        <footer className="relative z-20 flex items-center justify-center gap-8 px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          {/* Upload Image Picker */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group flex flex-col items-center gap-1.5"
          >
            <span className="grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white transition-all group-hover:bg-white/20 group-active:scale-95 backdrop-blur-md">
              <ImagePlus className="size-6" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Gallery</span>
          </button>

          {/* Capture / Re-scan Button */}
          <button
            onClick={() => {
              if (streaming) {
                stopCamera();
                setTimeout(() => startCamera(), 100);
              } else {
                startCamera();
              }
            }}
            className="group flex flex-col items-center gap-1.5"
          >
            <span className="grid size-[76px] place-items-center rounded-full border-4 border-primary/60 bg-primary text-primary-foreground shadow-[0_0_30px_rgba(251,191,36,0.35)] transition-all group-hover:scale-105 group-active:scale-95">
              <Camera className="size-8" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              {streaming ? 'Re-scan' : 'Start'}
            </span>
          </button>

          {/* Placeholder for symmetry */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white/50 backdrop-blur-md">
              <ScanLine className="size-6" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              {barcodeDetectorSupported ? 'Active' : 'Software'}
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
