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
    producerEmail: 'kwame.mensah@hivetrace.seed',
    producerName: 'Kwame Mensah',
    businessName: 'Mensah Forest Apiaries',
    location: 'Brong-Ahafo Region, Ghana',
    latitude: 7.9465,
    longitude: -1.0232,
    producerDesc: 'Family-run apiary in the Brong-Ahafo forests producing premium wildflower honey since 1998.',
    certifications: 'Organic, Ghana Standards Authority',
    batchCode: 'HT-2024-MFA-001',
    honeyType: 'Wildflower',
    quantity: 180,
    harvestDate: new Date('2024-03-12'),
    processingDate: new Date('2024-03-20'),
    productName: 'Brong-Ahafo Wildflower Honey',
    productDesc:
      'A rich, golden wildflower honey harvested from the biodiverse forests of the Brong-Ahafo Region. Notes of tropical blossom, floral sweetness, and a smooth amber finish. Unfiltered and raw — every jar tells the story of the forest.',
    price: 85.00,
    unit: '500g jar',
    stock: 48,
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=1200&auto=format&fit=crop',
  },
  {
    producerEmail: 'abena.boateng@hivetrace.seed',
    producerName: 'Abena Boateng',
    businessName: "Boateng's Volta Valley Bees",
    location: 'Volta Region, Ghana',
    latitude: 6.877,
    longitude: 0.249,
    producerDesc: 'Artisan beekeeper in the Volta Valley producing single-origin raw honey with traceable provenance.',
    certifications: 'Fair Trade, Rainforest Alliance',
    batchCode: 'HT-2024-VVB-002',
    honeyType: 'Acacia',
    quantity: 120,
    harvestDate: new Date('2024-04-05'),
    processingDate: new Date('2024-04-15'),
    productName: 'Volta Valley Acacia Honey',
    productDesc:
      'Light and crystal-clear acacia honey from the pristine Volta Valley. Mild sweetness with delicate floral notes and an exceptionally slow crystallisation rate. A favourite for tea and fine cooking.',
    price: 110.00,
    unit: '500g jar',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1200&auto=format&fit=crop',
  },
  {
    producerEmail: 'kofi.asante@hivetrace.seed',
    producerName: 'Kofi Asante',
    businessName: 'Asante Highland Honey Co.',
    location: 'Ashanti Region, Ghana',
    latitude: 6.6886,
    longitude: -1.6244,
    producerDesc: 'Highland apiary at 700 m elevation producing intensely flavoured raw honey from native flora.',
    certifications: 'Organic, GLOBALG.A.P.',
    batchCode: 'HT-2024-AHH-003',
    honeyType: 'Raw Multifloral',
    quantity: 200,
    harvestDate: new Date('2024-02-18'),
    processingDate: new Date('2024-02-28'),
    productName: 'Ashanti Highland Raw Honey',
    productDesc:
      'Dark amber raw honey from high-altitude Ashanti flora — brimming with antioxidants and natural enzymes. Minimally processed, coarse-strained, with bold earthy undertones and a long caramel finish.',
    price: 95.00,
    unit: '500g jar',
    stock: 62,
    imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1200&auto=format&fit=crop',
  },
  {
    producerEmail: 'kwame.mensah@hivetrace.seed',
    producerName: 'Kwame Mensah',
    businessName: 'Mensah Forest Apiaries',
    location: 'Brong-Ahafo Region, Ghana',
    latitude: 7.9465,
    longitude: -1.0232,
    producerDesc: 'Family-run apiary in the Brong-Ahafo forests producing premium wildflower honey since 1998.',
    certifications: 'Organic, Ghana Standards Authority',
    batchCode: 'HT-2024-MFA-004',
    honeyType: 'Clover',
    quantity: 150,
    harvestDate: new Date('2024-05-10'),
    processingDate: new Date('2024-05-20'),
    productName: 'Pure Clover Blossom Honey',
    productDesc:
      'Classic clover honey with a clean, mild sweetness perfect for everyday use. Light colour, buttery texture, and a fresh herbal aroma. Cold-extracted and never heat-treated.',
    price: 72.00,
    unit: '500g jar',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1634467524884-897d0af5e104?q=80&w=1200&auto=format&fit=crop',
  },
  {
    producerEmail: 'abena.boateng@hivetrace.seed',
    producerName: 'Abena Boateng',
    businessName: "Boateng's Volta Valley Bees",
    location: 'Volta Region, Ghana',
    latitude: 6.877,
    longitude: 0.249,
    producerDesc: 'Artisan beekeeper in the Volta Valley producing single-origin raw honey with traceable provenance.',
    certifications: 'Fair Trade, Rainforest Alliance',
    batchCode: 'HT-2024-VVB-005',
    honeyType: 'Black Seed',
    quantity: 80,
    harvestDate: new Date('2024-06-01'),
    processingDate: new Date('2024-06-10'),
    productName: 'Black Seed & Thyme Infused Honey',
    productDesc:
      'Therapeutic honey infused with cold-pressed black seed oil and wild thyme, harvested from the Volta countryside. Prized for its immune-boosting properties. Rich, dark, and deeply aromatic — a spoonful a day.',
    price: 145.00,
    unit: '350g jar',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
  },
];

// ─── Main seeder ─────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🐝  HiveTrace — seeding 5 honey products…\n');

  // 1. Upsert users & collect userId map
  const userMap: Record<string, string> = {};
  const uniqueUsers = [
    { email: 'kwame.mensah@hivetrace.seed', name: 'Kwame Mensah' },
    { email: 'abena.boateng@hivetrace.seed', name: 'Abena Boateng' },
    { email: 'kofi.asante@hivetrace.seed', name: 'Kofi Asante' },
  ];

  for (const u of uniqueUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        // Placeholder bcrypt hash — seed accounts are not meant for login
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
        status: 'VERIFIED',
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
        status: 'VERIFIED',
      },
    });
    producerMap[seed.producerEmail] = producer.id;
    console.log(`  ✓ Producer: ${seed.businessName} → ${producer.id}`);
  }

  // 3. Create batches + products
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
        },
      });
      console.log(`  ✓ Batch: ${seed.batchCode} → ${batch.id}`);
    } else {
      console.log(`  ~ Batch exists: ${seed.batchCode}`);
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
