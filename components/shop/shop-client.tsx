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
              className="motion-rise group overflow-hidden rounded-xl border border-border/60 bg-card/72 shadow-[var(--shadow-soft)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
            >
              <Link href={`/shop/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=1200')] bg-cover bg-center" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-transparent opacity-80" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <Badge className="rounded-full bg-background/86 text-foreground backdrop-blur">Verified</Badge>
                  {product.stock < 10 && (
                    <Badge variant="destructive" className="rounded-full">Low stock</Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Batch listing</p>
                    <p className="mt-1 line-clamp-1 font-heading text-2xl font-semibold">{product.name}</p>
                  </div>
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                    <ShoppingCart className="size-5" />
                  </span>
                </div>
              </Link>

              <div className="space-y-5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    <span className="truncate">{product.producerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="size-4 fill-current" />
                    <span className="text-sm font-semibold text-foreground">5.0</span>
                  </div>
                </div>

                <p className="line-clamp-2 min-h-14 leading-7 text-muted-foreground">
                  {product.description || 'Traceable honey listed from a registered HiveTrace batch.'}
                </p>

                <div className="flex items-end justify-between gap-3 border-t border-border/60 pt-5">
                  <div>
                    <p className="font-heading text-3xl font-semibold tracking-tight">GH₵{product.price.toLocaleString()}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Per {product.unit}</p>
                  </div>
                  <Button onClick={() => addItem(product)} className="gap-2">
                    <ShoppingCart className="size-4" />
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
