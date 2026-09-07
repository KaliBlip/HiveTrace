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

  const producerIds = new Set<string>();

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

    producerIds.add(product.producerId);
  }

  if (producerIds.size > 1) {
    throw new Error('Please place separate orders for products from different beekeepers.');
  }

  const reference = generatePaymentReference();

  const order = await prisma.order.create({
    data: {
      consumerId: session.user.id,
      status: 'PENDING',
      totalAmount: data.totalAmount,
      customerEmail: data.customerEmail?.trim() || null,
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

  let verification = await verifyPaystackPayment(reference);

  // Paystack can briefly report a transaction as pending immediately after
  // the popup callback. Give the gateway a few attempts to settle it.
  for (let attempt = 1; attempt < 3 && verification.data?.status !== 'success'; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 750));
    verification = await verifyPaystackPayment(reference);
  }

  if (verification.data?.status === 'failed') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'FAILED' },
    });
    throw new Error(verification.message || 'Payment was declined by Paystack');
  }

  if (!verification.status || verification.data?.status !== 'success') {
    throw new Error('Payment is still being confirmed by Paystack. Please refresh your orders shortly.');
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

  const orders = await prisma.order.findMany({
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
        where: {
          product: {
            producerId: producer.id,
          },
        },
        include: {
          product: {
            include: {
              batch: true,
            },
          },
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

  return orders.map((order) => {
    const producerItems = order.items.filter(
      (item) => item.product?.producerId === producer.id
    );
    const producerSubtotal = producerItems.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );
    const isMultiProducerCart = order.items.length > producerItems.length;

    return {
      ...order,
      items: producerItems,
      producerSubtotal,
      isMultiProducerCart,
    };
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

  if (order.status !== 'PENDING' && order.status !== 'FAILED') {
    throw new Error('Only pending or failed orders can be paid again');
  }

  if (order.payment?.status === 'PAID') {
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

  // Paystack references are unique; retries must never reuse a previous attempt.
  const reference = generatePaymentReference();

  if (order.payment) {
    await prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        reference,
        amount: order.totalAmount,
        status: 'PENDING',
        paidAt: null,
        channel: null,
      },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: reference, status: 'PENDING' },
    });
  } else {
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

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      items: { some: { product: { producerId: producer.id } } },
    },
    include: { payment: true },
  });

  if (!order) throw new Error('Order not found');

  if (order.payment?.status !== 'PAID') {
    throw new Error('Delivery cannot be updated until payment is confirmed');
  }

  const allowedTransitions: Record<string, string[]> = {
    PAID: ['SHIPPED'],
    SHIPPED: ['DELIVERED'],
  };

  if (!allowedTransitions[order.status]?.includes(status)) {
    throw new Error(`Cannot change order from ${order.status} to ${status}`);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath('/dashboard/orders');
  revalidatePath('/consumer/orders');
  revalidatePath('/admin');
  return updatedOrder;
}

export async function confirmOrderDelivery(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const order = await prisma.order.findFirst({
    where: { id: orderId, consumerId: session.user.id },
  });

  if (!order) throw new Error('Order not found');
  if (order.status !== 'DELIVERED') {
    throw new Error('Delivery can only be confirmed after the order is marked delivered');
  }
  if (order.deliveryConfirmedAt) return order;

  const confirmedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { deliveryConfirmedAt: new Date() },
  });

  revalidatePath('/consumer/orders');
  revalidatePath('/dashboard/orders');
  revalidatePath('/admin');
  return confirmedOrder;
}

export async function reportOrderNotReceived(orderId: string, reason: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const order = await prisma.order.findFirst({
    where: { id: orderId, consumerId: session.user.id },
    include: {
      payment: true,
      items: { include: { product: { include: { producer: true, batch: true } } } },
    },
  });

  if (!order) throw new Error('Order not found');
  if (order.payment?.status !== 'PAID') {
    throw new Error('Only paid orders can be reported as not received');
  }

  const existing = await prisma.fraudAlert.findFirst({
    where: {
      orderId,
      type: 'ORDER_NOT_RECEIVED',
      status: { in: ['FLAGGED', 'INVESTIGATING'] },
    },
  });

  if (existing) return existing;

  const firstItem = order.items[0];
  const alert = await prisma.fraudAlert.create({
    data: {
      orderId: order.id,
      producerId: firstItem?.product.producerId,
      batchId: firstItem?.product.batchId,
      type: 'ORDER_NOT_RECEIVED',
      severity: 'HIGH',
      description: `Consumer reported paid order ${order.id.slice(-8).toUpperCase()} was not received. Reason: ${reason.trim() || 'No reason provided'}`,
      status: 'FLAGGED',
      evidence: JSON.stringify({
        orderId: order.id,
        consumerId: session.user.id,
        paymentReference: order.payment.reference,
        paymentStatus: order.payment.status,
        orderStatus: order.status,
        deliveryConfirmedAt: order.deliveryConfirmedAt,
        producerId: firstItem?.product.producerId,
        producerName: firstItem?.product.producer.businessName,
        batchCode: firstItem?.product.batch.batchCode,
        reason: reason.trim(),
      }),
    },
  });

  revalidatePath('/consumer/orders');
  revalidatePath('/admin/fraud');
  revalidatePath('/admin');
  return alert;
}

export async function getAdminDeliveryProofs() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return prisma.order.findMany({
    where: { deliveryConfirmedAt: { not: null } },
    include: {
      consumer: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { name: true, producer: { select: { businessName: true } } } } },
      },
    },
    orderBy: { deliveryConfirmedAt: 'desc' },
    take: 10,
  });
}
