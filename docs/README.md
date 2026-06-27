# HiveTrace Documentation

Technical documentation for the HiveTrace final-year project: a cryptographically verified honey traceability platform with anti-fraud detection, immutable audit ledger, and integrated e-commerce.

## Document Index

| # | Document | Description |
|---|----------|-------------|
| 1 | [Project Overview](./01-project-overview.md) | Problem statement, objectives, scope, and stakeholder roles |
| 2 | [System Architecture](./02-system-architecture.md) | Layered architecture, request flows, and component map |
| 3 | [Development Methodology](./03-development-methodology.md) | SDLC approach, design decisions, and implementation phases |
| 4 | [Technology Stack](./04-technology-stack.md) | Frameworks, libraries, and infrastructure choices |
| 5 | [Cryptographic Verification](./05-cryptographic-verification.md) | HMAC-SHA256 batch integrity and QR encoding |
| 6 | [Blockchain Ledger](./06-blockchain-ledger.md) | Hash-chained immutable audit trail |
| 7 | [Fraud Detection](./07-fraud-detection-system.md) | Geo-verification, scan analytics, and alert lifecycle |
| 8 | [Authentication & Authorization](./08-authentication-authorization.md) | NextAuth, RBAC, and route protection |
| 9 | [E-Commerce & Payments](./09-ecommerce-payments.md) | Shop, orders, and Paystack integration |
| 10 | [Reputation & Reviews](./10-reputation-reviews.md) | Verified purchase reviews and producer ratings |
| 11 | [Database Design](./11-database-design.md) | Entity relationships, schema, and data flows |
| 12 | [API Reference](./12-api-reference.md) | REST endpoints and server actions |
| 13 | [Testing & Demonstration](./13-testing-demonstration.md) | Local setup, test accounts, and demo scenarios |

## Quick Reference

**Run locally**

```bash
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

**Demo accounts** (see [Testing & Demonstration](./13-testing-demonstration.md))

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hivetrace.com | password |
| Producer | john@goldenvalley.com | password |
| Consumer | sarah@consumer.com | password |

## Novel Systems Summary

HiveTrace combines several interdependent systems that address honey supply-chain fraud:

1. **Cryptographic batch sealing** — Each batch receives an HMAC-SHA256 fingerprint derived from producer ID, batch code, honey type, quantity, and harvest date. Any tampering invalidates the hash.

2. **Hash-chained ledger** — Admin-approved batches are registered on an append-only ledger where each block links to the previous block via SHA-256. This provides tamper-evident audit records without requiring a public blockchain network.

3. **Real-time fraud detection** — QR scan events trigger rule-based checks: impossible travel (cross-country scans within 24 hours), geo-distance from apiary, and scan burst detection.

4. **Verified reputation loop** — Consumers who complete Paystack purchases can leave verified reviews; ratings aggregate into producer trust scores displayed on public profiles.

5. **End-to-end traceability** — From producer batch creation → admin verification → ledger registration → QR scan → consumer purchase → verified review.

## Source Code Map

| Concern | Primary Location |
|---------|------------------|
| Batch hashing | `lib/crypto.ts` |
| Ledger engine | `lib/blockchain.ts` |
| Fraud checks | `lib/actions/scan-actions.ts` |
| Admin workflows | `lib/actions/admin-actions.ts` |
| Payments | `lib/paystack-server.ts`, `lib/actions/order-actions.ts` |
| Reviews | `lib/actions/review-actions.ts` |
| Auth | `lib/auth.ts`, `auth.config.ts`, `proxy.ts` |
| Database schema | `prisma/schema.prisma` |
