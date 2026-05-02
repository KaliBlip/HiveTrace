"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function BatchList({ batches, isLoading }: BatchListProps) {
  // Demo data
  const demoData: Batch[] = [
    {
      id: "1",
      name: "Wildflower Blend 2024",
      harvestDate: "2024-04-15",
      quantity: 50,
      unit: "kg",
      status: "verified",
      qrScans: 234,
      createdAt: "2024-05-01",
    },
    {
      id: "2",
      name: "Clover Premium",
      harvestDate: "2024-03-20",
      quantity: 75,
      unit: "kg",
      status: "verified",
      qrScans: 189,
      createdAt: "2024-04-10",
    },
    {
      id: "3",
      name: "Spring Collection",
      harvestDate: "2024-02-28",
      quantity: 100,
      unit: "kg",
      status: "pending",
      qrScans: 412,
      createdAt: "2024-03-15",
    },
    {
      id: "4",
      name: "Heritage Blend",
      harvestDate: "2024-01-10",
      quantity: 60,
      unit: "kg",
      status: "verified",
      qrScans: 567,
      createdAt: "2024-02-01",
    },
  ];

  const displayBatches = batches;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading batches...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!displayBatches || displayBatches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">No batches yet</p>
            <Link href="/dashboard/batches/new">
              <Button>Create Your First Batch</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Honey Batches</CardTitle>
        <CardDescription>
          Manage and track all your honey batches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                  Harvest Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                  QR Scans
                </th>
                <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {displayBatches.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <p className="font-medium">{batch.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-muted-foreground">
                      {new Date(batch.harvestDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm">
                      {batch.quantity} {batch.unit}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(batch.status)}>
                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium">{batch.qrScans}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/batches/${batch.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      {batch.status === "verified" && (
                        <Link href={`/dashboard/products/new?batchId=${batch.id}`}>
                          <Button variant="outline" size="sm" className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
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
      </CardContent>
    </Card>
  );
}
