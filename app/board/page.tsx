'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, ClipboardCheck, MapPin, Search, XCircle } from 'lucide-react';
import { decideBatchValidation, decideProducerAccreditation, getBoardProducerCase, getBoardProducerDirectory, submitFarmInspection } from '@/lib/actions/board-actions';
import { toast } from 'sonner';

type Producer = { id: string; businessName: string; location: string; status: string; verified: boolean; user: { name: string; email: string }; inspections: { id: string; visitDate: Date }[]; _count: { batches: number; inspections: number } };
type Batch = { id: string; batchCode: string; honeyType: string; boardStatus: string; honeyImage: string | null; packagingImage: string | null; createdAt: Date };
type Inspection = { visitDate: Date; notes: string; honeyPhotos: string[]; packagingPhotos: string[]; apiaryPhotos: string[]; hivePhotos: string[] };
type Case = Omit<Producer, '_count' | 'inspections'> & { inspections: Inspection[]; batches: Batch[] };

const initialEvidence = { visitDate: '', identityDocumentUrl: '', apiaryPhotos: '', hivePhotos: '', honeyPhotos: '', packagingPhotos: '', certificates: '', videoUrl: '', signedReportUrl: '', notes: '' };
const show = (value: string) => value.replaceAll('_', ' ');
const evidenceFields = [
  ['identityDocumentUrl', 'Identity document', 'image/*,application/pdf', false],
  ['apiaryPhotos', 'Apiary photos', 'image/*', true],
  ['hivePhotos', 'Hive photos', 'image/*', true],
  ['honeyPhotos', 'Honey photos', 'image/*', true],
  ['packagingPhotos', 'Packaging photos', 'image/*', true],
  ['certificates', 'Certificates', 'image/*,application/pdf', true],
  ['videoUrl', 'Short site video', 'video/*', false],
  ['signedReportUrl', 'Signed report', 'image/*,application/pdf', false],
] as const;

export default function ValidationBoardPage() {
  const [directory, setDirectory] = useState<Producer[]>([]);
  const [producerCase, setProducerCase] = useState<Case | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [filter, setFilter] = useState('');
  const [notes, setNotes] = useState('');
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [evidence, setEvidence] = useState(initialEvidence);

  const loadDirectory = async () => { try { setDirectory(await getBoardProducerDirectory()); } catch { toast.error('Unable to load producers'); } };
  const openCase = async (id: string) => { try { setProducerCase(await getBoardProducerCase(id)); setBatch(null); setInspectionOpen(false); setNotes(''); } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to open case'); } };
  const refresh = async () => { await loadDirectory(); if (producerCase) await openCase(producerCase.id); };
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadDirectory(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const upload = async (key: keyof typeof evidence, files: FileList | null) => {
    if (!files?.length) return;
    const body = new FormData(); Array.from(files).forEach((file) => body.append('files', file));
    try { const response = await fetch('/api/upload/evidence', { method: 'POST', body }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error); setEvidence((current) => ({ ...current, [key]: payload.urls.join(',') })); toast.success('Evidence uploaded'); } catch (error) { toast.error(error instanceof Error ? error.message : 'Upload failed'); }
  };
  const saveInspection = async () => {
    if (!producerCase) return;
    const list = (value: string) => value.split(',').filter(Boolean);
    try {
      await submitFarmInspection({ producerId: producerCase.id, visitDate: evidence.visitDate, identityDocumentUrl: evidence.identityDocumentUrl, apiaryPhotos: list(evidence.apiaryPhotos), hivePhotos: list(evidence.hivePhotos), honeyPhotos: list(evidence.honeyPhotos), packagingPhotos: list(evidence.packagingPhotos), certificates: list(evidence.certificates), videoUrl: evidence.videoUrl, signedReportUrl: evidence.signedReportUrl, notes: evidence.notes });
      toast.success('Inspection saved'); setInspectionOpen(false); setEvidence(initialEvidence); await refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to save inspection'); }
  };
  const decideProducer = async (decision: 'ACCREDITED' | 'REJECTED') => {
    if (!producerCase) return;
    try { await decideProducerAccreditation(producerCase.id, decision, notes); toast.success(`Producer ${decision.toLowerCase()}`); setNotes(''); await refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Decision failed'); }
  };
  const decideBatch = async (decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED') => {
    if (!batch) return;
    try { await decideBatchValidation(batch.id, decision, notes); toast.success(`Batch ${show(decision).toLowerCase()}`); setNotes(''); await refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Decision failed'); }
  };

  const inspection = producerCase?.inspections[0];
  const producers = directory.filter((item) => `${item.businessName} ${item.location} ${item.user.email}`.toLowerCase().includes(filter.toLowerCase()));
  const preview = (src: string | null | undefined, alt: string) => src ? <img src={src} alt={alt} className="h-40 w-full rounded-lg object-cover" /> : <div className="grid h-40 place-items-center rounded-lg bg-muted text-xs text-muted-foreground">No image</div>;

  return <main className="mx-auto max-w-6xl pb-16">
    <div className="mb-6 border-b pb-5">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Validation Board</p>
      <h1 className="mt-1 font-heading text-3xl font-bold uppercase italic">Producer review desk</h1>
      <p className="mt-2 text-sm text-muted-foreground">Select a producer, keep their inspection evidence current, and review each submitted batch.</p>
    </div>

    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit lg:sticky lg:top-6">
        <label className="relative block"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={filter} onChange={(event) => setFilter(event.target.value)} className="pl-9" placeholder="Find a producer" /></label>
        <div className="mt-3 space-y-1 rounded-xl border bg-card p-2">
          {producers.map((item) => <button key={item.id} onClick={() => openCase(item.id)} className={`w-full rounded-lg px-3 py-3 text-left ${producerCase?.id === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
            <div className="flex items-center justify-between gap-2"><strong className="truncate text-sm">{item.businessName}</strong><span className="shrink-0 text-xs">{item._count.batches}</span></div>
            <p className={`mt-1 truncate text-xs ${producerCase?.id === item.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{item.location || 'Location pending'}</p>
          </button>)}
          {!producers.length && <p className="p-4 text-sm text-muted-foreground">No producers found.</p>}
        </div>
      </aside>

      {!producerCase ? <div className="grid min-h-80 place-items-center rounded-xl border border-dashed p-8 text-center"><div><ClipboardCheck className="mx-auto mb-3 size-9 text-primary" /><h2 className="font-heading text-xl font-bold">Choose a producer</h2><p className="mt-1 text-sm text-muted-foreground">Their accreditation, inspections, and batches will appear here.</p></div></div> : <section className="space-y-5">
        <Card><CardContent className="p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-2xl font-bold">{producerCase.businessName}</h2><Badge variant={producerCase.verified ? 'default' : 'outline'}>{show(producerCase.status)}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{producerCase.user.name} · {producerCase.location || 'Location pending'}</p></div><Button variant="outline" onClick={() => setInspectionOpen(!inspectionOpen)}><MapPin className="mr-2 size-4" />{inspection ? 'Renew inspection' : 'Record inspection'}</Button></div>
          <div className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Latest inspection</p><p className="mt-1 text-sm">{inspection ? new Date(inspection.visitDate).toLocaleDateString() : 'Not yet recorded'}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Submitted batches</p><p className="mt-1 text-sm">{producerCase.batches.length} batch{producerCase.batches.length === 1 ? '' : 'es'}</p></div></div>
        </CardContent></Card>

        {inspectionOpen && <Card className="border-primary/30"><CardContent className="p-5"><h3 className="font-heading text-lg font-bold">Inspection evidence</h3><p className="mt-1 text-sm text-muted-foreground">All items below are required before saving the visit.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Visit date<Input className="mt-1" type="date" value={evidence.visitDate} onChange={(event) => setEvidence({ ...evidence, visitDate: event.target.value })} /></label>{evidenceFields.map(([key, label, accept, multiple]) => <label key={key} className="rounded-lg border border-dashed p-3 text-sm"><span className="font-medium">{label}</span><Input className="mt-2" type="file" accept={accept} multiple={multiple} onChange={(event) => upload(key, event.target.files)} /><span className="mt-2 block text-xs text-muted-foreground">{evidence[key] ? 'Uploaded' : 'Required'}</span></label>)}<label className="sm:col-span-2 text-sm font-medium">Visit notes<Textarea className="mt-1" value={evidence.notes} onChange={(event) => setEvidence({ ...evidence, notes: event.target.value })} placeholder="What was observed during this visit?" /></label></div><div className="mt-4 flex gap-2"><Button onClick={saveInspection}>Save inspection</Button><Button variant="ghost" onClick={() => setInspectionOpen(false)}>Cancel</Button></div></CardContent></Card>}

        <Card><CardContent className="p-5"><div className="flex items-center justify-between gap-3"><div><h3 className="font-heading text-lg font-bold">1. Producer accreditation</h3><p className="text-sm text-muted-foreground">An inspection must be on record before accreditation.</p></div>{inspection && !producerCase.verified && <div className="flex gap-2"><Button size="sm" onClick={() => decideProducer('ACCREDITED')}><CheckCircle2 className="mr-1.5 size-4" />Accredit</Button><Button size="sm" variant="destructive" onClick={() => decideProducer('REJECTED')}><XCircle className="mr-1.5 size-4" />Reject</Button></div>}</div>{inspection && <p className="mt-3 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{inspection.notes || 'No inspection notes provided.'}</p>}</CardContent></Card>

        <Card><CardContent className="p-5"><h3 className="font-heading text-lg font-bold">2. Batch comparison</h3><p className="mb-3 text-sm text-muted-foreground">Choose one batch to compare its images with the latest inspection.</p><div className="space-y-2">{producerCase.batches.map((item) => <button key={item.id} onClick={() => { setBatch(item); setNotes(''); }} className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left ${batch?.id === item.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/60'}`}><span><strong className="text-sm">{item.batchCode}</strong><span className="ml-2 text-sm text-muted-foreground">{item.honeyType}</span></span><Badge variant="outline">{show(item.boardStatus)}</Badge></button>)}{!producerCase.batches.length && <p className="text-sm text-muted-foreground">No batches have been submitted.</p>}</div>
          {batch && <div className="mt-5 border-t pt-5"><div className="grid gap-4 sm:grid-cols-2"><div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Submitted honey</p>{preview(batch.honeyImage, 'Submitted honey')}</div><div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Inspection honey reference</p>{preview(inspection?.honeyPhotos[0], 'Inspection honey reference')}</div><div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Submitted packaging</p>{preview(batch.packagingImage, 'Submitted packaging')}</div><div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Inspection packaging reference</p>{preview(inspection?.packagingPhotos[0], 'Inspection packaging reference')}</div></div><Textarea className="mt-4" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Comparison result and decision notes (required)" /><div className="mt-3 flex flex-wrap gap-2"><Button disabled={!inspection} onClick={() => decideBatch('APPROVED')}><CheckCircle2 className="mr-2 size-4" />Approve & issue certificate</Button><Button disabled={!inspection} variant="outline" onClick={() => decideBatch('CHANGES_REQUESTED')}>Request corrections</Button><Button variant="destructive" onClick={() => decideBatch('REJECTED')}>Reject batch</Button></div>{!inspection && <p className="mt-2 text-sm text-amber-700">Record an inspection before approving a batch.</p>}</div>}
        </CardContent></Card>
      </section>}
    </div>
  </main>;
}
