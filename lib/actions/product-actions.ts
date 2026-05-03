'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getProducerProducts() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) return [];

  return await prisma.product.findMany({
    where: { producerId: producer.id },
    include: { batch: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllActiveProducts() {
  return await prisma.product.findMany({
    where: { isActive: true },
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
      batch: true,
    },
  });
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
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) throw new Error('Producer profile not found');

  // Check if batch already has a listing
  const existingProduct = await prisma.product.findUnique({
    where: { batchId: data.batchId },
  });

  if (existingProduct) {
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
        imageUrl: data.imageUrl || null,
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
      imageUrl: data.imageUrl || null,
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
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath('/dashboard/products');
  revalidatePath('/shop');
}
