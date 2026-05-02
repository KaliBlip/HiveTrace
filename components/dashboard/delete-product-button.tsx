'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteProduct } from '@/lib/actions/product-actions';
import { useState } from 'react';

export function DeleteProductButton({ productId }: { productId: string }) {
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    setPending(true);
    try {
      await deleteProduct(productId);
    } catch {
      alert('Failed to delete product');
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
      onClick={handleDelete}
      disabled={pending}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
