import { NextRequest, NextResponse } from 'next/server';
import { verifyBlockOnLedger, verifyLedgerIntegrity } from '@/lib/blockchain';

/**
 * GET /api/blockchain/verify?hash=0x...
 * Verify a ledger block hash and chain integrity
 */
export async function GET(request: NextRequest) {
  try {
    const hash = request.nextUrl.searchParams.get('hash');

    if (!hash) {
      const integrity = await verifyLedgerIntegrity();
      return NextResponse.json({
        success: true,
        chain: integrity,
      });
    }

    const result = await verifyBlockOnLedger(hash);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: 'Block not found on ledger' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      block: result.block,
      chainValid: result.chainValid,
    });
  } catch (error) {
    console.error('Blockchain verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify blockchain record' },
      { status: 500 }
    );
  }
}
