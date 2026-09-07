'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { HIVETRACE_COMMISSION_RATE } from '@/lib/config';

export interface AdminMarketplaceFinances {
  totalGMV: number; // Gross Merchandise Value across all paid orders
  totalHiveTraceCommission: number; // 5% platform earnings
  totalProducerPayouts: number; // 95% net to all producers
  pendingGMV: number;
  pendingCommission: number;
  pendingPayouts: number;
  totalPaidOrdersCount: number;
  totalUnitsSold: number;
  commissionRatePercent: number;

  producerBreakdowns: {
    producerId: string;
    businessName: string;
    location: string;
    ownerName: string;
    email: string;
    payoutMethod: string | null;
    payoutAccountDetails: string;
    paidOrdersCount: number;
    unitsSold: number;
    grossSales: number;
    hiveTraceFee: number;
    netPayout: number;
  }[];

  recentPlatformOrders: {
    orderId: string;
    createdAt: string;
    consumerName: string;
    consumerEmail: string;
    status: string;
    totalAmount: number;
    hiveTraceFee: number;
    producerPayoutsTotal: number;
    producersCount: number;
    isMultiProducerCart: boolean;
    itemsCount: number;
  }[];
}

export async function getAdminMarketplaceFinances(): Promise<AdminMarketplaceFinances | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') return null;

  // 1. Fetch all orders with items, products, producers, consumers
  const allOrders = await prisma.order.findMany({
    include: {
      consumer: { select: { name: true, email: true } },
      items: {
        include: {
          product: {
            include: {
              producer: {
                include: {
                  user: { select: { name: true, email: true } },
                },
              },
            },
          },
        },
      },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // 2. Fetch all producers for financial ledger aggregation
  const allProducers = await prisma.producer.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const isPaidStatus = (status: string) =>
    ['PAID', 'SHIPPED', 'DELIVERED'].includes(status.toUpperCase());

  let totalGMV = 0;
  let pendingGMV = 0;
  let totalUnitsSold = 0;
  let totalPaidOrdersCount = 0;

  // Map to accumulate financials per producer
  const producerStatsMap = new Map<
    string,
    {
      producerId: string;
      businessName: string;
      location: string;
      ownerName: string;
      email: string;
      payoutMethod: string | null;
      payoutAccountDetails: string;
      paidOrderIds: Set<string>;
      unitsSold: number;
      grossSales: number;
      hiveTraceFee: number;
      netPayout: number;
    }
  >();

  // Initialize for all producers
  for (const p of allProducers) {
    let payoutDetails = 'Not configured';
    if (p.payoutMethod === 'BANK' && p.bankName) {
      payoutDetails = `${p.bankName} (${p.accountNumber || '—'})`;
    } else if (p.momoNumber) {
      payoutDetails = `${p.momoProvider || 'MTN MoMo'}: ${p.momoNumber}`;
    }

    producerStatsMap.set(p.id, {
      producerId: p.id,
      businessName: p.businessName,
      location: p.location,
      ownerName: p.user.name,
      email: p.user.email,
      payoutMethod: p.payoutMethod || 'MOMO',
      payoutAccountDetails: payoutDetails,
      paidOrderIds: new Set(),
      unitsSold: 0,
      grossSales: 0,
      hiveTraceFee: 0,
      netPayout: 0,
    });
  }

  const recentPlatformOrders = [];

  for (const order of allOrders) {
    const isPaid = isPaidStatus(order.status);
    let orderGross = 0;
    let orderUnits = 0;
    const orderProducerIds = new Set<string>();

    for (const item of order.items) {
      const itemGross = item.priceAtPurchase * item.quantity;
      orderGross += itemGross;
      orderUnits += item.quantity;

      const producerId = item.product?.producerId;
      if (producerId) {
        orderProducerIds.add(producerId);

        if (isPaid && producerStatsMap.has(producerId)) {
          const pStat = producerStatsMap.get(producerId)!;
          const fee = Math.round(itemGross * HIVETRACE_COMMISSION_RATE * 100) / 100;
          const net = Math.round((itemGross - fee) * 100) / 100;

          pStat.grossSales += itemGross;
          pStat.hiveTraceFee += fee;
          pStat.netPayout += net;
          pStat.unitsSold += item.quantity;
          pStat.paidOrderIds.add(order.id);
        }
      }
    }

    const orderFee = Math.round(orderGross * HIVETRACE_COMMISSION_RATE * 100) / 100;
    const orderPayout = Math.round((orderGross - orderFee) * 100) / 100;

    if (isPaid) {
      totalGMV += orderGross;
      totalUnitsSold += orderUnits;
      totalPaidOrdersCount += 1;
    } else if (order.status.toUpperCase() === 'PENDING') {
      pendingGMV += orderGross;
    }

    recentPlatformOrders.push({
      orderId: order.id,
      createdAt: order.createdAt.toISOString(),
      consumerName: order.consumer?.name || 'Customer',
      consumerEmail: order.consumer?.email || '',
      status: order.status,
      totalAmount: orderGross,
      hiveTraceFee: orderFee,
      producerPayoutsTotal: orderPayout,
      producersCount: orderProducerIds.size,
      isMultiProducerCart: orderProducerIds.size > 1,
      itemsCount: orderUnits,
    });
  }

  const totalHiveTraceCommission = Math.round(totalGMV * HIVETRACE_COMMISSION_RATE * 100) / 100;
  const totalProducerPayouts = Math.round((totalGMV - totalHiveTraceCommission) * 100) / 100;

  const pendingCommission = Math.round(pendingGMV * HIVETRACE_COMMISSION_RATE * 100) / 100;
  const pendingPayouts = Math.round((pendingGMV - pendingCommission) * 100) / 100;

  const producerBreakdowns = Array.from(producerStatsMap.values())
    .map((p) => ({
      ...p,
      paidOrdersCount: p.paidOrderIds.size,
      grossSales: Math.round(p.grossSales * 100) / 100,
      hiveTraceFee: Math.round(p.hiveTraceFee * 100) / 100,
      netPayout: Math.round(p.netPayout * 100) / 100,
    }))
    .sort((a, b) => b.grossSales - a.grossSales);

  return {
    totalGMV: Math.round(totalGMV * 100) / 100,
    totalHiveTraceCommission,
    totalProducerPayouts,
    pendingGMV: Math.round(pendingGMV * 100) / 100,
    pendingCommission,
    pendingPayouts,
    totalPaidOrdersCount,
    totalUnitsSold,
    commissionRatePercent: HIVETRACE_COMMISSION_RATE * 100,
    producerBreakdowns,
    recentPlatformOrders: recentPlatformOrders.slice(0, 30),
  };
}
