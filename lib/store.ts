/**
 * Mock data store for development and testing
 * This will be replaced with real database queries
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'consumer' | 'producer' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Producer {
  id: string;
  userId: string;
  businessName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  verified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
}

export interface HoneyBatch {
  id: string;
  producerId: string;
  batchCode: string;
  name: string;
  harvestDate: string;
  quantity: number; // in kg
  type: string;
  integrityHash: string;
  qrCode: string;
  scanCount: number;
  verified: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  batchId: string;
  consumerId: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface FraudAlert {
  id: string;
  batchId: string;
  type: 'duplicate_qr' | 'geo_mismatch' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high';
  description: string;
  resolved: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  batchId: string;
  producerId: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  consumerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentReference?: string;
  createdAt: string;
}


// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john@goldenvalley.com',
    name: 'John Smith',
    role: 'producer',
    createdAt: new Date(2024, 0, 15).toISOString(),
  },
  {
    id: 'user-2',
    email: 'sarah@consumer.com',
    name: 'Sarah Johnson',
    role: 'consumer',
    createdAt: new Date(2024, 2, 20).toISOString(),
  },
  {
    id: 'user-3',
    email: 'admin@hivetrace.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date(2023, 11, 1).toISOString(),
  },
];

// Mock Producers
export const mockProducers: Producer[] = [
  {
    id: 'producer-1',
    userId: 'user-1',
    businessName: 'Golden Valley Apiaries',
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: 'New York, NY',
    },
    verified: true,
    rating: 4.8,
    totalReviews: 128,
    createdAt: new Date(2023, 6, 10).toISOString(),
  },
  {
    id: 'producer-2',
    userId: 'user-2',
    businessName: 'Sweet Meadow Honey Farm',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Los Angeles, CA',
    },
    verified: true,
    rating: 4.5,
    totalReviews: 87,
    createdAt: new Date(2023, 8, 5).toISOString(),
  },
];

// Mock Batches
export const mockBatches: HoneyBatch[] = [
  {
    id: 'batch-1',
    producerId: 'producer-1',
    batchCode: 'HT-2024-WFB-001',
    name: 'Wildflower Blend Spring 2024',
    harvestDate: '2024-05-15',
    quantity: 50,
    type: 'Wildflower',
    integrityHash: '7a3c2f8e9b4d1c6e5f2a9d3b7c1e8a4f',
    qrCode: '{"batchId":"HT-2024-WFB-001","hash":"7a3c2f8e9b4d1c6e5f2a9d3b7c1e8a4f"}',
    scanCount: 234,
    verified: true,
    createdAt: new Date(2024, 4, 15).toISOString(),
  },
  {
    id: 'batch-2',
    producerId: 'producer-1',
    batchCode: 'HT-2024-CLP-002',
    name: 'Clover Premium',
    harvestDate: '2024-06-10',
    quantity: 75,
    type: 'Clover',
    integrityHash: '8b4d3f9e2c5a1f7e6d3c9b2e1a5f8c4d',
    qrCode: '{"batchId":"HT-2024-CLP-002","hash":"8b4d3f9e2c5a1f7e6d3c9b2e1a5f8c4d"}',
    scanCount: 189,
    verified: true,
    createdAt: new Date(2024, 5, 10).toISOString(),
  },
  {
    id: 'batch-3',
    producerId: 'producer-1',
    batchCode: 'HT-2024-SPC-003',
    name: 'Spring Collection Mixed',
    harvestDate: '2024-04-20',
    quantity: 100,
    type: 'Mixed Wildflower',
    integrityHash: '9c5e4f2d1e8a3c7b6d2f9e4a1b5c8f3e',
    qrCode: '{"batchId":"HT-2024-SPC-003","hash":"9c5e4f2d1e8a3c7b6d2f9e4a1b5c8f3e"}',
    scanCount: 412,
    verified: true,
    createdAt: new Date(2024, 3, 20).toISOString(),
  },
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: 'review-1',
    batchId: 'batch-1',
    consumerId: 'user-2',
    rating: 5,
    comment: 'Excellent honey! Pure and delicious. Very transparent about sourcing.',
    verifiedPurchase: true,
    createdAt: new Date(2024, 5, 1).toISOString(),
  },
  {
    id: 'review-2',
    batchId: 'batch-1',
    consumerId: 'user-3',
    rating: 5,
    comment: 'Best wildflower honey I have tasted. Highly recommend!',
    verifiedPurchase: true,
    createdAt: new Date(2024, 5, 5).toISOString(),
  },
  {
    id: 'review-3',
    batchId: 'batch-1',
    consumerId: 'user-4',
    rating: 4,
    comment: 'Good quality, though a bit pricey. Worth the premium.',
    verifiedPurchase: true,
    createdAt: new Date(2024, 5, 8).toISOString(),
  },
];

// Mock Fraud Alerts
export const mockFraudAlerts: FraudAlert[] = [
  {
    id: 'alert-1',
    batchId: 'batch-1',
    type: 'suspicious_activity',
    severity: 'low',
    description: 'Unusual scanning pattern detected - 50 scans in 1 hour from same location',
    resolved: false,
    createdAt: new Date(2024, 5, 20).toISOString(),
  },
  {
    id: 'alert-2',
    batchId: 'batch-2',
    type: 'geo_mismatch',
    severity: 'medium',
    description: 'Scan from location 200km away from producer address',
    resolved: true,
    createdAt: new Date(2024, 5, 18).toISOString(),
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    batchId: 'batch-1',
    producerId: 'producer-1',
    name: 'Pure Wildflower Honey',
    description: 'Freshly harvested wildflower honey from the Golden Valley.',
    price: 4500,
    unit: '500g Jar',
    stock: 45,
    imageUrl: '/honey-jar-1.jpg',
    isActive: true,
    createdAt: new Date(2024, 4, 16).toISOString(),
  },
  {
    id: 'prod-2',
    batchId: 'batch-2',
    producerId: 'producer-1',
    name: 'Premium Clover Honey',
    description: 'Smooth and light clover honey, perfect for tea.',
    price: 5200,
    unit: '500g Jar',
    stock: 30,
    imageUrl: '/honey-jar-2.jpg',
    isActive: true,
    createdAt: new Date(2024, 5, 11).toISOString(),
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    consumerId: 'user-2',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        quantity: 2,
        priceAtPurchase: 4500,
      },
    ],
    totalAmount: 9000,
    status: 'delivered',
    paymentReference: 'ps_test_123',
    createdAt: new Date(2024, 5, 2).toISOString(),
  },
];

// Helper functions
export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getProducerById(id: string): Producer | undefined {
  return mockProducers.find((p) => p.id === id);
}

export function getBatchById(id: string): HoneyBatch | undefined {
  return mockBatches.find((b) => b.id === id);
}

export function getBatchByCode(code: string): HoneyBatch | undefined {
  return mockBatches.find((b) => b.batchCode === code);
}

export function getReviewsByBatchId(batchId: string): Review[] {
  return mockReviews.filter((r) => r.batchId === batchId);
}

export function getBatchesByProducerId(producerId: string): HoneyBatch[] {
  return mockBatches.filter((b) => b.producerId === producerId);
}

export function getFraudAlertsByBatchId(batchId: string): FraudAlert[] {
  return mockFraudAlerts.filter((a) => a.batchId === batchId);
}

export function getProducerRating(producerId: string): number {
  const producer = getProducerById(producerId);
  return producer?.rating || 0;
}

export function getAverageRatingForBatch(batchId: string): number {
  const reviews = getReviewsByBatchId(batchId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getAllProducts(): Product[] {
  return mockProducts.filter((p) => p.isActive);
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductsByProducerId(producerId: string): Product[] {
  return mockProducts.filter((p) => p.producerId === producerId);
}

export function getOrdersByConsumerId(consumerId: string): Order[] {
  return mockOrders.filter((o) => o.consumerId === consumerId);
}

export function getOrdersByProducerId(producerId: string): Order[] {
  // In a real DB, this would be a join through OrderItem -> Product -> Producer
  const producerProductIds = getProductsByProducerId(producerId).map((p) => p.id);
  return mockOrders.filter((o) =>
    o.items.some((item) => producerProductIds.includes(item.productId))
  );
}
