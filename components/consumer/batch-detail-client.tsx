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
import { submitBatchReview } from '@/lib/actions/review-actions';
import { toast } from 'sonner';

type BatchData = {
  id: string;
  batchCode: string;
  honeyType: string;
  quantity: number;
  harvestDate: Date;
  verificationHash: string;
  verified: boolean;
  scanCount: number;
  producerId: string;
  avgRating: number;
  reviewCount: number;
  producer: {
    id: string;
    businessName: string;
    location: string;
    description: string | null;
    ratings: { averageRating: number; totalReviews: number } | null;
    _count: { batches: number };
  };
  reviews: {
    id: string;
    rating: number;
    text: string;
    verified: boolean;
    createdAt: Date;
    user: { name: string };
  }[];
};

export function ConsumerBatchDetail({ batch }: { batch: BatchData }) {
  const [rating, setRating] = useState('0');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState(batch.reviews);

  const handleSubmitReview = async () => {
    if (rating === '0' || !reviewText.trim()) return;
    setSubmitting(true);
    try {
      const review = await submitBatchReview({
        batchId: batch.id,
        rating: parseInt(rating, 10),
        text: reviewText,
      });
      setReviews([
        {
          id: review.id,
          rating: review.rating,
          text: review.text,
          verified: review.verified,
          createdAt: review.createdAt,
          user: review.user,
        },
        ...reviews,
      ]);
      setRating('0');
      setReviewText('');
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const producerRating =
    batch.producer.ratings?.averageRating ?? batch.avgRating;
  const producerReviewCount =
    batch.producer.ratings?.totalReviews ?? batch.reviewCount;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/consumer/scanner" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Scanner
          </Link>
          <h1 className="text-4xl font-bold">{batch.honeyType}</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">{batch.batchCode}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Harvest Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {new Date(batch.harvestDate).toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
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
              <p className="text-2xl font-bold">{batch.quantity} kg</p>
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
              <p className="text-2xl font-bold">{batch.producer.location || 'Ghana'}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>About the Producer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{batch.producer.businessName}</h3>
                <p className="text-muted-foreground">
                  {batch.producer.description || 'Verified honey producer on HiveTrace'}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div>
                    <p className="font-semibold">{producerRating.toFixed(1)}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(producerRating) ? 'fill-primary text-primary' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="border-l border-border pl-4">
                    <p className="text-sm text-muted-foreground">{producerReviewCount} reviews</p>
                  </div>
                  <div className="border-l border-border pl-4">
                    <p className="text-sm text-muted-foreground">
                      {batch.producer._count.batches} batches verified
                    </p>
                  </div>
                </div>
              </div>
              <Link href={`/consumer/producer/${batch.producerId}`}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-400/50 bg-green-50/30 dark:bg-green-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              {batch.verified ? 'Cryptographically Verified' : 'Pending Verification'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm space-y-2">
            <p>
              {batch.verified
                ? 'This batch has been verified with HMAC-SHA256 and registered on the HiveTrace blockchain ledger.'
                : 'This batch is awaiting admin quality verification.'}
            </p>
            <p className="font-mono text-xs break-all">Hash: {batch.verificationHash}</p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
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
                disabled={rating === '0' || !reviewText.trim() || submitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <p className="text-muted-foreground">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''} for this batch
              </p>
            </div>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <Card className="border-border p-8 text-center text-muted-foreground">
                  No reviews yet. Be the first to review this batch!
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="border-border">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{review.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                            {review.verified && (
                              <span className="ml-2 text-emerald-600 text-xs font-bold">
                                Verified Purchase
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <p className="text-foreground">{review.text}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
