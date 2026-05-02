'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getProducerOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) return [];

  return await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            producerId: producer.id
          }
        }
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Verify the producer owns at least one item in this order
  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) throw new Error('Producer profile not found');

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath('/dashboard/orders');
  return order;
}
