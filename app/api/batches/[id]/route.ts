import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Fetch batch from database
    // For now, return mock response
    const batch = {
      id,
      batchCode: 'HT-2024-WFB-001',
      honeyType: 'Wildflower Blend',
      quantity: 50,
      harvestDate: '2024-05-01',
      description: 'Premium wildflower honey from our spring harvest',
      verificationHash: 'a3f8d2e91c7b4e6f9a2d5c8e1b4f7a0d',
      verified: true,
      verifiedAt: '2024-05-01T10:30:00Z',
      scanCount: 234,
      producer: {
        id: 'prod-1',
        businessName: 'Golden Valley Apiaries',
        location: 'California',
        rating: 4.8,
        reviews: 128,
        verified: true,
      },
      reviews: [
        {
          id: 'rev-1',
          reviewer: 'Jane Smith',
          rating: 5,
          text: 'Exceptional quality honey! The QR code verification gave me confidence.',
          date: '2 days ago',
        },
        {
          id: 'rev-2',
          reviewer: 'John Davis',
          rating: 5,
          text: 'Love knowing exactly where my honey comes from.',
          date: '1 week ago',
        },
      ],
    };

    return NextResponse.json(batch);
  } catch (error) {
    console.error('[v0] Batch detail fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch details' },
      { status: 500 }
    );
  }
}
