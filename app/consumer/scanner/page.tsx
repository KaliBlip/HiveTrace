'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck, Zap, Info, ScanLine, Keyboard } from 'lucide-react';
import { QRScanner } from '@/components/consumer/qr-scanner';
import { ConsumerHeader } from '@/components/consumer/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';

export default function ScannerPage() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [inputType, setInputType] = useState<'camera' | 'manual'>('camera');

  const handleQRScan = (data: string) => {
    if (data.includes('/verify/')) {
      const hash = data.split('/verify/')[1];
      router.push(`/verify/${hash}`);
      return;
    }
    router.push(`/verify/${encodeURIComponent(data.trim())}`);
  };

  const handleManualVerify = () => {
    if (manualInput.trim()) {
      if (manualInput.includes('/verify/')) {
        const hash = manualInput.split('/verify/')[1];
        router.push(`/verify/${hash}`);
      } else {
        router.push(`/verify/${encodeURIComponent(manualInput.trim())}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ConsumerHeader transparent />

      <main className="flex-1 relative">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[#1c1917] h-[600px] -z-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558583055-d7ac00b1adca?q=80&w=2000')] bg-cover bg-center opacity-30 grayscale mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1c1917]/50 to-background"></div>
        </div>

        <div
          className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] pt-20 pb-24 relative z-10"
          style={{ width: "100%", minWidth: "100%" }}
        >
          {/* Back Link */}
          <Link href="/consumer" className="inline-flex items-center gap-3 text-stone-400 hover:text-primary transition-all font-bold uppercase tracking-widest text-[10px] mb-12 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="text-center space-y-6 mb-12 text-foreground">
            <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
              Verification Protocol
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-[-0.03em] leading-[0.92] uppercase italic text-foreground drop-shadow-2xl">
              SCAN YOUR <span className="text-primary not-italic tracking-tight">HONEY.</span>
            </h1>
            <div
              className="text-muted-foreground font-normal text-xl mx-auto leading-relaxed"
              style={{
                display: "block",
                width: "min(100%, 760px)",
                maxWidth: "760px",
                whiteSpace: "normal",
                writingMode: "horizontal-tb",
                textOrientation: "mixed",
              }}
            >
              Decrypt the story behind your jar. Every scan verifies authenticity and supports artisan beekeepers through cryptographic trust.
            </div>
          </div>

          <div className="w-full max-w-3xl mx-auto space-y-10">
            {/* Input Toggle */}
            <div className="w-full max-w-xl mx-auto rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md p-1.5 shadow-xl">
              <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setInputType('camera')}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-all ${
                  inputType === 'camera'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <ScanLine className="w-4 h-4 sm:w-5 sm:h-5" />
                Camera Scan
              </button>
              <button
                onClick={() => setInputType('manual')}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-all ${
                  inputType === 'manual'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Keyboard className="w-4 h-4 sm:w-5 sm:h-5" />
                Manual Entry
              </button>
              </div>
            </div>

            {/* Main Interface */}
            <div className="grid gap-12 w-full min-w-0">
              {inputType === 'camera' ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <QRScanner onScan={handleQRScan} />
                </div>
              ) : (
                <div className="bg-card border border-border/50 shadow-2xl rounded-[48px] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="p-10 lg:p-20 space-y-10 text-center">
                    <div className="w-20 h-20 bg-primary/5 rounded-[24px] flex items-center justify-center mx-auto">
                      <Zap className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-3xl font-heading font-bold uppercase tracking-tight">Manual Verification</h2>
                      <div
                        className="text-stone-500 font-normal text-lg"
                        style={{
                          display: "block",
                          width: "100%",
                          whiteSpace: "normal",
                          writingMode: "horizontal-tb",
                          textOrientation: "mixed",
                        }}
                      >
                        Enter the unique cryptographic hash or batch ID found on the label.
                      </div>
                    </div>
                    <div className="space-y-6">
                      <input
                        type="text"
                        placeholder="e.g., HT-2024-WFB-001"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        className="w-full h-20 px-8 bg-stone-50/50 border-2 border-border/40 rounded-3xl focus:outline-none focus:border-primary transition-all text-center text-2xl font-bold uppercase tracking-widest placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
                      />
                      <Button
                        onClick={handleManualVerify}
                        className="w-full h-20 bg-[#1c1917] hover:bg-primary text-white text-xl rounded-3xl transition-all shadow-2xl shadow-primary/20 font-bold"
                        disabled={!manualInput.trim()}
                      >
                        Verify Cryptographic Hash
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Tips */}
              <div className="grid md:grid-cols-2 gap-6 w-full min-w-0">
                <div className="w-full min-w-0 p-8 bg-card border border-border/50 rounded-[32px] flex gap-6 items-start shadow-sm hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <p className="font-heading font-bold uppercase text-sm tracking-widest">Scanning Tip</p>
                    <div
                      className="text-base text-stone-500 font-normal leading-relaxed"
                      style={{
                        display: "block",
                        width: "100%",
                        whiteSpace: "normal",
                        writingMode: "horizontal-tb",
                        textOrientation: "mixed",
                      }}
                    >
                      Hold your phone steady and ensure there is enough light on the QR code for instant recognition.
                    </div>
                  </div>
                </div>
                <div className="w-full min-w-0 p-8 bg-card border border-border/50 rounded-[32px] flex gap-6 items-start shadow-sm hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <p className="font-heading font-bold uppercase text-sm tracking-widest">Digital Signature</p>
                    <div
                      className="text-base text-stone-500 font-normal leading-relaxed"
                      style={{
                        display: "block",
                        width: "100%",
                        whiteSpace: "normal",
                        writingMode: "horizontal-tb",
                        textOrientation: "mixed",
                      }}
                    >
                      Every scan checks the HMAC-SHA256 hash against our reserve nodes to ensure zero tampering.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
