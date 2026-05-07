import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/producers/[id]
 * Get producer profile information and ratings
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Producer ID is required' },
        { status: 400 }
      );
    }

    const producer = await prisma.producer.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        ratings: true,
        batches: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        products: {
          where: { isActive: true },
          take: 5,
        },
      },
    });

    if (!producer) {
      return NextResponse.json(
        { error: 'Producer not found' },
        { status: 404 }
      );
    }

    const totalScans = await prisma.honeyBatch.aggregate({
      where: { producerId: id },
      _sum: { scanCount: true },
    });

    const topReviews = await prisma.review.findMany({
      where: {
        batch: { producerId: id },
      },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      ...producer,
      rating: producer.ratings || {
        averageRating: 0,
        totalReviews: 0,
        trustScore: 100,
        fraudCasesCount: 0,
      },
      batchesCount: producer.batches.length,
      totalScans: totalScans._sum.scanCount || 0,
      recentBatches: producer.batches,
      topReviews: topReviews.map((r) => ({
        id: r.id,
        reviewer: r.user.name,
        rating: r.rating,
        text: r.text,
        date: r.createdAt,
      })),
    });
  } catch (error) {
    console.error('Producer profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch producer profile' },
      { status: 500 }
    );
  }
}
