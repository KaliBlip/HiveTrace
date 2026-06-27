import crypto from 'crypto';
import prisma from './prisma';

export const GENESIS_HASH = '0'.repeat(64);

export type LedgerBlockType = 'GENESIS' | 'BATCH_VERIFY' | 'FRAUD_RECORD';

function computeBlockHash(
  index: number,
  previousHash: string,
  payload: string,
  timestamp: string,
  nonce: number
): string {
  const prev = previousHash.replace(/^0x/, '');
  const data = `${index}:${prev}:${payload}:${timestamp}:${nonce}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

function canonicalPayload(data: Record<string, unknown>): string {
  const sorted = Object.keys(data)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});
  return JSON.stringify(sorted);
}

function formatHash(hash: string): string {
  return hash.startsWith('0x') ? hash : `0x${hash}`;
}

function stripHash(hash: string): string {
  return hash.replace(/^0x/, '');
}

export async function ensureGenesisBlock(): Promise<void> {
  const existing = await prisma.ledgerBlock.findFirst({ where: { index: 0 } });
  if (existing) return;

  const timestamp = new Date().toISOString();
  const payload = canonicalPayload({
    type: 'GENESIS',
    message: 'HiveTrace Honey Verification Ledger',
    timestamp,
  });
  const blockHash = computeBlockHash(0, GENESIS_HASH, payload, timestamp, 0);

  await prisma.ledgerBlock.create({
    data: {
      index: 0,
      blockHash: formatHash(blockHash),
      previousHash: GENESIS_HASH,
      blockType: 'GENESIS',
      payload,
      nonce: 0,
    },
  });
}

export async function registerBatchOnLedger(params: {
  batchId: string;
  batchCode: string;
  verificationHash: string;
  adminId?: string;
  metadata?: Record<string, unknown>;
}): Promise<{ blockHash: string; blockIndex: number }> {
  await ensureGenesisBlock();

  const latestBlock = await prisma.ledgerBlock.findFirst({
    orderBy: { index: 'desc' },
  });

  const newIndex = (latestBlock?.index ?? -1) + 1;
  const previousHash = latestBlock?.blockHash ?? GENESIS_HASH;
  const timestamp = new Date().toISOString();

  const payload = canonicalPayload({
    type: 'BATCH_VERIFY',
    batchId: params.batchId,
    batchCode: params.batchCode,
    verificationHash: params.verificationHash,
    adminId: params.adminId ?? null,
    timestamp,
    ...params.metadata,
  });

  const blockHash = computeBlockHash(
    newIndex,
    stripHash(previousHash),
    payload,
    timestamp,
    0
  );
  const formattedHash = formatHash(blockHash);

  await prisma.ledgerBlock.create({
    data: {
      index: newIndex,
      blockHash: formattedHash,
      previousHash,
      batchId: params.batchId,
      blockType: 'BATCH_VERIFY',
      payload,
      nonce: 0,
      createdBy: params.adminId,
    },
  });

  return { blockHash: formattedHash, blockIndex: newIndex };
}

export async function registerFraudOnLedger(params: {
  alertId: string;
  batchId?: string;
  alertType: string;
  description: string;
  adminId?: string;
}): Promise<{ blockHash: string; blockIndex: number }> {
  await ensureGenesisBlock();

  const latestBlock = await prisma.ledgerBlock.findFirst({
    orderBy: { index: 'desc' },
  });

  const newIndex = (latestBlock?.index ?? -1) + 1;
  const previousHash = latestBlock?.blockHash ?? GENESIS_HASH;
  const timestamp = new Date().toISOString();

  const payload = canonicalPayload({
    type: 'FRAUD_RECORD',
    alertId: params.alertId,
    batchId: params.batchId ?? null,
    alertType: params.alertType,
    description: params.description,
    adminId: params.adminId ?? null,
    timestamp,
  });

  const blockHash = computeBlockHash(
    newIndex,
    stripHash(previousHash),
    payload,
    timestamp,
    0
  );
  const formattedHash = formatHash(blockHash);

  await prisma.ledgerBlock.create({
    data: {
      index: newIndex,
      blockHash: formattedHash,
      previousHash,
      batchId: params.batchId,
      blockType: 'FRAUD_RECORD',
      payload,
      nonce: 0,
      createdBy: params.adminId,
    },
  });

  return { blockHash: formattedHash, blockIndex: newIndex };
}

export async function verifyLedgerIntegrity(): Promise<{
  valid: boolean;
  blocksChecked: number;
  errorAt?: number;
  message?: string;
}> {
  const blocks = await prisma.ledgerBlock.findMany({ orderBy: { index: 'asc' } });
  if (blocks.length === 0) {
    return { valid: true, blocksChecked: 0 };
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const expectedPrevious =
      i === 0 ? GENESIS_HASH : blocks[i - 1].blockHash;

    if (block.previousHash !== expectedPrevious) {
      return {
        valid: false,
        blocksChecked: i,
        errorAt: block.index,
        message: `Block ${block.index} has invalid previous hash link`,
      };
    }

    let timestamp: string;
    try {
      const parsed = JSON.parse(block.payload) as { timestamp?: string };
      timestamp = parsed.timestamp ?? block.createdAt.toISOString();
    } catch {
      timestamp = block.createdAt.toISOString();
    }

    const prevForCompute =
      i === 0 ? GENESIS_HASH : stripHash(blocks[i - 1].blockHash);
    const recomputed = computeBlockHash(
      block.index,
      prevForCompute,
      block.payload,
      timestamp,
      block.nonce
    );

    if (formatHash(recomputed) !== block.blockHash) {
      return {
        valid: false,
        blocksChecked: i + 1,
        errorAt: block.index,
        message: `Block ${block.index} hash does not match sealed data`,
      };
    }
  }

  return { valid: true, blocksChecked: blocks.length };
}

export async function verifyBlockOnLedger(blockHash: string): Promise<{
  valid: boolean;
  block?: {
    index: number;
    blockHash: string;
    blockType: string;
    batchCode?: string;
    payload: Record<string, unknown>;
    createdAt: Date;
  };
  chainValid: boolean;
}> {
  const normalized = formatHash(blockHash);
  const block = await prisma.ledgerBlock.findFirst({
    where: {
      OR: [{ blockHash: normalized }, { blockHash: stripHash(normalized) }],
    },
    include: {
      batch: { select: { batchCode: true } },
    },
  });

  if (!block) {
    return { valid: false, chainValid: false };
  }

  const integrity = await verifyLedgerIntegrity();
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(block.payload) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  return {
    valid: true,
    chainValid: integrity.valid,
    block: {
      index: block.index,
      blockHash: block.blockHash,
      blockType: block.blockType,
      batchCode: block.batch?.batchCode,
      payload,
      createdAt: block.createdAt,
    },
  };
}

export async function getLedgerChain(limit = 50) {
  return prisma.ledgerBlock.findMany({
    take: limit,
    orderBy: { index: 'desc' },
    include: {
      batch: {
        select: {
          batchCode: true,
          honeyType: true,
          verified: true,
        },
      },
    },
  });
}

export async function getBatchLedgerBlock(batchId: string) {
  return prisma.ledgerBlock.findFirst({
    where: { batchId, blockType: 'BATCH_VERIFY' },
    orderBy: { index: 'desc' },
  });
}

export async function getLedgerStats() {
  const [blockCount, batchBlocks, fraudBlocks] = await Promise.all([
    prisma.ledgerBlock.count(),
    prisma.ledgerBlock.count({ where: { blockType: 'BATCH_VERIFY' } }),
    prisma.ledgerBlock.count({ where: { blockType: 'FRAUD_RECORD' } }),
  ]);

  const integrity = await verifyLedgerIntegrity();

  return {
    blockCount,
    batchBlocks,
    fraudBlocks,
    chainValid: integrity.valid,
    blocksChecked: integrity.blocksChecked,
  };
}
