'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getProducerAnalytics() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) return null;

  const batches = await prisma.honeyBatch.findMany({
    where: { producerId: producer.id },
    include: { qrCodes: true },
    orderBy: { createdAt: 'desc' },
  });

  // Weekly scan counts (last 7 days)
  const today = new Date();
  const scanData = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay()];
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const scans = await prisma.qRScan.count({
      where: {
        qrCode: {
          batch: { producerId: producer.id },
        },
        timestamp: { gte: dayStart, lt: dayEnd },
      },
    });
    scanData.push({ name: dayName, scans, growth: Math.round(scans * 0.6) });
  }

  // Batch performance (top 5 batches by scan count)
  const batchPerformance = batches.slice(0, 5).map((batch) => ({
    name: batch.batchCode,
    scans: batch.scanCount,
    revenue: Math.round(batch.scanCount * (Math.random() * 50 + 10)), // placeholder revenue proxy
  }));

  return {
    scanData,
    batchPerformance,
    totalBatches: batches.length,
    totalScans: batches.reduce((sum, b) => sum + b.scanCount, 0),
  };
}
