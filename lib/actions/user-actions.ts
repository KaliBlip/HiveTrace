'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function updateProfile(data: { name?: string; image?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      image: data.image,
    },
  });

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');

  return updatedUser;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  if (data.newPassword !== data.confirmPassword) {
    throw new Error('New passwords do not match');
  }

  if (data.newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.password) {
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isValid) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}
