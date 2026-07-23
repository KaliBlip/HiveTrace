import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { getDashboardReviews } from '@/lib/actions/review-actions';

export default async function ReviewsPage() {
  const { reviews, stats } = await getDashboardReviews();

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
              <div className="text-3xl font-bold">
                {(stats?.averageRating ?? 0).toFixed(1)}
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(stats?.averageRating ?? 0) ? 'fill-primary text-primary' : 'text-muted'}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {stats?.totalReviews ?? 0} reviews
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">5 Star Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.fiveStarCount ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats?.fiveStarPercent ?? 0}% of all reviews
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{stats?.thisMonthCount ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-2">New reviews</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>Latest customer feedback from your batches</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Reviews appear when customers rate your verified batches.
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="pb-6 border-b border-border last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between mb-2">
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
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-muted" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{review.text}</p>
                <p className="text-xs text-muted-foreground">
                  Product:{' '}
                  <span className="font-medium">
                    {review.batch.product?.name || review.batch.honeyType}
                  </span>
                  <span className="mx-2">·</span>
                  Batch:{' '}
                  <span className="font-medium">
                    {review.batch.batchCode}
                  </span>
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
