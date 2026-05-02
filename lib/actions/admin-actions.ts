'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getAdminStats() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const [
    producerCount,
    batchCount,
    fraudAlertCount,
    scanCount,
    recentAlerts,
    pendingProducers
  ] = await Promise.all([
    prisma.producer.count(),
    prisma.honeyBatch.count(),
    prisma.fraudAlert.count({ where: { status: 'PENDING' } }),
    prisma.qRScan.count(),
    prisma.fraudAlert.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        batch: {
          select: { batchCode: true }
        }
      }
    }),
    prisma.producer.findMany({
      where: { verified: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } }
      }
    })
  ]);

  return {
    producerCount,
    batchCount,
    fraudAlertCount,
    scanCount,
    recentAlerts,
    pendingProducers
  };
}
