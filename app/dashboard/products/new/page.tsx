'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getBatchById } from '@/lib/store';

function NewProductForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const batchId = searchParams.get('batchId');
  const batch = batchId ? getBatchById(batchId) : null;

  const [formData, setFormData] = useState({
    name: batch ? `Pure ${batch.type} Honey` : '',
    price: '',
    stock: '',
    description: batch ? `A premium batch of ${batch.type} honey, harvested on ${batch.harvestDate}. Cryptographically verified for authenticity.` : '',
    unit: '500g Jar',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/products');
      }, 2000);
    }, 1500);
  };

  if (!batchId || !batch) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h2 className="text-2xl font-bold">No Batch Selected</h2>
        <p className="text-muted-foreground">You must select a verified honey batch to create a product listing.</p>
        <Link href="/dashboard/batches">
          <Button>View My Batches</Button>
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Product Listed Successfully!</h2>
        <p className="text-muted-foreground">Your honey is now available in the HiveTrace marketplace.</p>
        <p className="text-sm">Redirecting to products management...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link href="/dashboard/batches" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Batches
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">List for Sale</h1>
        <p className="text-muted-foreground">Create a marketplace listing for batch <strong>{batch.batchCode}</strong></p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Enter the details for your marketplace listing</CardDescription>
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
                <label className="text-sm font-medium">Price (₦)</label>
                <Input 
                  type="number"
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
              <label className="text-sm font-medium">Initial Stock (Units)</label>
              <Input 
                type="number"
                value={formData.stock} 
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="e.g. 100" 
                required 
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Listing...' : 'List Product in Marketplace'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewProductForm />
    </Suspense>
  );
}
