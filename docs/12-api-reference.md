# 12. API Reference

## 12.1 Overview

HiveTrace exposes functionality through two mechanisms:

1. **REST API Routes** — HTTP endpoints under `app/api/`
2. **Server Actions** — Direct function calls from React Server/Client Components

This document catalogues the primary endpoints. Server Actions are invoked internally and are not HTTP-accessible unless wrapped by a route.

## 12.2 Authentication

### NextAuth Handler

```
GET/POST /api/auth/[...nextauth]
```

NextAuth.js protocol endpoints for sign-in, sign-out, session, and CSRF.

### Register

```
POST /api/auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "Full Name",
  "role": "CONSUMER" | "PRODUCER"
}
```

**Response:** `201` with user object (password excluded)

---

## 12.3 Batch Management

### Create Batch

```
POST /api/batches
```

**Auth:** PRODUCER or ADMIN (producer must be verified)

**Body:**
```json
{
  "honeyType": "Wildflower",
  "quantity": 50,
  "harvestDate": "2026-05-15",
  "description": "Spring harvest"
}
```

**Response:** `201` with batch object including `verificationHash`

### List Producer Batches

```
GET /api/batches?producerId={id}
```

**Auth:** Session required; must own producer or be ADMIN

**Response:** Array of batch objects

### Batch by ID

```
GET /api/batches/[id]
PUT /api/batches/[id]
DELETE /api/batches/[id]
```

Standard CRUD with auth checks.

---

## 12.4 QR Verification

### Verify QR Code

```
POST /api/qr/verify
```

**Body:**
```json
{
  "qrCode": "{\"batchId\":\"HT-2026-ABC-001\",\"hash\":\"...\"}",
  "latitude": 5.6037,
  "longitude": -0.1870,
  "country": "Ghana",
  "city": "Accra"
}
```

**Response:**
```json
{
  "success": true,
  "batch": { /* batch details with producer info */ },
  "message": "Batch verified successfully"
}
```

**Note:** Logs scan to database. For full fraud detection, prefer Server Action `registerScan`.

---

## 12.5 Blockchain Verification

### Verify Ledger

```
GET /api/blockchain/verify
```

**Response:**
```json
{
  "success": true,
  "chain": {
    "valid": true,
    "blocksChecked": 12
  }
}
```

### Verify Specific Block

```
GET /api/blockchain/verify?hash=0xabc123...
```

**Response:**
```json
{
  "success": true,
  "block": {
    "index": 5,
    "blockHash": "0x...",
    "blockType": "BATCH_VERIFY",
    "batchCode": "HT-2026-ABC-001",
    "payload": { /* parsed JSON */ }
  },
  "chainValid": true
}
```

---

## 12.6 Reviews

### Submit Review

```
POST /api/reviews
```

**Auth:** Session required

**Body:**
```json
{
  "batchId": "clx...",
  "rating": 5,
  "text": "Excellent wildflower honey!"
}
```

### Get Batch Reviews

```
GET /api/reviews?batchId={id}
```

**Response:** Array of review objects with user names

---

## 12.7 Checkout & Payments

### Initialize Checkout

```
POST /api/checkout/paystack
```

**Auth:** Session required

**Body:**
```json
{
  "items": [
    { "productId": "clx...", "quantity": 2, "priceAtPurchase": 25.00 }
  ],
  "totalAmount": 50.00,
  "shippingAddress": "123 Main St, Accra"
}
```

**Response:**
```json
{
  "authorization_url": "https://checkout.paystack.com/...",
  "reference": "HT-1234567890-ABC123",
  "publicKey": "pk_test_...",
  "amount": 5000,
  "email": "consumer@example.com"
}
```

### Verify Payment (Client Fallback)

```
GET /api/checkout/paystack/verify?reference=HT-...
```

**Auth:** Session required

**Response:** Order object with PAID status on success

### Paystack Webhook

```
POST /api/checkout/paystack/webhook
```

**Auth:** HMAC-SHA512 signature (`x-paystack-signature` header)

**Events handled:** `charge.success`

### Retry Pending Payment

```
POST /api/checkout/paystack/retry
```

**Auth:** Session required

**Body:**
```json
{ "orderId": "clx..." }
```

---

## 12.8 Producers

### Get Producer Profile

```
GET /api/producers/[id]
```

**Response:** Public producer profile with ratings

---

## 12.9 Server Actions Reference

### Admin Actions (`lib/actions/admin-actions.ts`)

| Function | Description |
|----------|-------------|
| `getAdminStats()` | Dashboard statistics and trends |
| `getAllProducers()` | List all producers |
| `approveProducer(id)` | Approve pending producer |
| `rejectProducer(id)` | Reject producer application |
| `getAllBatches()` | List all batches for admin review |
| `verifyAndApproveBatch(id, qualityMetrics?)` | Approve batch + ledger register |
| `updateFraudAlertStatus(id, status)` | Update alert investigation status |
| `getContactMessagesAdmin()` | List contact form submissions |
| `markContactMessageReadAdmin(id)` | Mark message as read |
| `getLedgerBlocks(limit?)` | Fetch ledger chain with integrity check |

### Scan Actions (`lib/actions/scan-actions.ts`)

| Function | Description |
|----------|-------------|
| `registerScan(qrCodeId, locationData)` | Log scan + run fraud checks |
| `registerScanByHash(hash, locationData)` | Resolve batch from hash, then scan |
| `reportBatchDiscrepancy(params)` | Consumer fraud report |
| `getFraudAlerts()` | List all fraud alerts |

### Order Actions (`lib/actions/order-actions.ts`)

| Function | Description |
|----------|-------------|
| `createPendingOrderFromCart(data)` | Create order before payment |
| `fulfillOrderByReference(reference)` | Verify Paystack + mark paid |
| `getProducerOrders()` | Orders containing producer's products |
| `getConsumerOrders()` | Current user's orders |
| `retryOrderPayment(orderId)` | Re-init Paystack for pending order |
| `updateOrderStatus(orderId, status)` | Producer updates order status |

### Review Actions (`lib/actions/review-actions.ts`)

| Function | Description |
|----------|-------------|
| `submitBatchReview(data)` | Submit review with verified check |
| `getBatchDetailForConsumer(batchId)` | Full batch page data |
| `getDashboardReviews()` | Producer review dashboard data |
| `getProducerReviewStats(producerId)` | Aggregate rating statistics |

### Producer Actions (`lib/actions/producer-actions.ts`)

| Function | Description |
|----------|-------------|
| `getProducerStats()` | Dashboard overview metrics |
| `getProducerPublicProfile(producerId)` | Public profile page data |
| `getProducerProfileForSettings()` | Settings form initial data |
| `updateProducerProfile(data)` | Save producer business info |

### Analytics Actions (`lib/actions/analytics-actions.ts`)

| Function | Description |
|----------|-------------|
| `getProducerAnalytics()` | Revenue, orders, scan trends from real data |

---

## 12.10 Error Responses

Standard error format for API routes:

```json
{
  "error": "Human-readable error message"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Missing or invalid request body |
| 401 | Not authenticated |
| 403 | Authenticated but insufficient role |
| 404 | Resource not found |
| 500 | Server error |

---

## 12.11 Related Documents

- [Authentication & Authorization](./08-authentication-authorization.md)
- [E-Commerce & Payments](./09-ecommerce-payments.md)
- [Blockchain Ledger](./06-blockchain-ledger.md)
