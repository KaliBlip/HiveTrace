import QRCode from 'qrcode.react';
import { encodeQRData } from './crypto';

/**
 * Generate QR code data URL for a batch
 * Used for displaying QR codes in the UI
 */
export async function generateQRCodeDataUrl(
  batchId: string,
  hash: string
): Promise<string> {
  const qrData = encodeQRData(batchId, hash);
  
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const qrElement = (
        <QRCode
          value={qrData}
          size={256}
          level="H"
          includeMargin={true}
        />
      );
      
      // For server-side generation, we'll return the encoded data directly
      resolve(qrData);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Format batch URL for QR code
 * Can be used to embed deep links in QR codes
 */
export function formatBatchQRUrl(batchId: string, hash: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const encodedData = encodeURIComponent(JSON.stringify({ batchId, hash }));
  return `${baseUrl}/consumer/verify?data=${encodedData}`;
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
    const parsed = parseQRScanResult(data);
    return parsed.batchId.startsWith('HT-') && parsed.batchId.length > 0;
  } catch {
    return false;
  }
}

/**
 * Generate QR code for batch with verification hash
 * Used when creating new batches
 */
export function createBatchQRCode(batchId: string, hash: string): string {
  const qrData = encodeQRData(batchId, hash);
  return qrData;
}
