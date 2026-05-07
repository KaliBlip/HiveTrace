'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <Link href="/" className="inline-flex items-center gap-3 group transition-all">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:rotate-12 transition-transform">
            <span className="text-3xl">🍯</span>
          </div>
        </Link>
        <div className="space-y-2">
          <Badge className="bg-primary/20 text-primary border-none py-1 px-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
            Secure Access
          </Badge>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter uppercase italic text-white">
            WELCOME <span className="text-primary not-italic">BACK.</span>
          </h1>
          <p className="text-stone-400 font-normal">Sign in to the cryptographic ledger.</p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 rounded-[48px] shadow-2xl backdrop-blur-xl overflow-hidden">
        <CardContent className="p-10 flex justify-center">
          <LoginForm />
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-primary transition-colors flex items-center justify-center gap-2">
          <span className="text-lg">←</span> Back to Network Home
        </Link>
      </div>
    </div>
  );
}
