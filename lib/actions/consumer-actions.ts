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
  const [batchCount, producerCount] = await Promise.all([
    prisma.honeyBatch.count(),
    prisma.producer.count()
  ]);

  return { batchCount, producerCount };
}

export async function getConsumerOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.order.findMany({
    where: { consumerId: session.user.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}
