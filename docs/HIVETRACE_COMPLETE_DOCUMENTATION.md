# HiveTrace: Complete System Documentation

**Version:** Validation Board architecture  
**Purpose:** This is the authoritative overview of the current HiveTrace system. It describes what the platform does, how the roles work, how a honey batch is validated, and how the application is structured.

---

## 1. System purpose

HiveTrace is a honey traceability and marketplace platform. Its core purpose is to give consumers a trustworthy way to verify that a honey batch comes from a real, inspected beekeeper.

The system does **not** currently claim to prove honey authenticity using artificial intelligence, GPS analysis, or blockchain. The source of trust is a documented human process:

1. A beekeeper registers.
2. An independent **Validation Board** conducts an on-site farm inspection.
3. The board records compulsory evidence from that visit.
4. The board decides whether to accredit the producer.
5. An accredited producer submits a honey batch with finished-honey, packaging, and video evidence.
6. The board compares the batch evidence with the farm-inspection evidence and makes a human decision.
7. An approved batch receives a digital certificate and QR code.
8. A consumer scans the QR code to view the public validation record.

The application also supports a honey shop, payments, orders, producer reputation, and reviews. Those features operate around the validation workflow; they do not replace it.

## 2. Roles and responsibilities

| Role | Main responsibility | Can do | Cannot do |
|---|---|---|---|
| **Producer / Beekeeper** | Supply accurate business, farm, and batch information | Register, manage profile, submit batches and products after accreditation, fulfill orders | Accredit themselves, approve a batch, issue a certificate |
| **Validation Board** | Independent human validation body (for example, a regulatory or accreditation body) | View producer cases, record farm inspections, accredit/reject producers, compare batches, approve/reject/request corrections, issue certificates through approval | Manage platform users or replace evidence with an automated result |
| **Consumer** | Verify and buy honey | View public approved products, scan/verify QR codes, purchase, review fulfilled purchases | View private inspection files or approve records |
| **Administrator** | Platform oversight and operations | Manage platform content, products, reports, finance, orders, support, and legacy monitoring tools | Perform the Validation Board’s producer accreditation or batch-certification decisions |

### Important governance principle

The Validation Board is separate from the HiveTrace administrator. A board member must use a `VALIDATION_BOARD` account. The role is enforced by the board layout, server actions, and inspection-evidence upload endpoint.

## 3. The simplified Validation Board review desk

The board dashboard is deliberately organised as a simple case review desk, rather than a collection of dashboards.

```text
Producer directory
       |
       v
Selected producer case
       |
       +--> Record / renew inspection
       |
       +--> Accredit or reject producer
       |
       +--> Select one submitted batch
                 |
                 v
          Side-by-side evidence comparison
                 |
                 v
       Approve | Request corrections | Reject
```

The board member sees a searchable producer list. Selecting a producer opens one focused case page containing:

- Producer identity, location, accreditation status, latest inspection date, and number of batches.
- A button to record a first inspection or renewal inspection.
- A producer-accreditation decision area.
- A batch list. The member selects one batch at a time.
- A side-by-side comparison of submitted honey/packaging images and the latest inspection’s reference images.
- A required decision-notes field and the appropriate batch-decision buttons.

This keeps detailed inspection uploads hidden until the member chooses to record an inspection and prevents accidental decisions across multiple batches.

## 4. Complete validation workflow

### 4.1 Producer registration and membership review

1. A user registers as a `PRODUCER`.
2. HiveTrace creates a linked `Producer` record.
3. The new producer starts with:
   - `verified = false`
   - `status = PENDING_BOARD_REVIEW`
4. The producer can complete profile information but cannot create or manage batches, products, or orders until accredited.
5. The producer appears in the Validation Board producer directory.

### 4.2 On-site farm inspection

A Validation Board member selects the producer and visits the physical production location. The board member must capture and upload all of the following before the inspection can be saved:

| Required evidence | Reason |
|---|---|
| Visit date | Establishes when the evidence was collected |
| Identity document | Links the inspected operator to the producer record |
| Apiary photographs | Shows the production environment |
| Hive photographs | Shows the hives used for production |
| Honey photographs | Creates a product reference for later comparisons |
| Packaging photographs | Creates a packaging reference for later comparisons |
| Certificates | Records relevant compliance/accreditation documents |
| Site video | Adds contextual visual evidence |
| Signed inspection report | Captures the verifier’s formal report |
| Inspection notes | Records observations and findings |

GPS latitude and longitude are supported in the data model but are optional. They are not a current approval requirement.

When saved, HiveTrace creates a `FarmInspection` record and changes the producer status to `INSPECTION_RECORDED`. The inspection belongs to both the producer and the Validation Board member who conducted it.

### 4.3 Producer accreditation decision

The Validation Board reviews the field evidence and makes one of these decisions:

| Decision | Producer status | Result |
|---|---|---|
| Accredit | `ACCREDITED` | `verified` becomes true; accreditation starts and expires one year later |
| Reject | `REJECTED` | `verified` remains false; the producer cannot submit batches |
| Request/require inspection | `INSPECTION_REQUIRED` | Used when a further visit or information is needed |

Accreditation cannot be granted without at least one completed farm inspection. The latest inspection’s outcome is also updated to reflect approval or rejection.

### 4.4 Periodic renewal

Producer accreditation has a one-year validity period. The platform stores:

- `lastInspectionAt`
- `accreditationExpiresAt`
- `accreditedById`

Before the expiry date, the board should carry out a renewal inspection using the same mandatory evidence checklist. Once accreditation has expired, the producer authorisation guard prevents batch, product, and order management until the producer has been re-accredited.

### 4.5 Batch submission

Only a currently accredited producer can submit a honey batch. At submission time, HiveTrace requires:

- Honey type, quantity, harvest date, and normal batch details.
- A photograph of the finished honey.
- A photograph of the finished packaging.
- A batch video.

HiveTrace creates a unique batch code and a cryptographic verification hash, but the hash is an identifier/integrity aid—not the decision-maker for authenticity. The batch begins as:

```text
verified = false
boardStatus = PENDING_REVIEW
```

### 4.6 Board batch comparison and decision

The Validation Board opens the producer’s case, chooses the submitted batch, and compares:

| Producer-submitted evidence | Inspection reference evidence |
|---|---|
| Finished honey image | Honey image from the latest farm inspection |
| Packaging image | Packaging image from the latest farm inspection |
| Batch video | Site/inspection documentation and the verifier’s judgement |

This is a **human comparison**. The system displays the evidence but does not use machine learning or automatic image matching to decide authenticity.

The board member must write decision notes. The allowed outcomes are:

| Board decision | `boardStatus` | Result |
|---|---|---|
| Approve | `APPROVED` | Batch is marked verified; QR record and active certificate are created/updated |
| Request corrections | `CHANGES_REQUESTED` | Producer must correct/re-submit evidence; no certificate is issued |
| Reject | `REJECTED` | Batch is not publicly validated or sellable as a validated product |

Approval is blocked if the producer is not accredited or the batch lacks the required finished-honey image, packaging image, or video.

### 4.7 Certificate and QR verification

Approving a batch creates or refreshes:

- A `QRCode` record for the batch.
- A `ValidationCertificate` with a unique `HT-CERT-<year>-<random>` number.
- An `ACTIVE` certificate expiry date one year after issuance.

The public verification page only returns a batch where all of the following are true:

```text
batch.verified = true
boardStatus = APPROVED
certificate.status = ACTIVE
certificate.expiresAt is in the future
```

The public record presents the batch, producer, board reviewer, latest inspection date, approval date, certificate number/status/expiry, and traceability history. Private inspection evidence, identity documents, signed reports, and verifier notes are not public.

## 5. State model

### Producer states

```text
PENDING_BOARD_REVIEW
        |
        v
INSPECTION_RECORDED -----> INSPECTION_REQUIRED
        |
        +----> ACCREDITED -----> renewal inspection -----> ACCREDITED
        |
        +----> REJECTED
```

`verified` is true only while the producer is accredited. The operational access check also rejects an expired accreditation.

### Batch states

```text
PENDING_REVIEW
      |
      +----> APPROVED ----------> active certificate + QR verification
      |
      +----> CHANGES_REQUESTED -> producer corrects and resubmits for review
      |
      +----> REJECTED
```

## 6. System architecture

HiveTrace uses a Next.js App Router application with server-side actions and API routes. Prisma is the database access layer.

```text
Browser
  |
  +-- Public pages: landing, shop, QR verification, producer/product details
  +-- Authenticated dashboards: producer, consumer, administrator, validation board
  |
Next.js application
  |
  +-- Route layouts and proxy: session/role route protection
  +-- React pages/components: user interface
  +-- Server actions: protected business operations
  +-- API routes: registration, uploads, batches, QR verification, payments, reviews
  |
  +-- NextAuth/Auth.js: session authentication
  +-- Prisma ORM
  |
SQLite in local development / PostgreSQL-compatible production target
  |
  +-- Users, producers, inspections, batches, certificates, QR codes
  +-- Products, orders, payments, reviews, scans, reports
```

### Architectural layers

| Layer | Responsibility | Main locations |
|---|---|---|
| Presentation | Pages, forms, dashboards, reusable UI | `app/`, `components/` |
| Access control | Login, session, route protection, role checks | `lib/auth.ts`, `proxy.ts`, route layouts |
| Business rules | Accreditation, inspection, batch review, certificates, commerce | `lib/actions/`, `lib/producer-authorization.ts` |
| HTTP interfaces | Registration, uploads, QR, checkout, reviews | `app/api/` |
| Persistence | Data models and database migrations | `prisma/schema.prisma`, `prisma/migrations/` |
| Supporting services | QR generation, hashing, payment, scan analytics | `lib/qr.ts`, `lib/crypto.ts`, `lib/paystack*.ts`, `lib/actions/scan-actions.ts` |

### Validation-specific implementation map

| Concern | Primary implementation |
|---|---|
| Board review desk UI | `app/board/page.tsx` |
| Board-only route guard | `app/board/layout.tsx` |
| Board business rules | `lib/actions/board-actions.ts` |
| Producer accreditation guard | `lib/producer-authorization.ts` |
| Inspection file upload | `app/api/upload/evidence/route.ts` |
| Producer registration status | `app/api/auth/register/route.ts` |
| Batch submission requirement | `lib/actions/batch-actions.ts`, `app/api/batches/route.ts` |
| Public certificate check | `lib/actions/verify-actions.ts` |
| Data model | `prisma/schema.prisma` |

## 7. Core data model

### Main entities

| Entity | Meaning | Important fields |
|---|---|---|
| `User` | Login identity for every role | `email`, `password`, `name`, `role` |
| `Producer` | Producer/business profile | `businessName`, `location`, `status`, `verified`, accreditation dates |
| `FarmInspection` | Evidence from one board farm visit | verifier, date, files, notes, outcome |
| `HoneyBatch` | One submitted honey batch | batch code, producer, submitted media, `boardStatus`, reviewer, decision notes |
| `ValidationCertificate` | Human-issued public validation stamp | number, issued/expiry dates, status, issuing board member |
| `QRCode` and `QRScan` | Batch QR data and scan activity | code, counts, scan location/time |
| `Product` | Sellable listing tied to a batch | price, stock, active state |
| `Order` and `OrderItem` | Marketplace purchase and fulfilment records | consumer, payment, delivery state |
| `Review` | Consumer feedback | rating, text, verified-purchase flag |

### Relationship summary

```text
User (producer) 1 ---- 1 Producer
User (board)    1 ---- * FarmInspection
Producer        1 ---- * FarmInspection
Producer        1 ---- * HoneyBatch
HoneyBatch      1 ---- 1 ValidationCertificate
HoneyBatch      1 ---- * QRCode ---- * QRScan
HoneyBatch      1 ---- 0..1 Product
Product         1 ---- * OrderItem ---- 1 Order
HoneyBatch      1 ---- * Review
```

Inspection photo/document collections are stored as JSON arrays of uploaded file URLs. This permits local file storage today and object storage in production later.

## 8. Authentication and authorization

Authentication is provided by NextAuth/Auth.js. Role-based access is checked in both the user interface and the protected server operation; hiding a button alone is never relied upon for security.

### Authorisation boundaries

| Action | Required role / condition |
|---|---|
| Open board dashboard | `VALIDATION_BOARD` |
| Upload inspection evidence | `VALIDATION_BOARD` |
| Save inspection | `VALIDATION_BOARD` |
| Accredit/reject producer | `VALIDATION_BOARD` |
| Decide a batch | `VALIDATION_BOARD` |
| Create or manage producer batches/products/orders | `PRODUCER` + `verified` + `ACCREDITED` + not expired |
| View public validated batch | No login; approved, verified batch with active certificate |
| Platform management | `ADMIN` routes/actions as applicable |

## 9. Files and evidence storage

Validation Board evidence is uploaded through `POST /api/upload/evidence`.

- Allowed types: JPEG, PNG, WebP, PDF, MP4, WebM, and QuickTime video.
- Maximum file size: 20 MB per file.
- Development storage location: `public/uploads/inspection-evidence/`.
- Access: only a `VALIDATION_BOARD` session may upload this evidence.

For production, move evidence storage to a private object-storage service (such as Supabase Storage, S3, or Cloudflare R2), keep signed documents non-public, and store only protected URLs/references in the database.

## 10. Public and marketplace flows

### Consumer verification flow

```text
Consumer scans QR
       |
       v
HiveTrace resolves batch/certificate
       |
       +-- not approved, inactive, expired, or unknown --> no valid public result
       |
       +-- approved + active --> public verification record
                                    |
                                    +--> producer and batch details
                                    +--> inspection/approval dates
                                    +--> validation-board name
                                    +--> certificate details
```

### Marketplace flow

1. A producer creates a product linked to a validated batch.
2. Public shop queries restrict listings to active products with board-approved batches and active certificates.
3. A consumer adds a product to the cart and starts checkout.
4. Paystack payment routes initialise and verify payment.
5. The producer sees the order and fulfils it.
6. After delivery/fulfilment, the consumer can leave a review, which contributes to producer reputation.

## 11. API and server-action reference

### Primary validation interfaces

| Interface | Type | Purpose |
|---|---|---|
| `POST /api/auth/register` | API route | Register user; producer registration creates a pending producer profile |
| `POST /api/upload/evidence` | API route | Board-only inspection evidence upload |
| `getBoardProducerDirectory()` | Server action | Board searchable producer list |
| `getBoardProducerCase(producerId)` | Server action | Full producer case with inspections and batches |
| `submitFarmInspection(data)` | Server action | Validate required evidence and save field visit |
| `decideProducerAccreditation(id, decision, notes)` | Server action | Accredit, reject, or require more inspection |
| `decideBatchValidation(id, decision, notes)` | Server action | Human batch decision; creates certificate/QR on approval |
| `createBatch(data)` / `POST /api/batches` | Server action/API route | Accredited producer submits a pending batch |
| `verifyBatchByHash(hash)` | Server action | Public validation page lookup with certificate gate |
| `POST /api/qr/verify` | API route | QR lookup and scan logging |

### Supporting interfaces

The application also includes routes/actions for product management, Paystack checkout/webhooks, orders, reviews, scan tracking, contact messages, reporting, and legacy monitoring features. Their files are grouped under `app/api/` and `lib/actions/`.

## 12. Technology stack

| Area | Technology |
|---|---|
| Application | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, shadcn/ui/Radix components, Lucide icons |
| Authentication | NextAuth/Auth.js with Prisma adapter support |
| Data access | Prisma 6 |
| Development database | SQLite (`prisma/dev.db`) |
| Production database target | PostgreSQL-compatible database |
| Payments | Paystack integration |
| QR UI | `qrcode.react` and browser barcode capabilities |
| Validation file handling | Next.js route upload to local public storage in development |

## 13. Local setup and operation

### Prerequisites

- Node.js 18 or newer
- pnpm
- A `DATABASE_URL` in the environment (the included local setup uses SQLite)

### Commands

```bash
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate dev
pnpm dev
```

Open `http://localhost:3000` after the server is ready.

Useful commands:

```bash
pnpm exec tsc --noEmit       # Type-check
pnpm lint                    # Run ESLint across the project
pnpm db:seed                 # Load demo data
pnpm build                   # Generate Prisma client and build Next.js
```

### Required environment settings

At minimum configure:

```env
DATABASE_URL="file:./dev.db"              # local example
NEXTAUTH_SECRET="replace-with-a-secret"
NEXTAUTH_URL="http://localhost:3000"
BATCH_HASH_SECRET="replace-with-a-secret"
```

Production also requires the appropriate hosted database and payment settings; keep all payment and authentication secrets outside version control.

## 14. Security, privacy, and operational requirements

### Implemented protections

- Board server actions require `VALIDATION_BOARD`.
- Inspection upload endpoint requires `VALIDATION_BOARD`.
- Producer mutations are protected by the producer-accreditation guard.
- Board decision notes are compulsory for batch decisions.
- Batch approval is blocked without producer accreditation and mandatory batch media.
- Public page lookup requires an approved batch and active, non-expired certificate.

### Production requirements and known hardening work

The following are essential before a production deployment:

1. **Control Validation Board account creation.** The current registration endpoint accepts a requested role. In production, public registration must be limited to consumer/producer roles; Validation Board and administrator accounts should be provisioned by a controlled administrator or invitation flow.
2. **Protect inspection files.** Local `public/` storage makes files addressable by URL. Replace it with private object storage and short-lived signed viewing URLs for board members.
3. **Harden QR API verification.** Ensure every QR API response applies the same approved/active-certificate gate as `verifyBatchByHash`; do not reveal unapproved batch data through a direct QR lookup.
4. **Use PostgreSQL and backups.** SQLite is appropriate for development only.
5. **Add audit history.** Preserve immutable records of decisions, re-accreditations, certificate revocations, and who made each change.
6. **Add certificate revocation handling to the board UI.** The database supports `REVOKED`, but a complete operational revocation flow should be added.
7. **Validate files beyond MIME type.** Add malware scanning, content validation, retention periods, and access logging.
8. **Use HTTPS, secure secrets, rate limits, and monitoring** for every production environment.

## 15. Scope: current system versus future enhancements

### Current core

- Registration and role-based dashboards
- Human, evidence-based farm inspection
- Periodic producer accreditation model
- Human batch evidence comparison and decision
- Certificate and QR-based public verification
- Marketplace, orders, payments, reputation, and reviews

### Future enhancements, not proof mechanisms today

- Optional GPS-supported inspection and scan analysis
- Advanced fraud detection and alerting
- Blockchain or external immutable ledger integration
- Machine-learning assistance for internal review only
- Mobile field-inspection application
- Regulatory-system integration, notifications, and richer audit reports

Any future AI or blockchain capability must be described as supplementary support. It must not be presented as the system’s basis for proving honey authenticity unless it has been formally designed, validated, and approved for that purpose.

## 16. Demonstration script

Use this sequence to demonstrate the system to a supervisor:

1. Register a producer. Show that the producer is pending and cannot submit a batch.
2. Sign in as a Validation Board member and open the producer review desk.
3. Select the producer and record a farm inspection, uploading every required evidence type.
4. Accredit the producer. Show the one-year accreditation date.
5. Sign in as the producer and submit a batch with honey image, packaging image, and video.
6. Return to the board review desk, select the producer and batch, and show the side-by-side comparison.
7. Enter decision notes and approve the batch.
8. Show the generated certificate and QR code/public verification page.
9. Scan or enter the QR data as a consumer and show the producer, board, inspection date, approval date, batch details, and active certificate.

---

## 17. Glossary

| Term | Meaning |
|---|---|
| **Accreditation** | The board’s approval of a producer after field inspection; it is time-limited. |
| **Batch** | A defined quantity of honey submitted by one producer for review. |
| **Certificate** | The digital record issued after a board member approves a batch. |
| **Inspection evidence** | The compulsory documents, photos, video, and notes collected at the producer’s physical site. |
| **Validation Board** | The independent body responsible for field verification and human decisions. |
| **QR verification** | The public lookup of an approved batch’s validation record using its code. |

This document supersedes earlier documentation that describes admin-led approval, automatic AI authenticity judgement, blockchain-led proof, or GPS as mandatory validation. Those modules may remain in the codebase as legacy/supporting functionality, but they are not the core HiveTrace validation architecture.
