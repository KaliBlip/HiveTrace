"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, Loader2, Calendar, Weight, QrCode, ArrowUpRight } from "lucide-react";
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
  hasActiveProduct?: boolean;
  productId?: string | null;
}

interface BatchListProps {
  batches?: Batch[];
  isLoading?: boolean;
}

export function BatchList({ batches, isLoading }: BatchListProps) {
  const displayBatches = batches;

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl sm:rounded-3xl lg:rounded-[40px] border border-border/50 p-8 sm:p-14 lg:p-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-normal text-sm sm:text-base">Loading batches...</p>
        </div>
      </div>
    );
  }

  if (!displayBatches || displayBatches.length === 0) {
    return (
      <div className="bg-card rounded-2xl sm:rounded-3xl lg:rounded-[40px] border border-border/50 p-6 sm:p-12 lg:p-20 text-center space-y-6 sm:space-y-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground/50">
          <Box className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-tight">No batches yet</h3>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg font-normal max-w-sm mx-auto leading-relaxed">
            You haven't registered any honey batches yet. Start by creating your first cryptographically signed batch.
          </p>
        </div>
        <Link href="/dashboard/batches/new" className="inline-block w-full sm:w-auto">
          <Button className="w-full sm:w-auto rounded-full h-12 sm:h-14 px-6 sm:px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105">
            Create Your First Batch
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl lg:rounded-[40px] border border-border/50 overflow-hidden shadow-sm">
      {/* Card Header */}
      <div className="p-4 sm:p-6 lg:p-10 border-b border-border/50 bg-muted/30">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold uppercase tracking-tight">Your Honey Batches</h2>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-normal mt-0.5 sm:mt-1">
          Manage and track all your honey batches ({displayBatches.length})
        </p>
      </div>

      {/* Mobile Card List View (visible on < md) */}
      <div className="block md:hidden divide-y divide-border/40">
        {displayBatches.map((batch) => {
          const formattedDate = new Date(batch.harvestDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          return (
            <div key={batch.id} className="p-4 sm:p-5 space-y-4 hover:bg-muted/20 transition-colors">
              {/* Batch Header: Icon, Name & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-base shrink-0">
                    {batch.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-base text-foreground truncate">{batch.name}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 shrink-0" />
                      {formattedDate}
                    </p>
                  </div>
                </div>

                <Badge className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none shrink-0",
                  batch.status === "verified" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : 
                  batch.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" : 
                  "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                )}>
                  {batch.status}
                </Badge>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-2 bg-muted/40 rounded-xl p-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Weight className="w-3 h-3" /> Quantity
                  </span>
                  <p className="font-bold text-foreground text-sm">
                    {batch.quantity} <span className="text-muted-foreground font-normal text-xs">{batch.unit}</span>
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <QrCode className="w-3 h-3" /> QR Scans
                  </span>
                  <p className="font-heading font-bold text-foreground text-sm">
                    {batch.qrScans}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Link href={`/dashboard/batches/${batch.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-9 rounded-xl font-bold text-xs gap-1">
                    View Details
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                {batch.status === "verified" && (
                  batch.hasActiveProduct ? (
                    <Link href={`/dashboard/products/${batch.productId}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full h-9 rounded-xl border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white text-xs font-bold">
                        Edit Listing
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/dashboard/products/new?batchId=${batch.id}`} className="flex-1">
                      <Button size="sm" className="w-full h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold">
                        List for Sale
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (visible on md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/20 border-b border-border/40">
              <th className="text-left py-4 lg:py-5 px-4 lg:px-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Honey Type
              </th>
              <th className="text-left py-4 lg:py-5 px-4 lg:px-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Harvest Date
              </th>
              <th className="text-left py-4 lg:py-5 px-4 lg:px-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Quantity
              </th>
              <th className="text-left py-4 lg:py-5 px-4 lg:px-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Status
              </th>
              <th className="text-left py-4 lg:py-5 px-4 lg:px-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                QR Scans
              </th>
              <th className="text-right py-4 lg:py-5 px-4 lg:px-8 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
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
                <td className="py-5 lg:py-6 px-4 lg:px-8">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-sm lg:text-base shrink-0">
                      {batch.name.charAt(0)}
                    </div>
                    <p className="font-heading font-bold text-base lg:text-lg group-hover:text-primary transition-colors truncate max-w-[180px] lg:max-w-none">{batch.name}</p>
                  </div>
                </td>
                <td className="py-5 lg:py-6 px-4 lg:px-8">
                  <p className="text-muted-foreground font-normal text-xs lg:text-sm">
                    {new Date(batch.harvestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </td>
                <td className="py-5 lg:py-6 px-4 lg:px-8">
                  <p className="font-bold text-foreground text-sm lg:text-base">
                    {batch.quantity} <span className="text-muted-foreground font-normal text-xs lg:text-sm">{batch.unit}</span>
                  </p>
                </td>
                <td className="py-5 lg:py-6 px-4 lg:px-8">
                  <Badge className={cn(
                    "rounded-full px-3 lg:px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-none",
                    batch.status === "verified" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : 
                    batch.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" : 
                    "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                  )}>
                    {batch.status}
                  </Badge>
                </td>
                <td className="py-5 lg:py-6 px-4 lg:px-8">
                  <p className="font-heading font-bold text-base lg:text-xl">{batch.qrScans}</p>
                </td>
                <td className="py-5 lg:py-6 px-4 lg:px-8 text-right">
                  <div className="flex justify-end gap-2 lg:gap-3">
                    <Link href={`/dashboard/batches/${batch.id}`}>
                      <Button variant="ghost" size="sm" className="font-bold rounded-full hover:bg-primary/5 hover:text-primary h-9 lg:h-10 px-3.5 lg:px-5 text-xs lg:text-sm">
                        View
                      </Button>
                    </Link>
                    {batch.status === "verified" && (
                      batch.hasActiveProduct ? (
                        <Link href={`/dashboard/products/${batch.productId}/edit`}>
                          <Button variant="outline" size="sm" className="rounded-full border-green-500/20 text-green-600 hover:bg-green-600 hover:text-white h-9 lg:h-10 px-3.5 lg:px-5 font-bold text-xs lg:text-sm">
                            Edit Listing
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/dashboard/products/new?batchId=${batch.id}`}>
                          <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white h-9 lg:h-10 px-3.5 lg:px-5 font-bold text-xs lg:text-sm">
                            List for Sale
                          </Button>
                        </Link>
                      )
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
