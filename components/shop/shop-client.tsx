'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ShoppingCart, 
  Filter, 
  ShieldCheck, 
  Leaf, 
  Truck, 
  Gem, 
  Star,
  MapPin,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.producerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#1c1917] text-white pt-48 pb-24 px-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=2000')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1c1917]"></div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] relative z-10">
          <div className="mx-auto w-full text-center" style={{ maxWidth: "980px" }}>
            <div className="flex justify-center">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                Premium Selection
              </Badge>
            </div>
            <h1 className="mt-6 text-6xl md:text-8xl lg:text-[100px] font-heading font-bold tracking-[-0.03em] leading-[0.9] uppercase italic">
              THE HONEY <span className="text-primary not-italic tracking-tight">RESERVE</span>
            </h1>
            <div
              className="mx-auto mt-8 text-xl md:text-2xl text-stone-400 font-normal leading-relaxed"
              style={{ width: "100%", maxWidth: "760px", whiteSpace: "normal" }}
            >
              Discover the world's most authentic, cryptographically verified honey batches directly from artisan beekeepers.
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-card border-y border-border/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: ShieldCheck, title: "Verified", sub: "Blockchain signed" },
              { icon: Leaf, title: "100% Pure", sub: "No additives" },
              { icon: Truck, title: "Direct", sub: "From the apiary" },
              { icon: Gem, title: "Quality", sub: "A-Grade testing" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-heading font-bold uppercase tracking-tight">{item.title}</p>
                  <p className="text-xs text-stone-500 font-normal">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] py-20 space-y-16">
        {/* Navigation & Search */}
        <div className="flex flex-col lg:flex-row gap-8 items-end justify-between">
          <div className="space-y-3">
            <h2 className="text-4xl font-heading font-bold uppercase italic tracking-tight leading-none">Marketplace</h2>
            <p className="text-stone-500 font-normal text-lg">{filtered.length} curated batches available</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-[400px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <Input
                placeholder="Search variety, producer..."
                className="pl-14 h-16 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-16 px-8 rounded-2xl border-2 border-border/50 font-bold gap-3 hover:bg-primary hover:text-white hover:border-primary transition-all">
              <Filter className="w-5 h-5" /> Filters
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {filtered.map((product) => (
            <div key={product.id} className="group relative w-full min-w-0 flex flex-col h-full bg-card rounded-[32px] overflow-hidden border border-border/40 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Image Section */}
              <Link href={`/shop/${product.id}`} className="relative aspect-square overflow-hidden bg-stone-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                    <span className="text-6xl grayscale opacity-20">🍯</span>
                  </div>
                )}
                
                {/* Floating Tags */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <Badge className="bg-background/90 backdrop-blur text-[10px] font-bold uppercase tracking-[0.1em] text-primary border-none shadow-sm py-1.5 px-3 rounded-full">
                    Verified Batch
                  </Badge>
                  {product.stock < 10 && (
                    <Badge variant="destructive" className="text-[10px] font-bold uppercase tracking-[0.1em] py-1.5 px-3 border-none rounded-full">
                      Low Stock
                    </Badge>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="rounded-full w-14 h-14 bg-white text-stone-900 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                    <ChevronRight className="w-7 h-7" />
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="w-full min-w-0 p-6 flex-1 flex flex-col space-y-4">
                <div className="w-full min-w-0 space-y-2">
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="w-full min-w-0 break-words text-xl font-heading font-bold tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="w-full min-w-0 flex items-center gap-2 text-sm text-stone-500 font-normal">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{product.producerName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-sm font-bold ml-1 text-stone-900">5.0</span>
                </div>

                <div className="w-full min-w-0 flex-1">
                  <p className="w-full min-w-0 text-base text-stone-500 font-normal line-clamp-2 leading-relaxed">
                    {product.description || "Premium honey harvested with care, meeting the highest standards of purity and taste."}
                  </p>
                </div>

                <div className="w-full min-w-0 pt-4 border-t border-border/50 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xl font-heading font-bold text-stone-900 leading-none">GH₵{product.price.toLocaleString()}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-2 ml-0.5">Per {product.unit}</p>
                  </div>
                  <Button
                    onClick={() => addItem(product as any)}
                    className="shrink-0 rounded-full px-5 h-12 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-32 space-y-8 bg-card rounded-[40px] border-2 border-dashed border-border/50">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-300">
              <Search className="w-10 h-10" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-heading font-bold uppercase tracking-tight">No results found</h3>
              <p className="text-stone-500 text-lg font-normal max-w-sm mx-auto leading-relaxed">
                We couldn't find any batches matching "{searchQuery}". Try different keywords or browse all producers.
              </p>
            </div>
            <Button onClick={() => setSearchQuery('')} variant="link" className="font-bold uppercase tracking-widest text-primary text-sm">
              Clear All Searches
            </Button>
          </div>
        )}
      </div>

      {/* Mission Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] mt-12 pb-24">
        <div className="bg-[#1c1917] rounded-[48px] p-10 lg:p-20 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative text-white">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-0"></div>

          <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
            <Badge className="bg-white/10 text-white border-white/20 px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">Artisan Spotlight</Badge>
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-heading font-bold leading-[0.9] tracking-tighter uppercase italic">
              BEE THE <span className="text-primary not-italic tracking-tight">CHANGE</span>
            </h2>
            <div
              className="text-stone-400 text-xl font-normal leading-relaxed mx-auto lg:mx-0"
              style={{
                display: "block",
                width: "min(100%, 680px)",
                maxWidth: "680px",
                whiteSpace: "normal",
                writingMode: "horizontal-tb",
                textOrientation: "mixed",
              }}
            >
              Every purchase directly supports our network of independent beekeepers and global bee conservation efforts.
            </div>
            <Button className="bg-white text-stone-900 hover:bg-primary hover:text-white h-16 px-10 rounded-full font-bold text-lg transition-all">
              Our Mission
            </Button>
          </div>
          
          <div className="flex-1 relative z-10 w-full lg:w-auto">
            <div className="aspect-video lg:aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1558583055-d7ac00b1adca?q=80&w=1000')] bg-cover bg-center rounded-[32px] shadow-2xl rotate-2 scale-105"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
