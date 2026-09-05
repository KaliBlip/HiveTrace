'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, ShieldAlert, Loader2, Sparkles, Check, X, Phone } from 'lucide-react';
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
    const phone = (p.phoneNumber || p.user?.phoneNumber || '').toLowerCase();
    const loc = p.location?.toLowerCase() || '';
    return name.includes(term) || email.includes(term) || phone.includes(term) || loc.includes(term);
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold uppercase italic tracking-tighter">
            PRODUCER <span className="text-primary not-italic tracking-tight">MANAGEMENT</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg mt-1">Vet, approve, and audit honey producers on the HiveTrace platform</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or location..."
            className="pl-10 sm:pl-12 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-card border-border/50 text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main List */}
      <Card className="border-border rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm">
        <CardHeader className="p-4 sm:p-6 lg:p-8 border-b border-border bg-muted/30">
          <CardTitle className="text-lg sm:text-2xl font-heading uppercase tracking-tight">Registered Producers</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {loading ? 'Fetching records...' : `Total of ${filteredProducers.length} producers matching filters`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 lg:p-8">
          {loading ? (
            <div className="py-12 sm:py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
              <p className="text-sm sm:text-base">Loading producer data...</p>
            </div>
          ) : filteredProducers.length === 0 ? (
            <div className="py-12 sm:py-20 text-center border border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-muted-foreground flex flex-col items-center justify-center gap-3 sm:gap-4">
              <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/30" />
              <p className="text-base sm:text-lg font-bold">No producers found</p>
              <p className="text-xs sm:text-sm max-w-sm">No registered producer matches your search query or has signed up yet.</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredProducers.map((producer) => (
                <div
                  key={producer.id}
                  className="border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-muted/20 hover:border-primary/30 transition-all group flex flex-col gap-4 sm:gap-6"
                >
                  <div className="space-y-2.5 sm:space-y-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-xl font-heading font-bold uppercase tracking-tight">{producer.businessName}</h3>
                      <Badge className={`rounded-full px-2.5 sm:px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none ${getStatusBadgeColor(producer.status)}`}>
                        {producer.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 sm:gap-x-6 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/60 shrink-0" />
                        <span className="truncate">{producer.location || 'Location not specified'}</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="font-mono text-[11px] sm:text-xs truncate max-w-[180px]">{producer.user?.email}</span>
                      {(producer.phoneNumber || producer.user?.phoneNumber) && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-1 font-mono text-[11px] sm:text-xs text-foreground font-semibold">
                            <Phone className="w-3 h-3 text-primary shrink-0" />
                            {producer.phoneNumber || producer.user?.phoneNumber}
                          </span>
                        </>
                      )}
                      <span className="hidden sm:inline">•</span>
                      <span className="text-[11px] sm:text-sm">Joined {new Date(producer.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Stats & Trust */}
                    <div className="flex flex-wrap gap-4 sm:gap-6 pt-1 sm:pt-2 text-xs">
                      <div>
                        <span className="text-muted-foreground/60 block uppercase font-bold">Batches</span>
                        <span className="font-bold text-sm sm:text-base text-foreground">{producer._count?.batches || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground/60 block uppercase font-bold">Rating</span>
                        <span className="font-bold text-sm sm:text-base text-foreground flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-primary text-primary shrink-0" />
                          {producer.ratings?.averageRating?.toFixed(1) || '0.0'} 
                          <span className="text-muted-foreground font-normal text-[10px] sm:text-xs">({producer.ratings?.totalReviews || 0})</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground/60 block uppercase font-bold">Trust</span>
                        <span className="font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400">{producer.ratings?.trustScore || 100}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
                    {producer.status === 'PENDING' && (
                      <>
                        <Button 
                          size="default" 
                          className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold px-4 sm:px-6"
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
                          size="default" 
                          variant="outline"
                          className="flex-1 sm:flex-initial border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800 dark:hover:bg-rose-950/30 rounded-xl gap-2 font-bold px-4 sm:px-6"
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
                        size="default" 
                        variant="outline"
                        className="flex-1 sm:flex-initial rounded-xl gap-2 font-bold px-4 sm:px-6"
                        onClick={() => handleApprove(producer.id)}
                        disabled={actioningId !== null}
                      >
                        Re-Approve
                      </Button>
                    )}
                    {producer.status === 'APPROVED' && (
                      <Button 
                        size="default" 
                        variant="outline"
                        className="flex-1 sm:flex-initial border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800 dark:hover:bg-rose-950/30 rounded-xl gap-2 font-bold px-4 sm:px-6"
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
