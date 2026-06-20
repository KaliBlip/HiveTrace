'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Fingerprint,
  Leaf,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Dna,
  Layers,
  ChevronDown,
  ChevronUp,
  Star,
  ShieldAlert,
  HelpCircle,
  DollarSign,
  Briefcase,
  Users,
  Building,
  Terminal,
  Activity,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/footer';
import { PublicHeader } from '@/components/public-header';
import { mockBatches, getProducerById, mockProducers } from '@/lib/store';

const trustSignals = [
  { label: 'Verified batches', value: '12k+', icon: BadgeCheck },
  { label: 'Producer trust score', value: '98%', icon: Star },
  { label: 'Scan events logged', value: '240k', icon: Activity },
];

const workflow = [
  {
    icon: Fingerprint,
    title: 'Batch identity',
    text: 'Producers register harvest details and sign every batch with a tamper-evident HMAC hash.',
  },
  {
    icon: QrCode,
    title: 'Smart scan trail',
    text: 'Consumers scan packaging to see origin, producer reputation, scan history, and traceability data.',
  },
  {
    icon: BarChart3,
    title: 'Reputation loop',
    text: 'Orders, reviews, and fraud signals feed dashboards for producers and administrators.',
  },
];

const highlights = [
  { icon: ShieldCheck, label: 'Cryptographic verification' },
  { icon: PackageCheck, label: 'Batch-to-product marketplace' },
  { icon: Leaf, label: 'Producer provenance profiles' },
];

const faqItems = [
  {
    question: 'How does cryptographic verification prevent honey fraud?',
    answer:
      'HiveTrace generates a unique HMAC-SHA256 signature combining the harvest date, apiary ID, and batch weight. This signature is printed as a secure QR code. If someone copies the QR code to put it on fake honey, our scanner detects duplicate scans or geographical anomalies, immediately flagging the batch as suspicious.',
  },
  {
    question: 'Do consumers need to download a special app to scan QR codes?',
    answer:
      'No. HiveTrace uses standard web-based QR scanning. Any modern smartphone camera can scan the QR code, which opens a secure mobile-optimized webpage showing the exact batch credentials, apiary origin, and reputation metrics.',
  },
  {
    question: 'How are honey marketplace payments processed?',
    answer:
      'HiveTrace integrates with secure payment systems (like Paystack). Consumers can pay with cards or direct bank transfers. Funds are handled securely, enabling consumers to purchase directly from verified beekeepers with confidence.',
  },
  {
    question: 'What happens if a fraud alert is triggered?',
    answer:
      'If a duplicate scan or geolocation mismatch is detected, the platform flags the batch immediately. It logs the scan time and device metadata, notifies administrators, and lowers the producer\'s trust score. The admin panel allows full auditing to resolve or confirm disputes.',
  },
  {
    question: 'Can any honey producer join the platform?',
    answer:
      'Any beekeeper can register, but they must submit business documentation, location details, and apiary verification. Administrators review and approve each registry application manually before they can sign honey batches or list products.',
  },
];

export default function Home() {
  // Hero Simulator State
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Batch Trace Search State
  const [searchInput, setSearchInput] = useState('HT-2024-WFB-001');
  const [currentBatch, setCurrentBatch] = useState(mockBatches[0]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [timelineDetail, setTimelineDetail] = useState<number | null>(null);

  // Role Features Tab State
  const [activeTab, setActiveTab] = useState<'producer' | 'consumer' | 'admin'>('producer');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const logsSequence = [
    'Connecting to secure HiveTrace ledger...',
    'Reading QR cryptographic signature hash...',
    'Extracting public key from Golden Valley Apiaries...',
    'Running HMAC-SHA256 signature verification...',
    'Checking location coordinates: 40.7128, -74.006...',
    'Authenticity confirmed: Signature is valid & secure.'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanState === 'scanning') {
      setScanLogs([]);
      setActiveLogIndex(0);
      
      interval = setInterval(() => {
        setActiveLogIndex((prev) => {
          if (prev < logsSequence.length - 1) {
            setScanLogs((prevLogs) => [...prevLogs, logsSequence[prev]]);
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setScanState('success');
            }, 400);
            return prev;
          }
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [scanState]);

  const handleStartScan = () => {
    setScanState('scanning');
  };

  const handleResetScan = () => {
    setScanState('idle');
    setScanLogs([]);
    setActiveLogIndex(0);
  };

  const handleTraceSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const cleanedCode = searchInput.trim().toUpperCase();
    const found = mockBatches.find((b) => b.batchCode === cleanedCode);

    if (found) {
      setCurrentBatch(found);
      setTimelineDetail(null);
    } else {
      setSearchError(`Warning: Batch code "${cleanedCode}" was not found in the HiveTrace registry. Integrity check failed.`);
    }
  };

  const currentProducer = getProducerById(currentBatch?.producerId || '');

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        {/* Redesigned Hero Section */}
        <section className="relative min-h-[95vh] px-4 pb-14 pt-28 sm:px-6 lg:px-8 flex items-center">
          <div className="pointer-events-none absolute inset-0 hive-grid" />
          <div className="pointer-events-none absolute inset-x-4 top-24 h-[40rem] rounded-[2rem] border border-border/40 bg-card/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.95fr] w-full">
            
            {/* Left Column: Typography & Badges */}
            <div className="motion-rise space-y-8 lg:pr-4">
              <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm w-fit flex items-center gap-2">
                <Zap className="size-3 text-primary animate-pulse" />
                Verified Honey Ledger System
              </Badge>

              <div className="space-y-6">
                <h1 className="text-balance font-heading text-5xl font-bold tracking-tight leading-[0.92] sm:text-6xl lg:text-[5.8rem]">
                  Trust every jar, <br />
                  <span className="bg-gradient-to-r from-amber-500 via-primary to-yellow-600 bg-clip-text text-transparent">
                    verified from the hive
                  </span>.
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  HiveTrace equips beekeepers with cryptographic batch signatures, dynamic QR seals, 
                  and a direct-to-consumer marketplace to stamp out counterfeit honey and secure supply chains.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3.5 sm:flex-row">
                <Link href="/shop">
                  <Button size="lg" className="w-full gap-2.5 sm:w-auto active:scale-[0.98] transition-all hover:shadow-[0_0_20px_oklch(0.76_0.17_76_/_0.25)]">
                    Explore marketplace
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/auth/register?role=producer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto active:scale-[0.98] transition-transform border-border/80 hover:bg-muted/40">
                    Register producer
                  </Button>
                </Link>
              </div>

              {/* Floating Trust Badge List */}
              <div className="flex flex-wrap gap-2.5 pt-4">
                {trustSignals.map((signal, index) => {
                  const Icon = signal.icon;
                  return (
                    <div
                      key={signal.label}
                      className="motion-rise flex items-center gap-2.5 rounded-full border border-border/50 bg-card/60 px-4 py-2 text-xs backdrop-blur hover:border-primary/45 transition-colors"
                      style={{ animationDelay: `${120 + index * 60}ms` }}
                    >
                      <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-3.5" />
                      </span>
                      <div>
                        <span className="font-bold font-mono text-sm leading-none mr-1">{signal.value}</span>
                        <span className="text-muted-foreground uppercase tracking-[0.06em] text-[10px]">{signal.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Interactive Scan Terminal Simulator */}
            <div className="motion-rise motion-delay-2">
              <div className="glass-panel relative rounded-2xl border border-border/60 p-4 shadow-[var(--shadow-lift)] overflow-hidden min-h-[460px] flex flex-col justify-between">
                
                {/* Honeycomb pulsing grid background (Idle/Scanning) */}
                {(scanState === 'idle' || scanState === 'scanning') && (
                  <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none select-none">
                    <svg className="w-full h-full animate-pulse-grid" fill="none" viewBox="0 0 100 100" stroke="currentColor" strokeWidth="0.5">
                      <polygon points="50,15 75,30 75,60 50,75 25,60 25,30" />
                      <polygon points="50,75 75,90 75,100 50,100 25,100 25,90" className="opacity-40" />
                      <polygon points="75,30 100,15 100,0 75,0" className="opacity-40" />
                      <polygon points="25,30 0,15 0,0 25,0" className="opacity-40" />
                    </svg>
                  </div>
                )}

                {/* Console Header */}
                <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-4 text-primary" />
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Ledger Terminal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${scanState === 'scanning' ? 'bg-amber-500 animate-pulse' : scanState === 'success' ? 'bg-emerald-500' : 'bg-primary animate-pulse'}`} />
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      {scanState === 'scanning' ? 'Verifying...' : scanState === 'success' ? 'Ready' : 'Awaiting Scan'}
                    </span>
                  </div>
                </div>

                {/* Terminal Window Body */}
                <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                  
                  {scanState === 'idle' && (
                    <div className="text-center space-y-6 py-8">
                      <div className="relative mx-auto size-24 grid place-items-center">
                        <div className="absolute inset-0 rounded-full border border-primary/20 bg-primary/4 animate-ping" />
                        <div className="relative size-16 rounded-full border border-primary/45 bg-primary/8 grid place-items-center text-primary shadow-[0_0_20px_oklch(0.76_0.17_76_/_0.15)]">
                          <QrCode className="size-8" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-heading text-lg font-semibold">Simulate Honey Verification</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                          Click below to trigger a live cryptographic audit check on honey jar batch HT-2024-WFB-001.
                        </p>
                      </div>

                      <Button onClick={handleStartScan} className="active:scale-[0.98] transition-transform gap-2 mx-auto shadow-sm">
                        <Activity className="size-4 animate-pulse" />
                        Simulate Verification Scan
                      </Button>
                    </div>
                  )}

                  {scanState === 'scanning' && (
                    <div className="w-full space-y-6 py-6 px-4 flex-1 flex flex-col justify-between">
                      {/* Laser sweep animation overlay */}
                      <div className="absolute inset-x-0 h-0.5 bg-emerald-500/80 shadow-[0_0_8px_#10b981] animate-laser pointer-events-none" />

                      <div className="font-mono text-xs text-left bg-black/15 dark:bg-black/35 rounded-lg border p-4 flex-1 space-y-2.5 overflow-y-auto min-h-[180px] max-h-[220px]">
                        {scanLogs.map((log, idx) => (
                          <div key={idx} className="flex gap-2 items-start text-muted-foreground animate-rise-in">
                            <span className="text-emerald-500 shrink-0">✓</span>
                            <span>{log}</span>
                          </div>
                        ))}
                        {activeLogIndex < logsSequence.length && (
                          <div className="flex gap-2 items-center text-primary font-semibold">
                            <span className="size-1.5 rounded-full bg-primary animate-ping shrink-0" />
                            <span className="animate-pulse">{logsSequence[activeLogIndex]}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                            style={{ width: `${(scanLogs.length / logsSequence.length) * 100}%` }}
                          />
                        </div>
                        <p className="font-mono text-[10px] text-center text-muted-foreground uppercase tracking-widest animate-pulse">
                          Reading cryptographic signature
                        </p>
                      </div>
                    </div>
                  )}

                  {scanState === 'success' && (
                    <div className="w-full space-y-5 py-4 animate-rise-in">
                      {/* Cryptographic Passport */}
                      <div className="glass-panel border-emerald-500/35 bg-emerald-500/6 rounded-xl border p-5 relative overflow-hidden shadow-[0_12px_40px_rgba(16,185,129,0.08)]">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-36 bg-emerald-500/8 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex items-center justify-between gap-4 border-b border-emerald-500/20 pb-3.5">
                          <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              <BadgeCheck className="size-6" />
                            </span>
                            <div>
                              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Purity Confirmed</p>
                              <p className="font-heading text-lg font-semibold mt-0.5">HT-2024-WFB-001</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-500 hover:bg-emerald-500/90 text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5">
                            TAMPER-FREE
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-4 text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-muted-foreground block uppercase">Beekeeper</span>
                            <span className="font-semibold block mt-0.5 text-foreground">Golden Valley Apiaries</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block uppercase">Origin</span>
                            <span className="font-semibold block mt-0.5 text-foreground">New York, NY</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block uppercase">Purity Rating</span>
                            <span className="font-semibold block mt-0.5 text-emerald-600 dark:text-emerald-400">100% Organic</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block uppercase">Consumer Rating</span>
                            <span className="font-semibold block mt-0.5 text-foreground flex items-center gap-1">
                              ★ 4.8 <span className="text-muted-foreground font-normal text-[10px]">(128 reviews)</span>
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                          <span>HMAC Verified</span>
                          <span className="text-foreground font-semibold">7a3c2f8e9b4d...</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href="/verify/7a3c2f8e9b4d1c6e5f2a9d3b7c1e8a4f" className="flex-1">
                          <Button size="sm" className="w-full text-xs font-semibold py-2.5">
                            View Full Blockchain Audit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={handleResetScan} className="text-xs py-2.5 border-border/80 text-muted-foreground hover:text-foreground">
                          <RefreshCw className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Console Footer Info */}
                <div className="border-t border-border/40 pt-2.5 flex items-center justify-between font-mono text-[9px] text-muted-foreground">
                  <span>SSL SECURE CONNECTION</span>
                  <span>LATENCY: 42ms</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Highlights Bar */}
        <section className="border-y border-border/60 bg-card/38 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 p-4">
                  <span className="grid size-10 place-items-center rounded-md bg-primary/12 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-semibold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl space-y-4">
                <Badge className="rounded-full bg-muted text-muted-foreground">Traceability workflow</Badge>
                <h2 className="text-balance font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
                  One platform for the whole honey chain.
                </h2>
              </div>
              <Link href="/consumer/scanner">
                <Button variant="outline" className="gap-2 active:scale-[0.98] transition-transform">
                  Try scanner
                  <QrCode className="size-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="motion-rise rounded-xl border border-border/60 bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur hover:translate-y-[-2px] transition-transform duration-300"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <span className="mb-10 grid size-12 place-items-center rounded-md bg-foreground text-background">
                      <Icon className="size-6" />
                    </span>
                    <p className="font-heading text-2xl font-semibold tracking-tight">{item.title}</p>
                    <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Interactive Honey Trace Showcase */}
        <section className="relative border-y border-border/60 bg-card/18 px-4 py-24 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,oklch(0.76_0.17_76_/_0.06),transparent_60%)]" />
          
          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
              <Badge className="rounded-full bg-primary/10 text-primary border border-primary/20">Interactive Demo</Badge>
              <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                Trace a honey batch yourself
              </h2>
              <p className="text-muted-foreground text-lg">
                Enter one of our registry codes to track a batch from beehive harvest to lab purity reports.
              </p>

              <form onSubmit={handleTraceSearch} className="flex gap-2 max-w-md mx-auto pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="e.g. HT-2024-WFB-001"
                    className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <Button type="submit" className="active:scale-[0.98] transition-transform">Trace</Button>
              </form>
              <div className="text-xs text-muted-foreground gap-3 flex justify-center mt-1.5">
                <span>Try:</span>
                <button
                  type="button"
                  onClick={() => { setSearchInput('HT-2024-WFB-001'); setSearchError(null); }}
                  className="font-mono text-primary underline hover:text-primary/80 transition-colors"
                >
                  HT-2024-WFB-001
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchInput('HT-2024-CLP-002'); setSearchError(null); }}
                  className="font-mono text-primary underline hover:text-primary/80 transition-colors"
                >
                  HT-2024-CLP-002
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchInput('HT-2024-SPC-003'); setSearchError(null); }}
                  className="font-mono text-primary underline hover:text-primary/80 transition-colors"
                >
                  HT-2024-SPC-003
                </button>
              </div>
            </div>

            {searchError ? (
              <div className="max-w-3xl mx-auto rounded-lg border border-destructive/25 bg-destructive/10 p-6 text-center space-y-4">
                <ShieldAlert className="size-12 text-destructive mx-auto" />
                <h3 className="font-heading text-xl font-semibold text-destructive">UNREGISTERED BATCH ENCOUNTERED</h3>
                <p className="text-sm max-w-xl mx-auto text-muted-foreground">
                  {searchError} The batch code entered is not registered on our cryptographically-secured honey ledger. This might indicate generic, dilution, or fraudulent honey branding.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => { setSearchInput('HT-2024-WFB-001'); setSearchError(null); setCurrentBatch(mockBatches[0]); }} className="border-destructive/20 text-destructive hover:bg-destructive/10">
                    Restore secure batch
                  </Button>
                </div>
              </div>
            ) : currentBatch && (
              <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] max-w-5xl mx-auto items-start">
                {/* Left Side: Batch Identity Card */}
                <div className="glass-panel rounded-xl border p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Honey Batch Identity</span>
                      <h3 className="font-heading text-2xl font-semibold mt-1">{currentBatch.name}</h3>
                      <p className="text-sm font-mono text-muted-foreground mt-0.5">{currentBatch.batchCode}</p>
                    </div>
                    <BadgeCheck className="size-8 text-primary" />
                  </div>

                  <div className="border-t border-border/60 pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground block">Honey Type</span>
                        <span className="font-semibold block mt-0.5">{currentBatch.type}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Harvest Date</span>
                        <span className="font-semibold block mt-0.5">{currentBatch.harvestDate}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Batch Weight</span>
                        <span className="font-semibold block mt-0.5">{currentBatch.quantity} kg</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Verification Registry</span>
                        <span className="font-semibold block mt-0.5 text-emerald-600 dark:text-emerald-400">ACTIVE & SECURE</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-4 space-y-2">
                    <span className="text-xs text-muted-foreground block font-mono">HMAC SHA-256 Signature</span>
                    <div className="font-mono text-[10px] break-all bg-muted/60 border rounded p-2.5 text-muted-foreground select-all leading-relaxed">
                      {currentBatch.integrityHash}
                    </div>
                  </div>
                </div>

                {/* Right Side: Interactive Trace Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground px-1">Verification Ledger Audit Trail</h4>
                  
                  <div className="space-y-3">
                    {/* Step 1: Apiary Harvest */}
                    <div className={`glass-panel border rounded-lg p-4 transition-all duration-300 ${timelineDetail === 1 ? 'border-primary' : 'hover:border-border-foreground/30'}`}>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setTimelineDetail(timelineDetail === 1 ? null : 1)}>
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <MapPin className="size-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-sm">Step 1: Origin & Harvest Logging</p>
                            <p className="text-xs text-muted-foreground">{(getProducerById(currentBatch.producerId) || mockProducers[0])?.businessName}</p>
                          </div>
                        </div>
                        {timelineDetail === 1 ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                      </div>
                      {timelineDetail === 1 && (
                        <div className="mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground space-y-2">
                          <p>Harvested locally at <strong>{(getProducerById(currentBatch.producerId) || mockProducers[0])?.location.address}</strong>.</p>
                          <p>Coordinates registered: <strong>{(getProducerById(currentBatch.producerId) || mockProducers[0])?.location.lat}, {(getProducerById(currentBatch.producerId) || mockProducers[0])?.location.lng}</strong>.</p>
                          <p>Apiary credentials status: <span className="text-emerald-500 font-semibold">100% Verified</span></p>
                        </div>
                      )}
                    </div>

                    {/* Step 2: Quality Analysis */}
                    <div className={`glass-panel border rounded-lg p-4 transition-all duration-300 ${timelineDetail === 2 ? 'border-primary' : 'hover:border-border-foreground/30'}`}>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setTimelineDetail(timelineDetail === 2 ? null : 2)}>
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Dna className="size-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-sm">Step 2: Lab Purity Analysis</p>
                            <p className="text-xs text-muted-foreground">Certified 100% Natural Honey</p>
                          </div>
                        </div>
                        {timelineDetail === 2 ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                      </div>
                      {timelineDetail === 2 && (
                        <div className="mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground space-y-2">
                          <p>Laboratory moisture index: <strong>17.4%</strong> (Maximum allowable is 20%).</p>
                          <p>Pollen analysis matches local flora: <span className="text-emerald-500 font-semibold">Confirmed</span></p>
                          <p>No foreign syrups, sugars, or heavy metals detected.</p>
                        </div>
                      )}
                    </div>

                    {/* Step 3: Cryptographic Signing */}
                    <div className={`glass-panel border rounded-lg p-4 transition-all duration-300 ${timelineDetail === 3 ? 'border-primary' : 'hover:border-border-foreground/30'}`}>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setTimelineDetail(timelineDetail === 3 ? null : 3)}>
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Fingerprint className="size-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-sm">Step 3: HMAC Cryptographic Signing</p>
                            <p className="text-xs text-muted-foreground">Ledger entry recorded</p>
                          </div>
                        </div>
                        {timelineDetail === 3 ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                      </div>
                      {timelineDetail === 3 && (
                        <div className="mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground space-y-2">
                          <p>Unique batch signature generated using a secure SHA-256 HMAC digest key.</p>
                          <p>Hash: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] text-foreground">{currentBatch.integrityHash}</code></p>
                          <p>This signature verifies that harvest statistics and packaging IDs cannot be falsified.</p>
                        </div>
                      )}
                    </div>

                    {/* Step 4: Scan Log & Alerts */}
                    <div className={`glass-panel border rounded-lg p-4 transition-all duration-300 ${timelineDetail === 4 ? 'border-primary' : 'hover:border-border-foreground/30'}`}>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setTimelineDetail(timelineDetail === 4 ? null : 4)}>
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <QrCode className="size-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-sm">Step 4: Label & Scan Log</p>
                            <p className="text-xs text-muted-foreground">{currentBatch.scanCount} scans logged</p>
                          </div>
                        </div>
                        {timelineDetail === 4 ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                      </div>
                      {timelineDetail === 4 && (
                        <div className="mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground space-y-2">
                          <p>This batch has been scanned <strong>{currentBatch.scanCount}</strong> times in various regions.</p>
                          <p>Anomalies detected: <span className="text-emerald-500 font-semibold">Zero Fraud Reports</span></p>
                          <p>Any scan mismatch in GPS thresholds triggers automated Admin alerts.</p>
                        </div>
                      )}
                    </div>

                    {/* Step 5: Direct Marketplace */}
                    <div className={`glass-panel border rounded-lg p-4 transition-all duration-300 ${timelineDetail === 5 ? 'border-primary' : 'hover:border-border-foreground/30'}`}>
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setTimelineDetail(timelineDetail === 5 ? null : 5)}>
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Layers className="size-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-sm">Step 5: Marketplace & Ordering</p>
                            <p className="text-xs text-muted-foreground">Listings verified and active</p>
                          </div>
                        </div>
                        {timelineDetail === 5 ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                      </div>
                      {timelineDetail === 5 && (
                        <div className="mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground space-y-2">
                          <p>Available on the decentralized shop marketplace.</p>
                          <p>Producer Rating: <span className="font-semibold text-amber-500">★ {currentProducer?.rating || '4.8'}</span> ({currentProducer?.totalReviews || 128} reviews)</p>
                          <p>Consumers can scan physical jars to instantly post verified-purchase feedback.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Role-Based Feature Grid (Tabbed View) */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center space-y-4 mb-14">
              <Badge className="rounded-full bg-muted text-muted-foreground">Detailed Breakdown</Badge>
              <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                Rethinking the honey supply chain
              </h2>
              <p className="text-muted-foreground text-lg">
                Explore the platform capabilities engineered for each participant in the HiveTrace ecosystem.
              </p>
            </div>

            {/* Tab Controller */}
            <div className="flex justify-center border-b border-border/60 max-w-md mx-auto mb-12">
              <div className="flex gap-2 p-1 bg-muted/60 rounded-full border border-border/40 w-full">
                <button
                  onClick={() => setActiveTab('producer')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'producer' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Producers
                </button>
                <button
                  onClick={() => setActiveTab('consumer')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'consumer' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Consumers
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'admin' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Auditors
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="max-w-5xl mx-auto">
              {activeTab === 'producer' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <Fingerprint className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Batch Cryptographic Signing</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Register batch specifics, harvest dates, and weights. Generate SHA-256 HMAC hashes that tie to the batch permanently on our secure honey registry.
                    </p>
                  </div>
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <QrCode className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">QR Code Label Export</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Export and print secure QR codes for packaging labels. Each label is uniquely generated with verification deep links for consumers.
                    </p>
                  </div>
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <DollarSign className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Direct Honey Marketplace</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Convert signed batches into shop listings. Keep inventory synchronized and sell directly to honey enthusiasts without intermediary retail markups.
                    </p>
                  </div>
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <BarChart3 className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Apiary Performance Dashboards</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Monitor scan metrics, geographic search locations, consumer reviews, transaction volumes, and overall apiary reputation in real-time.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'consumer' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <Search className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Instant Web QR Scanner</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Scan product labels using any mobile camera and browser. No App Store downloads needed. Instantly audit the honey\'s chain of custody.
                    </p>
                  </div>
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <Star className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Verified Buyer Ratings</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Submit ratings and written reviews after purchase. Only scans bound to verified orders can submit reviews, preventing fraudulent bot ratings.
                    </p>
                  </div>
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <Building className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Detailed Provenance Profiles</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Access verified apiary coordinates, bio certificates, beekeeper descriptions, and historical purity statistics before checking out.
                    </p>
                  </div>
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <PackageCheck className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Direct-from-Hive Purchasing</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Order authentic honey from certified local apiaries. Secured checkout ensures safe payment handling and swift honey deliveries.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'admin' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <ShieldAlert className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Anomalous Fraud Monitoring</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Automated flagging system for double QR scans, timing anomalies, and scans originating beyond configured distance boundaries.
                    </p>
                  </div>
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <Users className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Producer Application Audits</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Approve, suspend, or audit registry participants. Safeguard integrity by checking lab reports and coordinates before activation.
                    </p>
                  </div>
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <Briefcase className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Audit Trail Reports</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Generate comprehensive statistics on batch counts, transaction compliance, scan volumes, and active fraud containment actions.
                    </p>
                  </div>
                  <div className="glass-panel border rounded-xl p-6 space-y-4 hover:translate-y-[-2px] transition-transform">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                        <Layers className="size-5" />
                      </span>
                      <h3 className="font-heading text-xl font-semibold">Escrow & Disputes Manager</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Oversee transaction flow and resolve disputes when lab verification alerts are triggered, preserving marketplace stability.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative border-t border-border/60 bg-card/28 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center space-y-4 mb-16">
              <Badge className="rounded-full bg-muted text-muted-foreground">FAQ</Badge>
              <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg">
                Answers to questions about honey signatures, scanning tech, and buyer security.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="glass-panel border rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex justify-between items-center w-full px-6 py-5 text-left font-semibold text-base focus:outline-none hover:text-primary transition-colors"
                  >
                    <span>{item.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="size-5 text-muted-foreground shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="size-5 text-muted-foreground shrink-0 ml-4" />
                    )}
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-[300px] border-t border-border/40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                  >
                    <p className="px-6 py-5 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl border border-border/60 bg-foreground text-background shadow-[var(--shadow-lift)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <Sparkles className="mb-8 size-10 text-primary" />
              <h2 className="text-balance font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
                Built for real producers, not generic storefronts.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-background/70">
                Dashboards focus on batch registration, listings, scan analytics, orders, and reputation signals so
                daily operations stay fast and auditable.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/register?role=producer">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-transform">Start as producer</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-background/20 bg-transparent text-background hover:bg-background/10 active:scale-[0.98] transition-transform">
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>
            <div className="min-h-[360px] bg-[url('/verification-badge.jpg')] bg-cover bg-center" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
