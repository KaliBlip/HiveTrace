'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import {
  verifyPaystackPayment,
  generatePaymentReference,
} from '@/lib/paystack-server';

export async function createPendingOrderFromCart(data: {
  items: { productId: string; quantity: number; priceAtPurchase: number }[];
  totalAmount: number;
  shippingAddress?: string;
  customerEmail?: string;
  customerName?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  if (!data.items.length) {
    throw new Error('Cart is empty');
  }

  for (const item of data.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product || !product.isActive) {
      throw new Error(`Product "${item.productId}" is no longer available`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${product.name}"`);
    }
  }

  const reference = generatePaymentReference();

  const order = await prisma.order.create({
    data: {
      consumerId: session.user.id,
      status: 'PENDING',
      totalAmount: data.totalAmount,
      shippingAddress: data.shippingAddress,
      paymentId: reference,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        })),
      },
      payment: {
        create: {
          reference,
          amount: data.totalAmount,
          status: 'PENDING',
        },
      },
    },
    include: {
      items: { include: { product: true } },
      payment: true,
    },
  });

  return { order, reference };
}

export async function fulfillOrderByReference(reference: string) {
  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: {
      order: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!payment) {
    throw new Error('Payment reference not found');
  }

  if (payment.status === 'PAID' || payment.order.status === 'PAID') {
    return { order: payment.order, alreadyPaid: true };
  }

  const verification = await verifyPaystackPayment(reference);

  if (!verification.status || verification.data?.status !== 'success') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'FAILED' },
    });
    throw new Error(verification.message || 'Payment verification failed');
  }

  const expectedAmount = Math.round(payment.order.totalAmount * 100);
  if (verification.data!.amount !== expectedAmount) {
    throw new Error('Payment amount does not match order total');
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: 'PAID' },
    });

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        paidAt: verification.data?.paid_at
          ? new Date(verification.data.paid_at)
          : new Date(),
        channel: verification.data?.channel ?? null,
      },
    });

    for (const item of payment.order.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product?.name ?? 'product'}"`);
      }

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  });

  const order = await prisma.order.findUnique({
    where: { id: payment.orderId },
    include: {
      items: { include: { product: true } },
      payment: true,
    },
  });

  revalidatePath('/consumer/orders');
  revalidatePath('/dashboard/orders');
  revalidatePath('/shop');

  return { order, alreadyPaid: false };
}

/** @deprecated Use createPendingOrderFromCart + fulfillOrderByReference instead */
export async function createOrderFromCart(data: {
  items: { productId: string; quantity: number; priceAtPurchase: number }[];
  totalAmount: number;
  shippingAddress?: string;
  paymentId?: string;
}) {
  const { order, reference } = await createPendingOrderFromCart(data);
  if (data.paymentId) {
    await fulfillOrderByReference(reference);
  }
  return order;
}

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
            producerId: producer.id,
          },
        },
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      consumer: {
        select: {
          name: true,
          email: true,
        },
      },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
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

export async function retryOrderPayment(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      payment: true,
    },
  });

  if (!order || order.consumerId !== session.user.id) {
    throw new Error('Order not found');
  }

  if (order.status === 'PAID') {
    throw new Error('Order is already paid');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });

  if (!user?.email) throw new Error('User email required');

  const { initializePaystackPayment, getPaystackPublicKey } = await import(
    '@/lib/paystack-server'
  );

  const reference = order.payment?.reference ?? order.paymentId ?? generatePaymentReference();

  if (!order.payment) {
    await prisma.payment.create({
      data: {
        orderId: order.id,
        reference,
        amount: order.totalAmount,
        status: 'PENDING',
      },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: reference },
    });
  }

  const paystack = await initializePaystackPayment({
    email: user.email,
    amount: order.totalAmount,
    reference,
    metadata: {
      orderId: order.id,
      retry: true,
    },
  });

  if (!paystack.status || !paystack.data) {
    throw new Error(paystack.message || 'Failed to initialize payment');
  }

  return {
    authorization_url: paystack.data.authorization_url,
    reference: paystack.data.reference,
    publicKey: getPaystackPublicKey(),
    amount: Math.round(order.totalAmount * 100),
    email: user.email,
  };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

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
