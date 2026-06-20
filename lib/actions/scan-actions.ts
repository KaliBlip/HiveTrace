'use server';

import prisma from '@/lib/prisma';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function registerScan(
  qrCodeId: string,
  locationData: { city?: string; country?: string; ip?: string; lat?: number; lng?: number }
) {
  // Retrieve request headers to extract client details in production
  const headerList = await headers();
  const rawIp = headerList.get('x-forwarded-for') || '';
  const clientIp = locationData.ip || (rawIp ? rawIp.split(',')[0].trim() : '127.0.0.1');
  
  const country = locationData.country || headerList.get('x-vercel-ip-country') || 'Unknown';
  const city = locationData.city || headerList.get('x-vercel-ip-city') || 'Unknown';
  const lat = locationData.lat || (headerList.get('x-vercel-ip-latitude') ? parseFloat(headerList.get('x-vercel-ip-latitude')!) : null);
  const lng = locationData.lng || (headerList.get('x-vercel-ip-longitude') ? parseFloat(headerList.get('x-vercel-ip-longitude')!) : null);

  // 1. Log the scan
  const scan = await prisma.qRScan.create({
    data: {
      qrCodeId,
      city,
      country,
      ipAddress: clientIp,
      latitude: lat,
      longitude: lng,
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
    return s.country && country && s.country !== 'Unknown' && country !== 'Unknown' && s.country !== country;
  });

  if (suspiciousScans.length > 0) {
    // Create a fraud alert
    await prisma.fraudAlert.create({
      data: {
        batchId: qrCode.batchId,
        type: 'IMPOSSIBLE_TRAVEL',
        severity: 'HIGH',
        description: `QR code scanned in ${country} and ${suspiciousScans[0].country} within 24 hours.`,
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

export async function registerScanByHash(
  hash: string,
  locationData: { lat?: number; lng?: number; city?: string; country?: string }
) {
  // Find the batch matching the hash (either by verificationHash or batchCode)
  const batch = await prisma.honeyBatch.findFirst({
    where: {
      OR: [
        { verificationHash: hash },
        { batchCode: hash },
      ],
    },
    include: {
      qrCodes: true,
    },
  });

  if (!batch) return null;

  // Find or create a QRCode record for this batch
  let qrCode = batch.qrCodes[0];
  if (!qrCode) {
    const payload = JSON.stringify({
      batchId: batch.batchCode,
      hash: batch.verificationHash,
    });
    qrCode = await prisma.qRCode.create({
      data: {
        batchId: batch.id,
        code: payload,
      },
    });
  }

  // Register the scan using the QR code ID and location details
  return await registerScan(qrCode.id, locationData);
}

