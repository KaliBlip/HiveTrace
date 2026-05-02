'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  Calendar, 
  Weight, 
  Hash, 
  MapPin,
  ExternalLink,
  History
} from 'lucide-react';
import Link from 'next/link';

export default function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  // In a real app, fetch this from the DB using a Server Action
  // For this demo, we'll use local state and a placeholder
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder fetching logic
    // We would call a server action here: const data = await getBatchById(id);
    setLoading(true);
    setTimeout(() => {
      setBatch({
        id: id,
        batchCode: 'HT-2024-X42',
        honeyType: 'Wildflower Blend',
        quantity: 50,
        unit: 'kg',
        harvestDate: '2024-04-15',
        description: 'Harvested from the north-eastern hills during the peak spring bloom.',
        verified: true,
        verificationHash: '8f3e2d1c...b4a0z9y8',
        producer: {
          name: 'Golden Valley Apiaries',
          location: 'Jos Plateau, Nigeria'
        },
        scans: 124
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading batch details...</div>;
  if (!batch) return <div className="p-8 text-center">Batch not found</div>;

  const qrUrl = `https://hivetrace.com/verify/${batch.verificationHash}`;

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
      <Link href="/dashboard/batches" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Batches
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">{batch.honeyType}</h1>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <ShieldCheck className="w-3 h-3 mr-1" /> Verified
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono">ID: {batch.id}</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2" onClick={downloadQR}>
            <Download className="w-4 h-4" /> Download QR
          </Button>
          <Link href={`/dashboard/products/new?batchId=${batch.id}`} className="flex-1 md:flex-none">
            <Button className="w-full gap-2">
              <ExternalLink className="w-4 h-4" /> List for Sale
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Traceability Details</CardTitle>
              <CardDescription>Core data verified on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Hash className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Batch Code</p>
                    <p className="font-semibold">{batch.batchCode}</p>
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
                    <p className="font-semibold">{batch.quantity} {batch.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Location</p>
                    <p className="font-semibold">{batch.producer.location}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Description</p>
                <p className="text-sm leading-relaxed">{batch.description}</p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Verification Hash</p>
                <code className="block p-3 bg-muted rounded text-[10px] break-all font-mono text-muted-foreground">
                  {batch.verificationHash}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Chain of Custody</CardTitle>
              <CardDescription>Event log for this batch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="w-0.5 h-full bg-border"></div>
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold">Batch Registered & Signed</p>
                    <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()} - HiveTrace Node #1</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 flex flex-col items-center opacity-50">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold text-muted-foreground">Ready for Distribution</p>
                    <p className="text-xs text-muted-foreground italic">Awaiting marketplace listing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: QR & Stats */}
        <div className="space-y-8">
          <Card className="border-border bg-sidebar overflow-hidden">
            <CardHeader className="text-center pb-2">
              <CardTitle>Traceability QR</CardTitle>
              <CardDescription>Scan to verify authenticity</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 pt-2">
              <div className="p-4 bg-white rounded-xl shadow-inner border border-sidebar-border">
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
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Encrypted ID</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm">Scan Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-black text-primary">{batch.scans}</p>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Total Consumer Scans</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
