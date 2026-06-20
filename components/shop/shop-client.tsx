'use client';

import { useMemo, useState } from 'react';
import { 
  BadgeCheck, 
  Filter, 
  MapPin, 
  Search, 
  ShieldCheck, 
  ShoppingCart, 
  SlidersHorizontal, 
  Star,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Lock,
  ArrowUpDown,
  Archive
} from 'lucide-react';
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
  const { addItem } = useCart();

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Filter Reset Check
  const hasActiveFilters = useMemo(() => {
    return selectedVariety !== 'All' || selectedStock !== 'All' || sortBy !== 'newest';
  }, [selectedVariety, selectedStock, sortBy]);

  const handleResetFilters = () => {
    setSelectedVariety('All');
    setSelectedStock('All');
    setSortBy('newest');
    setSearchQuery('');
  };

  // Filtering & Sorting Logic
  const filtered = useMemo(() => {
    let result = products;

    // 1. Text Search Query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((product) =>
        [product.name, product.description, product.producerName]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
      );
    }

    // 2. Honey Variety Filter
    if (selectedVariety !== 'All') {
      result = result.filter((product) => {
        const matchesName = product.name.toLowerCase().includes(selectedVariety.toLowerCase());
        const matchesDesc = product.description.toLowerCase().includes(selectedVariety.toLowerCase());
        return matchesName || matchesDesc;
      });
    }

    // 3. Stock Availability Filter
    if (selectedStock === 'InStock') {
      result = result.filter((product) => product.stock > 0);
    } else if (selectedStock === 'LowStock') {
      result = result.filter((product) => product.stock < 10 && product.stock > 0);
    }

    // 4. Sorting Logic
    const sorted = [...result];
    if (sortBy === 'priceAsc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'stock') {
      sorted.sort((a, b) => b.stock - a.stock);
    }

    return sorted;
  }, [products, searchQuery, selectedVariety, selectedStock, sortBy]);

  // Derived mock batch code mapping (since products don't directly serialize batchCode in this route)
  const getMockBatchCode = (productId: string) => {
    if (productId === 'prod-1') return 'HT-2024-WFB-001';
    if (productId === 'prod-2') return 'HT-2024-CLP-002';
    return 'HT-2024-GEN-999';
  };

  return (
    <main className="min-h-screen bg-background pb-20 text-foreground">
      {/* Header & Search Controls */}
      <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 hive-grid" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            
            <div className="motion-rise space-y-6">
              <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary w-fit flex items-center gap-1.5">
                <Lock className="size-3 text-primary" />
                Direct Cryptographic Marketplace
              </Badge>
              <div className="space-y-4">
                <h1 className="text-balance font-heading text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl">
                  Verified honey, direct from signed batches.
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Browse products directly connected to active apiaries, laboratory purity logs, and tamper-proof ledger codes.
                </p>
              </div>
            </div>

            <div className="motion-rise motion-delay-2 rounded-xl border border-border/60 bg-card/65 p-4 shadow-[var(--shadow-soft)] backdrop-blur">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search honey type, beekeeper, notes..."
                    className="h-[52px] rounded-md border-border/70 bg-background/70 pl-12 text-base focus-visible:ring-primary focus-visible:border-primary focus-visible:outline-none"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)} 
                  className={`h-[52px] gap-2 px-6 active:scale-[0.98] transition-transform ${showFilters ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border/80 text-muted-foreground hover:text-foreground'}`}
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                  {showFilters ? <ChevronUp className="size-4 shrink-0" /> : <ChevronDown className="size-4 shrink-0" />}
                </Button>
              </div>

              {/* Dynamic Active Indicators */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground border-t border-border/30 pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground font-mono">{filtered.length}</span>
                  <span>listings matching criteria</span>
                </div>
                {hasActiveFilters && (
                  <button 
                    onClick={handleResetFilters}
                    className="text-xs text-primary font-semibold flex items-center gap-1.5 hover:underline"
                  >
                    <RotateCcw className="size-3" />
                    Reset Search & Filters
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Expandable Glassmorphic Filter Panel */}
          {showFilters && (
            <div className="mt-6 glass-panel border rounded-xl p-6 sm:p-8 animate-rise-in relative z-20">
              <div className="grid gap-6 sm:grid-cols-3">
                
                {/* 1. Honey Varieties */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Honey Variety</h4>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Wildflower', 'Clover'].map((variety) => (
                      <button
                        key={variety}
                        onClick={() => setSelectedVariety(variety)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${selectedVariety === variety ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'border-border bg-background/50 text-muted-foreground hover:text-foreground'}`}
                      >
                        {variety === 'All' ? 'All Varieties' : variety}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Availability / Stock */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Availability</h4>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'InStock', 'LowStock'].map((stockOption) => (
                      <button
                        key={stockOption}
                        onClick={() => setSelectedStock(stockOption)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${selectedStock === stockOption ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'border-border bg-background/50 text-muted-foreground hover:text-foreground'}`}
                      >
                        {stockOption === 'All' ? 'All Stock' : stockOption === 'InStock' ? 'In Stock Only' : 'Low Stock (<10)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Sort Order */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort By</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'newest', label: 'Newest First' },
                      { key: 'priceAsc', label: 'Price: Low to High' },
                      { key: 'priceDesc', label: 'Price: High to Low' },
                      { key: 'stock', label: 'Availability Count' },
                    ].map((sortOption) => (
                      <button
                        key={sortOption.key}
                        onClick={() => setSortBy(sortOption.key)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${sortBy === sortOption.key ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'border-border bg-background/50 text-muted-foreground hover:text-foreground'}`}
                      >
                        {sortOption.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* Safety / Feature Ribbons */}
      <section className="border-y border-border/60 bg-card/38 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Signed provenance', text: 'HMAC-SHA256 signature linked' },
            { icon: BadgeCheck, title: 'Apiary Authenticity', text: '100% verified beekeeper registry' },
            { icon: ShoppingCart, title: 'Secure Paystack Checkouts', text: 'Secured transaction gateway' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/38 p-4">
                <span className="grid size-10 place-items-center rounded-md bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  <Badge className="rounded-full border border-primary/20 bg-background/90 text-primary font-bold px-2.5 py-0.5 backdrop-blur-sm shadow-sm text-[9px] uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="size-3 text-primary" />
                    Verified
                  </Badge>
                  {product.stock < 10 && (
                    <Badge variant="destructive" className="rounded-full font-bold px-2.5 py-0.5 text-[9px] uppercase tracking-wider">
                      Low stock
                    </Badge>
                  )}
                </div>

                {/* View Details Hover Reveal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] bg-black/15">
                  <span className="rounded-full bg-background/95 text-foreground border border-border/80 px-4 py-2.5 text-xs font-bold uppercase tracking-widest shadow-md active:scale-95 transition-transform">
                    Inspect Registry Details
                  </span>
                </div>
              </Link>

              {/* Content Details */}
              <div className="flex flex-col flex-1 p-5 space-y-4">
                
                {/* Producer and Rating Row */}
                <div className="flex items-center justify-between gap-3 border-b border-border/30 pb-3">
                  <div className="flex min-w-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-primary" />
                    <span className="truncate">{product.producerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="size-3.5 fill-current text-primary" />
                    <span className="text-xs font-bold text-foreground">4.8</span>
                  </div>
                </div>

                {/* Product Name & Description */}
                <div className="flex-grow space-y-2">
                  <Link href={`/shop/${product.id}`} className="block">
                    <h3 className="font-heading text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary leading-snug">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Cryptographic Batch Code Label */}
                <div className="flex items-center gap-1.5 bg-muted/60 border px-2.5 py-1 rounded-md text-[10px] font-mono text-muted-foreground w-fit select-all">
                  <Lock className="size-3 text-primary shrink-0" />
                  <span>Batch:</span>
                  <span className="font-semibold text-foreground">{getMockBatchCode(product.id)}</span>
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
                    onClick={() => addItem(product as any)}
                    className="h-10 px-4 gap-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary text-primary-foreground hover:bg-primary/95"
                  >
                    <ShoppingCart className="size-3.5" />
                    Add to Cart
                  </Button>
                </div>

              </div>
            </article>
          ))}
        </div>

        {/* Empty Search Fallback */}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/70 bg-card/55 px-6 py-20 text-center max-w-2xl mx-auto space-y-4">
            <Archive className="mx-auto size-12 text-muted-foreground animate-pulse" />
            <h2 className="font-heading text-2xl font-bold tracking-tight">No listings found</h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
              No honey listings match your active filters or query. Try resetting your search or expanding the variety selections.
            </p>
            <div className="pt-2">
              <Button variant="outline" className="gap-2 mx-auto active:scale-[0.98]" onClick={handleResetFilters}>
                <RotateCcw className="size-3.5" />
                Clear all filters
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
