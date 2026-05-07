'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, MapPin, TrendingUp, ShieldCheck, QrCode, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { use } from 'react';

export default function ProducerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const batches = [
    {
      id: 1,
      name: 'Wildflower Blend 2024',
      type: 'Wildflower',
      harvest: 'May 2024',
      scans: 234,
      rating: 4.9
    },
    {
      id: 2,
      name: 'Clover Premium',
      type: 'Clover',
      harvest: 'June 2024',
      scans: 189,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Spring Collection',
      type: 'Mixed',
      harvest: 'April 2024',
      scans: 412,
      rating: 4.7
    },
  ];

  const reviews = [
    { name: 'Ama K.', rating: 5, text: 'Smooth flavor and full traceability. The verification timeline is crystal clear.' },
    { name: 'David R.', rating: 5, text: 'Scanned instantly and matched all batch details. Reliable quality every order.' },
    { name: 'Lina M.', rating: 4, text: 'Great honey and very transparent producer profile. Packaging was excellent.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-[#1c1917] via-[#241e1a] to-[#2f2620] text-white pt-10 pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Link href="/consumer" className="inline-flex items-center gap-2 text-stone-300 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Back to Consumer Hub
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div className="space-y-5">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">Producer Reputation</Badge>
              <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight leading-[0.95]">
                Golden Valley <span className="text-primary not-italic">Apiaries</span>
              </h1>
              <div className="flex items-center gap-2 text-stone-300">
                <MapPin className="w-4 h-4" />
                <span>Valley Farms, California</span>
              </div>
              <div className="text-lg text-stone-300 leading-relaxed max-w-3xl">
                Producing pure, authentic honey since 2010. This profile aggregates verified scan activity, consumer feedback, and quality consistency across every released batch.
              </div>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Trust Snapshot</CardTitle>
                <CardDescription className="text-stone-300">Producer ID: {id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-3xl font-bold">
                  4.8 <Star className="w-5 h-5 fill-primary text-primary" />
                </div>
                <div className="text-sm text-stone-300">128 verified reviews</div>
                <Link href="/consumer/scanner" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <QrCode className="w-4 h-4 mr-2" />
                    Scan Their Batch
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Overall Rating', value: '4.8', sub: 'From 128 reviews', icon: Star },
            { label: 'Total Batches', value: '24', sub: 'Cryptographically verified', icon: ShieldCheck },
            { label: 'Total Scans', value: '8.5K', sub: 'Consumer verifications', icon: QrCode },
            { label: 'Reputation', value: '950', sub: 'Excellent trend', icon: TrendingUp },
          ].map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-3xl font-bold">
                  {stat.value}
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tight">Verified Batches</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {batches.map((batch) => (
              <Link key={batch.id} href={`/consumer/batch/${batch.id}`}>
                <Card className="h-full border-border hover:border-primary/50 transition-colors">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-xl">{batch.name}</CardTitle>
                    <CardDescription>{batch.type} • {batch.harvest}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">QR Scans</div>
                      <div className="text-2xl font-bold">{batch.scans}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Rating</div>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="font-semibold">{batch.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Recent Verified Reviews
              </CardTitle>
              <CardDescription>Only reviews from successful batch scans are shown.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <div key={review.name} className="rounded-xl border border-border/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{review.name}</div>
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{review.text}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Connect with Producer</CardTitle>
              <CardDescription>Ask questions about harvest source, lab checks, or handling.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-3">
              <Button variant="outline">Email Producer</Button>
              <Button variant="outline">Visit Website</Button>
              <Button variant="outline">Follow</Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
