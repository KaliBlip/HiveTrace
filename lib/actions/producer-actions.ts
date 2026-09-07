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

  const [scanCount, recentBatches, paidOrderItems] = await Promise.all([
    prisma.qRScan.count({
      where: { qrCode: { batch: { producerId: producer.id } } },
    }),
    prisma.honeyBatch.findMany({
      where: { producerId: producer.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { qrCodes: true } } },
    }),
    prisma.orderItem.findMany({
      where: {
        product: { producerId: producer.id },
        order: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
      },
      select: { priceAtPurchase: true, quantity: true },
    }),
  ]);

  const totalRevenue = paidOrderItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  return {
    producer,
    batchCount: producer._count.batches,
    scanCount,
    totalRevenue,
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
      user: { select: { name: true, email: true, phoneNumber: true } },
      ratings: true,
      _count: { select: { batches: true } },
    },
  });
}

export async function updateProducerProfile(data: {
  businessName?: string;
  location?: string;
  phoneNumber?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  apiarySize?: number;
  certifications?: string;
  payoutMethod?: string;
  accountName?: string;
  bankName?: string;
  accountNumber?: string;
  momoProvider?: string;
  momoNumber?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) throw new Error('Producer profile not found');

  const updatedProducer = await prisma.producer.update({
    where: { id: producer.id },
    data: {
      businessName: data.businessName,
      location: data.location,
      phoneNumber: data.phoneNumber ? data.phoneNumber.trim() : null,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      apiarySize: data.apiarySize,
      certifications: data.certifications,
      payoutMethod: data.payoutMethod,
      accountName: data.accountName,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      momoProvider: data.momoProvider,
      momoNumber: data.momoNumber,
    },
  });

  if (data.phoneNumber !== undefined) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phoneNumber: data.phoneNumber ? data.phoneNumber.trim() : null },
    });
  }

  return updatedProducer;
}

export async function updateProducerPayoutDetails(data: {
  payoutMethod: 'MOMO' | 'BANK';
  accountName: string;
  bankName?: string;
  accountNumber?: string;
  momoProvider?: string;
  momoNumber?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) throw new Error('Producer profile not found');

  return await prisma.producer.update({
    where: { id: producer.id },
    data: {
      payoutMethod: data.payoutMethod,
      accountName: data.accountName,
      bankName: data.payoutMethod === 'BANK' ? data.bankName : null,
      accountNumber: data.payoutMethod === 'BANK' ? data.accountNumber : null,
      momoProvider: data.payoutMethod === 'MOMO' ? data.momoProvider : null,
      momoNumber: data.payoutMethod === 'MOMO' ? data.momoNumber : null,
    },
  });
}
