# HiveTrace Quick Start Guide

Get up and running with HiveTrace in 5 minutes!

## 1️⃣ Installation (2 minutes)

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 2️⃣ Test Different User Roles

The application comes with mock data and supports three user types:

### 👨‍🌾 Producer Account
- **Email**: `john@goldenvalley.com`
- **Password**: `password`
- **Access**: `/dashboard`
- **Features**: Create batches, view analytics, manage producer profile

### 👥 Consumer Account
- **Email**: `sarah@consumer.com`
- **Password**: `password`
- **Access**: `/consumer`
- **Features**: Scan QR codes, verify batches, leave reviews

### 🛡️ Admin Account
- **Email**: `admin@hivetrace.com`
- **Password**: `admin123`
- **Access**: `/admin`
- **Features**: Fraud monitoring, producer approval, batch audit

> 💡 **Note**: Authentication is not yet integrated with a real database. Use mock accounts for demonstration.

## 3️⃣ Key Pages to Explore

### Landing Page
```
http://localhost:3000
```
- Hero section with features overview
- Security highlights
- Call-to-action buttons
- Complete footer

### Producer Dashboard
```
http://localhost:3000/dashboard
```
- Welcome overview with stats
- Batch creation form
- Batch management interface
- Analytics dashboard
- Settings page

### Consumer Features
```
http://localhost:3000/consumer
```
- Batch lookup interface
- QR scanner (browser-based)
- Producer profiles
- Batch details with reviews

### Admin Panel
```
http://localhost:3000/admin
```
- Dashboard with key metrics
- Fraud alert monitoring
- Producer management
- Batch oversight
- Report generation

## 4️⃣ Test Batch Creation & Verification

### As a Producer:

1. Go to `/dashboard/batches`
2. Click "Create Batch"
3. Fill in form:
   - Name: "Wildflower Blend 2024"
   - Harvest Date: "2024-05-15"
   - Quantity: 50
   - Type: "Wildflower"
4. Submit and view batch details
5. Copy the generated QR code data

### As a Consumer:

1. Go to `/consumer/scanner`
2. Paste the QR code in "Manual Entry"
3. Click "Verify Batch"
4. View batch details and producer info
5. Leave a review (if you wish)

## 5️⃣ Understanding the Architecture

### Components Structure
```
components/
├── ui/              # shadcn/ui base components
├── auth/            # Login, registration forms
├── dashboard/       # Producer dashboard components
├── consumer/        # Consumer-facing components
└── common/          # Shared utilities
```

### Key Utilities
- `lib/crypto.ts` - HMAC-SHA256 batch verification
- `lib/qr.ts` - QR code generation & parsing
- `lib/helpers.ts` - Formatting & validation helpers
- `lib/store.ts` - Mock data management
- `lib/config.ts` - Centralized configuration

### API Routes (Prepared for Database Integration)
```
/api/batches          # Batch CRUD operations
/api/qr/verify        # QR code verification
/api/producers        # Producer management
/api/reviews          # Review management
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start dev server

# Build
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier

# Database (prepared for future use)
pnpm db:push          # Sync database schema
pnpm db:studio        # Open Prisma Studio
```

## 📋 Feature Checklist

### Authentication
- [x] Login page with email/password
- [x] Register page with role selection
- [x] Protected routes with proxy
- [x] NextAuth.js integration

### Producer Features
- [x] Dashboard with overview
- [x] Batch creation form
- [x] Batch listing & management
- [x] QR code generation
- [x] Producer profile settings
- [x] Analytics dashboard
- [x] Review management

### Consumer Features
- [x] QR code scanner (manual & camera)
- [x] Batch verification display
- [x] Producer profiles
- [x] Batch details & traceability
- [x] Review submission
- [x] Rating system

### Admin Features
- [x] Admin dashboard
- [x] Fraud alert monitoring
- [x] Producer management
- [x] Batch overview
- [x] Report generation

### Technical
- [x] Modern Next.js 14 setup
- [x] TypeScript throughout
- [x] Tailwind CSS with honey theme
- [x] shadcn/ui components
- [x] Error boundaries & 404 page
- [x] Loading skeletons
- [x] Environment configuration
- [x] Crypto utilities for verification
- [x] Mock data store
- [x] API routes structure

## 🎨 Design & Styling

### Color Palette (Beehive Theme)
```
Primary Gold:        #D4AF37  (oklch(0.65 0.22 60))
Warm Honey:          #F5DEB3  (oklch(0.75 0.15 70))
Deep Brown:          #4A3F35  (oklch(0.45 0.15 40))
Light Cream:         #FFFAF0  (oklch(0.98 0.001 70))
Accent Orange:       #E8A93D  (oklch(0.58 0.19 50))
```

### Typography
- **Headlines**: Geist Bold
- **Body**: Geist Regular (16px)
- **Monospace**: Geist Mono (for codes)

## 🚀 Next Steps

### For Development
1. Review `SETUP.md` for environment configuration
2. Check `lib/config.ts` for feature flags
3. Explore API routes in `/app/api/`
4. Customize mock data in `lib/store.ts`

### For Database Integration
1. Set up Supabase or PostgreSQL database
2. Add connection string to `.env.local`
3. Uncomment database code in API routes
4. Run `pnpm db:push` to sync schema
5. Update authentication to use real user data

### For Deployment
1. Connect GitHub repository to Vercel
2. Add environment variables in dashboard
3. Deploy with `git push` to main branch
4. Access your live app at your-domain.vercel.app

## 📚 Documentation

- **README.md** - Full project documentation
- **SETUP.md** - Detailed setup instructions
- **QUICKSTART.md** - This file
- **Code Comments** - Throughout the codebase

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use a different port
pnpm dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
```

### Build Errors
```bash
# Clean build
pnpm build --clean
```

## ❓ FAQ

**Q: How do I use the real database?**
A: See SETUP.md for Supabase/PostgreSQL configuration instructions.

**Q: Can I customize the colors?**
A: Yes! Edit `app/globals.css` and update the oklch color values.

**Q: How do I add new batches?**
A: As a producer, navigate to `/dashboard/batches/new` and fill in the form.

**Q: Is authentication working?**
A: Currently using mock data. Database integration is prepared in API routes.

**Q: Can I modify the batch hash algorithm?**
A: Update `lib/crypto.ts` and `lib/config.ts` to change the algorithm.

---

**Need help?** Check the full README.md or review the inline code comments!

Happy tracing! 🍯
