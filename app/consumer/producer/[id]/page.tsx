'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, MapPin, TrendingUp } from 'lucide-react';

export default function ProducerProfilePage({ params }: { params: { id: string } }) {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/consumer" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Profile Header */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold">Golden Valley Apiaries</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Valley Farms, California</span>
                </div>
              </div>
              <p className="text-lg text-foreground max-w-2xl">
                Producing pure, authentic honey since 2010. Committed to sustainable beekeeping practices and the highest quality standards.
              </p>
            </div>
            <Link href="/consumer/scanner">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Scan Their Batches
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">From 128 reviews</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">Verified</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.5K</div>
                <p className="text-xs text-muted-foreground mt-1">QR code scans</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-3xl font-bold">950</div>
                  <TrendingUp className="w-5 h-5 text-green-600 mb-1" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Excellent</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Batches */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Their Batches</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {batches.map((batch) => (
              <Link key={batch.id} href={`/consumer/batch/${batch.id}`}>
                <Card className="border-border hover:border-primary/50 transition cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{batch.name}</CardTitle>
                    <CardDescription>{batch.type} • {batch.harvest}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">QR Scans</p>
                        <p className="text-2xl font-bold">{batch.scans}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <div className="flex gap-0.5 justify-end mt-1">
                          {[...Array(Math.ceil(batch.rating))].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                          {[...Array(5 - Math.ceil(batch.rating))].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-muted" />
                          ))}
                        </div>
                        <p className="text-sm mt-1">{batch.rating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>Connect with this producer</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="outline">Email Producer</Button>
            <Button variant="outline">Visit Website</Button>
            <Button variant="outline">Follow</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
