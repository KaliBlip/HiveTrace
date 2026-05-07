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
      <section className="relative overflow-hidden bg-[#1c1917] text-white pt-40 pb-24 px-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=2000')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1c1917]"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-[0.2em]">
            Premium Selection
          </Badge>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
            THE HONEY <span className="text-primary italic">RESERVE</span>
          </h1>
          <p className="text-xl text-muted-foreground/70 max-w-2xl mx-auto font-medium">
            Discover the world's most authentic, cryptographically verified honey batches directly from artisan beekeepers.
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wider">Verified</p>
                <p className="text-xs text-muted-foreground">Blockchain signed</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wider">100% Pure</p>
                <p className="text-xs text-muted-foreground">No additives</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wider">Direct</p>
                <p className="text-xs text-muted-foreground">From the apiary</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Gem className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wider">Quality</p>
                <p className="text-xs text-muted-foreground">A-Grade testing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        {/* Navigation & Search */}
        <div className="flex flex-col lg:flex-row gap-6 items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black uppercase tracking-tight">Marketplace</h2>
            <p className="text-muted-foreground font-medium">{filtered.length} curated batches available</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                placeholder="Search variety, producer..."
                className="pl-12 h-14 bg-background border-input rounded-xl text-lg font-medium focus:ring-primary shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-14 px-6 rounded-xl border-2 border-border font-bold gap-2 hover:bg-accent">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filtered.map((product) => (
            <div key={product.id} className="group relative flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500">
              {/* Image Section */}
              <Link href={`/shop/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-secondary">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary">
                    <span className="text-6xl grayscale opacity-20">🍯</span>
                  </div>
                )}
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-background/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-primary border-none shadow-sm py-1">
                    Verified Batch
                  </Badge>
                  {product.stock < 10 && (
                    <Badge variant="destructive" className="text-[10px] font-black uppercase tracking-widest py-1 border-none">
                      Low Stock
                    </Badge>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <div className="rounded-full w-12 h-12 bg-card text-foreground shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div className="space-y-1">
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <MapPin className="w-3 h-3" />
                    {product.producerName}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                  <span className="text-xs font-black ml-1">5.0</span>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description || "Premium honey harvested with care, meeting the highest standards of purity and taste."}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black text-foreground leading-none">GH₵{product.price.toLocaleString()}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mt-1">Per {product.unit}</p>
                  </div>
                  <Button
                    onClick={() => addItem(product as any)}
                    className="bg-foreground hover:bg-primary text-primary-foreground rounded-xl px-5 h-12 font-bold shadow-lg transition-all active:scale-95"
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
          <div className="text-center py-32 space-y-6 bg-card rounded-3xl border-2 border-dashed border-border">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground/50">
              <Search className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">No results found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                We couldn't find any batches matching "{searchQuery}". Try different keywords or browse all producers.
              </p>
            </div>
            <Button onClick={() => setSearchQuery('')} variant="link" className="font-black uppercase tracking-widest text-primary">
              Clear All Searches
            </Button>
          </div>
        )}
      </div>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 mt-12 pb-24">
        <div className="bg-foreground rounded-[2.5rem] p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-0"></div>

          <div className="flex-1 space-y-6 relative z-10 text-center lg:text-left">
            <Badge className="bg-background/10 text-background border-background/20">Artisan Spotlight</Badge>
            <h2 className="text-4xl lg:text-6xl font-black text-background leading-none tracking-tighter">
              BEE THE <span className="text-primary">CHANGE</span>
            </h2>
            <p className="text-muted-foreground/70 text-lg max-w-lg font-medium">
              Every purchase directly supports our network of independent beekeepers and global bee conservation efforts.
            </p>
            <Button className="bg-background text-foreground hover:bg-primary hover:text-primary-foreground h-14 px-8 rounded-xl font-bold text-lg">
              Our Mission
            </Button>
          </div>
          
          <div className="flex-1 relative z-10">
            <div className="aspect-video lg:aspect-square bg-[url('https://images.unsplash.com/photo-1558583055-d7ac00b1adca?q=80&w=1000')] bg-cover bg-center rounded-3xl shadow-2xl rotate-3"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
