/**
 * QR code utility functions for HiveTrace
 */

/**
 * Encode batch data for QR code
 */
export function encodeQRData(batchId: string, hash: string): string {
  return JSON.stringify({ batchId, hash });
}

/**
 * Format batch URL for QR code
 * Can be used to embed deep links in QR codes
 */
export function formatBatchQRUrl(batchId: string, hash: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/verify/${hash}`;
}

/**
 * Parse QR code scan result
 * Handles both encoded data and direct URLs
 */
export function parseQRScanResult(scanResult: string): {
  batchId: string;
  hash: string;
} {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(scanResult);
    if (parsed.batchId && parsed.hash) {
      return { batchId: parsed.batchId, hash: parsed.hash };
    }
  } catch {
    // Ignore JSON parse error, try URL parsing
  }

  // Try to extract from URL parameters
  try {
    const url = new URL(scanResult);
    // Handle /verify/[hash] URLs
    const pathParts = url.pathname.split('/');
    const verifyIdx = pathParts.indexOf('verify');
    if (verifyIdx !== -1 && pathParts[verifyIdx + 1]) {
      return { batchId: '', hash: pathParts[verifyIdx + 1] };
    }

    const dataParam = url.searchParams.get('data');
    if (dataParam) {
      const decoded = JSON.parse(decodeURIComponent(dataParam));
      return { batchId: decoded.batchId, hash: decoded.hash };
    }
  } catch {
    // Ignore URL parsing error
  }

  // If it's just a batch ID, return it with empty hash
  if (scanResult.startsWith('HT-')) {
    return { batchId: scanResult, hash: '' };
  }

  throw new Error('Invalid QR code format');
}

/**
 * Check if QR code data is valid
 */
export function isValidQRCode(data: string): boolean {
  try {
    parseQRScanResult(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate QR code for batch with verification hash
 * Used when creating new batches
 */
export function createBatchQRCode(batchId: string, hash: string): string {
  return encodeQRData(batchId, hash);
}
