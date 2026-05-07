import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Users, Globe, ShieldCheck, Leaf } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <PublicHeader />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center pt-24 pb-20 overflow-hidden bg-[#1c1917] text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917] via-[#1c1917]/80 to-[#1c1917]"></div>
          
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] relative z-10 w-full text-center">
            <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-10">
              Our Story
            </Badge>
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-heading font-bold tracking-[-0.03em] uppercase italic leading-[0.85] mb-12">
              PRESERVING <br className="hidden md:block" />THE <span className="text-primary not-italic">HIVE.</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-400 font-normal max-w-3xl mx-auto leading-relaxed">
              We started HiveTrace with a simple mission: to eliminate counterfeit honey and empower the artisan beekeepers who protect our global ecosystem.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-[80px] px-4 bg-background">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] space-y-24">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight uppercase italic leading-none">
                The <span className="text-primary not-italic">Honey</span> Crisis
              </h2>
              <div className="space-y-6">
                <p className="text-xl text-stone-500 leading-relaxed font-normal">
                  Honey is one of the most adulterated food products in the world. Often mixed with cheap syrups, heated until its beneficial enzymes are destroyed, and mislabeled to hide its true origins, the commercial honey market has made it nearly impossible for consumers to know what they're actually buying.
                </p>
                <p className="text-xl text-stone-500 leading-relaxed font-normal">
                  This adulteration doesn't just harm consumers—it destroys the livelihood of ethical, artisan beekeepers who cannot compete with artificially lowered prices. When local beekeepers go out of business, local bee populations plummet, threatening global food security.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 py-20 border-y border-white/5">
              <div className="space-y-6">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">Cryptographic Truth</h3>
                <p className="text-lg text-stone-500 font-normal leading-relaxed">
                  We use cryptographic signatures (HMAC-SHA256) to ensure that every jar's origin and lab test results are completely tamper-proof. Once data is on HiveTrace, it cannot be altered.
                </p>
              </div>
              <div className="space-y-6">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight">Global Network</h3>
                <p className="text-lg text-stone-500 font-normal leading-relaxed">
                  By connecting consumers directly to the source, we bypass the opaque supply chains that allow adulteration to thrive.
                </p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 pb-12">
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight uppercase italic leading-none">
                Our <span className="text-primary not-italic">Vision</span>
              </h2>
              <p className="text-xl text-stone-500 leading-relaxed font-normal">
                We envision a world where every food product can be traced back to its origin with absolute certainty. By starting with honey—the gold standard of natural products—we are building the infrastructure for a more transparent, ethical, and sustainable global food system.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
