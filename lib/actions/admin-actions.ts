'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { registerBatchOnLedger } from '@/lib/blockchain';

const ACTIVE_FRAUD_STATUSES = ['FLAGGED', 'PENDING', 'INVESTIGATING'] as const;

export async function getAdminStats() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return {
      producerCount: 0,
      batchCount: 0,
      fraudAlertCount: 0,
      scanCount: 0,
      recentAlerts: [],
      pendingProducers: [],
      trends: { producers: 0, batches: 0, scans: 0 },
    };
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    producerCount,
    batchCount,
    fraudAlertCount,
    scanCount,
    recentAlerts,
    pendingProducers,
    producersThisWeek,
    batchesThisWeek,
    scansThisWeek,
  ] = await Promise.all([
    prisma.producer.count(),
    prisma.honeyBatch.count({ where: { verified: true } }),
    prisma.fraudAlert.count({
      where: { status: { in: [...ACTIVE_FRAUD_STATUSES] } },
    }),
    prisma.qRScan.count(),
    prisma.fraudAlert.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        batch: { select: { batchCode: true } },
      },
    }),
    prisma.producer.findMany({
      where: { verified: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
      },
    }),
    prisma.producer.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.honeyBatch.count({
      where: { verified: true, createdAt: { gte: weekAgo } },
    }),
    prisma.qRScan.count({ where: { timestamp: { gte: weekAgo } } }),
  ]);

  return {
    producerCount,
    batchCount,
    fraudAlertCount,
    scanCount,
    recentAlerts,
    pendingProducers,
    trends: {
      producers: producersThisWeek,
      batches: batchesThisWeek,
      scans: scansThisWeek,
    },
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

export async function verifyAndApproveBatch(
  id: string,
  qualityMetrics?: {
    purity?: number;
    moisture?: number;
    color?: string;
    score?: number;
  }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const batch = await prisma.honeyBatch.findUnique({
    where: { id },
    include: { producer: true },
  });

  if (!batch) {
    throw new Error('Batch not found');
  }

  if (batch.verified && batch.blockchainTx) {
    return batch;
  }

  const { blockHash } = await registerBatchOnLedger({
    batchId: batch.id,
    batchCode: batch.batchCode,
    verificationHash: batch.verificationHash,
    adminId: session.user.id,
    metadata: {
      honeyType: batch.honeyType,
      quantity: batch.quantity,
      producerId: batch.producerId,
      producerName: batch.producer.businessName,
      qualityMetrics: qualityMetrics ?? null,
    },
  });

  const updatedBatch = await prisma.honeyBatch.update({
    where: { id },
    data: {
      verified: true,
      verifiedAt: new Date(),
      blockchainTx: blockHash,
    },
  });

  const codePayload = JSON.stringify({
    batchId: batch.batchCode,
    hash: batch.verificationHash,
  });

  const existingQr = await prisma.qRCode.findFirst({
    where: { batchId: id },
  });

  if (!existingQr) {
    await prisma.qRCode.create({
      data: {
        batchId: id,
        code: codePayload,
      },
    });
  }

  revalidatePath('/admin/batches');
  revalidatePath(`/admin/batches/${id}`);
  revalidatePath('/dashboard/batches');
  revalidatePath(`/verify/${batch.verificationHash}`);

  return updatedBatch;
}

export async function updateFraudAlertStatus(
  id: string,
  status: 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const data: {
    status: string;
    investigatedAt?: Date;
    resolvedAt?: Date;
  } = { status };

  if (status === 'INVESTIGATING') {
    data.investigatedAt = new Date();
  }
  if (status === 'RESOLVED' || status === 'DISMISSED') {
    data.resolvedAt = new Date();
  }

  const alert = await prisma.fraudAlert.update({
    where: { id },
    data,
  });

  revalidatePath('/admin/fraud');
  revalidatePath('/admin');
  return alert;
}

export async function getContactMessagesAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function markContactMessageReadAdmin(id: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath('/admin/messages');
  return message;
}

export async function getLedgerBlocks(limit = 50) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const { getLedgerChain, getLedgerStats, verifyLedgerIntegrity } = await import(
    '@/lib/blockchain'
  );

  const [blocks, stats, integrity] = await Promise.all([
    getLedgerChain(limit),
    getLedgerStats(),
    verifyLedgerIntegrity(),
  ]);

  return { blocks, stats, integrity };
}

