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
    <div className="max-w-[1440px] mx-auto p-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-8 border-b border-border/50">
        <div className="space-y-2">
          <h1 className="text-5xl font-heading font-bold tracking-tighter uppercase italic">
            Honey <span className="text-primary not-italic tracking-tight">Batches</span>
          </h1>
          <p className="text-stone-500 font-normal text-xl leading-relaxed">Manage and track your verified honey production batches</p>
        </div>
        <Link href="/dashboard/batches/new">
          <Button className="rounded-full h-14 px-8 font-bold shadow-xl shadow-primary/20 gap-3 text-lg transition-all hover:scale-105 active:scale-95">
            <Plus className="w-5 h-5" />
            Create Batch
          </Button>
        </Link>
      </div>

      {/* Batches List */}
      <BatchList batches={formattedBatches as any} />
    </div>
  );
}
