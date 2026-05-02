'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { QRScanner } from '@/components/consumer/qr-scanner';

export default function ScannerPage() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleQRScan = (data: string) => {
    // If it's a full URL from HiveTrace, extract the hash
    if (data.includes('/verify/')) {
      const hash = data.split('/verify/')[1];
      router.push(`/verify/${hash}`);
      return;
    }
    
    // Otherwise, show the result in place (manual entry)
    setQrCode(data);
    setShowResult(true);
  };

  const handleManualVerify = () => {
    if (manualInput.trim()) {
      if (manualInput.includes('/verify/')) {
        const hash = manualInput.split('/verify/')[1];
        router.push(`/verify/${hash}`);
      } else {
        setQrCode(manualInput);
        setShowResult(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/consumer" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-3xl font-bold">Scan a Honey Batch</h1>
          <p className="text-muted-foreground mt-2">Use your camera or upload an image to scan a HiveTrace QR code</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner */}
          <div>
            <QRScanner onScan={handleQRScan} />
          </div>

          {/* Manual Input & Results */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>Enter QR code manually if needed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter QR code or batch ID (e.g., HT-2024-WFB-001)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
                <Button
                  onClick={handleManualVerify}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!manualInput.trim()}
                >
                  Verify Batch
                </Button>
              </CardContent>
            </Card>

            {/* Result */}
            {showResult && (
              <Card className="border-green-400/50 bg-green-50/30 dark:bg-green-900/10">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <CardTitle>Batch Verified</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Batch ID</p>
                      <p className="font-mono font-semibold text-foreground">{qrCode}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Honey Type</p>
                      <p className="font-medium">Wildflower Blend</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Harvest Date</p>
                      <p className="font-medium">May 2024</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Producer</p>
                      <Link href="/consumer/producer/1">
                        <p className="font-medium text-primary hover:underline">Golden Valley Apiaries</p>
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-medium">Producer Rating</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">4.8 stars from 128 reviews</p>
                  </div>

                  <Link href={`/consumer/batch/1`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      View Full Details & Reviews
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
