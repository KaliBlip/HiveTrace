import { getAllActiveProducts } from '@/lib/actions/product-actions';
import { ShopClient } from '@/components/shop/shop-client';

export default async function ShopPage() {
  const products = await getAllActiveProducts();

  // Serialize for client component
  const serialized = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || '',
    price: p.price,
    unit: p.unit,
    stock: p.stock,
    imageUrl: p.imageUrl,
    isActive: p.isActive,
    batchId: p.batchId,
    producerId: p.producerId,
    createdAt: p.createdAt.toISOString(),
    producerName: p.producer?.businessName || p.producer?.user?.name || 'Unknown Producer',
  }));

  return <ShopClient products={serialized} />;
}
