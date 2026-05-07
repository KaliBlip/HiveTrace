'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <footer className="bg-background pt-32 pb-16 border-t border-border/40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] space-y-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12 group-hover:scale-110">
                <span className="text-primary-foreground font-bold text-2xl">🍯</span>
              </div>
              <span className="font-heading font-black text-3xl tracking-tighter uppercase italic group-hover:text-primary transition-colors">HiveTrace</span>
            </Link>
            <p className="text-stone-500 font-normal text-lg max-w-[320px] leading-relaxed">
              The premier cryptographic protocol for honey traceability, ensuring absolute authenticity for every jar in the artisan ecosystem.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'LinkedIn'].map((platform) => (
                <Link key={platform} href="#" className="w-12 h-12 rounded-xl bg-stone-50 border border-border/50 flex items-center justify-center text-stone-400 hover:text-primary hover:border-primary/30 transition-all hover:-translate-y-1">
                  <span className="sr-only">{platform}</span>
                  <div className="w-5 h-5 bg-current opacity-20 rounded-sm" />
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <p className="font-heading font-bold uppercase tracking-[0.2em] text-[10px] text-stone-400">Network</p>
            <ul className="space-y-4 font-bold uppercase tracking-widest text-xs">
              <li><Link href="/shop" className={`transition-colors ${isActive('/shop') ? 'text-primary' : 'text-stone-500 hover:text-primary'}`}>Marketplace</Link></li>
              <li><Link href="/#technology" className="text-stone-500 hover:text-primary transition-colors">Technology</Link></li>
              <li><Link href="/#mission" className="text-stone-500 hover:text-primary transition-colors">Mission</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <p className="font-heading font-bold uppercase tracking-[0.2em] text-[10px] text-stone-400">Company</p>
            <ul className="space-y-4 font-bold uppercase tracking-widest text-xs">
              <li><Link href="/about" className={`transition-colors ${isActive('/about') ? 'text-primary' : 'text-stone-500 hover:text-primary'}`}>About Us</Link></li>
              <li><Link href="/contact" className={`transition-colors ${isActive('/contact') ? 'text-primary' : 'text-stone-500 hover:text-primary'}`}>Contact</Link></li>
              <li><Link href="/privacy" className="text-stone-500 hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <p className="font-heading font-bold uppercase tracking-[0.2em] text-[10px] text-stone-400">Support</p>
            <ul className="space-y-4 font-bold uppercase tracking-widest text-xs">
              <li><Link href="#" className="text-stone-500 hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-stone-500 hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-stone-500 hover:text-primary transition-colors">Fraud Report</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-16 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 italic">© 2026 HIVETRACE PROTOCOL. SECURED BY RESERVE NODES.</p>
          </div>
          <div className="flex gap-12">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 hover:text-primary transition-colors cursor-default">Security Audited</span>
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 hover:text-primary transition-colors cursor-default">Artisan First</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
