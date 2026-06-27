# 5. Cryptographic Verification

## 5.1 Purpose

Cryptographic verification ensures that honey batch metadata cannot be altered after creation without detection. Each batch receives a unique **verification hash** computed from its core attributes using HMAC-SHA256.

This is the first layer of trust in HiveTrace — distinct from the ledger (which records admin approval events) and from QR codes (which encode the hash for public lookup).

## 5.2 Algorithm: HMAC-SHA256

**HMAC** (Hash-based Message Authentication Code) combines a secret key with message data. Unlike plain SHA-256, an attacker cannot recompute a valid hash without knowing `BATCH_HASH_SECRET`.

### Implementation

Source: `lib/crypto.ts`

```typescript
export function generateBatchHash(data: {
  producerId: string;
  batchCode: string;
  honeyType: string;
  quantity: number;
  harvestDate: string;
}) {
  const secret = process.env.BATCH_HASH_SECRET || 'fallback-secret-for-dev-only';

  const payload = JSON.stringify({
    producerId: data.producerId,
    batchCode: data.batchCode,
    honeyType: data.honeyType,
    quantity: data.quantity,
    harvestDate: data.harvestDate,
  });

  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}
```

### Hash Input Fields

| Field | Source | Why Included |
|-------|--------|--------------|
| `producerId` | Producer record ID | Binds batch to specific apiary operator |
| `batchCode` | Generated code (e.g. `HT-2026-ABC-042`) | Unique batch identifier |
| `honeyType` | User input (Wildflower, Clover, etc.) | Detects type substitution fraud |
| `quantity` | Harvest quantity in kg | Detects quantity inflation |
| `harvestDate` | ISO timestamp | Detects backdating |

Fields **not** included in the hash (description, images, price) can be updated without invalidating integrity — a deliberate trade-off allowing marketing edits while protecting core traceability data.

## 5.3 Batch Code Generation

Batch codes follow the pattern:

```
HT-{YEAR}-{RANDOM3}-{SEQUENCE3}
```

Example: `HT-2026-K7M-042`

Generated in `app/api/batches/route.ts` at creation time, before hash computation.

## 5.4 Verification Process

### At Creation (Producer)

1. Producer submits batch form
2. Server generates `batchCode`
3. Server computes `verificationHash = generateBatchHash(...)`
4. Batch stored with `verified: false`

### At Public Lookup (Consumer)

1. Consumer scans QR or visits `/verify/[hash]`
2. Server loads batch by `verificationHash` or `batchCode`
3. Server recomputes hash from stored fields
4. Match confirms data integrity; mismatch indicates tampering

```typescript
export function verifyBatchHash(data: any, hash: string) {
  const generatedHash = generateBatchHash(data);
  return generatedHash === hash;
}
```

### Trust Levels

| State | Meaning |
|-------|---------|
| Hash valid, `verified: false` | Data intact but not yet admin-approved |
| Hash valid, `verified: true` | Admin approved + ledger registered |
| Hash invalid | Data tampered or wrong secret used |

## 5.5 QR Code Encoding

QR codes embed a JSON payload linking batch identity to its hash:

```json
{
  "batchId": "HT-2026-K7M-042",
  "hash": "a1b2c3d4e5f6..."
}
```

Utilities in `lib/qr.ts`:

- `encodeQRData()` — Creates JSON string for QR rendering
- `formatBatchQRUrl()` — Deep link: `{APP_URL}/verify/{hash}`
- `parseQRScanResult()` — Handles JSON, URLs, and raw batch codes

QR codes are created when an admin approves a batch (`verifyAndApproveBatch` in `admin-actions.ts`).

## 5.6 Security Considerations

| Risk | Mitigation |
|------|------------|
| Secret exposure | `BATCH_HASH_SECRET` is server-only; never sent to client |
| Fallback secret in dev | Warning: default fallback must not be used in production |
| Hash replay | Hash alone doesn't prove admin approval; check `verified` flag and ledger |
| QR cloning | Fraud detection monitors scan patterns (see [Fraud Detection](./07-fraud-detection-system.md)) |

## 5.7 Geo-Distance Utility

`lib/crypto.ts` also provides `isLocationWithinThreshold()` using the **Haversine formula** to calculate great-circle distance between scan coordinates and producer apiary coordinates. Used by the fraud detection engine when geo-verification is enabled.

```
distance = 2 × R × atan2(√a, √(1−a))
where a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlng/2)
R = 6371 km
```

Default threshold: **50 km** (configurable in `lib/config.ts`).

## 5.8 Related Documents

- [Blockchain Ledger](./06-blockchain-ledger.md) — Records admin approval on immutable chain
- [Fraud Detection](./07-fraud-detection-system.md) — Scan pattern analysis
- [Testing & Demonstration](./13-testing-demonstration.md) — Verify hash integrity in demo
