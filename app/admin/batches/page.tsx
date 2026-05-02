'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminBatchesPage() {
  const batches = [
    {
      id: 'HT-2024-GVA-001',
      producer: 'Golden Valley Apiaries',
      type: 'Wildflower Blend',
      quantity: '50 kg',
      harvestDate: '2024-05-01',
      verified: true,
      scans: 234,
    },
    {
      id: 'HT-2024-SAP-023',
      producer: 'Sunny Apiary',
      type: 'Clover Premium',
      quantity: '75 kg',
      harvestDate: '2024-06-15',
      verified: true,
      scans: 189,
    },
    {
      id: 'HT-2024-HFS-089',
      producer: 'Hillside Farms',
      type: 'Spring Collection',
      quantity: '100 kg',
      harvestDate: '2024-04-10',
      verified: false,
      scans: 12,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold">All Batches</h1>
          <p className="text-muted-foreground">Monitor all honey batches across the platform</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by batch ID, producer, or type..."
            className="pl-10"
          />
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Batches</CardTitle>
          <CardDescription>Total of {batches.length} batches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Batch ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Producer</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold">Harvest Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Scans</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 font-mono text-xs">{batch.id}</td>
                    <td className="py-4 px-4">{batch.producer}</td>
                    <td className="py-4 px-4">{batch.type}</td>
                    <td className="py-4 px-4">{batch.quantity}</td>
                    <td className="py-4 px-4">{batch.harvestDate}</td>
                    <td className="py-4 px-4">{batch.scans}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        batch.verified
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {batch.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
