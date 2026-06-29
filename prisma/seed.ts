/**
 * prisma/seed.ts
 * Run with: npm run db:seed
 *           — or —
 *           npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 *
 * Seeds 5 premium honey products with verified batches and producers.
 * Uses real Unsplash honey imagery. Safe to re-run (upsert logic).
 */

import { PrismaClient } from '@prisma/client';
import { createHmac, randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { registerBatchOnLedger, ensureGenesisBlock } from '../lib/blockchain';

const prisma = new PrismaClient();

function makeHash(data: string): string {
  return createHmac('sha256', 'hivetrace-seed-secret').update(data).digest('hex');
}

// ─── Seed definitions ────────────────────────────────────────────────────────

interface SeedEntry {
  // Producer
  producerEmail: string;
  producerName: string;
  businessName: string;
  location: string;
  latitude: number;
  longitude: number;
  producerDesc: string;
  certifications: string;
  // Batch
  batchCode: string;
  honeyType: string;
  quantity: number;
  harvestDate: Date;
  processingDate: Date;
  // Product
  productName: string;
  productDesc: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string;
}

const SEEDS: SeedEntry[] = [
  {
    producerEmail: 'yaw.odoom@hivetrace.seed',
    producerName: 'Yaw Odoom',
    businessName: 'Odoom Forest Honey',
    location: 'Central Region, Ghana',
    latitude: 5.6037,
    longitude: -0.1870,
    producerDesc: 'Premium forest apiary producing rich honey in the Central Region since 2010.',
    certifications: 'Organic, Ghana Standards Authority',
    batchCode: 'HT-2024-OFH-001',
    honeyType: 'Wildflower',
    quantity: 150,
    harvestDate: new Date('2024-03-12'),
    processingDate: new Date('2024-03-20'),
    productName: 'Odoom Forest Wildflower Honey',
    productDesc:
      'A rich, golden wildflower honey harvested from the biodiverse forests of the Central Region. Notes of tropical blossom, floral sweetness, and a smooth amber finish.',
    price: 90.00,
    unit: '500g jar',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=1200&auto=format&fit=crop',
  },
  {
    producerEmail: 'ama.kofi@hivetrace.seed',
    producerName: 'Ama Kofi',
    businessName: 'Volta Honey Farms',
    location: 'Volta Region, Ghana',
    latitude: 6.877,
    longitude: 0.249,
    producerDesc: 'Artisan beekeeper in the Volta Valley producing single-origin raw honey with traceable provenance.',
    certifications: 'Fair Trade, Rainforest Alliance',
    batchCode: 'HT-2024-VHF-002',
    honeyType: 'Acacia',
    quantity: 110,
    harvestDate: new Date('2024-04-05'),
    processingDate: new Date('2024-04-15'),
    productName: 'Volta Valley Acacia Honey',
    productDesc:
      'Light and crystal-clear acacia honey from the pristine Volta Valley. Mild sweetness with delicate floral notes.',
    price: 115.00,
    unit: '500g jar',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1200&auto=format&fit=crop',
  },
  {
    producerEmail: 'kweku.mensah@hivetrace.seed',
    producerName: 'Kweku Mensah',
    businessName: 'Mensah Sweet Honey',
    location: 'Ashanti Region, Ghana',
    latitude: 6.6886,
    longitude: -1.6244,
    producerDesc: 'Highland apiary producing intensely flavoured raw honey from native flora.',
    certifications: 'Organic, GLOBALG.A.P.',
    batchCode: 'HT-2024-MSH-003',
    honeyType: 'Raw Multifloral',
    quantity: 180,
    harvestDate: new Date('2024-02-18'),
    processingDate: new Date('2024-02-28'),
    productName: 'Ashanti Highland Raw Honey',
    productDesc:
      'Dark amber raw honey from high-altitude Ashanti flora — brimming with antioxidants and natural enzymes.',
    price: 100.00,
    unit: '500g jar',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1200&auto=format&fit=crop',
  },
  {
    producerEmail: 'yaw.odoom@hivetrace.seed',
    producerName: 'Yaw Odoom',
    businessName: 'Odoom Forest Honey',
    location: 'Central Region, Ghana',
    latitude: 5.6037,
    longitude: -0.1870,
    producerDesc: 'Premium forest apiary producing rich honey in the Central Region since 2010.',
    certifications: 'Organic, Ghana Standards Authority',
    batchCode: 'HT-2024-OFH-004',
    honeyType: 'Clover',
    quantity: 130,
    harvestDate: new Date('2024-05-10'),
    processingDate: new Date('2024-05-20'),
    productName: 'Pure Clover Blossom Honey',
    productDesc:
      'Classic clover honey with a clean, mild sweetness perfect for everyday use. Light colour, buttery texture, and a fresh herbal aroma.',
    price: 75.00,
    unit: '500g jar',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1634467524884-897d0af5e104?q=80&w=1200&auto=format&fit=crop',
  },
  {
    producerEmail: 'ama.kofi@hivetrace.seed',
    producerName: 'Ama Kofi',
    businessName: 'Volta Honey Farms',
    location: 'Volta Region, Ghana',
    latitude: 6.877,
    longitude: 0.249,
    producerDesc: 'Artisan beekeeper in the Volta Valley producing single-origin raw honey with traceable provenance.',
    certifications: 'Fair Trade, Rainforest Alliance',
    batchCode: 'HT-2024-VHF-005',
    honeyType: 'Black Seed',
    quantity: 90,
    harvestDate: new Date('2024-06-01'),
    processingDate: new Date('2024-06-10'),
    productName: 'Black Seed & Thyme Infused Honey',
    productDesc:
      'Therapeutic honey infused with cold-pressed black seed oil and wild thyme, harvested from the Volta countryside.',
    price: 150.00,
    unit: '350g jar',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
  },
];

// ─── Main seeder ─────────────────────────────────────────────────────────────

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
  await prisma.producer.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: { not: 'admin@hivetrace.com' }
    }
  });
  console.log('✓ Database tables cleaned.');

  console.log('\n🐝  HiveTrace — seeding new honey products…\n');

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
  }

  // 1. Upsert users & collect userId map
  const userMap: Record<string, string> = {};
  const uniqueUsers = [
    { email: 'yaw.odoom@hivetrace.seed', name: 'Yaw Odoom' },
    { email: 'ama.kofi@hivetrace.seed', name: 'Ama Kofi' },
    { email: 'kweku.mensah@hivetrace.seed', name: 'Kweku Mensah' },
  ];

  for (const u of uniqueUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password: '$2b$10$seed.placeholder.hash.not.valid.for.auth.login.only',
        role: 'PRODUCER',
      },
    });
    userMap[u.email] = user.id;
    console.log(`  ✓ User: ${u.name} → ${user.id}`);
  }

  // 2. Upsert producers
  const producerMap: Record<string, string> = {};

  for (const seed of SEEDS) {
    if (producerMap[seed.producerEmail]) continue; // already processed

    const userId = userMap[seed.producerEmail];
    const producer = await prisma.producer.upsert({
      where: { userId },
      update: {
        businessName: seed.businessName,
        location: seed.location,
        latitude: seed.latitude,
        longitude: seed.longitude,
        description: seed.producerDesc,
        certifications: seed.certifications,
        verified: true,
        verifiedAt: new Date(),
        status: 'APPROVED',
      },
      create: {
        userId,
        businessName: seed.businessName,
        location: seed.location,
        latitude: seed.latitude,
        longitude: seed.longitude,
        description: seed.producerDesc,
        certifications: seed.certifications,
        verificationHash: makeHash(`producer-${userId}-${seed.businessName}`),
        verified: true,
        verifiedAt: new Date(),
        status: 'APPROVED',
      },
    });
    producerMap[seed.producerEmail] = producer.id;
    console.log(`  ✓ Producer: ${seed.businessName} → ${producer.id}`);
  }

  // 3. Create batches + products
  await ensureGenesisBlock();

  for (const seed of SEEDS) {
    const producerId = producerMap[seed.producerEmail];

    // Batch — skip if already exists
    let batch = await prisma.honeyBatch.findUnique({ where: { batchCode: seed.batchCode } });

    if (!batch) {
      batch = await prisma.honeyBatch.create({
        data: {
          batchCode: seed.batchCode,
          producerId,
          honeyType: seed.honeyType,
          quantity: seed.quantity,
          harvestDate: seed.harvestDate,
          processingDate: seed.processingDate,
          description: seed.productDesc,
          verificationHash: makeHash(`batch-${seed.batchCode}-${producerId}`),
          verified: true,
          verifiedAt: new Date(),
          honeyImage: seed.imageUrl,
          price: seed.price,
          latitude: 5.6037,
          longitude: -0.1870,
          registrationLocation: "Accra",
        },
      });
      console.log(`  ✓ Batch: ${seed.batchCode} → ${batch.id}`);

      const { blockHash } = await registerBatchOnLedger({
        batchId: batch.id,
        batchCode: batch.batchCode,
        verificationHash: batch.verificationHash,
        metadata: { seeded: true, honeyType: batch.honeyType },
      });

      await prisma.honeyBatch.update({
        where: { id: batch.id },
        data: { blockchainTx: blockHash },
      });
    } else {
      console.log(`  ~ Batch exists: ${seed.batchCode}`);
      if (!batch.blockchainTx) {
        const { blockHash } = await registerBatchOnLedger({
          batchId: batch.id,
          batchCode: batch.batchCode,
          verificationHash: batch.verificationHash,
          metadata: { seeded: true, honeyType: batch.honeyType },
        });
        await prisma.honeyBatch.update({
          where: { id: batch.id },
          data: { blockchainTx: blockHash },
        });
      }
    }

    // QR code for verified batches
    const existingQr = await prisma.qRCode.findFirst({ where: { batchId: batch.id } });
    if (!existingQr) {
      await prisma.qRCode.create({
        data: {
          batchId: batch.id,
          code: JSON.stringify({
            batchId: batch.batchCode,
            hash: batch.verificationHash,
          }),
        },
      });
    }

    // Product — upsert by batchId
    const existing = await prisma.product.findUnique({ where: { batchId: batch.id } });

    if (!existing) {
      const product = await prisma.product.create({
        data: {
          batchId: batch.id,
          producerId,
          name: seed.productName,
          description: seed.productDesc,
          price: seed.price,
          unit: seed.unit,
          stock: seed.stock,
          imageUrl: seed.imageUrl,
          isActive: true,
        },
      });
      console.log(`  ✓ Product: "${seed.productName}" @ GH₵${seed.price} → ${product.id}`);
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: seed.productName,
          description: seed.productDesc,
          price: seed.price,
          unit: seed.unit,
          stock: seed.stock,
          imageUrl: seed.imageUrl,
          isActive: true,
        },
      });
      console.log(`  ~ Product updated: "${seed.productName}"`);
    }
  }

  console.log('\n✅  Done — 5 products seeded to the marketplace.\n');
}

main()
  .catch((e) => {
    console.error('\n❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
