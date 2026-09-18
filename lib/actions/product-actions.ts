'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { requireApprovedProducer } from '@/lib/producer-authorization';

export async function getProducerProducts() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) return [];

  return await prisma.product.findMany({
    where: {
      producerId: producer.id,
      isActive: true,
    },
    include: { batch: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllActiveProducts() {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      batch: {
        verified: true,
        boardStatus: 'APPROVED',
        certificate: { is: { status: 'ACTIVE', expiresAt: { gt: new Date() } } },
        producer: { verified: true, status: 'ACCREDITED' },
      },
    },
    include: {
      producer: {
        include: { user: { select: { name: true } } },
      },
      batch: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      producer: {
        include: { user: { select: { name: true, email: true } } },
      },
      batch: {
        include: {
          reviews: {
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  });
}

export async function getPublicProductById(id: string) {
  return prisma.product.findFirst({
    where: {
      id,
      isActive: true,
      batch: {
        verified: true,
        boardStatus: 'APPROVED',
        certificate: { is: { status: 'ACTIVE', expiresAt: { gt: new Date() } } },
        producer: { verified: true, status: 'ACCREDITED' },
      },
    },
    include: {
      producer: { include: { user: { select: { name: true, email: true } } } },
      batch: { include: { reviews: { include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } } } },
    },
  });
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getAdminProducts() {
  await requireAdmin();

  return await prisma.product.findMany({
    include: {
      producer: {
        include: { user: { select: { name: true, email: true } } },
      },
      batch: {
        include: {
          reviews: {
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      _count: {
        select: { orderItems: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function setAdminProductActive(productId: string, isActive: boolean) {
  await requireAdmin();

  await prisma.product.update({
    where: { id: productId },
    data: { isActive },
  });

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath(`/shop/${productId}`);
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  unit: string;
  stock: number;
  batchId: string;
  imageUrl?: string;
}) {
  const producer = await requireApprovedProducer();

  // Fetch the associated batch to get its product image
  const batch = await prisma.honeyBatch.findUnique({
    where: { id: data.batchId },
  });
  if (!batch || batch.producerId !== producer.id) {
    throw new Error('Batch not found or does not belong to your producer account');
  }
  if (!batch.verified) {
    throw new Error('Only admin-verified batches can be listed for sale');
  }
  const certificate = await prisma.validationCertificate.findUnique({ where: { batchId: batch.id } });
  if (!certificate || certificate.status !== 'ACTIVE' || certificate.expiresAt <= new Date()) {
    throw new Error('Only batches with an active Validation Board certificate can be listed for sale');
  }

  const batchImage = batch.honeyImage || batch.packagingImage;

  // Check if batch already has a listing
  const existingProduct = await prisma.product.findUnique({
    where: { batchId: data.batchId },
  });

  if (existingProduct) {
    if (existingProduct.producerId !== producer.id) {
      throw new Error('Unauthorized to manage this product');
    }
    if (existingProduct.isActive) {
      throw new Error('This batch already has an active marketplace listing.');
    }
    // If it exists but is inactive, we could reactivate it or delete and recreate.
    // For now, let's just update the existing one.
    const updatedProduct = await prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        name: data.name,
        description: data.description || '',
        price: data.price,
        unit: data.unit,
        stock: data.stock,
        imageUrl: data.imageUrl || batchImage || null,
        isActive: true,
      },
    });
    revalidatePath('/dashboard/products');
    revalidatePath('/shop');
    return updatedProduct;
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description || '',
      price: data.price,
      unit: data.unit,
      stock: data.stock,
      imageUrl: data.imageUrl || batchImage || null,
      batchId: data.batchId,
      producerId: producer.id,
      isActive: true,
    },
  });

  revalidatePath('/dashboard/products');
  revalidatePath('/shop');
  return product;
}

export async function deleteProduct(id: string) {
  const producer = await requireApprovedProducer();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.producerId !== producer.id) {
    throw new Error('Unauthorized to delete this product');
  }

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/products');
  revalidatePath('/shop');
}

export async function updateProduct(id: string, data: {
  name: string;
  description?: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string;
  isActive?: boolean;
}) {
  const producer = await requireApprovedProducer();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { producer: true },
  });

  if (!product) throw new Error('Product not found');
  
  if (product.producerId !== producer.id) {
    throw new Error('Unauthorized to update this product');
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || '',
      price: data.price,
      unit: data.unit,
      stock: data.stock,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== undefined ? data.isActive : product.isActive,
    },
  });

  revalidatePath('/dashboard/products');
  revalidatePath('/shop');
  revalidatePath(`/shop/${id}`);
  
  return updatedProduct;
}
