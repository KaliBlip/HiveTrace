'use server';

import prisma from '@/lib/prisma';

export async function verifyBatchByHash(hash: string) {
  if (!hash || hash.length < 5) {
    return null;
  }

  // Accept public verifier values and legacy product links that used the internal batch id.
  const batch = await prisma.honeyBatch.findFirst({
    where: {
      verified: true,
      boardStatus: 'APPROVED',
      certificate: { is: { status: 'ACTIVE', expiresAt: { gt: new Date() } } },
      OR: [
        { id: hash },
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
      certificate: true,
      boardReviewer: { select: { name: true } },
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
    registrationLocation: batch.registrationLocation,
    blockchainTx: batch.blockchainTx,
    certificate: batch.certificate
      ? {
          number: batch.certificate.number,
          status: batch.certificate.status,
          issuedAt: batch.certificate.issuedAt.toISOString(),
          expiresAt: batch.certificate.expiresAt.toISOString(),
        }
      : null,
    validationBoard: batch.boardReviewer?.name || 'Validation Board',
    inspectionDate: batch.producer.lastInspectionAt?.toISOString() || null,
    approvalDate: batch.boardReviewedAt?.toISOString() || null,
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
        location: batch.registrationLocation || batch.producer.location || 'Unknown',
      },
      {
        event: 'Harvested',
        date: batch.harvestDate.toISOString().split('T')[0],
        location: batch.producer.location || 'Unknown',
      },
      ...(batch.verifiedAt
        ? [
            {
              event: 'Validation Board Approval',
              date: batch.verifiedAt.toISOString().split('T')[0],
              location: batch.boardReviewer?.name || 'Validation Board',
            },
          ]
        : []),
    ],
  };
}
