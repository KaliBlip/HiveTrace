'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getProducerStats() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
    include: {
      ratings: true,
      _count: {
        select: { batches: true }
      }
    }
  });

  if (!producer) throw new Error('Producer profile not found');

  const [scanCount, recentBatches] = await Promise.all([
    prisma.qRScan.count({
      where: { qrCode: { batch: { producerId: producer.id } } }
    }),
    prisma.honeyBatch.findMany({
      where: { producerId: producer.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { qrCodes: true }
        }
      }
    })
  ]);

  return {
    producer,
    batchCount: producer._count.batches,
    scanCount,
    recentBatches
  };
}
