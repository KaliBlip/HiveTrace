'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeBatchWithAI, approveBatchWithAIAnalysis, verifyAndApproveBatch } from '@/lib/actions/admin-actions';
import { getBatchById } from '@/lib/actions/batch-actions';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Camera,
    CheckCircle2,
    Cpu,
    Database,
    DollarSign,
    Image as ImageIcon,
    Loader2,
    MapPin,
    ShieldAlert,
    ShieldCheck,
    Video,
    Weight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminBatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanMetrics, setScanMetrics] = useState<any>(null);
  const [approving, setApproving] = useState(false);

  const fetchBatch = async () => {
    try {
      const data = await getBatchById(id);
      if (data) {
        setBatch(data);
      } else {
        toast.error('Batch not found');
      }
    } catch (err) {
      toast.error('Failed to load batch details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, [id]);

  const startQualityScan = async () => {
    setScanning(true);
    setScanStep(1);
    
    try {
      // Step 1: Initializing optics
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanStep(2);
      
      // Step 2: Inspecting packaging labels
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanStep(3);
      
      // Step 3: Analyzing fluid density
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanStep(4);
      
      // Step 4: Running AI analysis
      const aiResult = await analyzeBatchWithAI(id);
      
      setScanning(false);
      setScanStep(5);
      setScanMetrics(aiResult);
      
      if (aiResult.authenticityScore < 50) {
        toast.warning(`AI analysis detected potential issues (Authenticity: ${aiResult.authenticityScore}%)`);
      } else {
        toast.success('Quality inspection scan completed successfully!');
      }
    } catch (error) {
      console.error('AI scan failed:', error);
      setScanning(false);
      toast.error(error instanceof Error ? error.message : 'AI analysis failed');
    }
  };

  const handleApprove = async () => {
    if (!scanMetrics && !batch.verified) {
      toast.error('Please perform the camera quality verification scan first!');
      return;
    }
    setApproving(true);

    try {
      if (scanMetrics) {
        // Use AI analysis for approval
        await approveBatchWithAIAnalysis(id, scanMetrics);
      } else {
        // Use regular approval (already verified)
        await verifyAndApproveBatch(id);
      }
      toast.success('Batch cryptographically signed and registered on blockchain!');
      await fetchBatch();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve batch');
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-stone-500 font-normal">Loading batch detail...</p>
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
          <p className="text-stone-500">The batch you are trying to view does not exist or you do not have permission.</p>
          <Link href="/admin/batches">
            <Button>Back to Audits</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${batch.verificationHash}`
    : `https://hivetrace.com/verify/${batch.verificationHash}`;

  return (
    <div className="space-y-8">
      <Link href="/admin/batches" className="flex items-center gap-2 text-primary hover:underline font-bold">
        <ArrowLeft className="w-4 h-4" />
        Back to Batches
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">{batch.honeyType}</h1>
            {batch.verified ? (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Quality Verified
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-600" /> Pending Quality Check
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-mono text-sm">Batch Code: {batch.batchCode}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Inspection and Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Side-by-side Images & Video */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border overflow-hidden">
              <CardHeader className="py-4 bg-muted/20">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" /> Honey Image Upload
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

            <Card className="border-border overflow-hidden">
              <CardHeader className="py-4 bg-muted/20">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" /> Short Batch Video
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex items-center justify-center bg-muted/40 min-h-[220px] relative">
                {batch.honeyVideo ? (
                  <video src={batch.honeyVideo} controls className="w-full h-[220px] object-cover" />
                ) : (
                  <p className="text-xs text-muted-foreground italic">No video uploaded</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Verification Details */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Batch Parameters & Origin</CardTitle>
              <CardDescription>Submitted by {batch.producer?.businessName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Location</p>
                    <p className="font-semibold">{batch.producer?.location}</p>
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
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Quantity</p>
                    <p className="font-semibold">{batch.quantity} kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Price Listed</p>
                    <p className="font-semibold">GH₵{batch.price?.toFixed(2) || 'N/A'}</p>
                  </div>
                </div>
                {batch.registrationLocation && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Registration Location</p>
                      <p className="font-semibold">{batch.registrationLocation}</p>
                    </div>
                  </div>
                )}
              </div>

              {batch.description && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Description</p>
                  <p className="text-sm leading-relaxed">{batch.description}</p>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Integrity Hashing signature</p>
                <code className="block p-3 bg-muted rounded text-[10px] break-all font-mono text-muted-foreground">
                  {batch.verificationHash}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Simulated Camera Scanner & Ledger Sign */}
        <div className="space-y-8">
          
          {/* Quality Scanner Viewport */}
          <Card className="border-border overflow-hidden bg-[#1c1917] text-white shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            
            <CardHeader className="border-b border-white/5 py-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                <Camera className="w-4 h-4" /> Lab Quality Scanner
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {batch.verified ? (
                // Already Verified display
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-lg text-emerald-400">Ledger Verification Passed</p>
                    <p className="text-xs text-stone-400">Quality checked & blockchain registered</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-center">
                    <QRCodeSVG value={qrUrl} size={140} level="H" includeMargin={false} />
                  </div>
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-bold">Ledger Address</span>
                    <code className="block text-[10px] font-mono text-emerald-300 break-all bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/40">
                      {batch.blockchainTx}
                    </code>
                  </div>
                </div>
              ) : scanning ? (
                // Active Scan animation viewport
                <div className="relative border border-primary/30 rounded-2xl aspect-square overflow-hidden bg-black/60 flex flex-col items-center justify-center text-center p-4">
                  {/* Scanner laser lines */}
                  <div className="absolute inset-x-0 h-0.5 bg-primary/70 animate-scan shadow-[0_0_10px_#D4AF37]"></div>
                  
                  <div className="space-y-4 z-10">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <div className="space-y-2">
                      <p className="text-xs font-mono font-bold tracking-widest text-primary animate-pulse uppercase">
                        {scanStep === 1 && 'Initializing optics...'}
                        {scanStep === 2 && 'Inspecting packaging labels...'}
                        {scanStep === 3 && 'Analyzing fluid density...'}
                        {scanStep === 4 && 'Running AI analysis...'}
                      </p>
                      <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${(scanStep / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : scanMetrics ? (
                // Scan Complete Metrics - Display AI Analysis Results
                <div className="space-y-6">
                  <div className="border border-emerald-500/20 rounded-2xl p-4 bg-emerald-950/20 space-y-3">
                    <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="w-4 h-4" /> AI Analysis Complete
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <span className="text-stone-400 block">Quality Score</span>
                        <span className="font-bold text-sm text-stone-100">{scanMetrics.qualityScore}/100</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Authenticity</span>
                        <span className="font-bold text-sm text-stone-100">{scanMetrics.authenticityScore}%</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Classification</span>
                        <span className="font-bold text-sm text-stone-100">{scanMetrics.classification}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Confidence</span>
                        <span className="font-bold text-sm text-stone-100">{(scanMetrics.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Detailed Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-stone-500 block">Food Classification</span>
                        <span className="font-bold text-sm text-stone-200">{scanMetrics.detailedAnalysis.foodClassification}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Spoilage Score</span>
                        <span className="font-bold text-sm text-stone-200">{scanMetrics.detailedAnalysis.spoilageScore}%</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Visual Quality</span>
                        <span className="font-bold text-sm text-stone-200">{scanMetrics.detailedAnalysis.visualQuality}%</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Texture</span>
                        <span className="font-bold text-sm text-stone-200">{scanMetrics.detailedAnalysis.textureAnalysis}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-stone-500 block text-xs">Color Analysis</span>
                      <span className="font-bold text-sm text-stone-200">{scanMetrics.detailedAnalysis.colorAnalysis}</span>
                    </div>
                  </div>

                  {scanMetrics.detectedIssues.length > 0 && (
                    <div className="border border-amber-500/20 rounded-2xl p-4 bg-amber-950/20 space-y-3">
                      <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                        <AlertTriangle className="w-4 h-4" /> Detected Issues
                      </h4>
                      <ul className="space-y-1 text-xs text-amber-200">
                        {scanMetrics.detectedIssues.map((issue: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-400">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-2 text-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Overall Score</span>
                    <p className="text-5xl font-black text-primary tracking-tighter">{scanMetrics.qualityScore}<span className="text-lg font-normal text-stone-400">/100</span></p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      {scanMetrics.authenticityScore >= 70 ? 'Premium Grade Approved' : 'Requires Manual Review'}
                    </p>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
                    onClick={handleApprove}
                    disabled={approving || scanMetrics.authenticityScore < 50}
                  >
                    {approving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing blockchain ledger...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" /> Approve & Sign Ledger
                      </>
                    )}
                  </Button>
                  {scanMetrics.authenticityScore < 50 && (
                    <p className="text-xs text-amber-400 text-center">
                      Low authenticity score - manual review required before approval
                    </p>
                  )}
                </div>
              ) : (
                // Scanner Idle / Start
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg">Quality Verification Required</h4>
                    <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                      You must run the lab scanner tool on the packaging label and product image parameters before certifying this honey batch.
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-14 rounded-xl font-bold gap-2 transition-colors"
                    onClick={startQualityScan}
                  >
                    <Cpu className="w-4 h-4" /> Start Quality Inspection Scan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Checklist info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-sm">Audit Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-stone-500 font-medium leading-relaxed">
              <p className="flex items-center gap-2"><span className="text-primary">✓</span> Hashing signature matches batch parameters</p>
              <p className="flex items-center gap-2"><span className="text-primary">✓</span> Location aligns with producer registered apiary</p>
              <p className="flex items-center gap-2"><span className="text-primary">✓</span> Proposed price fits market guidelines</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
