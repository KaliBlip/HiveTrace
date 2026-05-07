'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { createBatch } from '@/lib/actions/batch-actions';
import { toast } from 'sonner';

export default function NewBatchPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    batchCode: '',
    honeyType: '',
    quantity: '',
    harvestDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    setFormData((prev) => {
      if (prev.batchCode) return prev;
      return {
        ...prev,
        batchCode: `HT-${new Date().getFullYear()}-${Math.random()
          .toString(36)
          .substring(2, 5)
          .toUpperCase()}`,
      };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createBatch({
        batchCode: formData.batchCode,
        honeyType: formData.honeyType,
        quantity: parseFloat(formData.quantity),
        harvestDate: new Date(formData.harvestDate),
        description: formData.description,
      });

      toast.success('Batch created and signed successfully!');
      router.push('/dashboard/batches');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto p-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/dashboard/batches" className="inline-flex items-center gap-3 text-stone-500 hover:text-primary font-bold group transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Batches
        </Link>

        <div className="space-y-4">
          <h1 className="text-5xl font-heading font-bold tracking-tighter uppercase italic">
            New Honey <span className="text-primary not-italic tracking-tight">Batch</span>
          </h1>
          <p className="text-stone-500 font-normal text-xl leading-relaxed">
            Register and cryptographically sign a new batch of honey to ensure absolute transparency and authenticity.
          </p>
        </div>

        <div className="bg-card rounded-[40px] border border-border/50 overflow-hidden shadow-2xl">
          <div className="p-10 bg-primary/5 border-b border-border/50 flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Save className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">Batch Information</h2>
              <p className="text-stone-500 font-normal">Enter the core data for authenticity verification</p>
            </div>
          </div>
          
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label htmlFor="batchCode" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Batch Code</Label>
                  <Input 
                    id="batchCode" 
                    value={formData.batchCode} 
                    onChange={(e) => setFormData({...formData, batchCode: e.target.value})}
                    className="h-16 font-mono bg-stone-50/50 border-border/50 rounded-2xl text-lg focus:ring-primary"
                    readOnly 
                  />
                  <p className="text-[10px] text-stone-400 font-normal italic ml-1">Auto-generated for cryptographic uniqueness</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="honeyType" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Honey Type</Label>
                  <Input 
                    id="honeyType" 
                    placeholder="e.g. Wildflower, Clover"
                    value={formData.honeyType} 
                    onChange={(e) => setFormData({...formData, honeyType: e.target.value})}
                    className="h-16 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label htmlFor="quantity" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Quantity (kg)</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    step="0.1"
                    placeholder="0.0"
                    value={formData.quantity} 
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="h-16 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary"
                    required 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="harvestDate" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Harvest Date</Label>
                  <Input 
                    id="harvestDate" 
                    type="date"
                    value={formData.harvestDate} 
                    onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                    className="h-16 bg-card border-border/50 rounded-2xl text-lg font-normal focus:ring-primary"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest text-stone-400 ml-1">Batch Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the harvest conditions, apiary location, etc."
                  className="min-h-[160px] bg-card border-border/50 rounded-3xl text-lg font-normal p-6 focus:ring-primary"
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="p-8 bg-[#1c1917] rounded-3xl border border-white/5 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-3 text-primary relative z-10">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="font-heading font-bold text-lg uppercase tracking-tight">Security Policy</span>
                </div>
                <p className="text-sm text-stone-400 font-normal leading-relaxed relative z-10">
                  By saving this batch, you are cryptographically signing the data with your unique producer key. 
                  This ensures the integrity of the information for the entire supply chain. Tampering is impossible.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 text-xl rounded-2xl font-bold gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Signing & Saving Batch...
                  </>
                ) : (
                  <>
                    Register & Sign Batch
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
