'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star } from 'lucide-react';

export default function AdminProducersPage() {
  const producers = [
    {
      id: 1,
      name: 'Golden Valley Apiaries',
      location: 'California',
      batches: 24,
      rating: 4.8,
      reviews: 128,
      status: 'verified',
      joinDate: '2022-01-15',
    },
    {
      id: 2,
      name: 'Sunny Apiary',
      location: 'Texas',
      batches: 18,
      rating: 4.6,
      reviews: 95,
      status: 'verified',
      joinDate: '2022-06-20',
    },
    {
      id: 3,
      name: 'Hillside Honey Co',
      location: 'Oregon',
      batches: 0,
      rating: 0,
      reviews: 0,
      status: 'pending',
      joinDate: '2024-05-01',
    },
    {
      id: 4,
      name: 'Crystal Clear Apiaries',
      location: 'Vermont',
      batches: 0,
      rating: 0,
      reviews: 0,
      status: 'pending',
      joinDate: '2024-04-28',
    },
    {
      id: 5,
      name: 'Urban Bee Keepers',
      location: 'New York',
      batches: 12,
      rating: 4.9,
      reviews: 67,
      status: 'flagged',
      joinDate: '2023-03-10',
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'flagged':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold">Producers</h1>
          <p className="text-muted-foreground">Manage and verify honey producers</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search producers by name or location..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Producers Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Producers</CardTitle>
          <CardDescription>Total of {producers.length} producers on platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {producers.map((producer) => (
              <div
                key={producer.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold">{producer.name}</h3>
                      <Badge className={getStatusBadgeColor(producer.status)}>
                        {producer.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {producer.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Member since</p>
                    <p className="font-semibold">{producer.joinDate}</p>
                  </div>
                </div>

                {producer.status === 'verified' && (
                  <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Batches</p>
                      <p className="font-bold">{producer.batches}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-semibold">{producer.rating}</span>
                      <span className="text-sm text-muted-foreground">({producer.reviews})</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {producer.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
