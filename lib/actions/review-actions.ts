'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function updateProducerRating(producerId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      batch: { producerId },
    },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  await prisma.producerRating.upsert({
    where: { producerId },
    update: { averageRating, totalReviews },
    create: {
      producerId,
      averageRating,
      totalReviews,
      trustScore: 100,
    },
  });
}

export async function getBatchReviews(batchId: string) {
  return prisma.review.findMany({
    where: { batchId },
    include: {
      user: { select: { name: true } },
      batch: { select: { batchCode: true, honeyType: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProducerReviews(producerId: string) {
  return prisma.review.findMany({
    where: {
      batch: { producerId },
    },
    include: {
      user: { select: { name: true } },
      batch: {
        select: {
          batchCode: true,
          honeyType: true,
          product: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}

export async function getProducerReviewStats(producerId: string) {
  const reviews = await prisma.review.findMany({
    where: { batch: { producerId } },
    select: { rating: true, createdAt: true },
  });

  const total = reviews.length;
  const average =
    total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const fiveStar = reviews.filter((r) => r.rating === 5).length;
  const thisMonth = reviews.filter((r) => {
    const d = new Date(r.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return {
    averageRating: average,
    totalReviews: total,
    fiveStarCount: fiveStar,
    fiveStarPercent: total > 0 ? Math.round((fiveStar / total) * 100) : 0,
    thisMonthCount: thisMonth,
  };
}

export async function getBatchDetailForConsumer(batchId: string) {
  const batch = await prisma.honeyBatch.findUnique({
    where: { id: batchId },
    include: {
      producer: {
        include: {
          user: { select: { name: true } },
          ratings: true,
          _count: { select: { batches: true } },
        },
      },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
      product: true,
    },
  });

  if (!batch) return null;

  const avgRating =
    batch.reviews.length > 0
      ? batch.reviews.reduce((s, r) => s + r.rating, 0) / batch.reviews.length
      : batch.producer.ratings?.averageRating ?? 0;

  return {
    ...batch,
    avgRating,
    reviewCount: batch.reviews.length,
  };
}

export async function submitBatchReview(data: {
  batchId: string;
  rating: number;
  text: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('You must be logged in to leave a review');

  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  if (!data.text.trim()) {
    throw new Error('Review text is required');
  }

  const batch = await prisma.honeyBatch.findUnique({
    where: { id: data.batchId },
    include: { product: true },
  });

  if (!batch) throw new Error('Batch not found');

  const existing = await prisma.review.findFirst({
    where: { batchId: data.batchId, userId: session.user.id },
  });

  if (existing) {
    throw new Error('You have already reviewed this batch');
  }

  let verified = false;
  if (batch.product) {
    const paidOrder = await prisma.order.findFirst({
      where: {
        consumerId: session.user.id,
        status: 'PAID',
        items: {
          some: { productId: batch.product.id },
        },
      },
    });
    verified = !!paidOrder;
  }

  const review = await prisma.review.create({
    data: {
      batchId: data.batchId,
      userId: session.user.id,
      rating: data.rating,
      text: data.text.trim(),
      verified,
    },
    include: {
      user: { select: { name: true } },
    },
  });

  await updateProducerRating(batch.producerId);

  revalidatePath(`/consumer/batch/${data.batchId}`);
  revalidatePath(`/consumer/producer/${batch.producerId}`);
  revalidatePath('/dashboard/reviews');

  return review;
}

export async function submitProductReview(data: {
  productId: string;
  rating: number;
  text: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('You must be logged in to leave a review');

  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  if (!data.text.trim()) {
    throw new Error('Review text is required');
  }

  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    include: { batch: true },
  });

  if (!product) throw new Error('Product not found');

  const paidOrder = await prisma.order.findFirst({
    where: {
      consumerId: session.user.id,
      status: 'PAID',
      items: {
        some: { productId: product.id },
      },
    },
  });

  if (!paidOrder) {
    throw new Error('Only buyers with a paid order can review this product');
  }

  const existing = await prisma.review.findFirst({
    where: { batchId: product.batchId, userId: session.user.id },
  });

  if (existing) {
    throw new Error('You have already reviewed this product');
  }

  const review = await prisma.review.create({
    data: {
      batchId: product.batchId,
      userId: session.user.id,
      rating: data.rating,
      text: data.text.trim(),
      verified: true,
    },
    include: {
      user: { select: { name: true } },
    },
  });

  await updateProducerRating(product.producerId);

  revalidatePath(`/shop/${product.id}`);
  revalidatePath(`/consumer/batch/${product.batchId}`);
  revalidatePath(`/consumer/producer/${product.producerId}`);
  revalidatePath('/dashboard/reviews');
  revalidatePath('/admin/products');

  return review;
}

export async function getDashboardReviews() {
  const session = await auth();
  if (!session?.user?.id) return { reviews: [], stats: null };

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) return { reviews: [], stats: null };

  const [reviews, stats] = await Promise.all([
    getProducerReviews(producer.id),
    getProducerReviewStats(producer.id),
  ]);

  return { reviews, stats, producerId: producer.id };
}
