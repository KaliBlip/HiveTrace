import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * POST /api/reviews — create review (authenticated consumer, purchase verified when possible)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { batchId, rating, text } = body;

    if (!batchId || !rating || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const batch = await prisma.honeyBatch.findUnique({
      where: { id: batchId },
      include: { product: true },
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const existing = await prisma.review.findFirst({
      where: { batchId, userId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: 'You already reviewed this batch' }, { status: 400 });
    }

    let verified = false;
    if (batch.product) {
      const paidOrder = await prisma.order.findFirst({
        where: {
          consumerId: session.user.id,
          status: 'PAID',
          items: { some: { productId: batch.product.id } },
        },
      });
      verified = !!paidOrder;
    }

    const review = await prisma.review.create({
      data: {
        batchId,
        userId: session.user.id,
        rating,
        text,
        verified,
      },
      include: { user: { select: { name: true } } },
    });

    // Update producer rating aggregate
    const allReviews = await prisma.review.findMany({
      where: { batch: { producerId: batch.producerId } },
      select: { rating: true },
    });

    await prisma.producerRating.upsert({
      where: { producerId: batch.producerId },
      update: {
        averageRating:
          allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length,
        totalReviews: allReviews.length,
      },
      create: {
        producerId: batch.producerId,
        averageRating:
          allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length,
        totalReviews: allReviews.length,
        trustScore: 100,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

/**
 * GET /api/reviews?batchId= — public read of batch reviews
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { batchId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Review fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
