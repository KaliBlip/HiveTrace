import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

    // TODO: Save review to database
    // For now, return mock response
    const review = {
      id: crypto.randomUUID(),
      batchId,
      userId,
      rating,
      text,
      verified,
      createdAt: new Date(),
    };

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('[v0] Review creation error:', error);
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

    // TODO: Fetch reviews from database
    // For now, return mock response
    const reviews = [
      {
        id: 'rev-1',
        batchId,
        reviewer: 'Jane Smith',
        rating: 5,
        text: 'Exceptional quality honey! The QR code verification gave me confidence.',
        verified: true,
        date: '2 days ago',
      },
      {
        id: 'rev-2',
        batchId,
        reviewer: 'John Davis',
        rating: 5,
        text: 'Love knowing exactly where my honey comes from. Great producer!',
        verified: true,
        date: '1 week ago',
      },
      {
        id: 'rev-3',
        batchId,
        reviewer: 'Maria Garcia',
        rating: 4,
        text: 'Very good honey. Slightly grainy texture but tastes wonderful.',
        verified: true,
        date: '2 weeks ago',
      },
    ];

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('[v0] Review fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
