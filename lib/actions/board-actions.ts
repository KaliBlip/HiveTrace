'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function requireBoardMember() {
  const session = await auth();
  if (!session?.user?.id || String((session.user as { role?: string }).role).toUpperCase() !== 'VALIDATION_BOARD') {
    throw new Error('Only Validation Board members can perform this action');
  }
  return session.user.id;
}

export async function getBoardQueue() {
  await requireBoardMember();
  const [producers, batches] = await Promise.all([
    prisma.producer.findMany({
      where: { status: { in: ['PENDING', 'PENDING_BOARD_REVIEW', 'INSPECTION_REQUIRED', 'RENEWAL_REQUIRED', 'INSPECTION_RECORDED'] } },
      include: { user: { select: { name: true, email: true } }, inspections: { orderBy: { visitDate: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.honeyBatch.findMany({
      where: { boardStatus: { in: ['PENDING_REVIEW', 'CHANGES_REQUESTED'] } },
      include: { producer: { include: { inspections: { orderBy: { visitDate: 'desc' }, take: 1 } } } },
      orderBy: { createdAt: 'asc' },
    }),
  ]);
  return {
    producers,
    batches: batches.map((batch) => ({
      ...batch,
      inspectionEvidence: batch.producer.inspections[0]
        ? {
            visitDate: batch.producer.inspections[0].visitDate,
            apiaryPhotos: JSON.parse(batch.producer.inspections[0].apiaryPhotos) as string[],
            hivePhotos: JSON.parse(batch.producer.inspections[0].hivePhotos) as string[],
            honeyPhotos: JSON.parse(batch.producer.inspections[0].honeyPhotos) as string[],
            packagingPhotos: JSON.parse(batch.producer.inspections[0].packagingPhotos) as string[],
          }
        : null,
    })),
  };
}

export async function getBoardProducerDirectory() {
  await requireBoardMember();
  return prisma.producer.findMany({
    include: {
      user: { select: { name: true, email: true, phoneNumber: true } },
      inspections: { orderBy: { visitDate: 'desc' }, take: 1 },
      _count: { select: { batches: true, inspections: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getBoardProducerCase(producerId: string) {
  await requireBoardMember();
  const producer = await prisma.producer.findUnique({
    where: { id: producerId },
    include: {
      user: { select: { name: true, email: true, phoneNumber: true } },
      inspections: { orderBy: { visitDate: 'desc' } },
      batches: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!producer) throw new Error('Producer case not found');

  return {
    ...producer,
    inspections: producer.inspections.map((inspection) => ({
      ...inspection,
      apiaryPhotos: JSON.parse(inspection.apiaryPhotos) as string[],
      hivePhotos: JSON.parse(inspection.hivePhotos) as string[],
      honeyPhotos: JSON.parse(inspection.honeyPhotos) as string[],
      packagingPhotos: JSON.parse(inspection.packagingPhotos) as string[],
      certificates: JSON.parse(inspection.certificates) as string[],
    })),
  };
}

export async function submitFarmInspection(data: {
  producerId: string;
  visitDate: string;
  latitude?: number;
  longitude?: number;
  identityDocumentUrl: string;
  apiaryPhotos: string[];
  hivePhotos: string[];
  honeyPhotos: string[];
  packagingPhotos: string[];
  certificates: string[];
  videoUrl: string;
  signedReportUrl: string;
  notes: string;
}) {
  const verifierId = await requireBoardMember();
  const requiredValues = [
    data.identityDocumentUrl, data.videoUrl, data.signedReportUrl, data.notes,
    ...data.apiaryPhotos, ...data.hivePhotos, ...data.honeyPhotos,
    ...data.packagingPhotos, ...data.certificates,
  ];
  if (!data.apiaryPhotos.length || !data.hivePhotos.length || !data.honeyPhotos.length || !data.packagingPhotos.length || !data.certificates.length || requiredValues.some((value) => !value?.trim())) {
    throw new Error('Identity document, all inspection photographs, certificates, video, signed report, and notes are required');
  }

  const inspection = await prisma.farmInspection.create({
    data: {
      producerId: data.producerId,
      verifierId,
      visitDate: new Date(data.visitDate),
      latitude: data.latitude,
      longitude: data.longitude,
      identityDocumentUrl: data.identityDocumentUrl,
      apiaryPhotos: JSON.stringify(data.apiaryPhotos),
      hivePhotos: JSON.stringify(data.hivePhotos),
      honeyPhotos: JSON.stringify(data.honeyPhotos),
      packagingPhotos: JSON.stringify(data.packagingPhotos),
      certificates: JSON.stringify(data.certificates),
      videoUrl: data.videoUrl,
      signedReportUrl: data.signedReportUrl,
      notes: data.notes,
    },
  });

  await prisma.producer.update({
    where: { id: data.producerId },
    data: { status: 'INSPECTION_RECORDED', lastInspectionAt: inspection.visitDate },
  });
  revalidatePath('/board');
  revalidatePath('/dashboard');
  return inspection;
}

export async function decideProducerAccreditation(producerId: string, decision: 'ACCREDITED' | 'REJECTED' | 'INSPECTION_REQUIRED', notes?: string) {
  const verifierId = await requireBoardMember();
  const inspection = await prisma.farmInspection.findFirst({ where: { producerId }, orderBy: { visitDate: 'desc' } });
  if (!inspection && decision === 'ACCREDITED') throw new Error('A completed farm inspection is required before accreditation');

  const accredited = decision === 'ACCREDITED';
  await prisma.$transaction([
    prisma.producer.update({
      where: { id: producerId },
      data: {
        verified: accredited,
        verifiedAt: accredited ? new Date() : null,
        status: decision,
        accreditedById: accredited ? verifierId : null,
        accreditationExpiresAt: accredited ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null,
      },
    }),
    ...(inspection ? [prisma.farmInspection.update({ where: { id: inspection.id }, data: { outcome: accredited ? 'APPROVED' : decision === 'REJECTED' ? 'REJECTED' : 'SUBMITTED', notes: notes?.trim() || inspection.notes } })] : []),
  ]);
  revalidatePath('/board');
  revalidatePath('/admin/producers');
}

export async function decideBatchValidation(batchId: string, decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED', notes: string) {
  const verifierId = await requireBoardMember();
  if (!notes.trim()) throw new Error('Board decision notes are required');

  const batch = await prisma.honeyBatch.findUnique({ where: { id: batchId }, include: { producer: true } });
  if (!batch) throw new Error('Batch not found');
  if (!batch.producer.verified || batch.producer.status !== 'ACCREDITED') throw new Error('The producer is not currently accredited');
  if (!batch.honeyImage || !batch.packagingImage || !batch.honeyVideo) throw new Error('Finished honey, packaging, and batch video evidence are required');

  const approved = decision === 'APPROVED';
  await prisma.$transaction(async (tx) => {
    await tx.honeyBatch.update({
      where: { id: batchId },
      data: {
        verified: approved,
        verifiedAt: approved ? new Date() : null,
        boardStatus: decision,
        boardDecisionNotes: notes.trim(),
        boardReviewedAt: new Date(),
        boardReviewerId: verifierId,
      },
    });
    if (approved) {
      await tx.qRCode.upsert({
        where: { code: JSON.stringify({ batchId: batch.batchCode, hash: batch.verificationHash }) },
        update: {},
        create: { batchId, code: JSON.stringify({ batchId: batch.batchCode, hash: batch.verificationHash }) },
      });
      await tx.validationCertificate.upsert({
        where: { batchId },
        update: { status: 'ACTIVE', issuedAt: new Date(), expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), issuedById: verifierId, notes: notes.trim() },
        create: { batchId, number: `HT-CERT-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`, expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), issuedById: verifierId, notes: notes.trim() },
      });
    }
  });
  revalidatePath('/board');
  revalidatePath('/dashboard/batches');
  revalidatePath('/shop');
  revalidatePath(`/verify/${batch.verificationHash}`);
}
