import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  ExternalLink,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { getConsumerOrders } from '@/lib/actions/consumer-actions';
import { ConsumerHeader } from '@/components/consumer/header';
import { Footer } from '@/components/footer';

export default async function ConsumerOrdersPage() {
  const orders = await getConsumerOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'PAID': return <CheckCircle2 className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'DELIVERED': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-500/25';
      case 'PAID': return 'bg-blue-500/10 text-blue-600 border-blue-500/25';
      case 'SHIPPED': return 'bg-purple-500/10 text-purple-600 border-purple-500/25';
      case 'DELIVERED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Calculate sum totals for summary cards
  const totalAmountSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalJarsCount = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <ConsumerHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-32 space-y-12 flex-grow">
          
          {/* Header Title */}
          <div className="space-y-2 md:max-w-xl">
            <Badge className="rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Purchasing Records
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              My Honey Ledger
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Track the status, payment details, and cryptographic provenance of your honey purchases.
            </p>
          </div>

          {/* Stats Bar */}
          {orders.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
              <div className="glass-panel border rounded-xl p-4.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Total Orders</span>
                <span className="font-heading text-3xl font-bold block mt-1">{orders.length}</span>
              </div>
              <div className="glass-panel border rounded-xl p-4.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Total Amount</span>
                <span className="font-heading text-3xl font-bold text-primary block mt-1">
                  GH₵{totalAmountSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="glass-panel border rounded-xl p-4.5 col-span-2 md:col-span-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Jars Purchased</span>
                <span className="font-heading text-3xl font-bold block mt-1">{totalJarsCount} items</span>
              </div>
            </div>
          )}

          {/* Orders Listing */}
          <div className="space-y-8">
            {orders.map((order) => (
              <Card key={order.id} className="border-border overflow-hidden glass-panel shadow-[var(--shadow-soft)]">
                {/* Order Meta Header */}
                <CardHeader className="bg-muted/20 border-b border-border/60 p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Order ID</p>
                        <p className="font-mono font-semibold text-foreground mt-0.5">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Date Placed</p>
                        <p className="font-semibold text-foreground mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Order Value</p>
                        <p className="font-bold text-primary mt-0.5">
                          GH₵{order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Badge variant="outline" className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {/* Order Details Body */}
                <CardContent className="p-5 sm:p-6">
                  <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
                    
                    {/* Item Details */}
                    <div className="space-y-6 divide-y divide-border/40">
                      {order.items.map((item, idx) => (
                        <div key={item.id} className={`flex gap-4 ${idx > 0 ? 'pt-6' : ''}`}>
                          
                          {/* Image */}
                          <div className="w-20 h-20 bg-muted/40 border rounded-xl overflow-hidden shrink-0">
                            {item.product?.imageUrl ? (
                              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1587334206516-951e046a5ef0?q=80&w=300')] bg-cover bg-center" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <h3 className="font-bold text-sm text-foreground truncate">{item.product?.name || 'Deleted Product'}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Unit Price: GH₵{item.priceAtPurchase.toLocaleString(undefined, { minimumFractionDigits: 2 })} • Qty: {item.quantity}
                              </p>
                            </div>

                            {/* Batch code indicator */}
                            {item.product?.batch && (
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground mt-2">
                                <Lock className="size-3 text-primary shrink-0" />
                                <span>Batch: {item.product.batch.batchCode}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Link (Desktop Purity Audit) */}
                          {item.product?.batch && (
                            <div className="hidden sm:flex flex-col justify-center items-end shrink-0 pl-4">
                              <Link href={`/verify/${(item.product.batch as any).verificationHash || item.product.batch.id}`}>
                                <Button size="sm" variant="outline" className="text-xs gap-1.5 h-9 rounded-lg hover:border-primary/45">
                                  Trace Provenance
                                  <ExternalLink className="size-3 text-muted-foreground" />
                                </Button>
                              </Link>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>

                    {/* Right Side: Logistical Ledger Detail */}
                    <div className="rounded-xl border border-border/40 bg-muted/10 p-5 space-y-4 text-xs">
                      <h4 className="font-heading font-semibold uppercase tracking-wider text-foreground text-xs pb-2 border-b border-border/40 flex items-center gap-2">
                        <ShieldCheck className="size-4 text-primary" />
                        Ledger Verification Stamp
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-muted-foreground uppercase">GATEWAY STATUS</span>
                          <span className="text-emerald-500 font-bold">SECURE & SETTLED</span>
                        </div>
                        
                        {order.paymentId && (
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-muted-foreground block uppercase">TRANSACTION REF</span>
                            <span className="font-mono text-foreground select-all break-all">{order.paymentId}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-border/40 space-y-2">
                          <span className="text-[10px] font-mono text-muted-foreground block uppercase">SHIPPING DESTINATION</span>
                          <p className="text-muted-foreground leading-relaxed">
                            {order.shippingAddress || 'No shipping address provided.'}
                          </p>
                        </div>
                      </div>

                      {/* Mobile Purity Audit Links */}
                      <div className="sm:hidden pt-4 border-t border-border/40 space-y-2">
                        {order.items.map((item) => (
                          item.product?.batch && (
                            <Link key={item.id} href={`/verify/${(item.product.batch as any).verificationHash || item.product.batch.id}`} className="block">
                              <Button size="sm" variant="outline" className="w-full text-xs gap-1.5 justify-center rounded-lg hover:border-primary/45 py-2">
                                Audit {item.product.name.slice(0, 16)}...
                                <ExternalLink className="size-3" />
                              </Button>
                            </Link>
                          )
                        ))}
                      </div>

                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}

            {orders.length === 0 && (
              <Card className="border-border p-16 text-center space-y-6 max-w-xl mx-auto glass-panel">
                <div className="relative mx-auto size-20 rounded-full border border-dashed border-border bg-muted/20 flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-2xl uppercase italic text-foreground">No purchases logged</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    You have not placed any orders yet. Explore our verified marketplace to make your first purchase.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/shop">
                    <Button className="h-12 rounded-xl px-8 font-semibold">Start Shopping</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
