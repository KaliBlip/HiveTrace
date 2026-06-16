'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Box, Loader2, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { getAllBatches } from '@/lib/actions/admin-actions';
import { toast } from 'sonner';

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllBatches();
        setBatches(data);
      } catch (err) {
        toast.error('Failed to load honey batches');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBatches = batches.filter((batch) => {
    const term = searchQuery.toLowerCase();
    const code = batch.batchCode?.toLowerCase() || '';
    const type = batch.honeyType?.toLowerCase() || '';
    const producer = batch.producer?.businessName?.toLowerCase() || '';
    return code.includes(term) || type.includes(term) || producer.includes(term);
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-5xl font-heading font-bold uppercase italic tracking-tighter">
            HONEY <span className="text-primary not-italic tracking-tight">BATCH AUDITS</span>
          </h1>
          <p className="text-muted-foreground text-lg">Verify quality, audit lab results, and sign honey batches to the blockchain</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by batch code, producer, or honey type..."
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-border rounded-[32px] overflow-hidden shadow-sm">
        <CardHeader className="p-8 border-b border-border bg-stone-50/50">
          <CardTitle className="text-2xl font-heading uppercase tracking-tight">All Batches</CardTitle>
          <CardDescription>
            {loading ? 'Accessing cryptographic ledger...' : `Total of ${filteredBatches.length} batches logged on platform`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p>Fetching batches...</p>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="py-20 text-center border border-dashed rounded-3xl p-12 text-muted-foreground flex flex-col items-center justify-center gap-4">
              <Box className="w-12 h-12 text-stone-300" />
              <p className="text-lg font-bold">No batches found</p>
              <p className="text-sm max-w-sm">No batches have been registered yet, or none match the search parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-stone-400 text-xs font-bold uppercase tracking-widest">
                    <th className="py-4 px-4">Batch ID</th>
                    <th className="py-4 px-4">Producer</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4">Quantity</th>
                    <th className="py-4 px-4">Harvest Date</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-stone-700">
                  {filteredBatches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-stone-50/40 transition-colors group">
                      <td className="py-5 px-4 font-mono text-xs font-semibold">{batch.batchCode}</td>
                      <td className="py-5 px-4 font-semibold">{batch.producer?.businessName}</td>
                      <td className="py-5 px-4">{batch.honeyType}</td>
                      <td className="py-5 px-4 font-bold">{batch.quantity} <span className="text-stone-400 font-normal">kg</span></td>
                      <td className="py-5 px-4 text-sm text-stone-500">{new Date(batch.harvestDate).toLocaleDateString()}</td>
                      <td className="py-5 px-4 font-semibold text-stone-850">GH₵{batch.price?.toFixed(2) || 'N/A'}</td>
                      <td className="py-5 px-4">
                        {batch.verified ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-none rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-none rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                            <ShieldAlert className="w-3 h-3 mr-1 text-amber-600 animate-pulse" /> Pending
                          </Badge>
                        )}
                      </td>
                      <td className="py-5 px-4 text-right">
                        <Link href={`/admin/batches/${batch.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="font-bold rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors gap-2"
                          >
                            Inspect & Verify
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
