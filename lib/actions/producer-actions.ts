'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getProducerStats() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      producer: { businessName: 'Guest', rating: 5, verified: false } as any,
      batchCount: 0,
      scanCount: 0,
      recentBatches: [],
    };
  }

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
    include: {
      ratings: true,
      _count: { select: { batches: true } },
    },
  });

  if (!producer) {
    return {
      producer: { businessName: 'New Producer', rating: 5, verified: false } as any,
      batchCount: 0,
      scanCount: 0,
      recentBatches: [],
    };
  }

  const [scanCount, recentBatches] = await Promise.all([
    prisma.qRScan.count({
      where: { qrCode: { batch: { producerId: producer.id } } },
    }),
    prisma.honeyBatch.findMany({
      where: { producerId: producer.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { qrCodes: true } } },
    }),
  ]);

  return {
    producer,
    batchCount: producer._count.batches,
    scanCount,
    recentBatches,
  };
}

export async function getProducerPublicProfile(producerId: string) {
  const producer = await prisma.producer.findUnique({
    where: { id: producerId },
    include: {
      user: { select: { name: true, email: true } },
      ratings: true,
      batches: {
        where: { verified: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { reviews: { select: { rating: true } } },
      },
      _count: { select: { batches: true } },
    },
  });

  if (!producer) return null;

  const scanCount = await prisma.qRScan.count({
    where: { qrCode: { batch: { producerId: producer.id } } },
  });

  const reviews = await prisma.review.findMany({
    where: { batch: { producerId: producer.id } },
    include: {
      user: { select: { name: true } },
      batch: { select: { honeyType: true, batchCode: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return {
    ...producer,
    scanCount,
    reviews,
    batches: producer.batches.map((b) => ({
      ...b,
      avgRating:
        b.reviews.length > 0
          ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length
          : 0,
    })),
  };
}

export async function getProducerProfileForSettings() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.producer.findUnique({
    where: { userId: session.user.id },
    include: {
      ratings: true,
      _count: { select: { batches: true } },
    },
  });
}

export async function updateProducerProfile(data: {
  businessName?: string;
  location?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  apiarySize?: number;
  certifications?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) throw new Error('Producer profile not found');

  return prisma.producer.update({
    where: { id: producer.id },
    data: {
      businessName: data.businessName,
      location: data.location,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      apiarySize: data.apiarySize,
      certifications: data.certifications,
    },
  });
}
