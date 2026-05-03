'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ShieldCheck, MapPin, Calendar, Info, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/use-cart';

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
  batchHarvestDate: string;
  honeyType: string;
  verified: boolean;
}

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/shop" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl bg-muted overflow-hidden border border-border">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                  No Image
                </div>
              )}
            </div>

            {/* Batch Trust Card */}
            <Card className="border-primary/20 bg-primary/5">
              <div className="p-6 pb-2">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <CardTitle className="text-lg">Cryptographically Verified</CardTitle>
                </div>
              </div>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This product is linked to a verified honey batch. You can audit the entire journey from hive to table.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Batch ID</p>
                    <p className="font-mono text-sm">{product.batchCode}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Integrity</p>
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                      {product.verified ? 'Signature Valid' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/20">{product.unit}</Badge>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {product.producerName[0]}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold leading-none">{product.producerName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {product.producerLocation}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-bold">GH₵{product.price.toLocaleString()}</p>
              <p className="text-sm text-green-600 font-medium">In Stock: {product.stock} units available</p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={() => addItem(product as any)}
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </Button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Harvested</p>
                  <p className="font-medium">
                    {product.batchHarvestDate ? new Date(product.batchHarvestDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Honey Type</p>
                  <p className="font-medium">{product.honeyType || 'Mixed'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
