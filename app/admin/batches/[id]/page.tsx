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
  Hash,
  Image as ImageIcon,
  Loader2,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
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
                    <span className="text-muted-foreground font-bold text-sm">GH₵</span>
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
          <Card className="border-border overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 from-slate-100 via-slate-50 to-slate-100 text-slate-900 dark:text-white shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <CardHeader className="border-b border-slate-200 dark:border-white/5 py-5 bg-slate-50/50 dark:bg-white/5 backdrop-blur-sm">
              <CardTitle className="text-base font-bold flex items-center gap-2.5 text-primary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Camera className="w-4 h-4" />
                </div>
                Lab Quality Scanner
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-stone-400 text-xs">
                AI-powered honey authenticity and quality verification
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6 relative z-10">
              {batch.verified ? (
                // Already Verified display
                <div className="text-center py-8 space-y-5">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-xl text-emerald-600 dark:text-emerald-400">Ledger Verification Passed</p>
                    <p className="text-xs text-slate-500 dark:text-stone-400">Quality checked & blockchain registered</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/50 to-white/0 dark:from-white/5 dark:to-white/0 border border-slate-200 dark:border-white/10 p-6 rounded-3xl flex items-center justify-center shadow-xl">
                    <QRCodeSVG value={qrUrl} size={160} level="H" includeMargin={false} />
                  </div>
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] text-slate-400 dark:text-stone-500 uppercase tracking-widest block font-bold">Ledger Address</span>
                    <code className="block text-[11px] font-mono text-emerald-700 dark:text-emerald-300 break-all bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-inner">
                      {batch.blockchainTx}
                    </code>
                  </div>
                </div>
              ) : scanning ? (
                // Active Scan animation viewport
                <div className="relative border-2 border-primary/20 rounded-3xl aspect-square overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 dark:from-black/80 dark:to-slate-900/80 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                  {/* Scanner laser lines */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan shadow-[0_0_20px_#D4AF37]"></div>
                  <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                  
                  <div className="space-y-6 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                      <Loader2 className="relative w-14 h-14 animate-spin text-primary mx-auto" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-mono font-bold tracking-widest text-primary animate-pulse uppercase">
                        {scanStep === 1 && 'Initializing optics...'}
                        {scanStep === 2 && 'Inspecting packaging labels...'}
                        {scanStep === 3 && 'Analyzing fluid density...'}
                        {scanStep === 4 && 'Running AI analysis...'}
                      </p>
                      <div className="w-56 h-2 bg-slate-200 dark:bg-white/10 rounded-full mx-auto overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-1000 shadow-lg shadow-primary/50"
                          style={{ width: `${(scanStep / 4) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-stone-500 uppercase tracking-wider">Step {scanStep} of 4</p>
                    </div>
                  </div>
                </div>
              ) : scanMetrics ? (
                // Scan Complete Metrics - Display AI Analysis Results
                <div className="space-y-5">
                  {/* Main Score Card */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 p-6 shadow-xl dark:shadow-emerald-500/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> AI Analysis Complete
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-stone-400">Powered by Hugging Face AI</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{scanMetrics.qualityScore}</p>
                        <p className="text-[10px] text-slate-500 dark:text-stone-400 uppercase tracking-wider">Quality Score</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/0 border border-slate-200 dark:border-white/10 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                          <Sparkles className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-stone-400 uppercase tracking-wider">Authenticity</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{scanMetrics.authenticityScore}%</p>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                          style={{ width: `${scanMetrics.authenticityScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/0 border border-slate-200 dark:border-white/10 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-500/10 rounded-lg">
                          <Cpu className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-stone-400 uppercase tracking-wider">Confidence</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{(scanMetrics.confidence * 100).toFixed(0)}%</p>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{ width: `${scanMetrics.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Classification Badge */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/10 dark:to-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-xl">
                        <Database className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-stone-400 uppercase tracking-wider block">Classification</span>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{scanMetrics.classification}</p>
                      </div>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {scanMetrics.authenticityScore >= 70 ? 'Verified' : 'Review Needed'}
                    </Badge>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/0 border border-slate-200 dark:border-white/10 rounded-3xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-stone-400 uppercase tracking-wider flex items-center gap-2">
                      <Hash className="w-3 h-3" /> Detailed Analysis
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 dark:text-stone-500 uppercase tracking-wider block">Food Classification</span>
                        <p className="font-bold text-sm text-slate-700 dark:text-stone-200">{scanMetrics.detailedAnalysis.foodClassification}</p>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 dark:text-stone-500 uppercase tracking-wider block">Spoilage Score</span>
                        <p className="font-bold text-sm text-slate-700 dark:text-stone-200">{scanMetrics.detailedAnalysis.spoilageScore}%</p>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 dark:text-stone-500 uppercase tracking-wider block">Visual Quality</span>
                        <p className="font-bold text-sm text-slate-700 dark:text-stone-200">{scanMetrics.detailedAnalysis.visualQuality}%</p>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 dark:text-stone-500 uppercase tracking-wider block">Texture</span>
                        <p className="font-bold text-sm text-slate-700 dark:text-stone-200 truncate">{scanMetrics.detailedAnalysis.textureAnalysis}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                      <span className="text-[10px] text-slate-400 dark:text-stone-500 uppercase tracking-wider block">Color Analysis</span>
                      <p className="font-bold text-sm text-slate-700 dark:text-stone-200">{scanMetrics.detailedAnalysis.colorAnalysis}</p>
                    </div>
                  </div>

                  {/* Detected Issues */}
                  {scanMetrics.detectedIssues.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-5 space-y-3 shadow-xl dark:shadow-amber-500/10">
                      <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" /> Detected Issues
                      </h4>
                      <ul className="space-y-2">
                        {scanMetrics.detectedIssues.map((issue: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-xs text-amber-700 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30">
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
                            <span className="leading-relaxed">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Approval Button */}
                  <div className="space-y-3 pt-2">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-white h-14 rounded-2xl font-bold gap-2 shadow-xl shadow-primary/30 transition-all"
                      onClick={handleApprove}
                      disabled={approving || scanMetrics.authenticityScore < 50}
                    >
                      {approving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Signing blockchain ledger...
                        </>
                      ) : (
                        <>
                          <Database className="w-5 h-5" /> Approve & Sign Ledger
                        </>
                      )}
                    </Button>
                    {scanMetrics.authenticityScore < 50 && (
                      <div className="flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Low authenticity score - manual review required before approval</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Scanner Idle / Start
                <div className="text-center py-10 space-y-6">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-stone-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                      <Camera className="w-10 h-10" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-xl text-slate-900 dark:text-white">Quality Verification Required</h4>
                    <p className="text-xs text-slate-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                      Run the AI-powered lab scanner to analyze packaging labels and product image parameters before certifying this honey batch.
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border border-primary/20 h-14 rounded-2xl font-bold gap-2 transition-all shadow-lg shadow-primary/10"
                    onClick={startQualityScan}
                  >
                    <Cpu className="w-5 h-5" /> Start Quality Inspection Scan
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
