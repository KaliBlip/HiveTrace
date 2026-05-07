import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface VerifyRequest {
  qrCode: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  city?: string;
}

/**
 * POST /api/qr/verify
 * Verify a QR code and return batch information
 * Also logs the scan for fraud detection
 */
export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();
    const { qrCode, latitude, longitude, country, city } = body;

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code is required' },
        { status: 400 }
      );
    }

    // Look up QR code in database
    const qrRecord = await prisma.qRCode.findUnique({
      where: { code: qrCode },
      include: {
        batch: {
          include: {
            producer: {
              include: {
                user: { select: { name: true } },
                ratings: true,
              },
            },
          },
        },
      },
    });

    if (!qrRecord) {
      return NextResponse.json(
        { error: 'Invalid QR code' },
        { status: 404 }
      );
    }

    const batch = qrRecord.batch;

    // Log the scan
    await prisma.qRScan.create({
      data: {
        qrCodeId: qrRecord.id,
        latitude: latitude || null,
        longitude: longitude || null,
        country: country || null,
        city: city || null,
      },
    });

    // Update scan counts
    await prisma.qRCode.update({
      where: { id: qrRecord.id },
      data: {
        scanCount: { increment: 1 },
        lastScannedAt: new Date(),
        firstScannedAt: qrRecord.firstScannedAt || new Date(),
      },
    });

    await prisma.honeyBatch.update({
      where: { id: batch.id },
      data: { scanCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      batch: {
        id: batch.id,
        batchCode: batch.batchCode,
        honeyType: batch.honeyType,
        quantity: batch.quantity,
        harvestDate: batch.harvestDate,
        description: batch.description,
        verificationHash: batch.verificationHash,
        verified: batch.verified,
        scanCount: batch.scanCount + 1,
        producer: {
          id: batch.producer.id,
          businessName: batch.producer.businessName,
          location: batch.producer.location,
          rating: batch.producer.ratings?.averageRating || 0,
          reviews: batch.producer.ratings?.totalReviews || 0,
          verified: batch.producer.verified,
        },
      },
      fraudRiskScore: 0.05,
      message: 'Batch verified successfully',
    });
  } catch (error) {
    console.error('QR verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify QR code' },
      { status: 500 }
    );
  }
}
