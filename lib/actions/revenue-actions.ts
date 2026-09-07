'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const HIVETRACE_COMMISSION_RATE = 0.05; // 5% HiveTrace Platform Commission

export interface ProducerRevenueStats {
  producer: {
    id: string;
    businessName: string;
    verified: boolean;
    payoutMethod: string | null;
    accountName: string | null;
    bankName: string | null;
    accountNumber: string | null;
    momoProvider: string | null;
    momoNumber: string | null;
  };
  // Paid / Settled
  grossRevenue: number;
  platformCommission: number;
  netRevenue: number; // 95% Producer Payout
  totalRevenue: number; // Alias for netRevenue for consistency

  // Pending
  pendingGrossRevenue: number;
  pendingPlatformCommission: number;
  pendingNetRevenue: number;
  pendingRevenue: number; // Alias for pendingNetRevenue

  // KPIs
  unitsSold: number;
  paidOrdersCount: number;
  averageOrderValue: number;
  commissionRatePercent: number;

  dailyRevenue: { date: string; label: string; gross: number; revenue: number; commission: number; ordersCount: number }[];
  monthlyRevenue: { month: string; gross: number; revenue: number; commission: number; ordersCount: number }[];
  productRevenueBreakdown: {
    productId: string;
    productName: string;
    batchCode: string;
    honeyType: string;
    unitsSold: number;
    grossRevenue: number;
    platformCommission: number;
    netRevenue: number;
    totalRevenue: number;
    price: number;
  }[];
  recentTransactions: {
    orderId: string;
    createdAt: string;
    consumerName: string;
    consumerEmail: string;
    status: string;
    grossTotal: number;
    platformCommission: number;
    netTotal: number;
    producerTotal: number; // Alias for netTotal
    itemsCount: number;
    isMultiProducerCart: boolean;
    items: {
      productId: string;
      productName: string;
      quantity: number;
      priceAtPurchase: number;
      grossSubtotal: number;
      platformFee: number;
      netSubtotal: number;
      subtotal: number;
    }[];
  }[];
}

export async function getProducerRevenueStats(): Promise<ProducerRevenueStats | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      businessName: true,
      verified: true,
      payoutMethod: true,
      accountName: true,
      bankName: true,
      accountNumber: true,
      momoProvider: true,
      momoNumber: true,
    },
  });

  if (!producer) return null;

  // Fetch all order items linked to this producer's products with their parent orders
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

  // Financial KPIs
  let grossRevenue = 0;
  let pendingGrossRevenue = 0;
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
      grossRevenue: number;
      platformCommission: number;
      netRevenue: number;
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
      grossTotal: number;
      platformCommission: number;
      netTotal: number;
      producerTotal: number;
      itemsCount: number;
      isMultiProducerCart: boolean;
      items: {
        productId: string;
        productName: string;
        quantity: number;
        priceAtPurchase: number;
        grossSubtotal: number;
        platformFee: number;
        netSubtotal: number;
        subtotal: number;
      }[];
    }
  >();

  const isPaidStatus = (status: string) =>
    ['PAID', 'SHIPPED', 'DELIVERED'].includes(status.toUpperCase());

  for (const item of producerOrderItems) {
    const itemGross = item.priceAtPurchase * item.quantity;
    const itemFee = Math.round(itemGross * HIVETRACE_COMMISSION_RATE * 100) / 100;
    const itemNet = Math.round((itemGross - itemFee) * 100) / 100;

    const orderStatus = item.order.status.toUpperCase();
    const isPaid = isPaidStatus(orderStatus);

    if (isPaid) {
      grossRevenue += itemGross;
      unitsSold += item.quantity;
      paidOrderIds.add(item.orderId);

      // Product breakdown accumulation (paid only)
      const existingProduct = productMap.get(item.productId) || {
        productId: item.productId,
        productName: item.product.name,
        batchCode: item.product.batch.batchCode,
        honeyType: item.product.batch.honeyType,
        unitsSold: 0,
        grossRevenue: 0,
        platformCommission: 0,
        netRevenue: 0,
        totalRevenue: 0,
        price: item.product.price,
      };

      existingProduct.unitsSold += item.quantity;
      existingProduct.grossRevenue += itemGross;
      existingProduct.platformCommission += itemFee;
      existingProduct.netRevenue += itemNet;
      existingProduct.totalRevenue += itemNet;
      productMap.set(item.productId, existingProduct);
    } else if (orderStatus === 'PENDING') {
      pendingGrossRevenue += itemGross;
    }

    // Populate order transaction
    if (!ordersMap.has(item.orderId)) {
      const totalOrderItemsCount = item.order.items.length;
      ordersMap.set(item.orderId, {
        orderId: item.orderId,
        createdAt: item.order.createdAt.toISOString(),
        consumerName: item.order.consumer?.name || 'Customer',
        consumerEmail: item.order.consumer?.email || '',
        status: item.order.status,
        grossTotal: 0,
        platformCommission: 0,
        netTotal: 0,
        producerTotal: 0,
        itemsCount: 0,
        isMultiProducerCart: totalOrderItemsCount > 1,
        items: [],
      });
    }

    const orderRecord = ordersMap.get(item.orderId)!;
    orderRecord.grossTotal += itemGross;
    orderRecord.platformCommission += itemFee;
    orderRecord.netTotal += itemNet;
    orderRecord.producerTotal += itemNet;
    orderRecord.itemsCount += item.quantity;
    orderRecord.items.push({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      grossSubtotal: itemGross,
      platformFee: itemFee,
      netSubtotal: itemNet,
      subtotal: itemNet,
    });
  }

  const platformCommission = Math.round(grossRevenue * HIVETRACE_COMMISSION_RATE * 100) / 100;
  const netRevenue = Math.round((grossRevenue - platformCommission) * 100) / 100;

  const pendingPlatformCommission =
    Math.round(pendingGrossRevenue * HIVETRACE_COMMISSION_RATE * 100) / 100;
  const pendingNetRevenue =
    Math.round((pendingGrossRevenue - pendingPlatformCommission) * 100) / 100;

  const paidOrdersCount = paidOrderIds.size;
  const averageOrderValue =
    paidOrdersCount > 0 ? Math.round((netRevenue / paidOrdersCount) * 100) / 100 : 0;

  // Daily revenue over last 14 days
  const today = new Date();
  const dailyRevenue: {
    date: string;
    label: string;
    gross: number;
    revenue: number;
    commission: number;
    ordersCount: number;
  }[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split('T')[0];
    const label = `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;

    let dayGross = 0;
    const dayOrders = new Set<string>();

    for (const item of producerOrderItems) {
      if (!isPaidStatus(item.order.status)) continue;
      const itemDateStr = new Date(item.order.createdAt).toISOString().split('T')[0];
      if (itemDateStr === dayStr) {
        dayGross += item.priceAtPurchase * item.quantity;
        dayOrders.add(item.orderId);
      }
    }

    const dayFee = Math.round(dayGross * HIVETRACE_COMMISSION_RATE * 100) / 100;
    const dayNet = Math.round((dayGross - dayFee) * 100) / 100;

    dailyRevenue.push({
      date: dayStr,
      label,
      gross: Math.round(dayGross * 100) / 100,
      revenue: dayNet,
      commission: dayFee,
      ordersCount: dayOrders.size,
    });
  }

  // Monthly revenue over last 6 months
  const monthlyRevenue: {
    month: string;
    gross: number;
    revenue: number;
    commission: number;
    ordersCount: number;
  }[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = d.getFullYear();
    const monthIndex = d.getMonth();
    const monthLabel = `${monthNames[monthIndex]} ${year}`;

    let monthGross = 0;
    const monthOrders = new Set<string>();

    for (const item of producerOrderItems) {
      if (!isPaidStatus(item.order.status)) continue;
      const orderDate = new Date(item.order.createdAt);
      if (orderDate.getFullYear() === year && orderDate.getMonth() === monthIndex) {
        monthGross += item.priceAtPurchase * item.quantity;
        monthOrders.add(item.orderId);
      }
    }

    const monthFee = Math.round(monthGross * HIVETRACE_COMMISSION_RATE * 100) / 100;
    const monthNet = Math.round((monthGross - monthFee) * 100) / 100;

    monthlyRevenue.push({
      month: monthLabel,
      gross: Math.round(monthGross * 100) / 100,
      revenue: monthNet,
      commission: monthFee,
      ordersCount: monthOrders.size,
    });
  }

  const productRevenueBreakdown = Array.from(productMap.values()).sort(
    (a, b) => b.netRevenue - a.netRevenue
  );

  const recentTransactions = Array.from(ordersMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    producer,
    grossRevenue: Math.round(grossRevenue * 100) / 100,
    platformCommission,
    netRevenue,
    totalRevenue: netRevenue,
    pendingGrossRevenue: Math.round(pendingGrossRevenue * 100) / 100,
    pendingPlatformCommission,
    pendingNetRevenue,
    pendingRevenue: pendingNetRevenue,
    unitsSold,
    paidOrdersCount,
    averageOrderValue,
    commissionRatePercent: HIVETRACE_COMMISSION_RATE * 100,
    dailyRevenue,
    monthlyRevenue,
    productRevenueBreakdown,
    recentTransactions,
  };
}
