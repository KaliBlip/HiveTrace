'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { analyzeHoneyImage, generateFallbackAnalysis, type HoneyAnalysisResult } from '@/lib/honey-analysis';

const ACTIVE_FRAUD_STATUSES = ['FLAGGED', 'PENDING', 'INVESTIGATING'] as const;

export async function getAdminStats() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return {
      producerCount: 0,
      batchCount: 0,
      fraudAlertCount: 0,
      scanCount: 0,
      recentAlerts: [],
      pendingProducers: [],
      trends: { producers: 0, batches: 0, scans: 0 },
    };
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    producerCount,
    batchCount,
    fraudAlertCount,
    scanCount,
    recentAlerts,
    pendingProducers,
    producersThisWeek,
    batchesThisWeek,
    scansThisWeek,
  ] = await Promise.all([
    prisma.producer.count(),
    prisma.honeyBatch.count({ where: { verified: true } }),
    prisma.fraudAlert.count({
      where: { status: { in: [...ACTIVE_FRAUD_STATUSES] } },
    }),
    prisma.qRScan.count(),
    prisma.fraudAlert.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        batch: { select: { batchCode: true } },
      },
    }),
    prisma.producer.findMany({
      where: { verified: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
      },
    }),
    prisma.producer.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.honeyBatch.count({
      where: { verified: true, createdAt: { gte: weekAgo } },
    }),
    prisma.qRScan.count({ where: { timestamp: { gte: weekAgo } } }),
  ]);

  return {
    producerCount,
    batchCount,
    fraudAlertCount,
    scanCount,
    recentAlerts,
    pendingProducers,
    trends: {
      producers: producersThisWeek,
      batches: batchesThisWeek,
      scans: scansThisWeek,
    },
  };
}

export async function getAllProducers() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return await prisma.producer.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        }
      },
      ratings: true,
      _count: {
        select: { batches: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function approveProducer(id: string) {
  void id;
  throw new Error('Producer accreditation is performed only by the Validation Board after a documented farm inspection');
}

export async function rejectProducer(id: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return await prisma.producer.update({
    where: { id },
    data: {
      verified: false,
      status: 'REJECTED',
    }
  });
}

export async function getAllBatches() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return await prisma.honeyBatch.findMany({
    include: {
      producer: {
        include: {
          user: {
            select: { name: true }
          }
        }
      },
      _count: {
        select: { qrCodes: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function verifyAndApproveBatch(
  id: string,
  qualityMetrics?: {
    purity?: number;
    moisture?: number;
    color?: string;
    score?: number;
  }
) {
  void id;
  void qualityMetrics;
  throw new Error('Batch approval, certificate issuance, and QR creation are performed only by the Validation Board after human evidence comparison');
}

export async function updateFraudAlertStatus(
  id: string,
  status: 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const data: {
    status: string;
    investigatedAt?: Date;
    resolvedAt?: Date;
  } = { status };

  if (status === 'INVESTIGATING') {
    data.investigatedAt = new Date();
  }
  if (status === 'RESOLVED' || status === 'DISMISSED') {
    data.resolvedAt = new Date();
  }

  const alert = await prisma.fraudAlert.update({
    where: { id },
    data,
  });

  revalidatePath('/admin/fraud');
  revalidatePath('/admin');
  return alert;
}

export async function getContactMessagesAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function markContactMessageReadAdmin(id: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath('/admin/messages');
  return message;
}

export async function getLedgerBlocks(limit = 50) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const { getLedgerChain, getLedgerStats, verifyLedgerIntegrity } = await import(
    '@/lib/blockchain'
  );

  const [blocks, stats, integrity] = await Promise.all([
    getLedgerChain(limit),
    getLedgerStats(),
    verifyLedgerIntegrity(),
  ]);

  return { blocks, stats, integrity };
}

export async function analyzeBatchWithAI(batchId: string): Promise<HoneyAnalysisResult> {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const batch = await prisma.honeyBatch.findUnique({
    where: { id: batchId },
    include: { producer: true }
  });

  if (!batch) {
    throw new Error('Batch not found');
  }

  // Use honey image or packaging image for analysis
  const imageToAnalyze = batch.honeyImage || batch.packagingImage;
  
  if (!imageToAnalyze) {
    // Return fallback analysis if no images available
    return generateFallbackAnalysis('No image available for AI analysis');
  }

  try {
    const analysisResult = await analyzeHoneyImage(imageToAnalyze);
    
    // If authenticity score is low, create a fraud alert
    if (analysisResult.authenticityScore < 50) {
      await prisma.fraudAlert.create({
        data: {
          batchId: batch.id,
          producerId: batch.producerId,
          type: 'AI_SUSPICIOUS_IMAGE',
          severity: analysisResult.authenticityScore < 30 ? 'HIGH' : 'MEDIUM',
          description: `AI analysis detected potential issues: ${analysisResult.detectedIssues.join(', ')}. Authenticity score: ${analysisResult.authenticityScore}%`,
          status: 'FLAGGED',
          evidence: JSON.stringify(analysisResult),
        }
      });
      
      revalidatePath('/admin/fraud');
    }
    
    return analysisResult;
  } catch (error) {
    console.error('AI analysis failed, returning fallback:', error);
    return generateFallbackAnalysis('AI analysis request failed');
  }
}

export async function approveBatchWithAIAnalysis(
  batchId: string,
  aiAnalysis: HoneyAnalysisResult,
  qualityMetrics?: {
    purity?: number;
    moisture?: number;
    color?: string;
    score?: number;
  }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const batch = await prisma.honeyBatch.findUnique({
    where: { id: batchId },
    include: { producer: true },
  });

  if (!batch) {
    throw new Error('Batch not found');
  }

  // Check if AI analysis indicates potential fraud
  if (aiAnalysis.authenticityScore < 50) {
    throw new Error(`Cannot approve batch: AI analysis indicates potential issues (Authenticity: ${aiAnalysis.authenticityScore}%)`);
  }

  // Combine AI analysis with quality metrics
  const combinedQualityMetrics = {
    ...qualityMetrics,
    aiAuthenticityScore: aiAnalysis.authenticityScore,
    aiQualityScore: aiAnalysis.qualityScore,
    aiClassification: aiAnalysis.classification,
    aiDetectedIssues: aiAnalysis.detectedIssues,
  };

  // Proceed with normal approval process
  return await verifyAndApproveBatch(batchId, combinedQualityMetrics);
}

export async function rejectBatch(batchId: string, reason?: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const batch = await prisma.honeyBatch.findUnique({
    where: { id: batchId },
    include: { producer: true },
  });

  if (!batch) {
    throw new Error('Batch not found');
  }

  // Update batch status to rejected
  await prisma.honeyBatch.update({
    where: { id: batchId },
    data: {
      verified: false,
    },
  });

  // Create fraud alert if reason provided
  if (reason) {
    await prisma.fraudAlert.create({
      data: {
        batchId: batch.id,
        producerId: batch.producerId,
        type: 'MANUAL_REJECTION',
        severity: 'HIGH',
        description: `Batch manually rejected by admin: ${reason}`,
        status: 'FLAGGED',
        evidence: JSON.stringify({ reason, rejectedBy: session.user.email }),
      },
    });

    revalidatePath('/admin/fraud');
  }

  revalidatePath('/admin/batches');
  revalidatePath('/dashboard/batches');

  return { success: true, message: 'Batch rejected successfully' };
}
