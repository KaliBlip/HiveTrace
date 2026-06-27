import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, MapPin, TrendingUp, ShieldCheck, QrCode, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getProducerPublicProfile } from '@/lib/actions/producer-actions';
import { notFound } from 'next/navigation';

export default async function ProducerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const producer = await getProducerPublicProfile(id);

  if (!producer) {
    notFound();
  }

  const rating = producer.ratings?.averageRating ?? 0;
  const reviewCount = producer.ratings?.totalReviews ?? producer.reviews.length;
  const verifiedBatches = producer.batches.length;

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-[#1c1917] via-[#241e1a] to-[#2f2620] text-white pt-10 pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Link
            href="/consumer"
            className="inline-flex items-center gap-2 text-stone-300 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Consumer Hub
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div className="space-y-5">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">
                Producer Reputation
              </Badge>
              <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight leading-[0.95]">
                {producer.businessName}
              </h1>
              <div className="flex items-center gap-2 text-stone-300">
                <MapPin className="w-4 h-4" />
                <span>{producer.location || 'Ghana'}</span>
              </div>
              <div className="text-lg text-stone-300 leading-relaxed max-w-3xl">
                {producer.description ||
                  'Verified honey producer on the HiveTrace platform with cryptographically sealed batches.'}
              </div>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Trust Snapshot</CardTitle>
                <CardDescription className="text-stone-300">
                  {producer.verified ? 'Verified Producer' : 'Pending Approval'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-3xl font-bold">
                  {rating.toFixed(1)} <Star className="w-5 h-5 fill-primary text-primary" />
                </div>
                <div className="text-sm text-stone-300">{reviewCount} verified reviews</div>
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
            {
              label: 'Overall Rating',
              value: rating.toFixed(1),
              sub: `From ${reviewCount} reviews`,
              icon: Star,
            },
            {
              label: 'Total Batches',
              value: String(producer._count.batches),
              sub: `${verifiedBatches} verified`,
              icon: ShieldCheck,
            },
            {
              label: 'Total Scans',
              value: producer.scanCount.toLocaleString(),
              sub: 'Consumer verifications',
              icon: QrCode,
            },
            {
              label: 'Trust Score',
              value: String(producer.ratings?.trustScore ?? 100),
              sub: 'Platform trust index',
              icon: TrendingUp,
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </CardTitle>
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
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tight">
            Verified Batches
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {producer.batches.length === 0 ? (
              <Card className="border-border p-8 text-center text-muted-foreground md:col-span-2">
                No verified batches yet.
              </Card>
            ) : (
              producer.batches.map((batch) => (
                <Link key={batch.id} href={`/consumer/batch/${batch.id}`}>
                  <Card className="h-full border-border hover:border-primary/50 transition-colors">
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-xl">{batch.honeyType}</CardTitle>
                      <CardDescription>
                        {batch.batchCode} •{' '}
                        {new Date(batch.harvestDate).toLocaleDateString(undefined, {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">
                          QR Scans
                        </div>
                        <div className="text-2xl font-bold">{batch.scanCount}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">
                          Rating
                        </div>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span className="font-semibold">
                            {batch.avgRating > 0 ? batch.avgRating.toFixed(1) : '—'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Recent Verified Reviews
              </CardTitle>
              <CardDescription>Reviews from verified batch purchases and scans.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {producer.reviews.length === 0 ? (
                <p className="text-muted-foreground text-sm">No reviews yet.</p>
              ) : (
                producer.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-border/60 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{review.user.name}</div>
                      <div className="flex items-center gap-1 text-primary">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Batch: {review.batch.batchCode}
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {review.text}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Shop This Producer</CardTitle>
              <CardDescription>Purchase verified honey directly from their marketplace listings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/shop">
                <Button className="w-full">Browse Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
