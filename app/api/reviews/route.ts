import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface ReviewRequest {
  batchId: string;
  userId: string;
  rating: number;
  text: string;
  verified?: boolean;
}

/**
 * POST /api/reviews
 * Create a new review for a batch
 */
export async function POST(request: NextRequest) {
  try {
    const body: ReviewRequest = await request.json();
    const { batchId, userId, rating, text, verified = false } = body;

    // Validate required fields
    if (!batchId || !userId || !rating || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        batchId,
        userId,
        rating,
        text,
        verified,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reviews
 * Get reviews for a specific batch
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json(
        { error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { batchId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Review fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
