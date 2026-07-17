/**
 * prisma/seed.ts
 * Run with: npm run db:seed
 *           — or —
 *           npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 *
 * Seeds the marketplace with default system administrator, producer, and consumer demo accounts.
 */

import { PrismaClient } from '@prisma/client';
import { createHmac } from 'crypto';
import bcrypt from 'bcryptjs';
import { ensureGenesisBlock } from '../lib/blockchain';

const prisma = new PrismaClient();

function makeHash(data: string): string {
  return createHmac('sha256', 'hivetrace-seed-secret').update(data).digest('hex');
}

async function main() {
  console.log('\n🧹  Cleaning database tables...');
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.qRScan.deleteMany({});
  await prisma.qRCode.deleteMany({});
  await prisma.fraudAlert.deleteMany({});
  await prisma.ledgerBlock.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.honeyBatch.deleteMany({});
  await prisma.producerRating.deleteMany({});
  
  // Cascade delete handles dependent relations, but we clean up user/producer mocks
  await prisma.producer.deleteMany({
    where: {
      user: {
        email: {
          endsWith: '@hivetrace.seed'
        }
      }
    }
  });

  await prisma.user.deleteMany({
    where: {
      email: {
        endsWith: '@hivetrace.seed'
      }
    }
  });

  await prisma.session.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  console.log('✓ Database tables cleaned.');

  console.log('\n🐝  HiveTrace — seeding auth/demo users…\n');

  const demoPassword = await bcrypt.hash('password', 10);

  const demoAccounts = [
    { email: 'admin@hivetrace.com', name: 'HiveTrace Admin', role: 'ADMIN' },
    { email: 'eric@primehoney.com', name: 'Eric Prime', role: 'PRODUCER' },
    { email: 'linda@consumer.com', name: 'Linda Consumer', role: 'CONSUMER' },
  ];

  for (const account of demoAccounts) {
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        role: account.role,
        password: demoPassword,
      },
      create: {
        email: account.email,
        name: account.name,
        role: account.role,
        password: demoPassword,
      },
    });
    console.log(`  ✓ Demo account: ${account.email} (${account.role})`);
  }

  const ericUser = await prisma.user.findUnique({ where: { email: 'eric@primehoney.com' } });
  if (ericUser) {
    await prisma.producer.upsert({
      where: { userId: ericUser.id },
      update: {
        businessName: 'Prime Honey Apiaries',
        location: 'Kumasi, Ashanti Region, Ghana',
        latitude: 6.6886,
        longitude: -1.6244,
        verified: true,
        status: 'APPROVED',
        verifiedAt: new Date(),
      },
      create: {
        userId: ericUser.id,
        businessName: 'Prime Honey Apiaries',
        location: 'Kumasi, Ashanti Region, Ghana',
        latitude: 6.6886,
        longitude: -1.6244,
        description: 'New demo producer account for dashboard testing.',
        verificationHash: makeHash(`producer-${ericUser.id}-prime-honey`),
        verified: true,
        status: 'APPROVED',
        verifiedAt: new Date(),
      },
    });
    console.log(`  ✓ Producer profile: Prime Honey Apiaries (${ericUser.email})`);
  }

  await ensureGenesisBlock();
  console.log('\n✅  Done — Database prepared with auth/demo users.\n');
}

main()
  .catch((e) => {
    console.error('\n❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
