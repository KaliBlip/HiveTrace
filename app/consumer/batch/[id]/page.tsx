import { notFound } from 'next/navigation';
import { getBatchDetailForConsumer } from '@/lib/actions/review-actions';
import { ConsumerBatchDetail } from '@/components/consumer/batch-detail-client';

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const batch = await getBatchDetailForConsumer(id);

  if (!batch) {
    notFound();
  }

  return <ConsumerBatchDetail batch={batch as any} />;
}
