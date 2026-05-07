'use server';

import prisma from '@/lib/prisma';

export async function getPlatformReportStats() {
  const [
    batchCount,
    producerCount,
    consumerCount,
    scanCount,
    fraudAlertCount,
    orderCount,
    reviewCount,
  ] = await Promise.all([
    prisma.honeyBatch.count(),
    prisma.producer.count(),
    prisma.user.count({ where: { role: 'CONSUMER' } }),
    prisma.qRScan.count(),
    prisma.fraudAlert.count({ where: { status: 'FLAGGED' } }),
    prisma.order.count(),
    prisma.review.count(),
  ]);

  return {
    batchCount,
    producerCount,
    consumerCount,
    scanCount,
    fraudAlertCount,
    orderCount,
    reviewCount,
  };
}
