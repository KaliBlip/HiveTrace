'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  ShieldAlert,
  Calendar, 
  Weight, 
  Hash, 
  MapPin,
  ExternalLink,
  History,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { getBatchById } from '@/lib/actions/batch-actions';
import { toast } from 'sonner';

export default function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBatchById(id);
        if (data) {
          setBatch(data);
        } else {
          toast.error('Batch not found');
        }
      } catch (err) {
        toast.error('Failed to load batch');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-stone-500 font-normal">Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <Card className="max-w-md w-full border-border text-center p-8 space-y-4">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold">Batch Not Found</h2>
          <p className="text-stone-500">The batch you are trying to view does not exist or you do not have permission to view it.</p>
          <Link href="/dashboard/batches">
            <Button>Back to Batches</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const qrUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${batch.verificationHash}`
    : `https://hivetrace.com/verify/${batch.verificationHash}`;

  const downloadQR = () => {
    const svg = document.getElementById('batch-qr');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${batch.batchCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="space-y-8">
      <Link href="/dashboard/batches" className="flex items-center gap-2 text-primary hover:underline font-bold">
        <ArrowLeft className="w-4 h-4" />
        Back to Batches
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">{batch.honeyType}</h1>
            {batch.verified ? (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-600" /> Pending Approval
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-mono text-sm">Batch Code: {batch.batchCode}</p>
        </div>
        
        {batch.verified && (
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none gap-2 font-bold" onClick={downloadQR}>
              <Download className="w-4 h-4" /> Download QR
            </Button>
            <Link href={`/dashboard/products/new?batchId=${batch.id}`} className="flex-1 md:flex-none">
              <Button className="w-full gap-2 font-bold">
                <ExternalLink className="w-4 h-4" /> List for Sale
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border overflow-hidden">
              <CardHeader className="py-4 bg-muted/20">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" /> Honey Product Image
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex items-center justify-center bg-muted/40 min-h-[220px] relative">
                {batch.honeyImage ? (
                  <img src={batch.honeyImage} alt="Honey product" className="w-full h-[220px] object-cover" />
                ) : (
                  <p className="text-xs text-muted-foreground italic">No image uploaded</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border overflow-hidden">
              <CardHeader className="py-4 bg-muted/20">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" /> Packaging & Label Image
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex items-center justify-center bg-muted/40 min-h-[220px] relative">
                {batch.packagingImage ? (
                  <img src={batch.packagingImage} alt="Packaging label" className="w-full h-[220px] object-cover" />
                ) : (
                  <p className="text-xs text-muted-foreground italic">No image uploaded</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Traceability & Auditing Parameters</CardTitle>
              <CardDescription>Batch records stored on public ledger</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Hash className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Honey Type</p>
                    <p className="font-semibold">{batch.honeyType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Harvest Date</p>
                    <p className="font-semibold">{new Date(batch.harvestDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Weight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Quantity</p>
                    <p className="font-semibold">{batch.quantity} kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Proposed Price</p>
                    <p className="font-semibold">GH₵{batch.price?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {batch.description && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Description</p>
                  <p className="text-sm leading-relaxed">{batch.description}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Cryptographic Verification Hash</p>
                <code className="block p-3 bg-muted rounded text-[10px] break-all font-mono text-muted-foreground">
                  {batch.verificationHash}
                </code>
              </div>

              {batch.blockchainTx && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Blockchain Transaction Address</p>
                  <code className="block p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 rounded text-xs break-all font-mono">
                    {batch.blockchainTx}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Chain of Custody History</CardTitle>
              <CardDescription>Live audit trail events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2"></div>
                    <div className="w-0.5 h-full bg-border"></div>
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold">Batch Registered</p>
                    <p className="text-xs text-muted-foreground">{new Date(batch.createdAt).toLocaleString()} - Producer Signed Node</p>
                  </div>
                </div>
                {batch.verified ? (
                  <div className="flex gap-4">
                    <div className="w-8 flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-700">Platform Quality Review Approved</p>
                      <p className="text-xs text-muted-foreground">{new Date(batch.verifiedAt || batch.createdAt).toLocaleString()} - Admin Quality Verified</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="w-8 flex flex-col items-center opacity-50">
                      <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground mt-2 animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground">Awaiting Quality Verification</p>
                      <p className="text-xs text-muted-foreground italic">Pending admin camera lab check</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: QR & Status */}
        <div className="space-y-8">
          {batch.verified ? (
            <Card className="border-border bg-sidebar overflow-hidden">
              <CardHeader className="text-center pb-2">
                <CardTitle>Verification QR Code</CardTitle>
                <CardDescription>Ready for packaging label integration</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6 pt-2">
                <div className="p-4 bg-card rounded-xl shadow-inner border border-sidebar-border">
                  <QRCodeSVG 
                    id="batch-qr"
                    value={qrUrl} 
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-mono text-muted-foreground">{batch.batchCode}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Authentic QR Signature</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-[#fffbeb] border-amber-200 overflow-hidden dark:bg-amber-950/15">
              <CardHeader className="text-center">
                <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                <CardTitle className="text-lg text-amber-900 dark:text-amber-300">Awaiting QR Generation</CardTitle>
                <CardDescription className="text-amber-800/70 dark:text-amber-400/80">
                  The unique packaging QR code and blockchain hash will be assigned once the admin performs the camera quality check.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-sm">Verification Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs text-muted-foreground uppercase font-bold">Status</span>
                <Badge className={batch.verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                  {batch.verified ? "Verified" : "Pending Approval"}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-xs text-muted-foreground uppercase font-bold">Scans</span>
                <span className="font-bold">{batch.scanCount} scans</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-muted-foreground uppercase font-bold">Registered On</span>
                <span className="text-sm font-semibold">{new Date(batch.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Simple loader helper since Lucide icon is missing or we want a neat local spinner
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
