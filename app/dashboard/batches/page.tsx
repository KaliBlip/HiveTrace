import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BatchList } from '@/components/dashboard/batch-list';
import { getProducerBatches } from '@/lib/actions/batch-actions';

export default async function BatchesPage() {
  const batches = await getProducerBatches();

  // Map database model to component props
  const formattedBatches = batches.map(batch => ({
    id: batch.id,
    name: batch.honeyType,
    harvestDate: batch.harvestDate.toISOString(),
    quantity: batch.quantity,
    unit: 'kg',
    status: batch.verified ? "verified" : "pending",
    qrScans: batch.scanCount,
    createdAt: batch.createdAt.toISOString(),
    hasActiveProduct: batch.product ? batch.product.isActive : false,
    productId: batch.product ? batch.product.id : null,
  }));

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:p-12 space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-border/50">
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tighter uppercase italic leading-tight">
            Honey <span className="text-primary not-italic tracking-tight">Batches</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 font-normal text-sm sm:text-base lg:text-xl leading-relaxed">
            Manage and track your verified honey production batches
          </p>
        </div>
        <Link href="/dashboard/batches/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto rounded-full h-11 sm:h-14 px-6 sm:px-8 font-bold shadow-lg shadow-primary/20 gap-2.5 text-sm sm:text-base lg:text-lg transition-all hover:scale-105 active:scale-95 justify-center">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Create Batch
          </Button>
        </Link>
      </div>

      {/* Batches List */}
      <BatchList batches={formattedBatches as any} />
    </div>
  );
}
