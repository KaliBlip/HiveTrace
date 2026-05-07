'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Weight,
  MapPin,
  History,
  ExternalLink,
  ArrowRight,
  Verified
} from 'lucide-react';
import Link from 'next/link';
import { verifyBatchByHash } from '@/lib/actions/verify-actions';

export default function VerifyBatchPage() {
  const params = useParams();
  const hash = params.hash as string;

  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function lookup() {
      setLoading(true);
      try {
        const result = await verifyBatchByHash(hash);
        setBatch(result);
      } catch {
        setBatch(null);
      } finally {
        setLoading(false);
      }
    }
    lookup();
  }, [hash]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground animate-pulse">Verifying authenticity on the HiveTrace network...</div>;

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full border-destructive/50 bg-destructive/5">
          <CardHeader className="text-center">
            <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl text-destructive">Invalid Batch</CardTitle>
            <CardDescription>The scanned QR code or hash could not be verified.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              This honey may not be authentic HiveTrace-certified honey. Please contact support if you believe this is an error.
            </p>
            <Link href="/consumer/scanner">
              <Button className="w-full">Try Scanning Again</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      {/* Verification Banner */}
      <div className="bg-primary py-8 text-primary-foreground text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Authenticity Verified</h1>
        <p className="text-primary-foreground/80">This batch is genuine and fully traceable.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-6">
        {/* Main Info */}
        <Card className="border-border shadow-xl">
          <CardContent className="p-0">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{batch.honeyType}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{batch.batchCode}</Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">HASH: {batch.verificationHash.slice(0, 12)}...</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Harvested</p>
                <p className="font-semibold text-sm">{new Date(batch.harvestDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="p-6 grid sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tight">Origin</span>
                </div>
                <p className="font-medium text-sm">{batch.producer.location}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Weight className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tight">Quantity</span>
                </div>
                <p className="font-medium text-sm">{batch.quantity} {batch.unit}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tight">Status</span>
                </div>
                <p className="font-medium text-sm text-green-600 flex items-center gap-1">
                  <Verified className="w-3 h-3" /> Fully Transparent
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* History */}
          <Card className="lg:col-span-2 border-border shadow-lg">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <CardTitle>Chain of Custody</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {batch.history.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-8 flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 mt-1"></div>
                      {i < batch.history.length - 1 && <div className="w-0.5 h-full bg-border mt-1"></div>}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-sm">{item.event}</p>
                        <span className="text-[10px] text-muted-foreground font-medium">{item.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Producer Profile */}
          <div className="space-y-6">
            <Card className="border-border shadow-lg overflow-hidden">
              <div className="h-2 bg-primary"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Producer Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-bold">{batch.producer.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-xs">★</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">({batch.producer.reviewCount})</span>
                  </div>
                </div>
                <Link href="/shop" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-2 group">
                    View More from Producer <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg bg-sidebar">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Help Stop Fraud</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you found this honey in a store, ensure the packaging is sealed and matches the batch code above.
                </p>
                <Button variant="destructive" size="sm" className="w-full text-xs gap-2">
                  <ShieldAlert className="w-3 h-3" /> Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link href="/shop">
            <Button size="lg" className="rounded-full px-8 gap-2 shadow-xl hover:scale-105 transition-transform">
              Explore More Verified Honey <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
