# 13. Testing & Demonstration

## 13.1 Purpose

This guide supports local setup, viva demonstration, and supervisor evaluation of HiveTrace. It assumes a final-year project context where full cloud deployment is not required.

## 13.2 Environment Setup

### Prerequisites

- Node.js 18 or later
- pnpm (`npm install -g pnpm`)

### Installation Steps

```bash
# Clone and enter project
cd HiveTrace

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env — ensure Paystack test keys are set for checkout demo

# Create database and apply schema
pnpm exec prisma db push

# Seed demonstration data
pnpm db:seed

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Verify Build

```bash
pnpm build
```

Production build should complete without TypeScript errors.

## 13.3 Test Accounts

Created by `prisma/seed.ts`:

| Role | Email | Password | Primary Portal |
|------|-------|----------|----------------|
| Admin | admin@hivetrace.com | password | `/admin` |
| Producer | john@goldenvalley.com | password | `/dashboard` |
| Consumer | sarah@consumer.com | password | `/shop`, `/consumer/scanner` |

## 13.4 Paystack Test Payment

Use Paystack test mode keys in `.env`:

| Field | Test Value |
|-------|------------|
| Card number | 5061 0000 0000 0000 008 |
| CVV | Any 3 digits |
| Expiry | Any future date |
| PIN | 1234 |
| OTP | 123456 |

## 13.5 Demonstration Scenarios

### Scenario A: Producer Batch Lifecycle

**Goal:** Show end-to-end traceability from creation to verification.

1. Login as **john@goldenvalley.com**
2. Navigate to **Dashboard → Batches → New Batch**
3. Create a batch (note the generated batch code)
4. Logout; login as **admin@hivetrace.com**
5. Navigate to **Admin → Batches**
6. Select the pending batch and **Approve / Verify**
7. Navigate to **Admin → Ledger** — show new `BATCH_VERIFY` block
8. Copy the verification hash or QR code from the batch detail page

**Expected results:**
- Batch marked `verified: true`
- `blockchainTx` field populated with ledger block hash
- Ledger integrity check shows `valid: true`

---

### Scenario B: Consumer QR Verification

**Goal:** Demonstrate public authenticity verification.

1. Login as consumer or use public verification URL
2. Open **Consumer → Scanner** or visit `/verify/{hash}`
3. Scan/paste QR code from Scenario A
4. View batch details: producer info, harvest date, verification badge

**Expected results:**
- Scan count increments on batch
- Verification page shows admin-verified status
- Link to blockchain proof available for verified batches

---

### Scenario C: Cryptographic Integrity

**Goal:** Prove tamper detection (explain during viva).

1. Open database with `pnpm exec prisma studio`
2. Locate a batch's `quantity` field
3. Manually change the value in the database
4. Revisit `/verify/{hash}` or recompute hash

**Expected results:**
- Recomputed HMAC no longer matches stored `verificationHash`
- System should treat batch as compromised (explain hash mismatch logic)

**Note:** Do not modify seed data permanently; restore via `pnpm db:seed` after demo.

---

### Scenario D: E-Commerce Purchase

**Goal:** Complete purchase flow with verified review.

1. Login as **sarah@consumer.com**
2. Browse **Shop**, add product to cart
3. Proceed to **Checkout**, enter shipping address
4. Complete Paystack test payment
5. Confirm redirect to **Checkout Success**
6. View **Consumer → Orders** — status should be PAID
7. Navigate to purchased batch page
8. Submit a review

**Expected results:**
- Order status transitions PENDING → PAID
- Product stock decremented
- Review shows **verified purchase** badge
- Producer rating updated on dashboard

---

### Scenario E: Fraud Alert Trigger

**Goal:** Demonstrate anti-fraud detection.

**Option 1 — Scan burst (easiest):**
1. Scan the same QR code rapidly more than 5 times within 1 minute
2. Check **Admin → Fraud** for `DUPLICATE_QR` alert

**Option 2 — Consumer report:**
1. On verification page, click **Report Discrepancy**
2. Submit a reason
3. Check **Admin → Fraud** for `SUSPICIOUS_ACTIVITY` alert

**Option 3 — Geo mismatch (requires coordinates):**
1. Ensure producer has latitude/longitude in settings
2. Scan with GPS coordinates far from apiary (>50 km)
3. Check for `GEO_MISMATCH` alert (requires `NEXT_PUBLIC_ENABLE_GEO_VERIFICATION=true`)

**Expected results:**
- FraudAlert record created with severity and description
- Admin can transition status: FLAGGED → INVESTIGATING → RESOLVED

---

### Scenario F: Ledger Integrity Audit

**Goal:** Demonstrate immutable audit trail.

1. Login as admin
2. Navigate to **Admin → Ledger**
3. Show block chain with linked hashes
4. Call API: `GET http://localhost:3000/api/blockchain/verify`

**Expected response:**
```json
{
  "success": true,
  "chain": {
    "valid": true,
    "blocksChecked": 12
  }
}
```

5. Click a block hash to verify individual block via `/api/blockchain/verify?hash=0x...`

---

### Scenario G: Producer Analytics

**Goal:** Show data-driven producer dashboard.

1. Login as **john@goldenvalley.com**
2. Navigate to **Dashboard → Analytics**
3. Show revenue from paid orders (not placeholder data)
4. Navigate to **Dashboard → Reviews** for rating statistics

---

## 13.6 Feature Flag Testing

Toggle in `.env` and restart dev server:

| Flag | Effect when `false` |
|------|---------------------|
| `NEXT_PUBLIC_ENABLE_FRAUD_DETECTION` | Fraud rules skipped |
| `NEXT_PUBLIC_ENABLE_GEO_VERIFICATION` | Geo mismatch rule skipped |
| `NEXT_PUBLIC_ENABLE_REVIEWS` | Review UI hidden |

## 13.7 Common Issues

| Issue | Solution |
|-------|----------|
| Database empty | Run `pnpm db:seed` |
| Paystack popup fails | Verify test keys in `.env` |
| Login redirect loop | Check `NEXTAUTH_URL` matches dev URL |
| Producer cannot create batch | Admin must approve producer first |
| Webhook not firing locally | Use success page client verify fallback |
| Build fails | Run `pnpm exec prisma generate` then `pnpm build` |

## 13.8 Viva Presentation Structure

Suggested demonstration order for academic defence:

1. **Problem introduction** — Honey fraud and trust gap (2 min)
2. **Architecture overview** — Show docs/02-system-architecture.md diagram (3 min)
3. **Cryptographic verification** — Batch hash explanation + live verify (3 min)
4. **Ledger audit trail** — Admin ledger page + integrity API (3 min)
5. **Fraud detection** — Trigger alert live or show existing alerts (3 min)
6. **Commerce + verified reviews** — Purchase and review flow (4 min)
7. **Q&A** — Reference methodology and limitations docs (remaining time)

## 13.9 Evaluation Checklist

| Criterion | Evidence |
|-----------|----------|
| Novel contribution | Hash-chained ledger + HMAC + fraud rules combined |
| Working prototype | All scenarios above executable locally |
| Security awareness | Server-side secrets, webhook HMAC, role checks |
| Data persistence | Prisma + SQLite with seed data |
| User experience | Three role portals with distinct workflows |
| Documentation | Complete docs/ folder |
| Honest limitations | Centralised ledger, no ML, SQLite for demo |

## 13.10 Related Documents

- [Project Overview](./01-project-overview.md)
- [Development Methodology](./03-development-methodology.md)
- [API Reference](./12-api-reference.md)
