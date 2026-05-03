import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Users, Globe, ShieldCheck, Leaf } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <PublicHeader />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 flex items-center overflow-hidden bg-[#1c1917] text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay grayscale"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917] via-[#1c1917]/80 to-[#1c1917]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
            <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8">
              Our Story
            </Badge>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-8">
              PRESERVING <br className="hidden md:block" />THE <span className="text-primary not-italic">HIVE.</span>
            </h1>
            <p className="text-xl text-stone-300 font-medium max-w-2xl mx-auto leading-relaxed">
              We started HiveTrace with a simple mission: to eliminate counterfeit honey and empower the artisan beekeepers who protect our global ecosystem.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 px-4 bg-background">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight uppercase">The Honey Crisis</h2>
              <p className="text-lg text-stone-500 leading-relaxed font-medium">
                Honey is one of the most adulterated food products in the world. Often mixed with cheap syrups, heated until its beneficial enzymes are destroyed, and mislabeled to hide its true origins, the commercial honey market has made it nearly impossible for consumers to know what they're actually buying.
              </p>
              <p className="text-lg text-stone-500 leading-relaxed font-medium">
                This adulteration doesn't just harm consumers—it destroys the livelihood of ethical, artisan beekeepers who cannot compete with artificially lowered prices. When local beekeepers go out of business, local bee populations plummet, threatening global food security.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 py-12 border-y border-stone-200">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-black uppercase">Cryptographic Truth</h3>
                <p className="text-stone-500 font-medium leading-relaxed">
                  We use cryptographic signatures (HMAC-SHA256) to ensure that every jar's origin and lab test results are completely tamper-proof. Once data is on HiveTrace, it cannot be altered.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-black uppercase">Global Network</h3>
                <p className="text-stone-500 font-medium leading-relaxed">
                  By connecting consumers directly to the source, we bypass the opaque supply chains that allow adulteration to thrive.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight uppercase">Our Vision</h2>
              <p className="text-lg text-stone-500 leading-relaxed font-medium">
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
