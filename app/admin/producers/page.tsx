'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, ShieldAlert, Loader2, Sparkles, Check, X } from 'lucide-react';
import { getAllProducers, approveProducer, rejectProducer } from '@/lib/actions/admin-actions';
import { toast } from 'sonner';

export default function AdminProducersPage() {
  const [producers, setProducers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchProducers = async () => {
    try {
      const data = await getAllProducers();
      setProducers(data);
    } catch (err) {
      toast.error('Failed to load producers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducers();
  }, []);

  const handleApprove = async (id: string) => {
    setActioningId(id);
    try {
      await approveProducer(id);
      toast.success('Producer approved successfully!');
      await fetchProducers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve producer');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    try {
      await rejectProducer(id);
      toast.success('Producer account rejected');
      await fetchProducers();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject producer');
    } finally {
      setActioningId(null);
    }
  };

  const filteredProducers = producers.filter((p) => {
    const term = searchQuery.toLowerCase();
    const name = p.businessName?.toLowerCase() || '';
    const email = p.user?.email?.toLowerCase() || '';
    const loc = p.location?.toLowerCase() || '';
    return name.includes(term) || email.includes(term) || loc.includes(term);
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400';
      default:
        return 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-5xl font-heading font-bold uppercase italic tracking-tighter">
            PRODUCER <span className="text-primary not-italic tracking-tight">MANAGEMENT</span>
          </h1>
          <p className="text-muted-foreground text-lg">Vet, approve, and audit honey producers on the HiveTrace platform</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by business name, email, or location..."
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main List */}
      <Card className="border-border rounded-[32px] overflow-hidden shadow-sm">
        <CardHeader className="p-8 border-b border-border bg-stone-50/50">
          <CardTitle className="text-2xl font-heading uppercase tracking-tight">Registered Producers</CardTitle>
          <CardDescription>
            {loading ? 'Fetching records...' : `Total of ${filteredProducers.length} producers matching filters`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p>Loading producer data...</p>
            </div>
          ) : filteredProducers.length === 0 ? (
            <div className="py-20 text-center border border-dashed rounded-3xl p-12 text-muted-foreground flex flex-col items-center justify-center gap-4">
              <ShieldAlert className="w-12 h-12 text-stone-300" />
              <p className="text-lg font-bold">No producers found</p>
              <p className="text-sm max-w-sm">No registered producer matches your search query or has signed up yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProducers.map((producer) => (
                <div
                  key={producer.id}
                  className="border border-border/50 rounded-3xl p-6 hover:bg-stone-50/20 hover:border-primary/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-heading font-bold uppercase tracking-tight">{producer.businessName}</h3>
                      <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none ${getStatusBadgeColor(producer.status)}`}>
                        {producer.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-stone-400" />
                        {producer.location}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-xs">{producer.user?.email}</span>
                      <span>•</span>
                      <span>Joined {new Date(producer.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Stats & Trust */}
                    <div className="flex gap-6 pt-2 text-xs">
                      <div>
                        <span className="text-stone-400 block uppercase font-bold">Batches</span>
                        <span className="font-bold text-base text-stone-800">{producer._count?.batches || 0}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block uppercase font-bold">Reputation Rating</span>
                        <span className="font-bold text-base text-stone-800 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                          {producer.ratings?.averageRating?.toFixed(1) || '0.0'} 
                          <span className="text-stone-400 font-normal">({producer.ratings?.totalReviews || 0} reviews)</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block uppercase font-bold">Trust Score</span>
                        <span className="font-bold text-base text-emerald-600">{producer.ratings?.trustScore || 100}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col lg:flex-row gap-3 shrink-0">
                    {producer.status === 'PENDING' && (
                      <>
                        <Button 
                          size="lg" 
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold px-6"
                          onClick={() => handleApprove(producer.id)}
                          disabled={actioningId !== null}
                        >
                          {actioningId === producer.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Approve
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl gap-2 font-bold px-6"
                          onClick={() => handleReject(producer.id)}
                          disabled={actioningId !== null}
                        >
                          {actioningId === producer.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Reject
                        </Button>
                      </>
                    )}
                    {producer.status === 'REJECTED' && (
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="flex-1 rounded-xl gap-2 font-bold px-6"
                        onClick={() => handleApprove(producer.id)}
                        disabled={actioningId !== null}
                      >
                        Re-Approve
                      </Button>
                    )}
                    {producer.status === 'APPROVED' && (
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl gap-2 font-bold px-6"
                        onClick={() => handleReject(producer.id)}
                        disabled={actioningId !== null}
                      >
                        Revoke Approval
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
