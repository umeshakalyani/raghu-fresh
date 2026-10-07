export type CategoryId = 
  | 'leafy-greens'
  | 'vegetables'
  | 'fruits'
  | 'dairy-eggs'
  | 'organic-staples';

export interface Category {
  id: CategoryId;
  name: string;
  kannadaName?: string;
  description: string;
  itemCount?: number;
  badge?: string;
  iconName: string;
}

export interface Product {
  id: string;
  name: string;
  kannadaName?: string;
  category: CategoryId;
  price: number;
  originalPrice: number;
  unit: string; // e.g. "500 g", "1 kg", "1 bunch", "1 pc", "Box"
  stock: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  isOrganic: boolean;
  isSeasonal?: boolean;
  isFeatured?: boolean;
  description: string;
  origin: string; // e.g. "Chikkaballapur Farm", "Kolar Green Farm"
  nutritionHighlights: string;
  imageEmoji?: string;
  imageUrl?: string;
  imageStorageKey?: string;
  colorScheme: {
    bg: string;
    border: string;
    badge: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Harvested & Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'UPI' | 'COD' | 'Card / Netbanking';

export interface TrackingStep {
  status: OrderStatus;
  time: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string; // Supabase auth.users.id (auth.uid())
  customer_id?: string; // Supabase database column alias
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  landmark?: string;
  deliverySlot: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid';
  orderStatus: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  createdAt: string;
  notes?: string;
  trackingUpdates: TrackingStep[];
}

export interface AuthUser {
  id: string; // Supabase auth.users.id (UUID)
  email: string;
  name?: string;
  phone?: string;
  role?: 'customer' | 'admin';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  isVip?: boolean;
}

export interface StoreSettings {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  locationUrl: string;
  addressText: string;
  upiId: string;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  openingHours: string;
  bannerMessage: string;
  isStoreOpen: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}

export type CustomerPage = 
  | 'home'
  | 'products'
  | 'categories'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'contact';

export type AdminPage = 
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'inventory'
  | 'customers'
  | 'reports'
  | 'settings'
  | 'supabase';
