'use client';

import { useState } from 'react';
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
    batchCode: `HT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
    honeyType: '',
    quantity: '',
    harvestDate: new Date().toISOString().split('T')[0],
    description: '',
  });

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
    } catch (error: any) {
      toast.error(error.message || 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link href="/dashboard/batches" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Batches
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">New Honey Batch</h1>
        <p className="text-muted-foreground">Register and cryptographically sign a new batch of honey</p>
      </div>

      <Card className="border-border shadow-lg">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Save className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Batch Information</CardTitle>
              <CardDescription>Enter the core data for authenticity verification</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchCode">Batch Code</Label>
                <Input 
                  id="batchCode" 
                  value={formData.batchCode} 
                  onChange={(e) => setFormData({...formData, batchCode: e.target.value})}
                  className="font-mono bg-muted"
                  readOnly 
                />
                <p className="text-[10px] text-muted-foreground italic">Auto-generated for uniqueness</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="honeyType">Honey Type</Label>
                <Input 
                  id="honeyType" 
                  placeholder="e.g. Wildflower, Clover"
                  value={formData.honeyType} 
                  onChange={(e) => setFormData({...formData, honeyType: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  step="0.1"
                  placeholder="0.0"
                  value={formData.quantity} 
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date</Label>
                <Input 
                  id="harvestDate" 
                  type="date"
                  value={formData.harvestDate} 
                  onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Batch Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the harvest conditions, apiary location, etc."
                className="min-h-32"
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm">Security Policy</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By saving this batch, you are cryptographically signing the data with your unique producer key. 
                This ensures the integrity of the information for the entire supply chain.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg gap-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing & Saving...
                </>
              ) : (
                <>
                  Register & Sign Batch
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
