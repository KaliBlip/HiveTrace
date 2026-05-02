'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Filter, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getAllProducts, getProducerById } from '@/lib/store';
import { useCart } from '@/lib/hooks/use-cart';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const products = getAllProducts().filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero / Header */}
      <div className="bg-primary/5 border-b border-border pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Verified Honey Marketplace</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse and buy 100% authentic honey directly from verified beekeepers. 
            Every jar is cryptographically signed.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by honey type, producer, or region..." 
              className="pl-12 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="py-6 px-6 gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const producer = getProducerById(product.producerId);
            return (
              <Card key={product.id} className="border-border group hover:shadow-xl transition-all duration-300 flex flex-col">
                <Link href={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                      No Image
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-white/90 backdrop-blur-sm text-primary border-primary/20 flex gap-1 items-center">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Batch
                    </Badge>
                  </div>
                </Link>
                <CardHeader className="p-5">
                  <div className="space-y-1">
                    <Link href={`/shop/${product.id}`}>
                      <CardTitle className="text-xl hover:text-primary transition-colors">{product.name}</CardTitle>
                    </Link>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      by <span className="font-medium text-foreground">{producer?.businessName}</span>
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pt-0 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="p-5 pt-0 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-2xl font-bold text-foreground">₦{product.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{product.unit}</p>
                  </div>
                  <Button 
                    onClick={() => addItem(product)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="text-4xl">🔍</div>
            <h3 className="text-2xl font-bold">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
