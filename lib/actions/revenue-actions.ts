'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export interface ProducerRevenueStats {
  producer: {
    id: string;
    businessName: string;
    verified: boolean;
  };
  totalRevenue: number;
  pendingRevenue: number;
  unitsSold: number;
  paidOrdersCount: number;
  averageOrderValue: number;
  dailyRevenue: { date: string; label: string; revenue: number; ordersCount: number }[];
  monthlyRevenue: { month: string; revenue: number; ordersCount: number }[];
  productRevenueBreakdown: {
    productId: string;
    productName: string;
    batchCode: string;
    honeyType: string;
    unitsSold: number;
    totalRevenue: number;
    price: number;
  }[];
  recentTransactions: {
    orderId: string;
    createdAt: string;
    consumerName: string;
    consumerEmail: string;
    status: string;
    producerTotal: number;
    itemsCount: number;
    isMultiProducerCart: boolean;
    items: {
      productId: string;
      productName: string;
      quantity: number;
      priceAtPurchase: number;
      subtotal: number;
    }[];
  }[];
}

export async function getProducerRevenueStats(): Promise<ProducerRevenueStats | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
    select: { id: true, businessName: true, verified: true },
  });

  if (!producer) return null;

  // 1. Fetch all order items linked to this producer's products with their parent orders
  const producerOrderItems = await prisma.orderItem.findMany({
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
      order: {
        include: {
          consumer: {
            select: { name: true, email: true },
          },
          items: {
            select: { productId: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate high-level financial KPIs
  let totalRevenue = 0;
  let pendingRevenue = 0;
  let unitsSold = 0;
  const paidOrderIds = new Set<string>();

  // Map to aggregate product revenue
  const productMap = new Map<
    string,
    {
      productId: string;
      productName: string;
      batchCode: string;
      honeyType: string;
      unitsSold: number;
      totalRevenue: number;
      price: number;
    }
  >();

  // Group items by order to construct producer-specific transaction ledger
  const ordersMap = new Map<
    string,
    {
      orderId: string;
      createdAt: string;
      consumerName: string;
      consumerEmail: string;
      status: string;
      producerTotal: number;
      itemsCount: number;
      isMultiProducerCart: boolean;
      items: {
        productId: string;
        productName: string;
        quantity: number;
        priceAtPurchase: number;
        subtotal: number;
      }[];
    }
  >();

  const isPaidStatus = (status: string) =>
    ['PAID', 'SHIPPED', 'DELIVERED'].includes(status.toUpperCase());

  for (const item of producerOrderItems) {
    const itemSubtotal = item.priceAtPurchase * item.quantity;
    const orderStatus = item.order.status.toUpperCase();
    const isPaid = isPaidStatus(orderStatus);

    if (isPaid) {
      totalRevenue += itemSubtotal;
      unitsSold += item.quantity;
      paidOrderIds.add(item.orderId);

      // Product breakdown accumulation (paid only)
      const existingProduct = productMap.get(item.productId) || {
        productId: item.productId,
        productName: item.product.name,
        batchCode: item.product.batch.batchCode,
        honeyType: item.product.batch.honeyType,
        unitsSold: 0,
        totalRevenue: 0,
        price: item.product.price,
      };

      existingProduct.unitsSold += item.quantity;
      existingProduct.totalRevenue += itemSubtotal;
      productMap.set(item.productId, existingProduct);
    } else if (orderStatus === 'PENDING') {
      pendingRevenue += itemSubtotal;
    }

    // Populate order transaction
    if (!ordersMap.has(item.orderId)) {
      // Check if total items in order is greater than producer's items in order
      const totalOrderItemsCount = item.order.items.length;
      ordersMap.set(item.orderId, {
        orderId: item.orderId,
        createdAt: item.order.createdAt.toISOString(),
        consumerName: item.order.consumer?.name || 'Customer',
        consumerEmail: item.order.consumer?.email || '',
        status: item.order.status,
        producerTotal: 0,
        itemsCount: 0,
        isMultiProducerCart: totalOrderItemsCount > 1,
        items: [],
      });
    }

    const orderRecord = ordersMap.get(item.orderId)!;
    orderRecord.producerTotal += itemSubtotal;
    orderRecord.itemsCount += item.quantity;
    orderRecord.items.push({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      subtotal: itemSubtotal,
    });
  }

  const paidOrdersCount = paidOrderIds.size;
  const averageOrderValue =
    paidOrdersCount > 0 ? Math.round((totalRevenue / paidOrdersCount) * 100) / 100 : 0;

  // Daily revenue over the last 14 days
  const today = new Date();
  const dailyRevenue: { date: string; label: string; revenue: number; ordersCount: number }[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split('T')[0];
    const label = `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;

    let dayRevenue = 0;
    const dayOrders = new Set<string>();

    for (const item of producerOrderItems) {
      if (!isPaidStatus(item.order.status)) continue;
      const itemDateStr = new Date(item.order.createdAt).toISOString().split('T')[0];
      if (itemDateStr === dayStr) {
        dayRevenue += item.priceAtPurchase * item.quantity;
        dayOrders.add(item.orderId);
      }
    }

    dailyRevenue.push({
      date: dayStr,
      label,
      revenue: Math.round(dayRevenue * 100) / 100,
      ordersCount: dayOrders.size,
    });
  }

  // Monthly revenue over the last 6 months
  const monthlyRevenue: { month: string; revenue: number; ordersCount: number }[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const monthLabel = `${monthNames[monthIndex]} ${year}`;

    let monthTotal = 0;
    const monthOrders = new Set<string>();

    for (const item of producerOrderItems) {
      if (!isPaidStatus(item.order.status)) continue;
      const orderDate = new Date(item.order.createdAt);
      if (orderDate.getFullYear() === year && orderDate.getMonth() === monthIndex) {
        monthTotal += item.priceAtPurchase * item.quantity;
        monthOrders.add(item.orderId);
      }
    }

    monthlyRevenue.push({
      month: monthLabel,
      revenue: Math.round(monthTotal * 100) / 100,
      ordersCount: monthOrders.size,
    });
  }

  const productRevenueBreakdown = Array.from(productMap.values()).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  const recentTransactions = Array.from(ordersMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    producer,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    pendingRevenue: Math.round(pendingRevenue * 100) / 100,
    unitsSold,
    paidOrdersCount,
    averageOrderValue,
    dailyRevenue,
    monthlyRevenue,
    productRevenueBreakdown,
    recentTransactions,
  };
}
