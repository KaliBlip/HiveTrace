'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getProductById, updateProduct } from '@/lib/actions/product-actions';
import { toast } from 'sonner';

function EditProductForm() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    unit: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProductById(id);
        if (product) {
          setFormData({
            name: product.name,
            price: product.price.toString(),
            stock: product.stock.toString(),
            description: product.description,
            unit: product.unit,
            imageUrl: product.imageUrl || '',
            isActive: product.isActive,
          });
        } else {
          toast.error('Product not found');
          router.push('/dashboard/products');
        }
      } catch (error) {
        toast.error('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProduct(id, {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        unit: formData.unit,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
      });

      toast.success('Product updated successfully!');
      router.push('/dashboard/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link href="/dashboard/products" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update your marketplace listing details</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Modify the information for your marketplace listing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Pure Wildflower Honey"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (GH₵)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  placeholder="e.g. 500g Jar"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Current Stock (Units)</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="e.g. 100"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/honey.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your honey..."
                className="min-h-32"
                required
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProductForm />
    </Suspense>
  );
}
