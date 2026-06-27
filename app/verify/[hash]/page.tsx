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
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { verifyBatchByHash } from '@/lib/actions/verify-actions';
import { registerScanByHash, reportBatchDiscrepancy } from '@/lib/actions/scan-actions';
import { toast } from 'sonner';
import { PublicHeader } from '@/components/public-header';

export default function VerifyBatchPage() {
  const params = useParams();
  const hash = params.hash as string;

  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [geoState, setGeoState] = useState<'prompting' | 'acquired' | 'denied' | 'unsupported'>('prompting');
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);

  useEffect(() => {
    async function lookupAndLog() {
      setLoading(true);
      
      let coords: { lat?: number; lng?: number } = {};
      if (typeof window !== 'undefined' && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
            });
          });
          coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setGeoState('acquired');
        } catch {
          setGeoState('denied');
        }
      } else {
        setGeoState('unsupported');
      }

      try {
        const result = await verifyBatchByHash(hash);
        setBatch(result);
        
        if (result) {
          await registerScanByHash(hash, coords);
        }
      } catch {
        setBatch(null);
      } finally {
        setLoading(false);
      }
    }
    lookupAndLog();
  }, [hash]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground animate-pulse space-y-4">
      <ShieldCheck className="w-16 h-16 text-primary animate-bounce" />
      <p className="text-xl font-heading font-bold uppercase tracking-widest">Verifying authenticity on the HiveTrace network...</p>
    </div>
  );

  if (!batch) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen flex items-center justify-center p-6 bg-background pt-28">
        <div className="max-w-xl w-full bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="p-12 text-center space-y-8">
            <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-3xl flex items-center justify-center mx-auto">
              <ShieldAlert className="w-12 h-12 text-rose-500 dark:text-rose-400" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-heading font-bold uppercase tracking-tight text-rose-900 dark:text-rose-100">Invalid Batch</h1>
              <p className="text-rose-700/70 dark:text-rose-300/70 text-lg font-normal">The scanned QR code or hash could not be verified on our cryptographic ledger.</p>
            </div>
            <div className="p-6 bg-card/80 dark:bg-card/40 rounded-3xl border border-rose-200/50 dark:border-rose-900/30">
              <p className="text-sm text-rose-800 dark:text-rose-200 font-normal leading-relaxed">
                This honey may not be authentic HiveTrace-certified honey. Please contact support if you believe this is an error or report a potential fraud case.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/consumer/scanner">
                <Button className="w-full h-16 rounded-2xl bg-rose-900 hover:bg-rose-950 dark:bg-rose-700 dark:hover:bg-rose-800 text-white font-bold text-lg">Try Scanning Again</Button>
              </Link>
              <Link href="/contact" className="text-rose-900 dark:text-rose-300 font-bold uppercase text-xs tracking-widest hover:underline">Report a discrepancy</Link>
            </div>
          </div>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PublicHeader />
    <div className="min-h-screen bg-background pb-24 pt-24">
      {/* Verification Banner */}
      {batch.verified ? (
        // VERIFIED STATE BANNER
        <div className="bg-[#1c1917] relative overflow-hidden py-32 text-center px-4">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=2000')] bg-cover bg-center opacity-10 grayscale mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1c1917]"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center shadow-2xl shadow-primary/40 group">
                <ShieldCheck className="w-12 h-12 text-white transition-transform duration-500 group-hover:scale-110" />
              </div>
            </div>
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.3em]">
                Origin Verified
              </Badge>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-bold tracking-tighter uppercase italic text-white leading-none text-balance">
                AUTHENTICITY <span className="text-primary not-italic">CONFIRMED.</span>
              </h1>
              <p className="text-stone-400 font-normal text-xl max-w-2xl mx-auto leading-relaxed">
                This batch has been cryptographically signed and verified on the HiveTrace ledger. 100% genuine artisan honey.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // PENDING STATE BANNER
        <div className="bg-[#291e13] relative overflow-hidden py-32 text-center px-4">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=2000')] bg-cover bg-center opacity-10 grayscale mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#291e13]"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-amber-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-amber-500/40 group animate-pulse">
                <ShieldAlert className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 py-1.5 px-6 rounded-full text-xs font-bold uppercase tracking-[0.3em]">
                Review Pending
              </Badge>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-bold tracking-tighter uppercase italic text-white leading-none text-balance">
                QUALITY <span className="text-amber-500 not-italic">UNVERIFIED.</span>
              </h1>
              <p className="text-amber-200/70 font-normal text-xl max-w-2xl mx-auto leading-relaxed">
                This batch has been logged by the producer but is awaiting formal camera & quality certification by HiveTrace administrators. Proceed with caution.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 lg:px-[128px] -mt-16 relative z-20 space-y-12">
        {/* Main Info Card */}
        <div className="bg-card rounded-[48px] border border-border/50 shadow-2xl overflow-hidden">
          <div className="p-10 lg:p-16 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-8 bg-muted/30">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl sm:text-5xl font-heading font-bold uppercase tracking-tight">{batch.honeyType}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge className="bg-foreground text-background px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{batch.batchCode}</Badge>
                <span className="text-xs text-muted-foreground font-mono bg-card px-3 py-1.5 rounded-lg border border-border/50">HMAC-SHA256: {batch.verificationHash.slice(0, 16)}...</span>
              </div>
            </div>
            <div className="text-center md:text-right space-y-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Harvested On</p>
              <p className="font-heading font-bold text-3xl">{new Date(batch.harvestDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
            </div>
          </div>
          
          <div className="p-10 lg:p-16 grid grid-cols-1 sm:grid-cols-4 gap-12">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Origin Location</span>
              </div>
              <p className="font-heading font-bold text-2xl">{batch.producer.location}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground mb-2">
                <Weight className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Batch Quantity</span>
              </div>
              <p className="font-heading font-bold text-2xl">{batch.quantity} <span className="text-muted-foreground font-normal">{batch.unit}</span></p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Retail Price</span>
              </div>
              <p className="font-heading font-bold text-2xl">GH₵{batch.price?.toFixed(2) || 'N/A'}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Transparency Status</span>
              </div>
              {batch.verified ? (
                <div className="space-y-1">
                  <p className="font-heading font-bold text-2xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2 italic uppercase">
                    Fully Verified
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    {geoState === 'acquired' && '✓ GPS Verified Scan'}
                    {geoState === 'denied' && '⚠ Scan Logged (GPS Denied)'}
                    {geoState === 'prompting' && '⌛ Resolving Location...'}
                    {geoState === 'unsupported' && '⚠ Location Unsupported'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-heading font-bold text-2xl text-amber-600 dark:text-amber-400 flex items-center gap-2 italic uppercase">
                    Unverified
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Awaiting admin quality check
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assets & Verification details */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Batch Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border overflow-hidden">
                <CardHeader className="py-4 bg-muted/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" /> Honey Product Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex items-center justify-center bg-muted/40 min-h-[200px]">
                  {batch.honeyImage ? (
                    <img src={batch.honeyImage} alt="Honey product" className="w-full h-[200px] object-cover" />
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No image uploaded by producer</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border overflow-hidden">
                <CardHeader className="py-4 bg-muted/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-primary" /> Packaging & Label Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex items-center justify-center bg-muted/40 min-h-[200px]">
                  {batch.packagingImage ? (
                    <img src={batch.packagingImage} alt="Packaging label" className="w-full h-[200px] object-cover" />
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No image uploaded by producer</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* History / Chain of Custody */}
            <Card className="rounded-[48px] border border-border/50 shadow-xl overflow-hidden flex flex-col">
              <div className="p-10 border-b border-border/50 bg-muted/30 flex items-center gap-4">
                <History className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">Chain of Custody</h3>
              </div>
              <div className="p-10 lg:p-16 flex-1">
                <div className="space-y-12">
                  {batch.history.map((item: any, i: number) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="w-10 flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-card border-4 border-primary ring-8 ring-primary/5 mt-1 group-hover:scale-125 transition-transform duration-300"></div>
                        {i < batch.history.length - 1 && <div className="w-0.5 h-full bg-border mt-4 group-hover:bg-primary/20 transition-colors"></div>}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <p className="font-heading font-bold text-xl uppercase italic group-hover:text-primary transition-colors">{item.event}</p>
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest bg-muted px-3 py-1 rounded-full border border-border/50 shrink-0">{item.date}</span>
                        </div>
                        <p className="text-muted-foreground font-normal mt-3 flex items-center gap-2 text-lg">
                          <MapPin className="w-4 h-4 text-muted-foreground/60" /> {item.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Producer Profile */}
            <div className="bg-card rounded-[40px] border border-border/50 shadow-xl overflow-hidden group">
              <div className="h-3 bg-primary w-full transition-all group-hover:h-4"></div>
              <div className="p-10 space-y-8">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Verified Producer</p>
                <div className="space-y-4">
                  <h4 className="text-3xl font-heading font-bold uppercase italic group-hover:text-primary transition-colors">{batch.producer.name}</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-primary text-xl">★</span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-bold">({batch.producer.reviewCount} Reviews)</span>
                  </div>
                </div>
                {batch.verified && (
                  <Link href="/shop" className="block">
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-border hover:border-primary hover:text-primary text-sm font-bold uppercase tracking-widest gap-3 group/btn">
                      View Producer Shop 
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Blockchain Details */}
            {batch.verified && batch.blockchainTx && (
              <div className="bg-[#1c1917] rounded-[40px] border border-white/5 p-10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <ShieldCheck className="w-7 h-7" />
                    <h4 className="text-xl font-heading font-bold uppercase tracking-tight text-white">Blockchain Record</h4>
                  </div>
                  <p className="text-stone-400 font-normal text-sm leading-relaxed">
                    This product's batch parameters are cryptographically sealed on the blockchain. The transaction ledger hash is recorded below:
                  </p>
                  <code className="block text-[10px] font-mono text-emerald-300 break-all bg-black/40 p-3 rounded-lg border border-white/10 select-all">
                    {batch.blockchainTx}
                  </code>
                  <Link href={`/api/blockchain/verify?hash=${encodeURIComponent(batch.blockchainTx)}`} target="_blank">
                    <Button variant="outline" size="sm" className="w-full mt-3 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/30">
                      Verify on Ledger API
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Fraud Protection Warning */}
            <div className="bg-rose-50 dark:bg-rose-950/10 rounded-[40px] border border-rose-100 dark:border-rose-950/20 p-10 space-y-6 shadow-sm">
              <div className="flex items-center gap-3 text-rose-600">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
                <h4 className="text-lg font-heading font-bold uppercase tracking-tight">Help Stop Fraud</h4>
              </div>
              <p className="text-rose-700/80 dark:text-rose-400/80 font-normal text-xs leading-relaxed">
                Check that the physical honey bottle container label matches the packaging image previewed on this page. If you spot anomalies, report it to our team immediately.
              </p>
              <Button
                variant="destructive"
                className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] gap-3"
                disabled={reporting || reported}
                onClick={async () => {
                  if (!batch) return;
                  setReporting(true);
                  try {
                    await reportBatchDiscrepancy({
                      batchCode: batch.batchCode,
                      hash,
                      reason: 'Consumer reported label or packaging mismatch during verification.',
                    });
                    setReported(true);
                    toast.success('Discrepancy reported. Our admin team will investigate.');
                  } catch {
                    toast.error('Failed to submit report. Please try again.');
                  } finally {
                    setReporting(false);
                  }
                }}
              >
                {reported ? 'Report Submitted' : reporting ? 'Submitting...' : 'Report discrepancy'}
              </Button>
            </div>
          </div>

        </div>

        {/* Global CTA */}
        {batch.verified && (
          <div className="text-center pt-12">
            <Link href="/shop">
              <Button className="rounded-full h-20 px-12 text-xl font-bold gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:scale-105 transition-all group">
                Explore More Verified Honey 
                <ExternalLink className="w-6 h-6 group-hover:rotate-45 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
