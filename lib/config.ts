/**
 * Application Configuration
 * Centralized config for HiveTrace platform
 */

export const config = {
  // App metadata
  app: {
    name: 'HiveTrace',
    description: 'Cryptographically verified honey traceability platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Feature flags
  features: {
    fraudDetection: process.env.NEXT_PUBLIC_ENABLE_FRAUD_DETECTION === 'true',
    geoVerification: process.env.NEXT_PUBLIC_ENABLE_GEO_VERIFICATION === 'true',
    reviews: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true',
    qrScanning: true,
  },

  // Batch settings
  batch: {
    minQuantity: 1, // kg
    maxQuantity: 10000, // kg
    hashAlgorithm: 'sha256',
    qrSize: 256,
    qrLevel: 'H' as const, // Error correction level
  },

  // Fraud detection thresholds
  fraud: {
    geoThresholdKm: 50, // Max distance from producer for valid scan
    suspiciousScanCount: 100, // Scans per hour threshold
    duplicateQrThreshold: 5, // Allow max 5 scans per minute
  },

  // Rating system
  ratings: {
    minRating: 1,
    maxRating: 5,
    minReviewsForReputation: 5,
  },

  // API endpoints
  api: {
    batches: '/api/batches',
    qr: '/api/qr',
    producers: '/api/producers',
    reviews: '/api/reviews',
    auth: '/api/auth',
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // Cache settings
  cache: {
    batchTTL: 3600, // 1 hour in seconds
    producerTTL: 7200, // 2 hours
    reviewsTTL: 1800, // 30 minutes
  },

  // Security
  security: {
    // Password requirements
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    
    // Rate limiting
    rateLimitRequests: 100,
    rateLimitWindow: 900, // 15 minutes in seconds
  },

  // Roles and permissions
  roles: {
    CONSUMER: 'consumer',
    PRODUCER: 'producer',
    ADMIN: 'admin',
  } as const,

  // Alert types
  alertTypes: {
    DUPLICATE_QR: 'duplicate_qr',
    GEO_MISMATCH: 'geo_mismatch',
    SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  } as const,

  // Alert severity levels
  alertSeverity: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  } as const,

  // Batch verification states
  verificationStates: {
    VERIFIED: 'verified',
    PENDING: 'pending',
    FAILED: 'failed',
    SUSPICIOUS: 'suspicious',
  } as const,

  // Timezone
  timezone: 'UTC',

  // Logging
  logging: {
    enabled: process.env.NODE_ENV !== 'production',
    level: process.env.LOG_LEVEL || 'info',
  },
} as const;

export type Role = typeof config.roles[keyof typeof config.roles];
export type AlertType = typeof config.alertTypes[keyof typeof config.alertTypes];
export type AlertSeverity = typeof config.alertSeverity[keyof typeof config.alertSeverity];
export type VerificationState = typeof config.verificationStates[keyof typeof config.verificationStates];
