'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function registerScan(batchId: string, locationData: { city?: string; country?: string; ip?: string }) {
  // 1. Log the scan
  const scan = await prisma.qRScan.create({
    data: {
      batchId,
      location: locationData as any,
      ip: locationData.ip,
    },
  });

  // 2. Simple Fraud Detection Logic: "Impossible Travel"
  // Check if there are other scans for this batch in a different country within the last 24 hours
  const recentScans = await prisma.qRScan.findMany({
    where: {
      batchId,
      id: { not: scan.id },
      scannedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });

  const suspiciousScans = recentScans.filter((s: any) => {
    const loc = s.location as any;
    return loc?.country !== locationData.country;
  });

  if (suspiciousScans.length > 0) {
    // Create a fraud alert
    await prisma.fraudAlert.create({
      data: {
        batchId,
        type: 'IMPOSSIBLE_TRAVEL',
        severity: 'HIGH',
        description: `Batch scanned in ${locationData.country} and ${suspiciousScans[0].location?.country} within 24 hours.`,
        status: 'PENDING',
      },
    });
  }

  revalidatePath(`/dashboard/batches/${batchId}`);
  return scan;
}

export async function getFraudAlerts() {
  return await prisma.fraudAlert.findMany({
    include: {
      batch: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
