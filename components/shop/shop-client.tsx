'use client';

import { useMemo, useState } from 'react';
import {
  Archive,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  Lock,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const HONEY_VARIETIES = ['All', 'Wildflower', 'Clover', 'Acacia', 'Manuka', 'Raw'];
const STOCK_OPTIONS = [
  { key: 'All', label: 'All items' },
  { key: 'InStock', label: 'In stock' },
  { key: 'LowStock', label: 'Low stock' },
];
const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'priceAsc', label: 'Price: low to high' },
  { key: 'priceDesc', label: 'Price: high to low' },
  { key: 'stock', label: 'Most available' },
];

/* ─────────────────────────────────────────────────────── */
/* Minimal Product Card                                    */
/* ─────────────────────────────────────────────────────── */
function ProductCard({ product, index }: { product: ShopProduct; index: number }) {
  const { addItem } = useCart();
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <article
      className="group relative flex flex-col bg-card border border-border/60 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_32px_-8px_oklch(0.76_0.17_76/0.18)] motion-rise"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
    >
      {/* Image */}
      <Link href={`/shop/${product.id}`} className="relative block aspect-[5/4] overflow-hidden bg-muted shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=900')" }}
          />
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {isOutOfStock ? (
            <span className="rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/60 backdrop-blur-sm">
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              Only {product.stock} left
            </span>
          ) : (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 backdrop-blur-sm flex items-center gap-1">
              <ShieldCheck className="size-2.5" />
              Verified
            </span>
          )}
        </div>

        {/* Quick view hover */}
        <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-background/95 backdrop-blur-md border border-border/60 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground shadow-sm">
            View details <ChevronRight className="size-3" />
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Producer */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <MapPin className="size-3 shrink-0 text-primary" />
          <span className="truncate">{product.producerName}</span>
        </div>

        {/* Name */}
        <Link href={`/shop/${product.id}`} className="block">
          <h3 className="font-heading text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Footer: Price + CTA */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40 mt-auto">
          <div>
            <p className="font-heading text-xl font-extrabold tracking-tight text-foreground leading-none">
              GH₵{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
              per {product.unit}
            </p>
          </div>

          <button
            onClick={() => addItem(product as any)}
            disabled={isOutOfStock}
            className="grid size-10 place-items-center rounded-xl border border-border/70 bg-background text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────── */
/* Filter Chip                                             */
/* ─────────────────────────────────────────────────────── */
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        active
          ? 'bg-foreground text-background border-foreground shadow-sm'
          : 'border-border/70 bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────── */
/* Main ShopClient                                         */
/* ─────────────────────────────────────────────────────── */
export function ShopClient({ products }: { products: ShopProduct[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const hasActiveFilters = selectedVariety !== 'All' || selectedStock !== 'All' || sortBy !== 'newest' || searchQuery.trim() !== '';

  const handleReset = () => {
    setSelectedVariety('All');
    setSelectedStock('All');
    setSortBy('newest');
    setSearchQuery('');
  };

  const filtered = useMemo(() => {
    let result = products;

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((p) =>
        [p.name, p.description, p.producerName].filter(Boolean).some((v) => v.toLowerCase().includes(query))
      );
    }
    if (selectedVariety !== 'All') {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(selectedVariety.toLowerCase()) ||
          p.description.toLowerCase().includes(selectedVariety.toLowerCase())
      );
    }
    if (selectedStock === 'InStock') result = result.filter((p) => p.stock > 0);
    else if (selectedStock === 'LowStock') result = result.filter((p) => p.stock > 0 && p.stock < 10);

    const sorted = [...result];
    if (sortBy === 'priceAsc') sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceDesc') sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === 'stock') sorted.sort((a, b) => b.stock - a.stock);

    return sorted;
  }, [products, searchQuery, selectedVariety, selectedStock, sortBy]);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">

      {/* ── Hero Bar ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-card/40 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 hive-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="motion-rise space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              <Lock className="size-3" />
              Cryptographic Marketplace
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Verified Honey
            </h1>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              Every listing is signed and linked to a tamper-proof batch record — hive to doorstep.
            </p>
          </div>

          {/* Trust pills */}
          <div className="motion-rise motion-delay-2 flex flex-wrap gap-2">
            {[
              { icon: ShieldCheck, text: 'Signed provenance' },
              { icon: BadgeCheck, text: 'Verified beekeepers' },
              { icon: ShoppingCart, text: 'Secure checkout' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                <Icon className="size-3.5 text-primary" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Controls bar ─────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-border/50 bg-background/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center gap-3 py-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search honey, beekeeper…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 pr-4 rounded-xl border-border/70 bg-card/50 text-sm focus-visible:ring-primary focus-visible:border-primary"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-2 rounded-xl border px-4 h-10 text-xs font-semibold transition-all ${
              showFilterPanel || hasActiveFilters
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border/70 text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <SlidersHorizontal className="size-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && !showFilterPanel && (
              <span className="size-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold grid place-items-center">
                •
              </span>
            )}
            <ChevronDown className={`size-3.5 transition-transform ${showFilterPanel ? 'rotate-180' : ''}`} />
          </button>

          {/* Count + reset */}
          <span className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
            <span className="font-bold text-foreground font-mono">{filtered.length}</span>
            {filtered.length === 1 ? 'result' : 'results'}
          </span>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline whitespace-nowrap"
            >
              <RotateCcw className="size-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Filter Panel (inline dropdown) */}
        {showFilterPanel && (
          <div className="border-t border-border/40 py-4">
            <div className="mx-auto max-w-7xl grid gap-6 sm:grid-cols-3">
              {/* Variety */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Variety</p>
                <div className="flex flex-wrap gap-1.5">
                  {HONEY_VARIETIES.map((v) => (
                    <FilterChip
                      key={v}
                      label={v === 'All' ? 'All varieties' : v}
                      active={selectedVariety === v}
                      onClick={() => setSelectedVariety(v)}
                    />
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Availability</p>
                <div className="flex flex-wrap gap-1.5">
                  {STOCK_OPTIONS.map((o) => (
                    <FilterChip
                      key={o.key}
                      label={o.label}
                      active={selectedStock === o.key}
                      onClick={() => setSelectedStock(o.key)}
                    />
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Sort by</p>
                <div className="flex flex-wrap gap-1.5">
                  {SORT_OPTIONS.map((o) => (
                    <FilterChip
                      key={o.key}
                      label={o.label}
                      active={sortBy === o.key}
                      onClick={() => setSortBy(o.key)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Product Grid ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-sm py-24 text-center space-y-4">
            <div className="mx-auto size-14 rounded-2xl border border-border/60 bg-card grid place-items-center">
              <Archive className="size-6 text-muted-foreground" />
            </div>
            <h2 className="font-heading text-xl font-bold">No listings found</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No honey listings match your filters. Try adjusting your search or clearing the filters.
            </p>
            <Button variant="outline" className="gap-2 mt-2" onClick={handleReset}>
              <RotateCcw className="size-3.5" />
              Clear all filters
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
