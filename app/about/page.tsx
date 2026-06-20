'use client';

import { useState } from 'react';
import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Leaf, 
  ShieldCheck, 
  Users, 
  Dna, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle2, 
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  Lock,
  Search
} from 'lucide-react';

const stats = [
  { value: '3rd', label: 'Most Faked Food', desc: 'Honey ranks right behind olive oil and milk in global food fraud.' },
  { value: '70%+', label: 'Pollen Stripped', desc: 'Commercial honey is often ultra-filtered to hide its geographic source.' },
  { value: '0%', label: 'Traceability', desc: 'Supermarket blends rarely list the specific apiary or harvest date.' },
];

const principles = [
  {
    icon: ShieldCheck,
    title: 'Tamper-Evident Records',
    text: 'Every batch is signed with a cryptographic HMAC signature, ensuring origin and harvest data cannot be cloned.',
  },
  {
    icon: Users,
    title: 'Producer-First Tooling',
    text: 'Beekeepers receive digital batch registries, automated inventory tools, and direct-to-consumer checkout pages.',
  },
  {
    icon: Globe,
    title: 'Transparent Supply Chains',
    text: 'Consumers trace honey directly to the source apiary with standard web-based smartphone QR scans.',
  },
  {
    icon: Leaf,
    title: 'Fair Provenance Pricing',
    text: 'Direct-to-consumer sales help ethical beekeepers compete on honey purity and origin instead of commodity pricing.',
  },
];

const timelineEvents = [
  {
    year: 'Stage 1',
    title: 'The Commodity Era',
    description: 'Industrial packing pools honey from anonymous global suppliers into massive vats, diluting quality and squeezing out local farms.',
  },
  {
    year: 'Stage 2',
    title: 'The Labeling Crisis',
    description: 'Vague label markers like "Blend of non-EU honeys" dominate supermarkets, concealing pasteurization and syrup adulteration.',
  },
  {
    year: 'Stage 3',
    title: 'Cryptographic Provenance',
    description: 'HiveTrace introduces batch-level cryptographic signatures. Every single jar is bound to a verified harvest footprint on a digital ledger.',
  },
  {
    year: 'Stage 4',
    title: 'Direct Marketplace',
    description: 'Bypassing wholesale distributors, beekeepers list products directly on our platform, securing both higher profits and verified purity.',
  },
];

export default function AboutPage() {
  const [purityTab, setPurityTab] = useState<'commercial' | 'hivetrace'>('hivetrace');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />

      <main className="pb-24">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 hive-grid" />
          
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] items-center">
              
              <div className="motion-rise space-y-6">
                <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  About HiveTrace
                </Badge>
                <h1 className="text-balance font-heading text-5xl font-bold leading-[0.92] tracking-tight sm:text-7xl">
                  Building trust for the honey economy.
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  HiveTrace was born out of a simple conviction: you should know exactly what goes into your body, where it was harvested, and who put in the labor to extract it.
                </p>
              </div>

              <div className="motion-rise motion-delay-2 rounded-xl border border-border/60 bg-card/60 p-6 shadow-[var(--shadow-soft)] backdrop-blur">
                <h2 className="font-heading text-lg font-semibold mb-3">The Honey Integrity Gap</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Honey is frequently adulterated, ultra-filtered, or cut with syrup blends. Because supply chains are opaque, honest beekeepers cannot compete on quality alone. HiveTrace solves this by establishing a secure verification layer: signed batches, scan history, direct orders, and reputation metrics in one place.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-12 border-y border-border/60 bg-card/25">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-3">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="font-heading text-4xl sm:text-5xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-foreground">{stat.label}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEW SECTION: Interactive Purity Comparator */}
        <section className="px-4 py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-card/10">
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
              <Badge className="rounded-full bg-primary/10 text-primary border border-primary/20">Integrity Check</Badge>
              <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                Compare Honey Purity
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Toggle between commercial supermarket honey and HiveTrace verified honey to understand the difference in quality and security.
              </p>
            </div>

            {/* Tab Controller */}
            <div className="flex justify-center border-b border-border/60 max-w-xs mx-auto mb-10">
              <div className="flex gap-2 p-1 bg-muted/60 rounded-full border border-border/40 w-full">
                <button
                  onClick={() => setPurityTab('commercial')}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all duration-300 ${purityTab === 'commercial' ? 'bg-destructive text-destructive-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Commercial Blend
                </button>
                <button
                  onClick={() => setPurityTab('hivetrace')}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all duration-300 ${purityTab === 'hivetrace' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  HiveTrace Verified
                </button>
              </div>
            </div>

            {/* Comparison Card */}
            <div className="max-w-3xl mx-auto">
              <div className={`glass-panel border rounded-2xl p-6 sm:p-8 transition-all duration-500 shadow-[var(--shadow-lift)] relative overflow-hidden ${purityTab === 'commercial' ? 'border-destructive/20 bg-destructive/[0.02]' : 'border-emerald-500/25 bg-emerald-500/[0.02]'}`}>
                
                {/* Glow Accent */}
                <div className={`absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${purityTab === 'commercial' ? 'bg-destructive/10' : 'bg-emerald-500/10'}`} />

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-border/40 pb-5 mb-6">
                  <div>
                    <h3 className="font-heading text-2xl font-bold flex items-center gap-2">
                      {purityTab === 'commercial' ? (
                        <>
                          <AlertTriangle className="size-6 text-destructive shrink-0" />
                          Generic Commercial Honey
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="size-6 text-emerald-500 shrink-0" />
                          HiveTrace Verified Honey
                        </>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {purityTab === 'commercial' ? 'Mass-processed and diluted for maximum commodity yield.' : 'Direct single-source honey protected by digital signatures.'}
                    </p>
                  </div>
                  <Badge className={`uppercase text-[10px] tracking-wider px-2 py-0.5 font-mono ${purityTab === 'commercial' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'}`}>
                    {purityTab === 'commercial' ? 'UNTRACEABLE' : '100% SECURE'}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {purityTab === 'commercial' ? (
                    <>
                      {/* Sourcing */}
                      <div className="flex gap-3">
                        <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Anonymous Sourcing</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Pooled from multiple countries with varying agricultural regulations. Specific origin cannot be traced.</p>
                        </div>
                      </div>
                      {/* Processing */}
                      <div className="flex gap-3">
                        <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Ultra-Filtered & Pasteurized</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Heated under high pressure. This destroys beneficial enzymes, antioxidants, and filters out pollen to bypass origin checks.</p>
                        </div>
                      </div>
                      {/* Dilution */}
                      <div className="flex gap-3">
                        <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Diluted Syrup Risk</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Subject to syrup addition (corn syrup, rice syrup, sugar syrups) to lower prices, without lab-tested batch results.</p>
                        </div>
                      </div>
                      {/* Verification */}
                      <div className="flex gap-3">
                        <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Zero Authentication</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Generic paper labeling is susceptible to fraud, re-packaging, and counterfeit branding with zero digital signature audits.</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Sourcing */}
                      <div className="flex gap-3">
                        <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Single-Source provenance</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Direct map coordinates tracking each honey batch back to its original apiary location and certified local beekeeper.</p>
                        </div>
                      </div>
                      {/* Processing */}
                      <div className="flex gap-3">
                        <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Raw & Cold-Extracted</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Unpasteurized honey retaining all its natural enzymes, beneficial nutrients, and local wildflower pollen count.</p>
                        </div>
                      </div>
                      {/* Dilution */}
                      <div className="flex gap-3">
                        <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Lab Purity Confirmed</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Every batch is checked for moisture levels (max 20%) and density before signing. No sugar syrup dilution.</p>
                        </div>
                      </div>
                      {/* Verification */}
                      <div className="flex gap-3">
                        <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">HMAC SHA-256 Ledger Security</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Tamper-evident batch hashes mapped directly to individual QR seals, instantly auditable by scanning with any smartphone browser.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Principles Grid */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-12">
            <div className="max-w-2xl">
              <Badge className="rounded-full bg-muted text-muted-foreground">Platform Pillars</Badge>
              <h2 className="font-heading text-4xl font-semibold tracking-tight mt-3 sm:text-5xl">
                Core design principles
              </h2>
            </div>
            
            <div className="grid gap-5 md:grid-cols-2">
              {principles.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="motion-rise rounded-xl border border-border/60 bg-card/72 p-6 shadow-[var(--shadow-soft)] backdrop-blur hover:translate-y-[-2px] transition-transform duration-300"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <span className="mb-8 grid size-12 place-items-center rounded-md bg-primary/12 text-primary">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="font-heading text-2xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground text-sm">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* NEW SECTION: Vertical Vision Timeline */}
        <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-border/60 bg-card/12 relative">
          <div className="mx-auto max-w-4xl">
            <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
              <Badge className="rounded-full bg-muted text-muted-foreground">The Evolution</Badge>
              <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                Timeline of Honey Provenance
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                How we transitioned from anonymous mass blending to a modern cryptographically-audited food chain.
              </p>
            </div>

            <div className="relative border-l border-border/80 pl-6 sm:pl-10 space-y-16 max-w-2xl mx-auto">
              {/* Vertical line accent */}
              <div className="absolute left-[-1.5px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative group">
                  
                  {/* Timeline point */}
                  <span className="absolute left-[-31px] sm:left-[-45px] top-1 flex size-5 items-center justify-center rounded-full bg-background border border-primary text-primary transition-all group-hover:scale-125 duration-300">
                    <span className="size-2 rounded-full bg-primary" />
                  </span>

                  <div className="space-y-2">
                    <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">{event.year}</span>
                    <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Thesis Banner */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl border border-border/60 bg-foreground text-background shadow-[var(--shadow-lift)] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="min-h-[340px] bg-[url('/hero-beehive.jpg')] bg-cover bg-center" />
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <Badge className="rounded-full bg-background/10 text-background w-fit">Our thesis</Badge>
              <h2 className="mt-6 text-balance font-heading text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
                Authenticity should be visible before the purchase, not argued after.
              </h2>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-background/70">
                HiveTrace starts with honey because provenance matters deeply in this category. The same cryptographic architecture can support a broader food system where origin, quality, and accountability are standard and easy to inspect.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
