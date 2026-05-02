import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Shield, Star, MapPin, Package } from 'lucide-react';
import { getFeaturedProducers, getPlatformStats } from '@/lib/actions/consumer-actions';
import { ConsumerHeader } from '@/components/consumer/header';

export default async function ConsumerPage() {
  const featuredProducers = await getFeaturedProducers();
  const stats = await getPlatformStats();

  return (
    <div className="min-h-screen bg-background">
      <ConsumerHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Hero */}
        <section className="text-center space-y-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter">
              Track Your Honey&apos;s <span className="text-primary">Story</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Join thousands of conscious consumers using HiveTrace to verify authenticity and support transparent, ethical beekeepers.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/consumer/scanner">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-3 h-16 px-8 text-lg font-bold shadow-xl hover:scale-105 transition-transform">
                <QrCode className="w-6 h-6" />
                Scan Honey QR
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="h-16 px-8 text-lg font-bold border-2 hover:bg-muted transition-all">
                Browse Marketplace
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center gap-8 pt-8 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              {stats.batchCount.toLocaleString()}+ Batches
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {stats.producerCount.toLocaleString()}+ Producers
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tight">Trust but Verify</h2>
            <p className="text-muted-foreground font-medium">Three simple steps to ensure your honey is genuine.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border shadow-lg group hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">1. Scan QR Code</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground font-medium">
                Locate the HiveTrace QR code on the packaging and scan it with your smartphone camera.
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg group hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">2. Verify Hash</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground font-medium">
                Our network checks the cryptographic signature (HMAC-SHA256) to guarantee zero tampering.
              </CardContent>
            </Card>

            <Card className="border-border shadow-lg group hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">3. Rate & Review</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground font-medium">
                Build the community by leaving a verified review. Your feedback helps other consumers stay safe.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Featured Producers */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Top Rated Producers</h2>
              <p className="text-muted-foreground font-medium">Transparent beekeepers with a proven track record.</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="font-bold hover:text-primary">
                View All <Package className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducers.map((producer) => (
              <Card key={producer.id} className="border-border hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group">
                <div className="h-2 bg-primary"></div>
                <CardHeader>
                  <div className="w-14 h-14 bg-muted rounded-xl mb-4 overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🐝</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{producer.user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3" /> {producer.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm line-clamp-3 italic">
                      &ldquo;Committed to sustainable beekeeping and 100% pure, unfiltered honey production.&rdquo;
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Rating</p>
                        <div className="flex items-center gap-1 text-primary">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold">{(producer as any).ratings?.averageRating?.toFixed(1) || '5.0'}</span>
                        </div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Batches</p>
                        <p className="font-bold">{producer._count.batches}</p>
                      </div>
                    </div>
                  </div>
                  <Link href={`/consumer/producer/${producer.id}`}>
                    <Button variant="outline" className="w-full font-bold border-2 hover:bg-primary hover:text-primary-foreground transition-all">
                      View Reputation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-primary/5 border border-border rounded-2xl p-12 lg:p-20 text-center space-y-8">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-2xl mx-auto space-y-4 relative">
            <h2 className="text-4xl font-black tracking-tight">Ready to verify?</h2>
            <p className="text-xl text-muted-foreground font-medium">
              Don&apos;t take authenticity for granted. Scan your HiveTrace QR code now and see the complete journey of your honey.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Link href="/consumer/scanner">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-12 text-lg font-black shadow-xl">
                Open Scanner
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="h-16 px-12 text-lg font-black border-2">
                Join HiveTrace
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
