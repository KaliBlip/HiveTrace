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
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <ConsumerHeader transparent />

      <main className="flex-1 relative">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-stone-950 h-[600px] -z-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558583055-d7ac00b1adca?q=80&w=2000')] bg-cover bg-center opacity-30 grayscale mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/50 to-background"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-12 pb-24 relative z-10">
          {/* Back Link */}
          <Link href="/consumer" className="inline-flex items-center gap-2 text-stone-400 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px] mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-[0.2em]">
              Verification Protocol
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white leading-none drop-shadow-2xl">
              SCAN YOUR <span className="text-primary not-italic">HONEY.</span>
            </h1>
            <p className="text-stone-300 font-medium text-lg max-w-xl mx-auto drop-shadow-md">
              Decrypt the story behind your jar. Every scan verifies authenticity and supports artisan beekeepers.
            </p>
          </div>

          <div className="space-y-8">
            {/* Input Toggle */}
            <div className="flex justify-center p-1 bg-secondary/50 backdrop-blur-xl border border-border rounded-2xl w-fit mx-auto shadow-inner">
              <button
                onClick={() => setInputType('camera')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                  inputType === 'camera' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ScanLine className="w-4 h-4" />
                Camera Scan
              </button>
              <button
                onClick={() => setInputType('manual')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                  inputType === 'manual' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Keyboard className="w-4 h-4" />
                Manual Entry
              </button>
            </div>

            {/* Main Interface */}
            <div className="grid gap-8">
              {inputType === 'camera' ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <QRScanner onScan={handleQRScan} />
                </div>
              ) : (
                <Card className="bg-card border-border shadow-2xl rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CardContent className="p-8 lg:p-12 space-y-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black uppercase tracking-tight">Manual Verification</h2>
                      <p className="text-muted-foreground font-medium">Enter the unique cryptographic hash or batch ID found on the label.</p>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="e.g., HT-2024-WFB-001"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        className="w-full h-16 px-6 bg-secondary/50 border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-colors text-center text-xl font-bold uppercase tracking-widest placeholder:normal-case placeholder:font-medium placeholder:tracking-normal"
                      />
                      <Button
                        onClick={handleManualVerify}
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20"
                        disabled={!manualInput.trim()}
                      >
                        Verify Cryptographic Hash
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results Section */}
              {showResult && (
                <Card className="bg-card border-2 border-green-500/20 shadow-2xl rounded-[2rem] overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="bg-green-500 h-2 w-full"></div>
                  <CardContent className="p-8 lg:p-12">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                      <div className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-12 h-12 text-green-500" />
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="space-y-2">
                          <Badge className="bg-green-500/10 text-green-500 border-none uppercase tracking-widest font-black text-[10px]">Authenticity Confirmed</Badge>
                          <h2 className="text-3xl font-black uppercase tracking-tight">Batch Verified Successfully</h2>
                          <p className="font-mono text-muted-foreground font-bold bg-secondary/50 px-3 py-1 rounded-lg inline-block">{qrCode}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 py-6 border-y border-border">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Honey Type</p>
                            <p className="font-bold text-lg">Wildflower Blend</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Harvest Date</p>
                            <p className="font-bold text-lg">May 2024</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Producer</p>
                            <p className="font-bold text-lg">Golden Valley Apiaries</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Trust Score</p>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-lg">4.8</span>
                              <span className="text-primary text-sm font-black uppercase italic">Platinum</span>
                            </div>
                          </div>
                        </div>

                        <Link href="/consumer/batch/1" className="block">
                          <Button className="w-full h-16 bg-stone-900 hover:bg-primary text-white text-lg font-black uppercase tracking-widest rounded-2xl">
                            Explore Full Traceability Data
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Info Tips */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-card border border-border rounded-3xl flex gap-4 items-start shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold uppercase text-xs tracking-widest">Scanning Tip</p>
                    <p className="text-sm text-muted-foreground font-medium">Hold your phone steady and ensure there is enough light on the QR code.</p>
                  </div>
                </div>
                <div className="p-6 bg-card border border-border rounded-3xl flex gap-4 items-start shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold uppercase text-xs tracking-widest">Digital Signature</p>
                    <p className="text-sm text-muted-foreground font-medium">Every scan checks the HMAC-SHA256 hash to ensure zero tampering.</p>
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

