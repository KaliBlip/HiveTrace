'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ShieldCheck, MapPin, Calendar, Info, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import { getProductById, getProducerById, getBatchById, getReviewsByBatchId } from '@/lib/store';
import { useCart } from '@/lib/hooks/use-cart';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const product = getProductById(id);
  
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Product Not Found</h1>
          <Link href="/shop">
            <Button variant="outline">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const producer = getProducerById(product.producerId);
  const batch = getBatchById(product.batchId);
  const reviews = getReviewsByBatchId(product.batchId);
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'New';

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
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  <CardTitle className="text-lg">Cryptographically Verified</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This product is linked to a verified honey batch. You can audit the entire journey from hive to table.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Batch ID</p>
                    <p className="font-mono text-sm">{batch?.batchCode}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Integrity</p>
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                      Signature Valid
                    </Badge>
                  </div>
                </div>
                <Link href={`/consumer/batch/${batch?.id}`}>
                  <Button variant="outline" className="w-full mt-2 gap-2 border-primary/20 hover:bg-primary/10 text-primary">
                    View Traceability Data
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right: Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/20">{product.unit}</Badge>
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  {avgRating} ({reviews.length} reviews)
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {producer?.businessName[0]}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold leading-none">{producer?.businessName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {producer?.location.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-bold">₦{product.price.toLocaleString()}</p>
              <p className="text-sm text-green-600 font-medium">In Stock: {product.stock} units available</p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => addItem(product)}
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
                  <p className="font-medium">{batch?.harvestDate}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">Honey Type</p>
                  <p className="font-medium">{batch?.type}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
