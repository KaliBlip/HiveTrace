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

  // Batch performance (top 5 batches by revenue from paid orders)
  const paidOrderItems = await prisma.orderItem.findMany({
    where: {
      order: { status: 'PAID' },
      product: { producerId: producer.id },
    },
    include: {
      product: { include: { batch: true } },
    },
  });

  const revenueByBatch: Record<string, { name: string; scans: number; revenue: number }> = {};
  for (const batch of batches) {
    revenueByBatch[batch.id] = {
      name: batch.batchCode,
      scans: batch.scanCount,
      revenue: 0,
    };
  }

  for (const item of paidOrderItems) {
    const batchId = item.product.batchId;
    if (revenueByBatch[batchId]) {
      revenueByBatch[batchId].revenue += item.priceAtPurchase * item.quantity;
    }
  }

  const batchPerformance = Object.values(revenueByBatch)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const activeProducts = await prisma.product.count({
    where: { producerId: producer.id, isActive: true },
  });

  return {
    scanData,
    batchPerformance,
    totalBatches: batches.length,
    totalScans: batches.reduce((sum, b) => sum + b.scanCount, 0),
    activeProducts,
  };
}
