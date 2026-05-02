'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Shield, Star, Zap } from 'lucide-react';

export default function ConsumerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground">🍯</span>
            </div>
            <span>HiveTrace</span>
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-bold">Track Your Honey&apos;s Story</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use HiveTrace to scan QR codes on honey jars and verify authenticity, explore producer reputation, and join our community of conscious consumers.
          </p>
          <Link href="/consumer/scanner">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <QrCode className="w-4 h-4" />
              Scan a QR Code
            </Button>
          </Link>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mb-4">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Scan the QR Code</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Find the QR code on your honey jar and scan it with your phone camera. No app needed!
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Verify Authenticity</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Our system instantly verifies the batch with cryptographic signatures to ensure authenticity.
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>See Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Explore what other customers think and leave your own review for this batch.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Featured Producers */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold">Featured Producers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Golden Valley Apiaries',
                location: 'California',
                rating: 4.9,
                batches: 24,
                bio: 'Producing pure, authentic honey since 2010.'
              },
              {
                name: 'Meadow Bee Farm',
                location: 'Oregon',
                rating: 4.8,
                batches: 18,
                bio: 'Sustainable beekeeping for over 15 years.'
              },
              {
                name: 'Pure Honey Co',
                location: 'Vermont',
                rating: 4.7,
                batches: 31,
                bio: 'Organic honey from the heart of New England.'
              },
            ].map((producer, i) => (
              <Card key={i} className="border-border hover:border-primary/50 transition">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/40 to-accent/40 rounded-lg mb-4"></div>
                  <CardTitle className="text-lg">{producer.name}</CardTitle>
                  <CardDescription>{producer.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">{producer.bio}</p>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-foreground font-semibold">{producer.rating}</p>
                      <p className="text-muted-foreground">Rating</p>
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">{producer.batches}</p>
                      <p className="text-muted-foreground">Batches</p>
                    </div>
                  </div>
                  <Link href={`/consumer/producer/${i + 1}`}>
                    <Button variant="outline" className="w-full" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary/5 border border-border rounded-lg p-12 text-center space-y-4">
          <h2 className="text-3xl font-bold">Start Exploring Now</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have a HiveTrace QR code? Scan it now to verify your honey and support transparent producers.
          </p>
          <Link href="/consumer/scanner">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Open Scanner
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
