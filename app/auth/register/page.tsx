'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/register-form';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Database, Users } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Branding & Info */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group transition-all">
              <div className="w-16 h-16 bg-stone-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl group-hover:border-primary/50 transition-all duration-500">
                <span className="text-3xl">🍯</span>
              </div>
            </Link>
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border border-primary/20 py-1 px-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]">
                NETWORK ENROLLMENT
              </Badge>
              <h1 className="text-6xl md:text-7xl font-heading font-bold tracking-[-0.02em] text-white uppercase italic leading-none">
                ESTABLISH <span className="text-primary not-italic">IDENTITY.</span>
              </h1>
              <p className="text-xl text-stone-400 font-medium leading-relaxed max-w-md">
                Join the decentralized ledger of premium honey artisans and ethical consumers.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                <Fingerprint className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Biometric Ready</h3>
                <p className="text-xs text-stone-500 mt-1">Optional Passkey support for seamless, passwordless verification.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Immutable Records</h3>
                <p className="text-xs text-stone-500 mt-1">Your batches and reviews are etched into the cryptographic ledger.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Community Driven</h3>
                <p className="text-xs text-stone-500 mt-1">Part of a global movement towards transparent agriculture.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Form */}
        <div className="lg:col-span-7">
          <Card className="w-full bg-stone-900/40 border-white/5 rounded-[40px] shadow-3xl backdrop-blur-2xl overflow-hidden ring-1 ring-white/10">
            <CardContent className="p-10 md:p-14">
              <RegisterForm />
            </CardContent>
          </Card>
          
          <div className="mt-10 flex justify-center lg:justify-start px-4">
             <Link 
              href="/" 
              className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 hover:text-white transition-all duration-300 flex items-center gap-3 border-b border-transparent hover:border-stone-700 pb-1"
            >
              <span>Return to Gateway</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
