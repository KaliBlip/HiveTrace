import { getProductById } from '@/lib/actions/product-actions';
import { ProductDetailClient } from '@/components/shop/product-detail-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

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

  const serialized = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    unit: product.unit,
    stock: product.stock,
    imageUrl: product.imageUrl,
    isActive: product.isActive,
    batchId: product.batchId,
    producerId: product.producerId,
    createdAt: product.createdAt.toISOString(),
    producerName: product.producer?.businessName || product.producer?.user?.name || 'Unknown',
    producerLocation: typeof product.producer?.location === 'object' 
      ? (product.producer.location as any)?.address || 'Unknown Location'
      : 'Unknown Location',
    batchCode: product.batch?.batchCode || '',
    batchHarvestDate: product.batch?.harvestDate?.toISOString() || '',
    honeyType: product.batch?.honeyType || '',
    verified: product.batch?.verified || false,
  };

  return <ProductDetailClient product={serialized} />;
}
