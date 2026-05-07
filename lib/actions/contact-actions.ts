'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitContactMessage(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
    throw new Error('All fields are required');
  }

  const contactMessage = await prisma.contactMessage.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      subject: data.subject,
      message: data.message,
    },
  });

  revalidatePath('/admin');
  return contactMessage;
}

export async function getContactMessages() {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function markContactMessageAsRead(id: string) {
  return await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });
}
