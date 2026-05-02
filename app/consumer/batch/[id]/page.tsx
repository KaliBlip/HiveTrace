'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Star, MapPin, Calendar, Package } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { use } from 'react';

export default function BatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [rating, setRating] = useState('0');
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = () => {
    if (rating !== '0' && reviewText.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setRating('0');
        setReviewText('');
        setSubmitted(false);
      }, 2000);
    }
  };

  const reviews = [
    {
      id: 1,
      reviewer: 'Jane Smith',
      rating: 5,
      text: 'Exceptional quality honey! The QR code verification gave me confidence that I\'m getting authentic product.',
      date: '2 days ago'
    },
    {
      id: 2,
      reviewer: 'John Davis',
      rating: 5,
      text: 'Love knowing exactly where my honey comes from. Great producer!',
      date: '1 week ago'
    },
    {
      id: 3,
      reviewer: 'Maria Garcia',
      rating: 4,
      text: 'Very good honey. Slightly grainy texture but tastes wonderful.',
      date: '2 weeks ago'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/consumer/scanner" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Scanner
          </Link>
          <h1 className="text-4xl font-bold">Wildflower Blend 2024</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Batch Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Harvest Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">May 2024</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                Quantity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">50 kg</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">California</p>
            </CardContent>
          </Card>
        </div>

        {/* Producer Info */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>About the Producer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Golden Valley Apiaries</h3>
                <p className="text-muted-foreground">Producing pure, authentic honey since 2010</p>
                <div className="flex items-center gap-4 mt-4">
                  <div>
                    <p className="font-semibold">4.8</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <p className="text-sm text-muted-foreground">128 reviews</p>
                  </div>
                  <div className="border-l border-border pl-4">
                    <p className="text-sm text-muted-foreground">24 batches verified</p>
                  </div>
                </div>
              </div>
              <Link href="/consumer/producer/1">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Verification Badge */}
        <Card className="border-green-400/50 bg-green-50/30 dark:bg-green-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              Cryptographically Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm space-y-2">
            <p>This batch has been verified with HMAC-SHA256 cryptographic signatures.</p>
            <p className="font-mono text-xs">Hash: a3f8d2e91c7b4e6f9a2d5c8e1b4f7a0d</p>
            <p>This ensures authenticity and protects against counterfeits.</p>
          </CardContent>
        </Card>

        {/* Reviews */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Write Review */}
          <Card className="border-border lg:col-span-1">
            <CardHeader>
              <CardTitle>Leave a Review</CardTitle>
              <CardDescription>Share your experience with this batch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Your Rating</p>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select rating...</SelectItem>
                    <SelectItem value="5">★★★★★ Excellent</SelectItem>
                    <SelectItem value="4">★★★★☆ Good</SelectItem>
                    <SelectItem value="3">★★★☆☆ Average</SelectItem>
                    <SelectItem value="2">★★☆☆☆ Below Average</SelectItem>
                    <SelectItem value="1">★☆☆☆☆ Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Your Review</p>
                <Textarea
                  placeholder="Share your thoughts about this honey batch..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                disabled={rating === '0' || !reviewText.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {submitted ? 'Review Submitted!' : 'Submit Review'}
              </Button>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <p className="text-muted-foreground">See what others think about this batch</p>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="border-border">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{review.reviewer}</p>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-muted" />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground">{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
