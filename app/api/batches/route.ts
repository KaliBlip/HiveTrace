import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

/**
 * POST /api/batches
 * Create a new honey batch with HMAC-SHA256 verification hash
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      honeyType,
      quantity,
      harvestDate,
      description,
      producerId,
    } = body;

    // Validate required fields
    if (!honeyType || !quantity || !harvestDate || !producerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate batch code (HT-YYYY-XXX-###)
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const batchCode = `HT-${year}-${random}-${sequence}`;

    // Generate HMAC-SHA256 verification hash
    const dataToHash = `${producerId}:${batchCode}:${honeyType}:${quantity}:${harvestDate}`;
    const secret = process.env.BATCH_VERIFICATION_SECRET || 'default-secret';
    const verificationHash = crypto
      .createHmac('sha256', secret)
      .update(dataToHash)
      .digest('hex');

    const batch = await prisma.honeyBatch.create({
      data: {
        batchCode,
        honeyType,
        quantity: parseFloat(quantity),
        harvestDate: new Date(harvestDate),
        description: description || null,
        producerId,
        verificationHash,
        verified: true,
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error('Batch creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create batch' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/batches
 * Get all batches for a producer
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const producerId = searchParams.get('producerId');

    if (!producerId) {
      return NextResponse.json(
        { error: 'Producer ID is required' },
        { status: 400 }
      );
    }

    const batches = await prisma.honeyBatch.findMany({
      where: { producerId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error('Batch fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batches' },
      { status: 500 }
    );
  }
}
