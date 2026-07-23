'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { config } from '@/lib/config';
import { isLocationWithinThreshold } from '@/lib/crypto';

export async function registerScan(
  qrCodeId: string,
  locationData: { city?: string; country?: string; ip?: string; lat?: number; lng?: number }
) {
  const headerList = await headers();
  const rawIp = headerList.get('x-forwarded-for') || '';
  const clientIp = locationData.ip || (rawIp ? rawIp.split(',')[0].trim() : '127.0.0.1');

  const country = locationData.country || headerList.get('x-vercel-ip-country') || 'Unknown';
  const city = locationData.city || headerList.get('x-vercel-ip-city') || 'Unknown';
  const lat =
    locationData.lat ??
    (headerList.get('x-vercel-ip-latitude')
      ? parseFloat(headerList.get('x-vercel-ip-latitude')!)
      : null);
  const lng =
    locationData.lng ??
    (headerList.get('x-vercel-ip-longitude')
      ? parseFloat(headerList.get('x-vercel-ip-longitude')!)
      : null);

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

  const qrCode = await prisma.qRCode.findUnique({
    where: { id: qrCodeId },
    include: {
      batch: {
        include: {
          producer: true,
        },
      },
    },
  });

  if (!qrCode) return scan;

  await prisma.qRCode.update({
    where: { id: qrCodeId },
    data: {
      scanCount: { increment: 1 },
      lastScannedAt: new Date(),
      firstScannedAt: qrCode.firstScannedAt || new Date(),
    },
  });

  await prisma.honeyBatch.update({
    where: { id: qrCode.batchId },
    data: { scanCount: { increment: 1 } },
  });

  await runFraudChecks(qrCode, scan, { country, city, lat, lng });

  revalidatePath('/admin/fraud');
  return scan;
}

async function runFraudChecks(
  qrCode: {
    id: string;
    batchId: string;
    scanCount: number;
    batch: {
      id: string;
      batchCode: string;
      producer: {
        id: string;
        latitude: number | null;
        longitude: number | null;
      };
    };
  },
  scan: { id: string },
  location: { country: string; city: string; lat: number | null; lng: number | null }
) {
  const recentScans = await prisma.qRScan.findMany({
    where: {
      qrCodeId: qrCode.id,
      id: { not: scan.id },
      timestamp: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  });

  const suspiciousTravel = recentScans.filter(
    (s) =>
      s.country &&
      location.country &&
      s.country !== 'Unknown' &&
      location.country !== 'Unknown' &&
      s.country !== location.country
  );

  if (suspiciousTravel.length > 0) {
    await createFraudAlertIfNew({
      batchId: qrCode.batchId,
      producerId: qrCode.batch.producer.id,
      type: 'IMPOSSIBLE_TRAVEL',
      severity: 'HIGH',
      description: `QR code scanned in ${location.country} and ${suspiciousTravel[0].country} within 24 hours.`,
    });
  }

  if (
    config.features.geoVerification &&
    location.lat != null &&
    location.lng != null &&
    qrCode.batch.producer.latitude != null &&
    qrCode.batch.producer.longitude != null
  ) {
    const withinRange = isLocationWithinThreshold(
      location.lat,
      location.lng,
      qrCode.batch.producer.latitude,
      qrCode.batch.producer.longitude,
      config.fraud.geoThresholdKm
    );

    if (!withinRange) {
      await createFraudAlertIfNew({
        batchId: qrCode.batchId,
        producerId: qrCode.batch.producer.id,
        type: 'GEO_MISMATCH',
        severity: 'MEDIUM',
        description: `Scan location (${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}) is outside the ${config.fraud.geoThresholdKm}km apiary threshold for batch ${qrCode.batch.batchCode}.`,
      });
    }
  }

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const recentBurst = await prisma.qRScan.count({
    where: {
      qrCodeId: qrCode.id,
      timestamp: { gte: oneMinuteAgo },
    },
  });

  if (recentBurst > config.fraud.duplicateQrThreshold) {
    await createFraudAlertIfNew({
      batchId: qrCode.batchId,
      producerId: qrCode.batch.producer.id,
      type: 'DUPLICATE_QR',
      severity: 'HIGH',
      description: `Unusual scan burst detected: ${recentBurst} scans in the last minute for batch ${qrCode.batch.batchCode}.`,
    });
  }
}

async function createFraudAlertIfNew(params: {
  batchId: string;
  producerId: string;
  type: string;
  severity: string;
  description: string;
}) {
  const existing = await prisma.fraudAlert.findFirst({
    where: {
      batchId: params.batchId,
      type: params.type,
      status: { in: ['FLAGGED', 'PENDING', 'INVESTIGATING'] },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  if (existing) return existing;

  return prisma.fraudAlert.create({
    data: {
      batchId: params.batchId,
      producerId: params.producerId,
      type: params.type,
      severity: params.severity,
      description: params.description,
      status: 'FLAGGED',
    },
  });
}

export async function getFraudAlerts() {
  return prisma.fraudAlert.findMany({
    include: {
      batch: true,
      producer: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function registerScanByHash(
  hash: string,
  locationData: { lat?: number; lng?: number; city?: string; country?: string }
) {
  const batch = await prisma.honeyBatch.findFirst({
    where: {
      OR: [{ id: hash }, { verificationHash: hash }, { batchCode: hash }],
    },
    include: {
      qrCodes: true,
    },
  });

  if (!batch) return null;

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

  return registerScan(qrCode.id, locationData);
}

export async function reportBatchDiscrepancy(params: {
  batchCode: string;
  hash: string;
  reason: string;
}) {
  const batch = await prisma.honeyBatch.findFirst({
    where: {
      OR: [{ verificationHash: params.hash }, { batchCode: params.batchCode }],
    },
    include: { producer: true },
  });

  if (!batch) {
    throw new Error('Batch not found');
  }

  const alert = await prisma.fraudAlert.create({
    data: {
      batchId: batch.id,
      producerId: batch.producerId,
      type: 'SUSPICIOUS_ACTIVITY',
      severity: 'MEDIUM',
      description: `Consumer reported discrepancy for batch ${batch.batchCode}: ${params.reason}`,
      status: 'FLAGGED',
      evidence: JSON.stringify({ hash: params.hash, reportedAt: new Date().toISOString() }),
    },
  });

  revalidatePath('/admin/fraud');
  return alert;
}
