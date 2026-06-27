# 4. Technology Stack

## 4.1 Stack Overview

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Runtime | Node.js | 18+ | Server-side JavaScript execution |
| Framework | Next.js | 16.x | Full-stack React framework with App Router |
| UI Library | React | 19.x | Component-based user interface |
| Language | TypeScript | 5.7 | Static typing across frontend and backend |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Components | shadcn/ui + Radix UI | — | Accessible, composable UI primitives |
| ORM | Prisma | 6.x | Type-safe database access |
| Database | SQLite | — | Local development persistence |
| Authentication | NextAuth.js | 5 beta | Session management, credentials login |
| Password Hashing | bcryptjs | 3.x | Secure password storage |
| Payments | Paystack REST API | — | Card and mobile money checkout |
| QR Codes | qrcode.react | 4.x | Batch QR rendering |
| QR Scanning | BarcodeDetector API | — | Browser-native QR decoding |
| Charts | Recharts | 2.x | Producer analytics visualisation |
| Forms | React Hook Form + Zod | — | Validated form handling |
| Icons | Lucide React | — | Consistent iconography |

## 4.2 Frontend Architecture

### Next.js App Router

HiveTrace uses the App Router paradigm introduced in Next.js 13+:

- **Server Components** default for data-fetching pages (dashboards, admin panels)
- **Client Components** (`'use client'`) for interactivity: scanner, checkout popup, forms with local state
- **Route groups** organise pages by actor: `/dashboard`, `/admin`, `/consumer`

### Styling System

Tailwind CSS 4 with PostCSS provides responsive layouts. shadcn/ui components (built on Radix UI) supply accessible dialogs, tables, forms, and navigation patterns without a heavy component framework lock-in.

### QR Scanning

The consumer scanner (`app/consumer/scanner/page.tsx`, `components/consumer/qr-scanner.tsx`) uses the experimental **BarcodeDetector Web API** when available, with manual paste fallback. This avoids native app dependencies while supporting mobile browser demos.

## 4.3 Backend Architecture

### Server Actions

Primary mutation pathway. Examples:

| Action File | Responsibility |
|-------------|----------------|
| `admin-actions.ts` | Producer/batch approval, fraud status, ledger queries |
| `scan-actions.ts` | Scan registration, fraud rule execution |
| `order-actions.ts` | Cart checkout, payment fulfillment, retry |
| `review-actions.ts` | Review submission, rating aggregation |
| `producer-actions.ts` | Producer stats, profile updates |

### API Route Handlers

Used where HTTP semantics or third-party integration requires REST:

| Route | Reason for REST |
|-------|-----------------|
| `/api/checkout/paystack/webhook` | Paystack requires raw body + signature header |
| `/api/qr/verify` | Client-side scanner POST |
| `/api/blockchain/verify` | Public verification lookup |
| `/api/auth/[...nextauth]` | NextAuth protocol handler |

## 4.4 Data Layer

### Prisma ORM

Prisma provides:

- Schema-first modelling in `prisma/schema.prisma`
- Type-safe queries with auto-generated client
- Migration support via `prisma db push` (development) or `migrate deploy` (production)

### Database Choice

**SQLite** is configured for local development and demonstration:

```
DATABASE_URL="file:./dev.db"
```

SQLite requires no separate database server, simplifying evaluator setup. The schema uses standard relational patterns portable to PostgreSQL when production deployment is needed.

## 4.5 Authentication Stack

```
NextAuth.js (Credentials Provider)
    └── bcrypt password verification
    └── JWT session strategy
    └── Role embedded in token (CONSUMER | PRODUCER | ADMIN)
    └── proxy.ts route guards
```

See [Authentication & Authorization](./08-authentication-authorization.md) for details.

## 4.6 Payment Stack

```
Client: Paystack inline popup (lib/paystack.ts)
Server: Paystack REST API (lib/paystack-server.ts)
    └── POST /transaction/initialize
    └── GET /transaction/verify/:reference
Webhook: HMAC-SHA512 signature validation
```

Currency is configured as **GHS** (Ghana Cedis) in the Paystack initializer, aligned with Paystack's primary markets. Order records default to **NGN** in schema — a configurable inconsistency noted for future harmonisation.

## 4.7 Cryptographic Libraries

Node.js built-in `crypto` module provides:

- `crypto.createHmac('sha256', secret)` for batch integrity hashes
- `crypto.createHash('sha256')` for ledger block hashing
- `crypto.createHmac('sha512', secret)` for Paystack webhook verification

No external cryptography libraries are required.

## 4.8 Development Tooling

| Tool | Purpose |
|------|---------|
| pnpm | Fast, disk-efficient package manager |
| ESLint | Code linting with `eslint-config-next` |
| ts-node | Running Prisma seed script |
| Prisma CLI | Schema management and client generation |

## 4.9 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Yes | Session encryption secret |
| `NEXTAUTH_URL` | Yes | Auth callback base URL |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL for links and Paystack callbacks |
| `DATABASE_URL` | Yes | Prisma database connection string |
| `BATCH_HASH_SECRET` | Yes | HMAC key for batch verification hashes |
| `PAYSTACK_SECRET_KEY` | For payments | Server-side Paystack API key |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | For payments | Client-side Paystack public key |
| `ADMIN_EMAIL` | Optional | Default admin account reference |
| `NEXT_PUBLIC_ENABLE_*` | Optional | Feature flags |

See `.env.example` in the project root for the complete template.

## 4.10 Related Documents

- [System Architecture](./02-system-architecture.md)
- [Database Design](./11-database-design.md)
- [E-Commerce & Payments](./09-ecommerce-payments.md)
