import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateBatchHash } from '@/lib/crypto';

/**
 * POST /api/batches — create batch (producer only, requires admin verification)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== 'PRODUCER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { honeyType, quantity, harvestDate, description } = body;

    if (!honeyType || !quantity || !harvestDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const producer = await prisma.producer.findUnique({
      where: { userId: session.user.id },
    });

    if (!producer) {
      return NextResponse.json({ error: 'Producer profile not found' }, { status: 404 });
    }

    if (!producer.verified && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Producer account must be approved before creating batches' },
        { status: 403 }
      );
    }

    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const batchCode = `HT-${year}-${random}-${sequence}`;

    const verificationHash = generateBatchHash({
      producerId: producer.id,
      batchCode,
      honeyType,
      quantity: parseFloat(quantity),
      harvestDate: new Date(harvestDate).toISOString(),
    });

    const batch = await prisma.honeyBatch.create({
      data: {
        batchCode,
        honeyType,
        quantity: parseFloat(quantity),
        harvestDate: new Date(harvestDate),
        description: description || null,
        producerId: producer.id,
        verificationHash,
        verified: false,
        verifiedAt: null,
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error('Batch creation error:', error);
    return NextResponse.json({ error: 'Failed to create batch' }, { status: 500 });
  }
}

/**
 * GET /api/batches?producerId= — get batches for authenticated producer
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const producerId = searchParams.get('producerId');

    if (!producerId) {
      return NextResponse.json({ error: 'Producer ID is required' }, { status: 400 });
    }

    const producer = await prisma.producer.findUnique({
      where: { userId: session.user.id },
    });

    const role = (session.user as { role?: string }).role;
    if (role !== 'ADMIN' && producer?.id !== producerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const batches = await prisma.honeyBatch.findMany({
      where: { producerId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error('Batch fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}
