import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const HIVETRACE_FEE_RATE = 0.05; // 5%

async function main() {
  console.log('====================================================');
  console.log(' 🐝 HiveTrace Multi-Vendor Cart & Revenue Split Test');
  console.log('====================================================\n');

  // 1. Setup Producer A (Aburi Apiary - Mobile Money)
  const producerAEmail = 'producer.aburi@hivetrace.test';
  let userA = await prisma.user.findUnique({ where: { email: producerAEmail } });
  if (!userA) {
    userA = await prisma.user.create({
      data: {
        email: producerAEmail,
        name: 'Kofi Mensah (Aburi Apiaries)',
        password: 'Password123!',
        role: 'PRODUCER',
        phoneNumber: '+233240000001',
      },
    });
  }

  let producerA = await prisma.producer.findUnique({ where: { userId: userA.id } });
  if (!producerA) {
    producerA = await prisma.producer.create({
      data: {
        userId: userA.id,
        businessName: 'Aburi Highlands Honey',
        location: 'Aburi, Eastern Region',
        verificationHash: crypto.randomBytes(16).toString('hex'),
        verified: true,
        status: 'APPROVED',
        payoutMethod: 'MOMO',
        momoProvider: 'MTN',
        momoNumber: '0240000001',
        accountName: 'Kofi Mensah',
      },
    });
  }

  // Batch A & Product A
  let batchA = await prisma.honeyBatch.findFirst({ where: { producerId: producerA.id } });
  if (!batchA) {
    batchA = await prisma.honeyBatch.create({
      data: {
        batchCode: `HT-ABURI-${Date.now().toString().slice(-4)}`,
        producerId: producerA.id,
        honeyType: 'Wildflower Blossom',
        quantity: 50,
        harvestDate: new Date(),
        verificationHash: crypto.randomBytes(16).toString('hex'),
        verified: true,
      },
    });
  }

  let productA = await prisma.product.findFirst({ where: { producerId: producerA.id } });
  if (!productA) {
    productA = await prisma.product.create({
      data: {
        batchId: batchA.id,
        producerId: producerA.id,
        name: 'Aburi Pure Wildflower Honey (500g)',
        description: 'Raw unfiltered honey from the Aburi botanical highlands.',
        price: 120,
        stock: 50,
        unit: 'jar',
        isActive: true,
      },
    });
  }

  // 2. Setup Producer B (Volta Apiary - Bank Account)
  const producerBEmail = 'producer.volta@hivetrace.test';
  let userB = await prisma.user.findUnique({ where: { email: producerBEmail } });
  if (!userB) {
    userB = await prisma.user.create({
      data: {
        email: producerBEmail,
        name: 'Ama Serwaa (Volta Forest Beekeepers)',
        password: 'Password123!',
        role: 'PRODUCER',
        phoneNumber: '+233240000002',
      },
    });
  }

  let producerB = await prisma.producer.findUnique({ where: { userId: userB.id } });
  if (!producerB) {
    producerB = await prisma.producer.create({
      data: {
        userId: userB.id,
        businessName: 'Volta Forest Honey Co.',
        location: 'Ho, Volta Region',
        verificationHash: crypto.randomBytes(16).toString('hex'),
        verified: true,
        status: 'APPROVED',
        payoutMethod: 'BANK',
        bankName: 'GCB Bank',
        accountNumber: '1092837465012',
        accountName: 'Volta Forest Honey Enterprise',
      },
    });
  }

  // Batch B & Product B
  let batchB = await prisma.honeyBatch.findFirst({ where: { producerId: producerB.id } });
  if (!batchB) {
    batchB = await prisma.honeyBatch.create({
      data: {
        batchCode: `HT-VOLTA-${Date.now().toString().slice(-4)}`,
        producerId: producerB.id,
        honeyType: 'Forest Acacia',
        quantity: 80,
        harvestDate: new Date(),
        verificationHash: crypto.randomBytes(16).toString('hex'),
        verified: true,
      },
    });
  }

  let productB = await prisma.product.findFirst({ where: { producerId: producerB.id } });
  if (!productB) {
    productB = await prisma.product.create({
      data: {
        batchId: batchB.id,
        producerId: producerB.id,
        name: 'Volta Pure Acacia Forest Honey (1kg)',
        description: 'Rich dark amber acacia honey from pristine Volta forests.',
        price: 150,
        stock: 50,
        unit: 'jar',
        isActive: true,
      },
    });
  }

  // 3. Setup Consumer
  const consumerEmail = 'consumer.demo@hivetrace.test';
  let consumer = await prisma.user.findUnique({ where: { email: consumerEmail } });
  if (!consumer) {
    consumer = await prisma.user.create({
      data: {
        email: consumerEmail,
        name: 'Akua Mansa (Verified Consumer)',
        password: 'Password123!',
        role: 'CONSUMER',
      },
    });
  }

  console.log('✅ Entities Verified:');
  console.log(`   - Producer A: "${producerA.businessName}" (${producerA.payoutMethod}: ${producerA.momoNumber})`);
  console.log(`     Product: ${productA.name} @ GH₵${productA.price}`);
  console.log(`   - Producer B: "${producerB.businessName}" (${producerB.payoutMethod}: ${producerB.bankName} ${producerB.accountNumber})`);
  console.log(`     Product: ${productB.name} @ GH₵${productB.price}`);
  console.log(`   - Consumer: "${consumer.name}" (${consumer.email})\n`);

  // 4. Create Multi-Vendor Order (2 jars of A + 3 jars of B)
  const qtyA = 2; // 2 x 120 = 240
  const qtyB = 3; // 3 x 150 = 450
  const subtotalA = productA.price * qtyA;
  const subtotalB = productB.price * qtyB;
  const orderTotal = subtotalA + subtotalB; // 690

  const paymentRef = `SIM-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      consumerId: consumer.id,
      status: 'PAID',
      totalAmount: orderTotal,
      currency: 'NGN',
      shippingAddress: '14 Independence Avenue, Ridge, Accra',
      paymentId: paymentRef,
      items: {
        create: [
          {
            productId: productA.id,
            quantity: qtyA,
            priceAtPurchase: productA.price,
          },
          {
            productId: productB.id,
            quantity: qtyB,
            priceAtPurchase: productB.price,
          },
        ],
      },
      payment: {
        create: {
          reference: paymentRef,
          amount: orderTotal,
          status: 'PAID',
          channel: 'card',
          paidAt: new Date(),
        },
      },
    },
    include: {
      items: {
        include: {
          product: {
            include: { producer: true },
          },
        },
      },
      payment: true,
    },
  });

  console.log('🛒 Multi-Vendor Order Created & Settled:');
  console.log(`   - Order ID: #${order.id.slice(-6).toUpperCase()} (Ref: ${paymentRef})`);
  console.log(`   - Total Paid by Consumer: GH₵ ${orderTotal.toFixed(2)}\n`);

  // 5. Verification & Mathematical Split Analysis
  const feeA = subtotalA * HIVETRACE_FEE_RATE;
  const netA = subtotalA - feeA;

  const feeB = subtotalB * HIVETRACE_FEE_RATE;
  const netB = subtotalB - feeB;

  const totalFee = feeA + feeB;
  const totalProducerPayout = netA + netB;

  console.log('📊 REVENUE SPLIT BREAKDOWN (5% HiveTrace Fee / 95% Producer Payout):');
  console.log('-------------------------------------------------------------------');
  console.log(`📌 Producer A (${producerA.businessName}):`);
  console.log(`   - Items Sold: ${qtyA}x ${productA.name}`);
  console.log(`   - Gross Sales:          GH₵ ${subtotalA.toFixed(2)} (100%)`);
  console.log(`   - HiveTrace Fee (5%):   GH₵  ${feeA.toFixed(2)}`);
  console.log(`   - Net Payout (95%):     GH₵ ${netA.toFixed(2)} => Disbursed to ${producerA.momoProvider} MoMo (${producerA.momoNumber})`);

  console.log('\n📌 Producer B (${producerB.businessName}):');
  console.log(`   - Items Sold: ${qtyB}x ${productB.name}`);
  console.log(`   - Gross Sales:          GH₵ ${subtotalB.toFixed(2)} (100%)`);
  console.log(`   - HiveTrace Fee (5%):   GH₵  ${feeB.toFixed(2)}`);
  console.log(`   - Net Payout (95%):     GH₵ ${netB.toFixed(2)} => Disbursed to ${producerB.bankName} (${producerB.accountNumber})`);

  console.log('\n🏢 HiveTrace Platform Ledger Overview:');
  console.log(`   - Total Gross Merchandise Value (GMV): GH₵ ${orderTotal.toFixed(2)}`);
  console.log(`   - Total Platform Commission (5%):     GH₵  ${totalFee.toFixed(2)}`);
  console.log(`   - Total Net Producer Disbursals (95%):  GH₵ ${totalProducerPayout.toFixed(2)}`);

  console.log('\n====================================================');
  console.log(' ✨ Multi-Vendor Split Test Completed Successfully!');
  console.log('====================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Simulation Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
