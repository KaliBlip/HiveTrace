'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { generateBatchHash } from '@/lib/crypto';

export async function getProducerBatches() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) return [];

  return await prisma.honeyBatch.findMany({
    where: { producerId: producer.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createBatch(data: {
  batchCode: string;
  honeyType: string;
  quantity: number;
  harvestDate: Date;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) throw new Error('Producer profile not found');

  // Generate cryptographic hash for the batch
  const verificationHash = generateBatchHash({
    producerId: producer.id,
    batchCode: data.batchCode,
    honeyType: data.honeyType,
    quantity: data.quantity,
    harvestDate: data.harvestDate.toISOString(),
  });

  const batch = await prisma.honeyBatch.create({
    data: {
      ...data,
      producerId: producer.id,
      verificationHash,
      verified: true, // Auto-verify for now since it's signed
      verifiedAt: new Date(),
    },
  });

  revalidatePath('/dashboard/batches');
  return batch;
}
