/**
 * prisma/clean-batches-products.ts
 *
 * Cleans all products, honey batches, orders, reviews, QR codes,
 * and associated blockchain verification blocks from the database and disk,
 * while preserving all User authentication accounts, Sessions, and Producer profiles.
 *
 * Run with:
 *   npm run db:clean
 *   -- or --
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/clean-batches-products.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { ensureGenesisBlock } from '../lib/blockchain';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🧹 HiveTrace — Deleting batches, products, and linked transaction data...\n');

  // 1. Delete dependent payment and order data
  const payments = await prisma.payment.deleteMany({});
  console.log(`  ✓ Deleted ${payments.count} payment record(s)`);

  const orderItems = await prisma.orderItem.deleteMany({});
  console.log(`  ✓ Deleted ${orderItems.count} order item(s)`);

  const orders = await prisma.order.deleteMany({});
  console.log(`  ✓ Deleted ${orders.count} order(s)`);

  // 2. Delete products
  const products = await prisma.product.deleteMany({});
  console.log(`  ✓ Deleted ${products.count} product(s)`);

  // 3. Delete consumer reviews and QR scan records
  const reviews = await prisma.review.deleteMany({});
  console.log(`  ✓ Deleted ${reviews.count} review(s)`);

  const qrScans = await prisma.qRScan.deleteMany({});
  console.log(`  ✓ Deleted ${qrScans.count} QR scan record(s)`);

  const qrCodes = await prisma.qRCode.deleteMany({});
  console.log(`  ✓ Deleted ${qrCodes.count} QR code(s)`);

  // 4. Delete fraud alerts
  const fraudAlerts = await prisma.fraudAlert.deleteMany({});
  console.log(`  ✓ Deleted ${fraudAlerts.count} fraud alert(s)`);

  // 5. Delete batches
  const batches = await prisma.honeyBatch.deleteMany({});
  console.log(`  ✓ Deleted ${batches.count} honey batch(es)`);

  // 6. Reset blockchain ledger blocks and recreate initial Genesis block
  const blocks = await prisma.ledgerBlock.deleteMany({});
  console.log(`  ✓ Cleared ${blocks.count} blockchain ledger block(s)`);
  await ensureGenesisBlock();
  console.log('  ✓ Initialized pristine Genesis ledger block');

  // 7. Reset producer rating metrics
  const ratings = await prisma.producerRating.updateMany({
    data: {
      averageRating: 0,
      totalReviews: 0,
      trustScore: 100,
      fraudCasesCount: 0,
    },
  });
  console.log(`  ✓ Reset reputation & rating scores for ${ratings.count} producer(s)`);

  // 8. Delete uploaded batch verification videos from disk
  const uploadsVideosDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  if (fs.existsSync(uploadsVideosDir)) {
    const files = fs.readdirSync(uploadsVideosDir);
    let removedFiles = 0;
    for (const file of files) {
      if (file.endsWith('.webm') || file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.ogg')) {
        try {
          fs.unlinkSync(path.join(uploadsVideosDir, file));
          removedFiles++;
        } catch (err) {
          console.warn(`    ⚠️ Could not delete ${file}:`, err);
        }
      }
    }
    console.log(`  ✓ Removed ${removedFiles} uploaded batch video file(s) from public/uploads/videos`);
  }

  // 9. Verify authentication accounts are intact
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, name: true },
  });
  const sessionsCount = await prisma.session.count();
  const producersCount = await prisma.producer.count();

  console.log('\n🔒 Verified Auth & User Data Preserved:');
  console.log(`  - Total Users: ${users.length}`);
  for (const u of users) {
    console.log(`    • ${u.name} <${u.email}> (${u.role})`);
  }
  console.log(`  - Active Sessions: ${sessionsCount}`);
  console.log(`  - Producer Profiles: ${producersCount}`);

  console.log('\n✅ Successfully removed all batches and products while keeping user auth intact.\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Cleanup failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
