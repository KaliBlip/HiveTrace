'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getFeaturedProducers() {
  return await prisma.producer.findMany({
    take: 3,
    include: {
      user: {
        select: {
          name: true
        }
      },
      ratings: true,
      _count: {
        select: {
          batches: true
        }
      }
    }
  });
}

export async function getPlatformStats() {
  const [batchCount, producerCount, scanCount, verifiedBatchCount] = await Promise.all([
    prisma.honeyBatch.count(),
    prisma.producer.count({ where: { verified: true } }),
    prisma.qRScan.count(),
    prisma.honeyBatch.count({ where: { verified: true } }),
  ]);

  return { batchCount, producerCount, scanCount, verifiedBatchCount };
}

export async function searchPublicBatch(batchCode: string) {
  if (!batchCode?.trim()) return null;

  const batch = await prisma.honeyBatch.findFirst({
    where: {
      OR: [
        { batchCode: { equals: batchCode.trim().toUpperCase() } },
        { batchCode: { contains: batchCode.trim().toUpperCase() } },
      ],
    },
    include: {
      producer: {
        include: {
          user: { select: { name: true } },
          ratings: true,
        },
      },
      reviews: { select: { rating: true } },
    },
  });

  if (!batch) return null;

  const totalReviews = batch.reviews.length;
  const averageRating =
    totalReviews > 0
      ? batch.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : batch.producer.ratings?.averageRating ?? 0;

  return {
    id: batch.id,
    batchCode: batch.batchCode,
    honeyType: batch.honeyType,
    quantity: batch.quantity,
    harvestDate: batch.harvestDate.toISOString(),
    verified: batch.verified,
    verificationHash: batch.verificationHash,
    blockchainTx: batch.blockchainTx,
    scanCount: batch.scanCount,
    producer: {
      businessName: batch.producer.businessName,
      location: batch.producer.location,
      rating: averageRating,
      reviewCount: totalReviews || batch.producer.ratings?.totalReviews || 0,
    },
    history: [
      {
        event: 'Batch Registered',
        date: batch.createdAt.toISOString().split('T')[0],
        location: batch.producer.location,
      },
      {
        event: 'Harvested',
        date: batch.harvestDate.toISOString().split('T')[0],
        location: batch.producer.location,
      },
      ...(batch.verifiedAt
        ? [
            {
              event: 'Blockchain Verified',
              date: batch.verifiedAt.toISOString().split('T')[0],
              location: 'HiveTrace Verification Ledger',
            },
          ]
        : []),
    ],
  };
}

export async function getFeaturedVerifiedBatch() {
  return prisma.honeyBatch.findFirst({
    where: { verified: true },
    orderBy: { verifiedAt: 'desc' },
    include: {
      producer: {
        include: {
          user: { select: { name: true } },
          ratings: true,
        },
      },
      reviews: { select: { rating: true } },
    },
  });
}

export async function getConsumerOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.order.findMany({
    where: { consumerId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              batch: true,
            },
          },
        },
      },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
