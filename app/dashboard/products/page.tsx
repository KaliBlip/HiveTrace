import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getProducerProducts } from '@/lib/actions/product-actions';
import { DeleteProductButton } from '@/components/dashboard/delete-product-button';

export default async function ProducerProductsPage() {
  const products = await getProducerProducts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Your Products</h1>
          <p className="text-muted-foreground">Manage your honey listings in the marketplace</p>
        </div>
        <Link href="/dashboard/batches">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />
            New Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="border-border overflow-hidden group">
            <div className="aspect-square bg-muted relative">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>₦{product.price.toLocaleString()} / {product.unit}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-medium">{product.stock} units</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Link href={`/shop/${product.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Preview
                  </Button>
                </Link>
                <DeleteProductButton productId={product.id} />
              </div>
            </CardContent>
          </Card>
        ))}

        {products.length === 0 && (
          <Card className="col-span-full border-dashed border-2 flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven&apos;t listed any products yet.</p>
            <Link href="/dashboard/batches">
              <Button variant="outline">Browse Batches to List</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
