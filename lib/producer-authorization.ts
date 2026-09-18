import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * Returns the current producer only when its account has passed the admin
 * verification workflow. Keep this check at mutation boundaries: route guards
 * and dashboard UI are not sufficient protection against direct requests.
 */
export async function requireApprovedProducer() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const role = String((session.user as { role?: string }).role ?? '').toUpperCase();
  if (role !== 'PRODUCER') {
    throw new Error('Only producer accounts can perform this action');
  }

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) {
    throw new Error('Producer profile not found');
  }

  if (!producer.verified || producer.status !== 'ACCREDITED' || (producer.accreditationExpiresAt && producer.accreditationExpiresAt < new Date())) {
    throw new Error('Your producer account must be approved before you can manage batches, products, or orders');
  }

  return producer;
}
