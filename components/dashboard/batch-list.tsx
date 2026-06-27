"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, Loader2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Batch {
  id: string;
  name: string;
  harvestDate: string;
  quantity: number;
  unit: string;
  status: "verified" | "pending" | "rejected";
  qrScans: number;
  createdAt: string;
}

interface BatchListProps {
  batches?: Batch[];
  isLoading?: boolean;
}

export function BatchList({ batches, isLoading }: BatchListProps) {
  const displayBatches = batches;

  if (isLoading) {
    return (
      <div className="bg-card rounded-[40px] border border-border/50 p-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-normal">Loading batches...</p>
        </div>
      </div>
    );
  }

  if (!displayBatches || displayBatches.length === 0) {
    return (
      <div className="bg-card rounded-[40px] border border-border/50 p-20 text-center space-y-8">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground/50">
          <Box className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-heading font-bold uppercase tracking-tight">No batches yet</h3>
          <p className="text-muted-foreground text-lg font-normal max-w-sm mx-auto leading-relaxed">
            You haven't registered any honey batches yet. Start by creating your first cryptographically signed batch.
          </p>
        </div>
        <Link href="/dashboard/batches/new" className="inline-block">
          <Button className="rounded-full h-14 px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105">
            Create Your First Batch
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[40px] border border-border/50 overflow-hidden shadow-sm">
      <div className="p-10 border-b border-border/50 bg-muted/30">
        <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">Your Honey Batches</h2>
        <p className="text-muted-foreground font-normal mt-1">Manage and track all your honey batches</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/20">
              <th className="text-left py-6 px-10 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Honey Type
              </th>
              <th className="text-left py-6 px-10 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Harvest Date
              </th>
              <th className="text-left py-6 px-10 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Quantity
              </th>
              <th className="text-left py-6 px-10 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Status
              </th>
              <th className="text-left py-6 px-10 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                QR Scans
              </th>
              <th className="text-right py-6 px-10 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {displayBatches.map((batch) => (
              <tr
                key={batch.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="py-8 px-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-heading font-bold">
                      {batch.name.charAt(0)}
                    </div>
                    <p className="font-heading font-bold text-lg group-hover:text-primary transition-colors">{batch.name}</p>
                  </div>
                </td>
                <td className="py-8 px-10">
                  <p className="text-muted-foreground font-normal">
                    {new Date(batch.harvestDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </td>
                <td className="py-8 px-10">
                  <p className="font-bold text-foreground">
                    {batch.quantity} <span className="text-muted-foreground font-normal">{batch.unit}</span>
                  </p>
                </td>
                <td className="py-8 px-10">
                  <Badge className={cn(
                    "rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-none",
                    batch.status === "verified" ? "bg-emerald-100 text-emerald-700" : 
                    batch.status === "pending" ? "bg-amber-100 text-amber-700" : 
                    "bg-rose-100 text-rose-700"
                  )}>
                    {batch.status}
                  </Badge>
                </td>
                <td className="py-8 px-10">
                  <p className="font-heading font-bold text-xl">{batch.qrScans}</p>
                </td>
                <td className="py-8 px-10 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/dashboard/batches/${batch.id}`}>
                      <Button variant="ghost" size="sm" className="font-bold rounded-full hover:bg-primary/5 hover:text-primary h-10 px-5">
                        View
                      </Button>
                    </Link>
                    {batch.status === "verified" && (
                      <Link href={`/dashboard/products/new?batchId=${batch.id}`}>
                        <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white h-10 px-5 font-bold">
                          List for Sale
                        </Button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
