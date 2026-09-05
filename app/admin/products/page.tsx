import Link from 'next/link';
import { Boxes, ExternalLink, MessageSquareText, PackageCheck, ShieldCheck, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminProducts, setAdminProductActive } from '@/lib/actions/product-actions';

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  const activeCount = products.filter((product) => product.isActive).length;
  const reviewCount = products.reduce((sum, product) => sum + product.batch.reviews.length, 0);
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2 sm:space-y-3">
          <Badge className="w-fit rounded-full bg-primary/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
            Marketplace Control
          </Badge>
          <div>
            <h1 className="font-heading text-3xl font-bold uppercase italic tracking-tight sm:text-4xl lg:text-5xl">
              PRODUCT <span className="text-primary not-italic">LISTINGS</span>
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm sm:text-base text-muted-foreground">
              Review every producer listing, moderate marketplace visibility, and inspect buyer feedback tied to each product.
            </p>
          </div>
        </div>
        <Link href="/shop" className="w-fit">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="size-4" />
            View marketplace
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-border">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
              <PackageCheck className="size-4 text-primary shrink-0" />
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <p className="font-heading text-2xl sm:text-3xl font-bold">{activeCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">of {products.length} total products</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
              <Boxes className="size-4 text-primary shrink-0" />
              Stock Under Watch
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <p className="font-heading text-2xl sm:text-3xl font-bold">{totalStock.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">units listed by producers</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
              <MessageSquareText className="size-4 text-primary shrink-0" />
              Buyer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <p className="font-heading text-2xl sm:text-3xl font-bold">{reviewCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">text reviews awaiting routine audit</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-border rounded-2xl sm:rounded-[32px]">
        <CardHeader className="p-4 sm:p-6 border-b border-border bg-muted/30">
          <CardTitle className="text-lg sm:text-xl font-heading uppercase tracking-tight">All Producer Products</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Visibility controls and review context for every marketplace product.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="p-8 sm:p-12 text-center text-sm text-muted-foreground">
              No product listings have been created yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {products.map((product) => {
                const reviews = product.batch.reviews;
                const averageRating =
                  reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                    : 0;

                return (
                  <section key={product.id} className="grid gap-4 sm:gap-6 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 min-w-0">
                      <div className="size-20 sm:size-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="size-full object-cover" />
                        ) : (
                          <div className="grid size-full place-items-center text-xs font-semibold text-muted-foreground">No image</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="truncate text-base sm:text-xl font-bold">{product.name}</h2>
                              <Badge className={product.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}>
                                {product.isActive ? 'Active' : 'Hidden'}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                              {product.producer.businessName} · {product.batch.honeyType} · <span className="font-mono">{product.batch.batchCode}</span>
                            </p>
                          </div>
                          <form
                            action={async () => {
                              'use server';
                              await setAdminProductActive(product.id, !product.isActive);
                            }}
                          >
                            <Button variant="outline" size="sm" className="gap-2 w-fit text-xs">
                              {product.isActive ? <ToggleLeft className="size-4" /> : <ToggleRight className="size-4" />}
                              {product.isActive ? 'Hide listing' : 'Activate'}
                            </Button>
                          </form>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm sm:grid-cols-4">
                          <div className="rounded-xl border border-border bg-background p-2.5 sm:p-3">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Price</p>
                            <p className="font-bold text-sm sm:text-base">GH₵{product.price.toFixed(2)}</p>
                          </div>
                          <div className="rounded-xl border border-border bg-background p-2.5 sm:p-3">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Stock</p>
                            <p className="font-bold text-sm sm:text-base truncate">{product.stock} {product.unit}</p>
                          </div>
                          <div className="rounded-xl border border-border bg-background p-2.5 sm:p-3">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Orders</p>
                            <p className="font-bold text-sm sm:text-base">{product._count.orderItems}</p>
                          </div>
                          <div className="rounded-xl border border-border bg-background p-2.5 sm:p-3">
                            <p className="text-[10px] sm:text-xs text-muted-foreground">Rating</p>
                            <p className="font-bold text-sm sm:text-base">{averageRating.toFixed(1)} / 5</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link href={`/shop/${product.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1.5 sm:gap-2 text-xs">
                              <ExternalLink className="size-3.5 sm:size-4" />
                              Product page
                            </Button>
                          </Link>
                          <Link href={`/admin/batches/${product.batchId}`}>
                            <Button variant="ghost" size="sm" className="gap-1.5 sm:gap-2 text-xs">
                              <ShieldCheck className="size-3.5 sm:size-4" />
                              Batch audit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-border bg-muted/20 p-4">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold">Buyer Review Text</h3>
                          <p className="text-xs text-muted-foreground">{reviews.length} review{reviews.length === 1 ? '' : 's'} for this product</p>
                        </div>
                        <MessageSquareText className="size-4 text-primary" />
                      </div>

                      {reviews.length === 0 ? (
                        <p className="rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                          No buyer reviews have been submitted for this product yet.
                        </p>
                      ) : (
                        <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
                          {reviews.map((review) => (
                            <article key={review.id} className="rounded-md border border-border bg-background p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold">{review.user.name}</p>
                                  <p className="text-xs text-muted-foreground">{review.user.email}</p>
                                </div>
                                <div className="flex shrink-0 gap-0.5">
                                  {[...Array(5)].map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`size-3.5 ${index < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                              <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                {review.verified && <span className="text-emerald-600">Verified buyer</span>}
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
