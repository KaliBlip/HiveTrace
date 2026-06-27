# HiveTrace - Cryptographically Verified Honey Traceability Platform

A modern Next.js application for tracking honey from hive to table with cryptographic verification, producer reputation systems, and anti-fraud detection.

![HiveTrace](./public/hero-beehive.jpg)

## 🎯 Features

### For Producers
- **Batch Management**: Create and manage honey batches with automatic HMAC-SHA256 verification
- **QR Code Generation**: Unique QR codes for each batch linking to verification data
- **Dashboard Analytics**: Track batch performance, scan counts, and consumer engagement
- **Producer Reputation**: Build reputation through verified consumer reviews
- **Settings & Profile**: Manage business information and account settings

### For Consumers
- **QR Scanner**: Browser-based QR code scanning with fallback image upload
- **Batch Verification**: Instantly verify honey authenticity and integrity
- **Producer Profiles**: View producer reputation, ratings, and verified reviews
- **Verified Reviews**: Leave reviews on batches you've purchased
- **Traceability Tab**: See complete journey from harvest to sale

### For Admins
- **Fraud Monitoring**: Real-time fraud detection dashboard
- **Producer Approval**: Vet and approve new producers
- **Batch Management**: Overview and audit of all batches
- **Alert System**: Track suspicious QR scans, geo-mismatches, and unusual patterns
- **Reports**: Generate compliance and audit reports

## 🔒 Security Features

- **Cryptographic Verification**: HMAC-SHA256 signatures prevent batch tampering
- **Duplicate QR Prevention**: Track and prevent fraudulent QR code cloning
- **Geo-Verification**: Detect suspicious scans from unexpected locations
- **Suspicious Activity Detection**: Monitor scan patterns for anomalies
- **Producer Vetting**: Admin approval process for producer accounts
- **Audit Trail**: Complete history of all batch operations

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS 4.2, shadcn/ui components
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM with PostgreSQL (prepared for Supabase)
- **QR Codes**: qrcode.react, BarcodeDetector API
- **State Management**: Zustand (for future client state)
- **Form Handling**: React Hook Form, Zod validation
- **Icons**: Lucide React

## 📋 Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public pages
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Producer dashboard
│   ├── consumer/                 # Consumer features
│   ├── admin/                    # Admin panel
│   ├── api/                      # API routes
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── auth/                     # Auth components
│   ├── dashboard/                # Dashboard components
│   ├── consumer/                 # Consumer components
│   ├── common/                   # Shared components
├── lib/                          # Utilities and helpers
│   ├── auth.ts                   # Auth configuration
│   ├── crypto.ts                 # Cryptographic functions
│   ├── qr.ts                     # QR code utilities
│   ├── helpers.ts                # General helpers
│   ├── store.ts                  # Mock data store
│   ├── config.ts                 # App configuration
│   └── utils.ts                  # Shared utilities
├── proxy.ts                      # Next.js proxy for route protection
├── public/                       # Static assets
└── prisma/                       # Database schema (prepared)
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL 15+ (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hivetrace.git
   cd hivetrace
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   BATCH_HASH_SECRET=your-batch-hash-secret
   ```

4. **Set up the database** (when using Supabase/PostgreSQL)
   ```bash
   pnpm db:push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

Full technical documentation for this final-year project is in the [`docs/`](./docs/) folder:

- [Documentation Index](./docs/README.md) — Start here
- [System Architecture](./docs/02-system-architecture.md)
- [Cryptographic Verification](./docs/05-cryptographic-verification.md)
- [Blockchain Ledger](./docs/06-blockchain-ledger.md)
- [Fraud Detection](./docs/07-fraud-detection-system.md)
- [Testing & Demonstration Guide](./docs/13-testing-demonstration.md)

## 📖 Usage Guide

### For Producers

1. **Register**: Sign up with your business information
2. **Create Batches**: Add honey batches with harvest dates, quantities, and types
3. **Generate QR Codes**: Automatic QR code generation with cryptographic verification
4. **Track Performance**: Monitor batch scans, consumer engagement, and reviews
5. **Manage Reputation**: Respond to reviews and maintain high ratings

### For Consumers

1. **Scan QR Code**: Use the browser-based scanner on your phone
2. **Verify Authenticity**: See instant verification badge and batch details
3. **View Traceability**: Check producer info, harvest date, and batch journey
4. **Leave Reviews**: Share feedback on verified purchases
5. **Track Reputation**: See producer ratings and verified reviews

### For Admins

1. **Review Alerts**: Monitor fraud detection dashboard
2. **Approve Producers**: Vet new producer accounts
3. **Manage Batches**: Audit batches and handle disputes
4. **Generate Reports**: Export compliance and fraud reports
5. **Configure Settings**: Manage thresholds and feature flags

## 🔐 API Routes

### Batch Management
- `GET /api/batches` - List all batches
- `POST /api/batches` - Create new batch
- `GET /api/batches/[id]` - Get batch details
- `PUT /api/batches/[id]` - Update batch
- `DELETE /api/batches/[id]` - Delete batch

### QR Verification
- `POST /api/qr/verify` - Verify batch QR code

### Producer Information
- `GET /api/producers/[id]` - Get producer profile
- `PUT /api/producers/[id]` - Update producer info

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews?batchId=xxx` - Get batch reviews

## 🔑 Key Concepts

### Batch Codes
Format: `HT-YYYY-XXX-###`
- `HT` = HiveTrace prefix
- `YYYY` = Year
- `XXX` = Random 3-letter code
- `###` = Random 3-digit code

### Verification Hash
Each batch is cryptographically signed using HMAC-SHA256:
```
hash = HMAC-SHA256(
  secret,
  JSON.stringify({
    batchId,
    harvestDate,
    quantity,
    producerId
  })
)
```

### QR Code Data
QR codes encode:
```json
{
  "batchId": "HT-2024-WFB-001",
  "hash": "7a3c2f8e9b4d1c6e5f2a9d3b7c1e8a4f",
  "timestamp": "2024-05-15T10:30:00Z"
}
```

## 📊 Database Schema

### Users Table
```
id (uuid)
email (string, unique)
password_hash (string)
role (enum: consumer, producer, admin)
full_name (string)
created_at (timestamp)
```

### Producers Table
```
id (uuid)
user_id (uuid, FK)
business_name (string)
location (geography)
verified (boolean)
rating (float)
total_reviews (integer)
```

### Honey Batches Table
```
id (uuid)
producer_id (uuid, FK)
batch_code (string, unique)
name (string)
harvest_date (date)
quantity_kg (decimal)
integrity_hash (string)
qr_code (string)
scan_count (integer)
verified (boolean)
created_at (timestamp)
```

### Reviews Table
```
id (uuid)
batch_id (uuid, FK)
consumer_id (uuid, FK)
rating (integer, 1-5)
comment (text)
verified_purchase (boolean)
created_at (timestamp)
```

### Fraud Alerts Table
```
id (uuid)
batch_id (uuid, FK)
type (enum: duplicate_qr, geo_mismatch, suspicious_activity)
severity (enum: low, medium, high)
description (text)
resolved (boolean)
created_at (timestamp)
```

## 🧪 Testing

### Database Seed Data
Run `pnpm db:seed` to populate demo producers, batches, products, and blockchain ledger entries.

### Test Accounts
```
Producer: john@goldenvalley.com / password
Consumer: sarah@consumer.com / password
Admin: admin@hivetrace.com / password
```

### Test QR Codes
- Producer Dashboard → Batches → View batch → Copy QR code
- Consumer Scanner → Paste QR code → Verify

## 🚀 Deployment

### Deploy to Vercel
```bash
# Connect your GitHub repository to Vercel
# Set environment variables in Vercel dashboard
# Automatic deployment on push to main
```

### Environment Variables for Production
```
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
BATCH_HASH_SECRET=your-secure-secret
```

## 📈 Roadmap

- [ ] Real database integration (Supabase/Neon)
- [ ] Email notifications for fraud alerts
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboards
- [ ] Batch CSV import/export
- [ ] Multi-language support
- [ ] Integration with e-commerce platforms
- [ ] Blockchain verification (optional)
- [ ] IoT sensor integration for harvest verification
- [ ] API for third-party integrations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, email support@hivetrace.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**HiveTrace** - _Bringing transparency to honey traceability_
