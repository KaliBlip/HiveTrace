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
    qrScans: 0, // Placeholder until we count actual scans
    createdAt: batch.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Honey Batches</h1>
          <p className="text-muted-foreground">Manage and track your verified honey batches</p>
        </div>
        <Link href="/dashboard/batches/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />
            Create Batch
          </Button>
        </Link>
      </div>

      {/* Batches List */}
      <BatchList batches={formattedBatches as any} />
    </div>
  );
}
