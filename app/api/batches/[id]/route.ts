import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/batches/[id]
 * Get details for a specific batch including verification info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    const batch = await prisma.honeyBatch.findUnique({
      where: { id },
      include: {
        producer: {
          include: {
            user: { select: { name: true, email: true } },
            ratings: true,
          },
        },
        reviews: {
          include: {
            user: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(batch);
  } catch (error) {
    console.error('Batch detail fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch details' },
      { status: 500 }
    );
  }
}
