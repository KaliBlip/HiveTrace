'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getAdminStats() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return {
      producerCount: 0,
      batchCount: 0,
      fraudAlertCount: 0,
      scanCount: 0,
      recentAlerts: [],
      pendingProducers: []
    };
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

export async function getAllProducers() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return await prisma.producer.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      },
      ratings: true,
      _count: {
        select: { batches: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function approveProducer(id: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const producer = await prisma.producer.update({
    where: { id },
    data: {
      verified: true,
      status: 'APPROVED',
      verifiedAt: new Date(),
    }
  });

  // Also update rating/trust score structure
  await prisma.producerRating.upsert({
    where: { producerId: id },
    update: { trustScore: 100 },
    create: {
      producerId: id,
      averageRating: 5.0,
      totalReviews: 0,
      trustScore: 100,
    }
  });

  return producer;
}

export async function rejectProducer(id: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return await prisma.producer.update({
    where: { id },
    data: {
      verified: false,
      status: 'REJECTED',
    }
  });
}

export async function getAllBatches() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return await prisma.honeyBatch.findMany({
    include: {
      producer: {
        include: {
          user: {
            select: { name: true }
          }
        }
      },
      _count: {
        select: { qrCodes: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function verifyAndApproveBatch(id: string, blockchainTx: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const batch = await prisma.honeyBatch.findUnique({
    where: { id }
  });

  if (!batch) {
    throw new Error('Batch not found');
  }

  // Update batch as verified and set blockchainTx
  const updatedBatch = await prisma.honeyBatch.update({
    where: { id },
    data: {
      verified: true,
      verifiedAt: new Date(),
      blockchainTx: blockchainTx,
    }
  });

  // Generate a unique code payload for the QR code
  const codePayload = JSON.stringify({
    batchId: batch.batchCode,
    hash: batch.verificationHash
  });

  // Create QRCode entry if not already existing
  const existingQr = await prisma.qRCode.findFirst({
    where: { batchId: id }
  });

  if (!existingQr) {
    await prisma.qRCode.create({
      data: {
        batchId: id,
        code: codePayload,
      }
    });
  }

  return updatedBatch;
}

