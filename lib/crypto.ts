import crypto from 'crypto';

/**
 * Generates a unique HMAC-SHA256 hash for a honey batch based on its core data.
 * This hash ensures the integrity of the batch information.
 */
export function generateBatchHash(data: {
  producerId: string;
  batchCode: string;
  honeyType: string;
  quantity: number;
  harvestDate: string;
}) {
  const secret = process.env.BATCH_HASH_SECRET || 'fallback-secret-for-dev-only';
  
  // Canonical data string
  const payload = JSON.stringify({
    producerId: data.producerId,
    batchCode: data.batchCode,
    honeyType: data.honeyType,
    quantity: data.quantity,
    harvestDate: data.harvestDate
  });

  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Verifies if a provided hash matches the batch data.
 */
export function verifyBatchHash(data: any, hash: string) {
  const generatedHash = generateBatchHash(data);
  return generatedHash === hash;
}

/**
 * Checks if a scan location is within the allowed distance from the producer apiary.
 */
export function isLocationWithinThreshold(
  scanLat: number,
  scanLng: number,
  producerLat: number,
  producerLng: number,
  thresholdKm: number
): boolean {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(producerLat - scanLat);
  const dLng = toRad(producerLng - scanLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(scanLat)) * Math.cos(toRad(producerLat)) * Math.sin(dLng / 2) ** 2;
  const distanceKm = earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return distanceKm <= thresholdKm;
}
