'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getConsumerOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.order.findMany({
    where: { consumerId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
