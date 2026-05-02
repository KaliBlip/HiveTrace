'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 px-4 border-t border-stone-200">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">🍯</span>
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic">HiveTrace</span>
            </div>
            <p className="text-stone-500 font-medium max-w-xs leading-relaxed">
              The leading cryptographic infrastructure for honey traceability and artisan market growth.
            </p>
          </div>
          <div className="space-y-4">
            <p className="font-black uppercase tracking-widest text-[10px] text-stone-400">Network</p>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link href="/shop" className="hover:text-primary transition-colors">Marketplace</Link></li>
              <li><Link href="/#technology" className="hover:text-primary transition-colors">Technology</Link></li>
              <li><Link href="/#mission" className="hover:text-primary transition-colors">Mission</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-black uppercase tracking-widest text-[10px] text-stone-400">Company</p>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-black uppercase tracking-widest text-[10px] text-stone-400">Social</p>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Instagram</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">© 2026 HIVETRACE PROTOCOL. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Security Audited</span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Artisan First</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
