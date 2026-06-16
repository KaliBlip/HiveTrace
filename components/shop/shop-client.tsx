'use client';

import { useMemo, useState } from 'react';
import { BadgeCheck, Filter, MapPin, Search, ShieldCheck, ShoppingCart, SlidersHorizontal, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/hooks/use-cart';

interface ShopProduct {
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
}

export function ShopClient({ products }: { products: ShopProduct[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.description, product.producerName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [products, searchQuery]);

  return (
    <main className="min-h-screen bg-background pb-20 text-foreground">
      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 hive-grid" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div className="motion-rise space-y-6">
            <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Marketplace
            </Badge>
            <div className="space-y-4">
              <h1 className="text-balance font-heading text-5xl font-semibold leading-[0.9] tracking-[-0.03em] sm:text-7xl">
                Verified honey, direct from signed batches.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Browse products that are attached to producer accounts, batch records, and traceable verification data.
              </p>
            </div>
          </div>

          <div className="motion-rise motion-delay-2 rounded-xl border border-border/60 bg-card/65 p-4 shadow-[var(--shadow-soft)] backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search honey type, producer, notes..."
                  className="h-[52px] rounded-md border-border/70 bg-background/70 pl-12 text-base"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="size-4" />
                Sort
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span>
              <span>active listings</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <span>all products are batch-linked</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/38 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Signed origin', text: 'HMAC-backed batch records' },
            { icon: BadgeCheck, title: 'Producer linked', text: 'Verified shop ownership' },
            { icon: ShoppingCart, title: 'Paystack ready', text: 'Checkout flow included' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/38 p-4">
                <span className="grid size-10 place-items-center rounded-md bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, index) => (
            <article
              key={product.id}
              className="motion-rise group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/60 shadow-[var(--shadow-soft)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
              style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
            >
              {/* Image Container */}
              <Link href={`/shop/${product.id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-muted">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=1200')] bg-cover bg-center" />
                )}
                {/* Subtle Image Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Badges on Top */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <Badge className="rounded-full border border-primary/20 bg-background/90 text-foreground font-semibold px-2.5 py-0.5 backdrop-blur-sm shadow-sm text-[10px] uppercase tracking-wider">
                    Verified
                  </Badge>
                  {product.stock < 10 && (
                    <Badge variant="destructive" className="rounded-full font-semibold px-2.5 py-0.5 text-[10px] uppercase tracking-wider">
                      Low stock
                    </Badge>
                  )}
                </div>

                {/* View Details Hover Reveal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] bg-black/10">
                  <span className="rounded-full bg-background/90 text-foreground border border-border/80 px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-md">
                    View Details
                  </span>
                </div>
              </Link>

              {/* Content Details */}
              <div className="flex flex-col flex-1 p-5 space-y-4">
                {/* Producer and Rating Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-primary" />
                    <span className="truncate">{product.producerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="size-3.5 fill-current" />
                    <span className="text-xs font-bold text-foreground">5.0</span>
                  </div>
                </div>

                {/* Product Name */}
                <div className="flex-grow min-h-[2.5rem]">
                  <Link href={`/shop/${product.id}`} className="block">
                    <h3 className="font-heading text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary leading-snug">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                {/* Price and Add Button Row */}
                <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-4 mt-auto">
                  <div className="space-y-0.5">
                    <p className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
                      GH₵{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Per {product.unit}
                    </p>
                  </div>
                  <Button
                    onClick={() => addItem(product)}
                    className="h-10 px-4 gap-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <ShoppingCart className="size-3.5" />
                    Add
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/70 bg-card/55 px-6 py-20 text-center">
            <Search className="mx-auto mb-5 size-10 text-muted-foreground" />
            <h2 className="font-heading text-3xl font-semibold tracking-tight">No listings found</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Try a producer name, honey type, or clear the search field to return to the full marketplace.
            </p>
            <Button className="mt-6" variant="outline" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
