'use client';

import { useState } from 'react';
import { ArrowLeft, BadgeCheck, Calendar, ChevronRight, Info, Lock, MapPin, Minus, Plus, ShieldCheck, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/lib/hooks/use-cart';
import { submitProductReview } from '@/lib/actions/review-actions';
import { toast } from 'sonner';

interface ProductReview {
  id: string;
  rating: number;
  text: string;
  verified: boolean;
  createdAt: string;
  user: {
    name: string;
  };
}

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  batchId: string;
  producerId: string;
  createdAt: string;
  producerName: string;
  producerLocation: string;
  batchCode: string;
  verificationHash: string;
  batchHarvestDate: string;
  honeyType: string;
  verified: boolean;
  reviews: ProductReview[];
}

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState(product.reviews);
  const [submittingReview, setSubmittingReview] = useState(false);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  const handleAddToCart = () => {
    addItem(product, qty);
  };

  const harvestFormatted = product.batchHarvestDate
    ? new Date(product.batchHarvestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const ledgerIdentifier = product.verificationHash || product.batchCode || product.batchId;
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.error('Please write a review before submitting');
      return;
    }

    setSubmittingReview(true);
    try {
      const review = await submitProductReview({
        productId: product.id,
        rating: reviewRating,
        text: reviewText,
      });

      setReviews([
        {
          id: review.id,
          rating: review.rating,
          text: review.text,
          verified: review.verified,
          createdAt: review.createdAt instanceof Date ? review.createdAt.toISOString() : String(review.createdAt),
          user: {
            name: review.user.name || 'HiveTrace buyer',
          },
        },
        ...reviews,
      ]);
      setReviewText('');
      setReviewRating(5);
      toast.success('Review submitted for admin and producer review');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Back nav ──────────────────────────────── */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-16 z-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center gap-3 h-12">
          <Link href="/shop" className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-3.5" />
            Marketplace
          </Link>
          <ChevronRight className="size-3 text-border" />
          <span className="text-xs font-semibold text-foreground truncate">{product.name}</span>
        </div>
      </div>

      {/* ── Main content ──────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_480px] lg:gap-16 xl:gap-20">

          {/* ── Left: Image ───────────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-muted">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=900')" }}
                />
              )}

              {/* Status overlay badge */}
              <div className="absolute top-4 left-4">
                {isOutOfStock ? (
                  <span className="rounded-full bg-background/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground border border-border/60 backdrop-blur-sm">
                    Out of stock
                  </span>
                ) : isLowStock ? (
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Only {product.stock} left
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20 backdrop-blur-sm">
                    <ShieldCheck className="size-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* ── Batch provenance card ─────────── */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-primary/10 grid place-items-center">
                    <ShieldCheck className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Batch Certificate</p>
                    <p className="text-[11px] text-muted-foreground">Cryptographically signed</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                  product.verified
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900'
                    : 'bg-muted text-muted-foreground border-border'
                }`}>
                  {product.verified ? 'Signature valid' : 'Pending'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1 border-t border-border/40">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Batch code</p>
                  <p className="font-mono text-xs font-semibold text-foreground">{product.batchCode || 'N/A'}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Honey type</p>
                  <p className="text-xs font-semibold">{product.honeyType || 'Mixed'}</p>
                </div>
                {harvestFormatted && (
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Harvested</p>
                    <p className="text-xs font-semibold">{harvestFormatted}</p>
                  </div>
                )}
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Origin</p>
                  <p className="text-xs font-semibold">{product.producerLocation}</p>
                </div>
              </div>

              {ledgerIdentifier && (
                <Link
                  href={`/verify/${encodeURIComponent(ledgerIdentifier)}`}
                  className="flex items-center justify-between w-full text-xs font-semibold text-primary hover:underline pt-1 border-t border-border/40"
                >
                  <span className="flex items-center gap-1.5">
                    <Lock className="size-3" />
                    Verify on blockchain ledger
                  </span>
                  <ChevronRight className="size-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* ── Right: Info & CTA ─────────────────── */}
          <div className="flex flex-col gap-7">

            {/* Producer */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 grid place-items-center font-bold text-primary text-sm font-heading shrink-0">
                {product.producerName[0]}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">{product.producerName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="size-3" />
                  {product.producerLocation}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-primary">
                <Star className="size-3.5 fill-current" />
                <span className="text-xs font-bold text-foreground">{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{product.unit}</span>
              <h1 className="font-heading text-3xl font-bold tracking-tight leading-tight sm:text-4xl">
                {product.name}
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-end gap-3">
              <p className="font-heading text-4xl font-extrabold tracking-tight">
                GH₵{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <span className="mb-1 text-xs font-semibold text-muted-foreground">
                per {product.unit}
              </span>
            </div>

            {/* Stock */}
            {!isOutOfStock && (
              <p className={`text-xs font-semibold ${isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {isLowStock ? `⚠ Only ${product.stock} units left` : `✓ ${product.stock} units in stock`}
              </p>
            )}

            {/* Qty + Add */}
            <div className="space-y-3">
              {/* Qty selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-1 rounded-xl border border-border/70 bg-card p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="size-8 rounded-lg grid place-items-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    disabled={isOutOfStock}
                    className="size-8 rounded-lg grid place-items-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                className="w-full h-12 gap-2.5 font-bold text-sm tracking-wide rounded-xl"
              >
                <ShoppingCart className="size-4" />
                {isOutOfStock ? 'Out of stock' : `Add ${qty > 1 ? `${qty} ×` : ''} to cart`}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                { icon: ShieldCheck, title: 'Signed provenance', sub: 'HMAC-SHA256 verified' },
                { icon: BadgeCheck, title: 'Verified beekeeper', sub: '100% authenticated' },
                { icon: Calendar, title: 'Fresh harvest', sub: harvestFormatted || 'Recent harvest' },
                { icon: Info, title: 'Lab tested', sub: 'Purity certificate' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/60 p-3">
                  <div className="size-7 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                    <Icon className="size-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold leading-tight">{title}</p>
                    <p className="text-[10px] text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Product reviews */}
            <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold">Product Reviews</h2>
                  <p className="text-xs text-muted-foreground">
                    Buyer feedback is visible to the producer and HiveTrace admins.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-primary">
                  <Star className="size-4 fill-current" />
                  <span className="text-sm font-bold">{averageRating > 0 ? averageRating.toFixed(1) : '0.0'}</span>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-border/50 bg-background/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Leave a buyer review</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setReviewRating(value)}
                        className="text-primary transition-transform hover:scale-110"
                        aria-label={`Rate ${value} star${value === 1 ? '' : 's'}`}
                      >
                        <Star className={`size-4 ${value <= reviewRating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  placeholder="Share what stood out about this honey..."
                  className="min-h-24 resize-none rounded-lg"
                />
                <Button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewText.trim()}
                  className="w-full gap-2"
                >
                  <BadgeCheck className="size-4" />
                  {submittingReview ? 'Submitting...' : 'Submit product review'}
                </Button>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Reviews are accepted from accounts with a paid order for this product.
                </p>
              </div>

              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                    No reviews yet for this product.
                  </p>
                ) : (
                  reviews.map((review) => (
                    <article key={review.id} className="rounded-lg border border-border/50 bg-background/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{review.user.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                            {review.verified && <span className="ml-2 font-bold text-emerald-600">Verified buyer</span>}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`size-3.5 ${index < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                    </article>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
