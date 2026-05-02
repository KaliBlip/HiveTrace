'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      reviewer: 'Jane Smith',
      rating: 5,
      text: 'Exceptional quality honey! The QR code verification gave me confidence that I&apos;m getting authentic product.',
      batch: 'Wildflower Blend',
      date: '2 days ago'
    },
    {
      id: 2,
      reviewer: 'John Davis',
      rating: 5,
      text: 'Love knowing exactly where my honey comes from. Great producer!',
      batch: 'Clover Premium',
      date: '1 week ago'
    },
    {
      id: 3,
      reviewer: 'Maria Garcia',
      rating: 4,
      text: 'Very good honey. Slightly grainy texture but tastes wonderful.',
      batch: 'Spring Collection',
      date: '2 weeks ago'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Customer Reviews</h1>
        <p className="text-muted-foreground">See what your customers are saying about your honey</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">4.8</div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Based on 128 reviews</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">5 Star Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">112</div>
            <p className="text-xs text-muted-foreground mt-2">87% of all reviews</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+24</div>
            <p className="text-xs text-muted-foreground mt-2">New reviews</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>Latest customer feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
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
              <p className="text-sm text-muted-foreground mb-2">{review.text}</p>
              <p className="text-xs text-muted-foreground">Batch: <span className="font-medium">{review.batch}</span></p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
