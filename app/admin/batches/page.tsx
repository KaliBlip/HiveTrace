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
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold uppercase italic tracking-tighter">
            HONEY <span className="text-primary not-italic tracking-tight">BATCH AUDITS</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg mt-1">Verify quality, audit lab results, and sign honey batches to the blockchain</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <Input
            placeholder="Search by batch, producer, or type..."
            className="pl-10 sm:pl-12 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-card border-border/50 text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-border rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm">
        <CardHeader className="p-4 sm:p-6 lg:p-8 border-b border-border bg-muted/30">
          <CardTitle className="text-lg sm:text-2xl font-heading uppercase tracking-tight">All Batches</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {loading ? 'Accessing cryptographic ledger...' : `Total of ${filteredBatches.length} batches logged on platform`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-4 lg:p-8">
          {loading ? (
            <div className="py-12 sm:py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
              <p className="text-sm sm:text-base">Fetching batches...</p>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="py-12 sm:py-20 text-center border border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-12 m-3 sm:m-0 text-muted-foreground flex flex-col items-center justify-center gap-3 sm:gap-4">
              <Box className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/30" />
              <p className="text-base sm:text-lg font-bold">No batches found</p>
              <p className="text-xs sm:text-sm max-w-sm">No batches have been registered yet, or none match the search parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-0">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Batch ID</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Producer</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Type</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Quantity</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Harvest Date</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Price</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Status</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-foreground">
                  {filteredBatches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="py-4 sm:py-5 px-3 sm:px-4 font-mono text-xs font-semibold">{batch.batchCode}</td>
                      <td className="py-4 sm:py-5 px-3 sm:px-4 font-semibold text-sm">{batch.producer?.businessName}</td>
                      <td className="py-4 sm:py-5 px-3 sm:px-4 text-sm">{batch.honeyType}</td>
                      <td className="py-4 sm:py-5 px-3 sm:px-4 font-bold text-sm">{batch.quantity} <span className="text-muted-foreground font-normal">kg</span></td>
                      <td className="py-4 sm:py-5 px-3 sm:px-4 text-sm text-muted-foreground">{new Date(batch.harvestDate).toLocaleDateString()}</td>
                      <td className="py-4 sm:py-5 px-3 sm:px-4 font-semibold text-sm">GH₵{batch.price?.toFixed(2) || 'N/A'}</td>
                      <td className="py-4 sm:py-5 px-3 sm:px-4">
                        {batch.verified ? (
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-none rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" /> Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-none rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                            <ShieldAlert className="w-3 h-3 mr-1 text-amber-600 dark:text-amber-400 animate-pulse" /> Pending
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 sm:py-5 px-3 sm:px-4 text-right">
                        <Link href={`/admin/batches/${batch.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="font-bold rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors gap-1.5 sm:gap-2 text-xs sm:text-sm"
                          >
                            <span className="hidden sm:inline">Inspect & Verify</span>
                            <span className="sm:hidden">View</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
