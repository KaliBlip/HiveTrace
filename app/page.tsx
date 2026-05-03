'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Zap,
  Lock,
  BarChart3,
  ShieldCheck,
  Leaf,
  Globe,
  Gem,
  ChevronRight,
  Star,
  Users,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/footer';
import { PublicHeader } from '@/components/public-header';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-sans">
      {/* Navigation */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#1c1917] text-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1558583055-d7ac00b1adca?q=80&w=2000')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917] via-[#1c1917]/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#fafaf9] to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 py-24 lg:py-32">
          <div className="max-w-3xl space-y-10">
            <div className="space-y-6">
              <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                The Gold Standard of Purity
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-[0.05em] leading-[0.85] uppercase italic">
                PURE. <br />
                <span className="text-primary not-italic tracking-tight">VERIFIED.</span> <br />
                TRACEABLE.
              </h1>
              <p className="text-lg md:text-xl text-stone-400 font-medium max-w-xl leading-relaxed">
                We're rebuilding trust in the honey industry through cryptographic verification. Every jar, every batch, directly from the hive to your table.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-10 text-lg font-black rounded-2xl shadow-2xl shadow-primary/30 group">
                  Explore Marketplace
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/register?role=producer">
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold rounded-2xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all">
                  Producer Portal
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-8 md:gap-12 pt-12 border-t border-stone-800">
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl font-black tracking-tighter">12K+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Verified Batches</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl font-black tracking-tighter">98%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Trust Score</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl font-black tracking-tighter">500+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Artisan Beekeepers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale">
          <p className="text-sm font-black uppercase tracking-[0.3em] italic">Artisan Certified</p>
          <p className="text-sm font-black uppercase tracking-[0.3em] italic">Eco-Friendly</p>
          <p className="text-sm font-black uppercase tracking-[0.3em] italic">Zero Additives</p>
          <p className="text-sm font-black uppercase tracking-[0.3em] italic">Fair Trade</p>
          <p className="text-sm font-black uppercase tracking-[0.3em] italic">Bio-Security</p>
        </div>
      </section>

      {/* Feature Section: The Technology */}
      <section id="technology" className="py-32 px-4">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=2000"
                  alt="Honey verification"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-primary p-8 rounded-3xl shadow-2xl max-w-xs space-y-4">
                <ShieldCheck className="w-12 h-12 text-primary-foreground" />
                <p className="text-primary-foreground font-black text-xl leading-tight">
                  Cryptographic Trust Infrastructure
                </p>
                <p className="text-primary-foreground/80 text-sm font-medium">
                  HMAC-SHA256 signatures ensure that every QR code is authentic and tamper-proof.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-none py-1 px-4">The Solution</Badge>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none italic uppercase">
                  ELIMINATING <br />
                  <span className="text-primary not-italic">COUNTERFEIT</span> <br />
                  HONEY.
                </h2>
                <p className="text-xl text-stone-500 font-medium leading-relaxed">
                  The global honey market is flooded with adulterated products. HiveTrace uses advanced digital identities to protect producers and empower consumers.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: Lock, title: "Secure Signing", desc: "Every batch is signed with a unique key known only to the producer and our node." },
                  { icon: Zap, title: "Instant Verification", desc: "Scan any HiveTrace QR code to see the harvest location, lab tests, and harvest date." },
                  { icon: BarChart3, title: "Reputation Engine", desc: "Our algorithm calculates trust scores based on verified scan history and consumer feedback." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-stone-100 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-7 h-7 text-stone-900 group-hover:text-primary" />
                    </div>
                    <div className="space-y-1 pt-1">
                      <h3 className="text-lg font-black uppercase tracking-tight">{item.title}</h3>
                      <p className="text-stone-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section: Artisan Spotlight Style */}
      <section id="mission" className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-[#1c1917] rounded-[4rem] p-10 lg:p-24 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-0"></div>

          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-10 order-2 lg:order-1 text-center lg:text-left">
              <div className="space-y-6">
                <Badge className="bg-white/10 text-white border-white/20 px-6 py-2 rounded-full uppercase tracking-widest text-[10px] font-black">Our Philosophy</Badge>
                <h2 className="text-4xl md:text-5xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
                  BEE THE <br />
                  <span className="text-primary not-italic">CHANGE.</span>
                </h2>
                <p className="text-stone-400 text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Every HiveTrace purchase directly funds conservation efforts and supports independent, local beekeepers who prioritize bee health over mass production.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                  <Globe className="w-8 h-8 text-primary" />
                  <p className="font-black text-lg">Global Impact</p>
                  <p className="text-xs text-stone-500 font-medium">Supporting biodiversity worldwide.</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                  <Users className="w-8 h-8 text-primary" />
                  <p className="font-black text-lg">Community</p>
                  <p className="text-xs text-stone-500 font-medium">Direct connection to producers.</p>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/shop">
                  <Button className="bg-white text-stone-900 hover:bg-primary hover:text-white h-16 px-12 rounded-2xl font-black text-lg shadow-2xl">
                    View Verified Producers
                  </Button>
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="aspect-square bg-[url('https://images.unsplash.com/photo-1550051631-097561872124?q=80&w=1500')] bg-cover bg-center rounded-[3rem] shadow-2xl rotate-3 scale-105"></div>
              <div className="absolute inset-0 border-4 border-primary/30 rounded-[3rem] translate-x-4 translate-y-4 -z-10 rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Market Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <Badge className="bg-stone-100 text-stone-900 border-none">Selected Batches</Badge>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-none italic uppercase">
                FROM THE <br />
                <span className="text-primary not-italic tracking-tight">RESERVE.</span>
              </h2>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="h-16 px-8 text-lg font-black uppercase tracking-widest gap-3 hover:text-primary group">
                Enter Marketplace <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Acacia Reserve", price: "GH₵15,000", img: "https://images.unsplash.com/photo-1471943311424-646960669fba?q=80&w=1000" },
              { name: "Wildflower Gold", price: "GH₵12,500", img: "https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=1000" },
              { name: "Plateau Premium", price: "GH₵18,000", img: "https://images.unsplash.com/photo-1558583055-d7ac00b1adca?q=80&w=1000" }
            ].map((product, i) => (
              <Link key={i} href="/shop" className="group space-y-6 block">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-stone-100 relative shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <img src={product.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={product.name} />
                  <div className="absolute bottom-6 left-6">
                    <Badge className="bg-white/90 backdrop-blur text-[10px] font-black uppercase py-1.5 px-3">Artisan Grade</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-start px-2">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight">{product.name}</h3>
                    <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Small Batch Limited</p>
                  </div>
                  <p className="text-2xl font-black text-primary italic leading-none">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 bg-[#1c1917] text-white">
        <div className="max-w-7xl mx-auto text-center space-y-12 py-24 border border-white/10 rounded-[4rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1471943311424-646960669fba?q=80&w=2000')] bg-cover bg-center opacity-5"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
              TRUST. <br />
              <span className="text-primary not-italic tracking-tight">DELIVERED.</span>
            </h2>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto font-medium">
              Whether you're a producer seeking verification or a consumer looking for purity, the HiveTrace network is open.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-12 text-xl font-black rounded-2xl shadow-2xl shadow-primary/30">
                  Register Now
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-bold rounded-2xl border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all">
                  Member Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
