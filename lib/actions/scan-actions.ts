'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function registerScan(qrCodeId: string, locationData: { city?: string; country?: string; ip?: string; lat?: number; lng?: number }) {
  // 1. Log the scan
  const scan = await prisma.qRScan.create({
    data: {
      qrCodeId,
      city: locationData.city,
      country: locationData.country,
      ipAddress: locationData.ip,
      latitude: locationData.lat,
      longitude: locationData.lng,
    },
  });

  // 2. Get the batch associated with this QR code
  const qrCode = await prisma.qRCode.findUnique({
    where: { id: qrCodeId },
    select: { batchId: true },
  });

  if (!qrCode) return scan;

  // 3. Simple Fraud Detection Logic: "Impossible Travel"
  // Check if there are other scans for this QR code in a different country within the last 24 hours
  const recentScans = await prisma.qRScan.findMany({
    where: {
      qrCodeId,
      id: { not: scan.id },
      timestamp: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });

  const suspiciousScans = recentScans.filter((s) => {
    return s.country && locationData.country && s.country !== locationData.country;
  });

  if (suspiciousScans.length > 0) {
    // Create a fraud alert
    await prisma.fraudAlert.create({
      data: {
        batchId: qrCode.batchId,
        type: 'IMPOSSIBLE_TRAVEL',
        severity: 'HIGH',
        description: `QR code scanned in ${locationData.country} and ${suspiciousScans[0].country} within 24 hours.`,
        status: 'FLAGGED',
      },
    });
  }

  revalidatePath(`/admin/fraud`);
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
