'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, ShieldCheck, ShieldAlert, Loader2, RefreshCw } from 'lucide-react';
import { getLedgerBlocks } from '@/lib/actions/admin-actions';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminLedgerPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadLedger = async () => {
    setLoading(true);
    try {
      const result = await getLedgerBlocks(100);
      setData(result);
    } catch {
      toast.error('Failed to load blockchain ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  if (loading && !data) {
    return (
      <div className="py-20 flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p>Loading verification ledger...</p>
      </div>
    );
  }

  const { blocks = [], stats, integrity } = data ?? {};

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Blockchain Ledger</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Immutable hash-chained record of all verified honey batches
          </p>
        </div>
        <Button variant="outline" onClick={loadLedger} disabled={loading} className="gap-2 w-fit">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Chain
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:pt-6 text-center">
            <p className="text-2xl sm:text-3xl font-black">{stats?.blockCount ?? 0}</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Total Blocks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:pt-6 text-center">
            <p className="text-2xl sm:text-3xl font-black">{stats?.batchBlocks ?? 0}</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Batch Records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:pt-6 text-center">
            <p className="text-2xl sm:text-3xl font-black">{stats?.fraudBlocks ?? 0}</p>
            <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Fraud Records</p>
          </CardContent>
        </Card>
        <Card className={integrity?.valid ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-900/10' : 'border-red-200 bg-red-50/50 dark:border-red-800/40 dark:bg-red-900/10'}>
          <CardContent className="p-4 sm:pt-6 text-center">
            <div className="flex items-center justify-center gap-2">
              {integrity?.valid ? (
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              )}
              <p className="text-base sm:text-lg font-black">{integrity?.valid ? 'Valid' : 'Invalid'}</p>
            </div>
            <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Chain Integrity</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Ledger Blocks
          </CardTitle>
          <CardDescription>
            Each block is cryptographically linked to the previous block, forming an auditable chain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {blocks.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No blocks registered yet. Approve a batch to create the first verification record.
            </p>
          ) : (
            blocks.map((block: any) =>                <div
                key={block.id}
                className="border border-border/60 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        #{block.index}
                      </Badge>
                      <Badge
                        className={
                          block.blockType === 'BATCH_VERIFY'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : block.blockType === 'GENESIS'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        }
                      >
                        {block.blockType.replace('_', ' ')}
                      </Badge>
                    </div>
                    {block.batch && (
                      <p className="font-semibold text-sm sm:text-base">
                        Batch: <span className="font-mono text-xs sm:text-sm">{block.batch.batchCode}</span>
                        {block.batch.honeyType && (
                          <span className="text-muted-foreground"> — {block.batch.honeyType}</span>
                        )}
                      </p>
                    )}
                    <code className="block text-[9px] sm:text-[10px] font-mono text-muted-foreground break-all bg-muted/50 p-1.5 sm:p-2 rounded-lg max-w-full sm:max-w-2xl">
                      {block.blockHash}
                    </code>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 text-xs text-muted-foreground shrink-0">
                    <p className="text-[11px] sm:text-xs">{new Date(block.createdAt).toLocaleString()}</p>
                    {block.batch?.batchCode && (
                      <Link href={`/verify/${block.batch.batchCode}`}>
                        <Button variant="ghost" size="sm" className="text-primary h-auto py-1">
                          Verify
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
