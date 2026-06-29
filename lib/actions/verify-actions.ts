'use server';

import prisma from '@/lib/prisma';

export async function verifyBatchByHash(hash: string) {
  if (!hash || hash.length < 5) {
    return null;
  }

  // Try to find a batch whose verificationHash contains or matches the provided hash
  const batch = await prisma.honeyBatch.findFirst({
    where: {
      OR: [
        { verificationHash: { equals: hash } },
        { verificationHash: { contains: hash } },
        { batchCode: { equals: hash } },
        { batchCode: { contains: hash } },
      ],
    },
    include: {
      producer: {
        include: {
          user: {
            select: { name: true },
          },
          ratings: true,
        },
      },
      qrCodes: true,
      reviews: {
        select: { rating: true },
      },
    },
  });

  if (!batch) return null;

  const totalReviews = batch.reviews.length;
  const averageRating =
    totalReviews > 0
      ? batch.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return {
    batchCode: batch.batchCode,
    honeyType: batch.honeyType,
    quantity: batch.quantity,
    unit: 'kg',
    harvestDate: batch.harvestDate.toISOString().split('T')[0],
    description: batch.description || 'No description provided.',
    verified: batch.verified,
    verificationHash: batch.verificationHash,
    honeyImage: batch.honeyImage,
    packagingImage: batch.packagingImage,
    honeyVideo: batch.honeyVideo,
    price: batch.price,
    blockchainTx: batch.blockchainTx,
    producer: {
      name: batch.producer.user.name || batch.producer.businessName,
      location: batch.producer.location || 'Unknown',
      rating: averageRating || batch.producer.ratings?.averageRating || 0,
      reviewCount: totalReviews || batch.producer.ratings?.totalReviews || 0,
    },
    scans: batch.scanCount,
    history: [
      {
        event: 'Batch Registered',
        date: batch.createdAt.toISOString().split('T')[0],
        location: batch.producer.location || 'Unknown',
      },
      {
        event: 'Harvested',
        date: batch.harvestDate.toISOString().split('T')[0],
        location: batch.producer.location || 'Unknown',
      },
      ...(batch.verifiedAt
        ? [
            {
              event: 'Quality Check Passed',
              date: batch.verifiedAt.toISOString().split('T')[0],
              location: 'HiveTrace Verification Network',
            },
          ]
        : []),
    ],
  };
}
