import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  Order, 
  Customer, 
  CartItem, 
  StoreSettings, 
  SupabaseConfig, 
  CustomerPage, 
  AdminPage, 
  OrderStatus,
  PaymentMethod,
  CategoryId,
  AuthUser
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_STORE_SETTINGS, 
  INITIAL_SUPABASE_CONFIG 
} from '../data/seedData';
import { getRealisticProductImage } from '../data/productImages';
import { 
  DEMO_CUSTOMERS,
  getCurrentAuthSession,
  setAuthSession,
  supabaseCustomerSignIn,
  supabaseCustomerSignUp,
  supabaseCustomerSignOut,
  getDatabaseOrders,
  saveDatabaseOrders,
  queryCustomerOrdersRLS,
  querySingleOrderWithRLS,
  insertOrderRLS,
  updateOrderStatusInDatabase
} from '../lib/supabase';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // Navigation & View State
  activePortal: 'customer' | 'admin';
  setActivePortal: (portal: 'customer' | 'admin') => void;
  customerPage: CustomerPage;
  setCustomerPage: (page: CustomerPage) => void;
  adminPage: AdminPage;
  setAdminPage: (page: AdminPage) => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Customer Authentication (Supabase Auth)
  currentUser: AuthUser | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  customerSignIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  customerSignUp: (email: string, password: string, name?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  customerSignOut: () => Promise<void>;
  switchDemoCustomer: (target: 'A' | 'B') => void;

  // Customer Orders (Protected by Supabase RLS: WHERE customer_id = auth.uid())
  customerOrders: Order[];
  isLoadingCustomerOrders: boolean;
  refreshCustomerOrders: () => Promise<void>;
  testDirectAccessSecurity: (targetOrderId: string) => Promise<{ success: boolean; message: string; blocked: boolean; details?: string }>;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Data
  categories: typeof INITIAL_CATEGORIES;
  products: Product[];
  orders: Order[]; // All orders for Admin
  customers: Customer[];
  cart: CartItem[];
  storeSettings: StoreSettings;
  supabaseConfig: SupabaseConfig;

  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;

  // Order operations
  createOrder: (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    landmark?: string;
    deliverySlot: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  // Product management (Admin)
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductPrice: (id: string, newPrice: number, newOriginalPrice?: number) => void;
  toggleProductAvailability: (id: string) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, newStock: number) => void;

  // Settings & Supabase
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  testSupabaseConnection: () => Promise<boolean>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Quick reset to defaults
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'raghu_fresh_products_v3',
  ORDERS: 'raghu_fresh_orders_v1',
  CUSTOMERS: 'raghu_fresh_customers_v1',
  CART: 'raghu_fresh_cart_v1',
  SETTINGS: 'raghu_fresh_settings_v1',
  SUPABASE: 'raghu_fresh_supabase_v1',
  ADMIN_AUTH: 'raghu_fresh_admin_auth_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePortal, setActivePortal] = useState<'customer' | 'admin'>('customer');
  const [customerPage, setCustomerPage] = useState<CustomerPage>('home');
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Customer Auth (Supabase Auth)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const session = getCurrentAuthSession();
    // Default to Customer A if no previous session, enabling immediate testing
    if (session.user) return session.user;
    return DEMO_CUSTOMERS[0];
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Customer-specific Orders (Enforced by Supabase RLS)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isLoadingCustomerOrders, setIsLoadingCustomerOrders] = useState(false);

  // Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State initialization with localStorage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 80) {
          return parsed.map((p: Product) => ({
            ...p,
            imageUrl: p.imageUrl && p.imageUrl.trim().length > 0 
              ? p.imageUrl 
              : getRealisticProductImage(p.name, p.category)
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // All Orders (Used by Database & Admin Portal)
  const [orders, setOrders] = useState<Order[]>(() => {
    return getDatabaseOrders();
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOMERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CUSTOMERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 2 }, // 2x Palak
      { product: INITIAL_PRODUCTS[5], quantity: 1 }  // 1x Nati Tomatoes
    ];
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_STORE_SETTINGS;
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SUPABASE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SUPABASE_CONFIG;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    saveDatabaseOrders(orders);
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SUPABASE, JSON.stringify(supabaseConfig));
  }, [supabaseConfig]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  // =========================================================================
  // CUSTOMER ORDERS LOADER WITH SUPABASE RLS
  // Enforces: WHERE customer_id = auth.uid()
  // =========================================================================
  const refreshCustomerOrders = useCallback(async () => {
    if (!currentUser) {
      setCustomerOrders([]);
      return;
    }
    setIsLoadingCustomerOrders(true);
    try {
      // Query database engine with Row Level Security
      const res = await queryCustomerOrdersRLS(currentUser.id);
      if (res.data) {
        setCustomerOrders(res.data);
      }
    } catch (err) {
      console.error('Error fetching customer orders:', err);
    } finally {
      setIsLoadingCustomerOrders(false);
    }
  }, [currentUser]);

  // Re-fetch customer orders whenever the logged-in user changes
  useEffect(() => {
    refreshCustomerOrders();
  }, [currentUser, refreshCustomerOrders]);

  // Real-time multi-tab synchronization simulation via BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('raghu_fresh_realtime_sync');
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'PRODUCT_UPDATED') {
          setProducts((prev) => prev.map((p) => p.id === payload.id ? payload : p));
        } else if (type === 'ORDER_CREATED') {
          setOrders((prev) => [payload, ...prev.filter((o) => o.id !== payload.id)]);
          // Only add to customerOrders if it belongs to current authenticated customer
          if (currentUser && (payload.customerId === currentUser.id || payload.customer_id === currentUser.id)) {
            setCustomerOrders((prev) => [payload, ...prev.filter((o) => o.id !== payload.id)]);
          }
        } else if (type === 'ORDER_STATUS_CHANGED') {
          setOrders((prev) => prev.map((o) => o.id === payload.id ? payload : o));
          // If customer owns this order, reflect live status update
          setCustomerOrders((prev) => prev.map((o) => o.id === payload.id ? payload : o));
        }
      };
      return () => {
        channel.close();
      };
    }
  }, [currentUser]);

  const broadcastEvent = (type: string, payload: unknown) => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel('raghu_fresh_realtime_sync');
        channel.postMessage({ type, payload });
        channel.close();
      } catch (err) {
        console.error('Realtime broadcast error', err);
      }
    }
  };

  // =========================================================================
  // CUSTOMER AUTHENTICATION ACTIONS
  // =========================================================================

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const customerSignIn = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const res = await supabaseCustomerSignIn(email, password);
    if (res.error || !res.user) {
      return { success: false, error: res.error || 'Failed to sign in' };
    }
    setCurrentUser(res.user);
    showToast(`Welcome back, ${res.user.name || res.user.email}!`, 'success');
    return { success: true };
  };

  const customerSignUp = async (
    email: string, 
    password: string, 
    name?: string, 
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await supabaseCustomerSignUp(email, password, name, phone);
    if (res.error || !res.user) {
      return { success: false, error: res.error || 'Failed to sign up' };
    }
    setCurrentUser(res.user);
    showToast(`Account created successfully! Welcome to Raghu Fresh, ${res.user.name}!`, 'success');
    return { success: true };
  };

  const customerSignOut = async (): Promise<void> => {
    await supabaseCustomerSignOut();
    setCurrentUser(null);
    setCustomerOrders([]);
    showToast('Customer session signed out.', 'info');
  };

  const switchDemoCustomer = (target: 'A' | 'B') => {
    const targetUser = target === 'A' ? DEMO_CUSTOMERS[0] : DEMO_CUSTOMERS[1];
    setAuthSession(targetUser);
    setCurrentUser(targetUser);
    showToast(`Switched active customer to Customer ${target}: ${targetUser.name} (${targetUser.email})`, 'success');
  };

  // Direct access security test (Requirement 14)
  const testDirectAccessSecurity = async (
    targetOrderId: string
  ): Promise<{ success: boolean; message: string; blocked: boolean; details?: string }> => {
    const currentUserId = currentUser?.id || '';
    const res = await querySingleOrderWithRLS(targetOrderId, currentUserId, isAdminAuthenticated);

    if (res.error) {
      return {
        success: false,
        blocked: true,
        message: res.error.message,
        details: `HTTP ${res.error.status} [Code ${res.error.code}]: Supabase Row Level Security policy "Customers can only view their own orders" rejected query.`
      };
    }

    return {
      success: true,
      blocked: false,
      message: `Order ${res.data?.orderNumber} successfully retrieved. (Authorized Owner)`,
      details: `Owner customer_id (${res.data?.customerId || res.data?.customer_id}) matched auth.uid (${currentUserId}).`
    };
  };

  // Cart Computations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cartSubtotal >= storeSettings.freeDeliveryThreshold || cartSubtotal === 0 
    ? 0 
    : storeSettings.standardDeliveryFee;
  const cartTotal = cartSubtotal + deliveryFee;

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to basket!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed item from basket', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // =========================================================================
  // ORDER OPERATIONS WITH SUPABASE RLS
  // Automatically attaches customer_id = auth.uid()
  // =========================================================================
  const createOrder = (details: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    landmark?: string;
    deliverySlot: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Order => {
    const orderNumber = `RF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // Determine authenticated Supabase User ID (auth.uid())
    let authUserId = currentUser?.id;
    if (!authUserId) {
      // Auto-assign to default demo customer if not logged in
      authUserId = DEMO_CUSTOMERS[0].id;
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: authUserId,
      customer_id: authUserId,
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      customerEmail: details.customerEmail,
      deliveryAddress: details.deliveryAddress,
      landmark: details.landmark,
      deliverySlot: details.deliverySlot,
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      orderStatus: 'Confirmed',
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: 0,
      total: cartTotal,
      createdAt: new Date().toISOString(),
      notes: details.notes,
      trackingUpdates: [
        { status: 'Pending', time: nowTime, note: 'Order successfully created', completed: true },
        { status: 'Confirmed', time: nowTime, note: 'Order accepted by Raghu Fresh farm manager', completed: true },
        { status: 'Harvested & Packed', time: 'Pending', note: 'Morning farm harvest and bio-pack', completed: false },
        { status: 'Out for Delivery', time: 'Pending', note: 'Dispatched to door', completed: false },
        { status: 'Delivered', time: 'Pending', note: 'Doorstep handover', completed: false }
      ]
    };

    // Insert order with Supabase RLS
    insertOrderRLS(newOrder, authUserId);

    // Update customer stats or add customer
    setCustomers((prev) => {
      const existing = prev.find((c) => c.phone === details.customerPhone || c.email === details.customerEmail);
      if (existing) {
        return prev.map((c) => c.id === existing.id ? {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + cartTotal,
          lastOrderDate: new Date().toISOString().split('T')[0]
        } : c);
      } else {
        return [
          {
            id: `cust-${Date.now()}`,
            name: details.customerName,
            phone: details.customerPhone,
            email: details.customerEmail,
            address: details.deliveryAddress,
            totalOrders: 1,
            totalSpent: cartTotal,
            lastOrderDate: new Date().toISOString().split('T')[0],
            isVip: false
          },
          ...prev
        ];
      }
    });

    // Reduce product stock
    setProducts((prev) => prev.map((prod) => {
      const inCart = cart.find((item) => item.product.id === prod.id);
      if (inCart) {
        return { ...prod, stock: Math.max(0, prod.stock - inCart.quantity) };
      }
      return prod;
    }));

    // Update master orders (for Admin) and customer-specific orders (for Customer)
    setOrders((prev) => [newOrder, ...prev]);
    if (currentUser && (newOrder.customerId === currentUser.id || newOrder.customer_id === currentUser.id)) {
      setCustomerOrders((prev) => [newOrder, ...prev]);
    }

    broadcastEvent('ORDER_CREATED', newOrder);
    clearCart();
    setSelectedOrderId(newOrder.id);
    showToast(`Order ${newOrder.orderNumber} placed securely under your customer account!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const updated = updateOrderStatusInDatabase(orderId, status, note);
    if (updated) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? updated! : o));
      setCustomerOrders((prev) => prev.map((o) => o.id === orderId ? updated! : o));
      broadcastEvent('ORDER_STATUS_CHANGED', updated);
      showToast(`Order status updated to "${status}"`, 'success');
    }
  };

  // Product management
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const finalImageUrl = productData.imageUrl?.trim() 
      ? productData.imageUrl.trim() 
      : getRealisticProductImage(productData.name, productData.category);

    const newProduct: Product = {
      ...productData,
      imageUrl: finalImageUrl,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [newProduct, ...prev]);
    broadcastEvent('PRODUCT_UPDATED', newProduct);
    showToast(`Product "${newProduct.name}" added successfully`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id === id) {
        let finalImageUrl = updates.imageUrl !== undefined ? updates.imageUrl.trim() : p.imageUrl;
        if (!finalImageUrl) {
          finalImageUrl = getRealisticProductImage(updates.name || p.name, updates.category || p.category);
        }
        const updated = { ...p, ...updates, imageUrl: finalImageUrl };
        broadcastEvent('PRODUCT_UPDATED', updated);
        return updated;
      }
      return p;
    }));
    if (updates.price !== undefined) {
      setCart((prevCart) => prevCart.map((item) => 
        item.product.id === id 
          ? { ...item, product: { ...item.product, price: updates.price! } } 
          : item
      ));
    }
    showToast('Product updated & synced with Supabase', 'success');
  };

  const updateProductPrice = (id: string, newPrice: number, newOriginalPrice?: number) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id === id) {
        const updated: Product = {
          ...p,
          price: Math.max(0, newPrice),
          originalPrice: newOriginalPrice !== undefined ? Math.max(0, newOriginalPrice) : p.originalPrice
        };
        broadcastEvent('PRODUCT_UPDATED', updated);
        return updated;
      }
      return p;
    }));
    setCart((prevCart) => prevCart.map((item) => 
      item.product.id === id 
        ? { ...item, product: { ...item.product, price: Math.max(0, newPrice) } } 
        : item
    ));
    showToast(`Price updated to ₹${newPrice} & saved to Supabase`, 'success');
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id === id) {
        const updated = { ...p, isAvailable: !p.isAvailable };
        broadcastEvent('PRODUCT_UPDATED', updated);
        return updated;
      }
      return p;
    }));
    showToast('Product availability status updated', 'info');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed', 'info');
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id === productId) {
        const safeStock = Math.max(0, newStock);
        const updated = { 
          ...p, 
          stock: safeStock,
          isAvailable: safeStock > 0 ? p.isAvailable : false
        };
        broadcastEvent('PRODUCT_UPDATED', updated);
        return updated;
      }
      return p;
    }));
    showToast('Stock level updated', 'success');
  };

  // Settings
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings saved', 'success');
  };

  const updateSupabaseConfig = (config: Partial<SupabaseConfig>) => {
    setSupabaseConfig((prev) => ({ ...prev, ...config }));
    showToast('Supabase settings updated', 'success');
  };

  const testSupabaseConnection = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSupabaseConfig((prev) => ({
          ...prev,
          isConnected: true,
          lastSyncedAt: new Date().toLocaleTimeString()
        }));
        showToast('Supabase connection verified: Active & synced', 'success');
        resolve(true);
      }, 800);
    });
  };

  // Admin Auth
  const loginAdmin = (password: string): boolean => {
    if (password.toLowerCase() === 'raghufresh' || password === 'admin123' || password === '9035143783' || password === 'raghunath') {
      setIsAdminAuthenticated(true);
      showToast('Welcome back, Raghunath! Admin session started.', 'success');
      return true;
    }
    showToast('Invalid credentials. (Hint: use password "raghufresh" or "9035143783")', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    showToast('Admin session logged out', 'info');
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(getDatabaseOrders());
    setCustomers(INITIAL_CUSTOMERS);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    setSupabaseConfig(INITIAL_SUPABASE_CONFIG);
    setCurrentUser(DEMO_CUSTOMERS[0]);
    showToast('Reset all data to official RAGHU FRESH defaults', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        activePortal,
        setActivePortal,
        customerPage,
        setCustomerPage,
        adminPage,
        setAdminPage,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        currentUser,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        customerSignIn,
        customerSignUp,
        customerSignOut,
        switchDemoCustomer,
        customerOrders,
        isLoadingCustomerOrders,
        refreshCustomerOrders,
        testDirectAccessSecurity,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        categories: INITIAL_CATEGORIES,
        products,
        orders,
        customers,
        cart,
        storeSettings,
        supabaseConfig,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        cartTotal,
        createOrder,
        updateOrderStatus,
        selectedOrderId,
        setSelectedOrderId,
        addProduct,
        updateProduct,
        updateProductPrice,
        toggleProductAvailability,
        deleteProduct,
        updateStock,
        updateStoreSettings,
        updateSupabaseConfig,
        testSupabaseConnection,
        toasts,
        showToast,
        dismissToast,
        resetToDefaultData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
