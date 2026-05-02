# HiveTrace - Cryptographically Verified Honey Traceability Platform

## Overview

HiveTrace is a modern Next.js web application that enables cryptographically verified honey traceability from hive to consumer. The platform uses HMAC-SHA256 verification, QR codes, and blockchain-like integrity checks to ensure honey authenticity and prevent counterfeits.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM) - Ready for Supabase/Neon
- **Authentication**: NextAuth.js
- **Design System**: shadcn/ui with Stripe-inspired minimal aesthetic and beehive/honey theme
- **QR Code**: qrcode.react for generation, native BarcodeDetector API + fallback for scanning
- **State Management**: Zustand (installed)

## Project Structure

```
app/
├── page.tsx                    # Landing page
├── auth/                       # Authentication pages
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── dashboard/                  # Producer dashboard
│   ├── layout.tsx             # Sidebar navigation
│   ├── page.tsx               # Dashboard overview
│   ├── batches/
│   │   ├── page.tsx           # Batches list
│   │   └── new/page.tsx       # Create batch form
│   ├── analytics/
│   ├── reviews/
│   └── settings/
├── consumer/                   # Consumer features
│   ├── page.tsx               # Consumer home
│   ├── scanner/page.tsx       # QR scanner
│   ├── batch/[id]/            # Batch detail with reviews
│   └── producer/[id]/         # Producer profile
├── admin/                      # Admin panel
│   ├── layout.tsx
│   ├── page.tsx               # Admin dashboard
│   ├── fraud/page.tsx         # Fraud detection
│   ├── producers/page.tsx     # Producer management
│   ├── batches/page.tsx       # All batches
│   └── reports/page.tsx       # Reports
├── api/                        # API routes
│   ├── auth/
│   ├── batches/               # Batch creation and retrieval
│   ├── qr/verify/             # QR verification with fraud detection
│   ├── producers/[id]/        # Producer profiles
│   └── reviews/               # Review management
└── globals.css                # Honey/beehive theme design system

components/
├── auth/
│   ├── login-form.tsx
│   └── register-form.tsx
├── dashboard/
│   ├── sidebar.tsx
│   ├── batch-list.tsx
│   └── ...
└── consumer/
    ├── qr-scanner.tsx
    ├── batch-info.tsx
    └── ...

lib/
├── auth.ts                     # NextAuth configuration
├── hooks/
│   └── use-auth.ts            # Auth hook
└── providers/
    └── auth-provider.tsx      # Auth provider wrapper

prisma/
└── schema.prisma              # Database schema
```

## Features Implemented

### Landing Page
- Hero section showcasing HiveTrace mission
- Feature overview (traceability, authenticity, producer info)
- Call-to-action buttons for different user types
- Modern beehive-themed design with honey gold colors

### Authentication System
- User registration with role selection (producer, consumer, admin)
- Email-based login
- NextAuth.js integration
- Protected routes with middleware
- Session management

### Producer Dashboard
- Overview with key metrics
- Batch management system
- Create new batches with automatic QR code generation
- HMAC-SHA256 verification hash generation
- Batch analytics and reviews
- Producer settings

### Consumer Features
- QR code scanner using BarcodeDetector API
- Manual QR code entry fallback
- Image upload for QR scanning
- Batch verification display with producer reputation
- Producer profile pages
- Review system for verified purchases
- Detailed batch information with cryptographic verification

### Admin Panel
- Platform metrics and KPIs
- Fraud detection monitoring
- Producer management and verification
- All batches monitoring
- Reports generation
- Fraud case investigation interface

### API Routes (Foundation)
- POST `/api/batches` - Create honey batch
- GET `/api/batches` - List producer batches
- GET `/api/batches/[id]` - Batch details
- POST `/api/qr/verify` - QR code verification with fraud detection
- GET `/api/producers/[id]` - Producer profile
- POST `/api/reviews` - Create review
- GET `/api/reviews` - Batch reviews

## Design System

### Color Scheme (Honey/Beehive Theme)
- **Primary**: Honey Gold - `oklch(0.65 0.22 60)` - Main brand color
- **Secondary**: Warm Amber - `oklch(0.58 0.19 50)` - Accents and highlights
- **Accent**: Deep Honey Brown - `oklch(0.45 0.15 40)` - Strong emphasis
- **Background**: Soft Cream - `oklch(0.98 0.001 70)` - Light and clean
- **Text**: Deep Brown - `oklch(0.2 0.02 70)` - High contrast
- **Dark Mode**: Sophisticated dark tones with bright honey accents

### Typography
- **Headings**: Geist font family
- **Body**: Geist font family
- **Monospace**: Geist Mono - For verification hashes and codes

## Database Schema

### Key Models
- **User**: Authentication and user data
- **Producer**: Beekeeper/honey producer information
- **HoneyBatch**: Individual batches with verification hashes
- **QRCode**: Generated QR codes linked to batches
- **QRScan**: Fraud detection - tracks individual scans with geo data
- **Review**: Consumer reviews with verification status
- **FraudAlert**: Suspicious activity detection and investigation
- **ProducerRating**: Reputation and trust scores

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database (When ready to connect)
DATABASE_URL=postgresql://user:password@localhost:5432/hivetrace

# Batch verification secret
BATCH_VERIFICATION_SECRET=your-hmac-secret-key

# Optional: File storage (for future implementation)
# BLOB_READ_WRITE_TOKEN=your-token
```

### 2. Database Setup (When Ready)

To connect a real database:

1. Set up PostgreSQL (Supabase, Neon, or self-hosted)
2. Update `DATABASE_URL` in `.env.local`
3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## Testing Accounts

### Producer Account
- Email: `producer@hivetrace.app`
- Password: `demo123`
- Role: Producer
- Business: Golden Valley Apiaries

### Admin Account
- Email: `admin@hivetrace.app`
- Password: `admin123`
- Role: Admin

### Consumer Account
- Email: `consumer@hivetrace.app`
- Password: `demo123`
- Role: Consumer

## Security Features

- HMAC-SHA256 cryptographic verification for batches
- Secure password hashing (with bcrypt when database connected)
- Geo-location fraud detection
- Duplicate QR code detection
- Unusual scan pattern analysis
- Producer reputation and trust scoring
- Verified purchase review system

## Future Enhancements

1. **Database Integration**
   - Connect Supabase or Neon PostgreSQL
   - Implement Prisma queries in API routes
   - Add RLS (Row Level Security) policies

2. **Payment Integration**
   - Stripe for premium features
   - Producer verification fees

3. **Advanced Fraud Detection**
   - Machine learning for anomaly detection
   - Blockchain integration for immutable records
   - Real-time geo-verification

4. **File Storage**
   - Producer certificates and documents (Vercel Blob)
   - Batch photos and documentation
   - QR code archive

5. **Real-time Features**
   - WebSocket for live fraud alerts
   - Real-time batch scanning updates
   - Producer notification system

6. **Mobile App**
   - React Native version for mobile scanning
   - Offline QR code support

## Deployment

### To Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy:
   ```bash
   vercel deploy
   ```

## Support & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
