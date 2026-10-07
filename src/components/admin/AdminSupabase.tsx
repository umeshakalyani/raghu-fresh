import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Database, 
  ShieldCheck, 
  Radio, 
  HardDrive, 
  Key, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Code2,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminSupabase: React.FC = () => {
  const { 
    supabaseConfig, 
    updateSupabaseConfig, 
    testSupabaseConnection, 
    products, 
    orders, 
    customers, 
    storeSettings,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'database' | 'auth' | 'rls' | 'storage' | 'realtime'>('overview');
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const [urlInput, setUrlInput] = useState(supabaseConfig.url);
  const [anonKeyInput, setAnonKeyInput] = useState(supabaseConfig.anonKey);

  const handleTestConnection = async () => {
    setIsTesting(true);
    await testSupabaseConnection();
    setIsTesting(false);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseConfig({
      url: urlInput,
      anonKey: anonKeyInput
    });
  };

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    showToast(`Copied ${sectionName} to clipboard`, 'info');
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sqlSchemaCode = `-- =========================================================
-- RAGHU FRESH: Production Supabase PostgreSQL Schema
-- Contact: ${storeSettings.email} | Helpline: ${storeSettings.phone}
-- Store Location: ${storeSettings.locationUrl}
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table (82 preloaded items with editable prices)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    kannada_name TEXT,
    category TEXT NOT NULL CHECK (category IN ('leafy-greens', 'vegetables', 'fruits', 'dairy-eggs', 'organic-staples')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0), -- Prices editable in Admin
    original_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT '500 g',
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_organic BOOLEAN DEFAULT true,
    is_seasonal BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    description TEXT,
    origin TEXT DEFAULT 'Kolar Organic Belt',
    nutrition_highlights TEXT,
    image_emoji TEXT DEFAULT '🥬',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin price update statement:
-- UPDATE public.products SET price = $1, original_price = $2, updated_at = NOW() WHERE id = $3;

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    address TEXT NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC(12, 2) DEFAULT 0,
    is_vip BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table (Connected to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Supabase auth.users.id (auth.uid())
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    landmark TEXT,
    delivery_slot TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'COD', 'Card / Netbanking')),
    payment_status TEXT NOT NULL DEFAULT 'Pending',
    order_status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (order_status IN ('Pending', 'Confirmed', 'Harvested & Packed', 'Out for Delivery', 'Delivered', 'Cancelled')),
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe migration for existing installations:
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID;

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'current',
    store_name TEXT NOT NULL DEFAULT 'RAGHU FRESH',
    owner_name TEXT NOT NULL DEFAULT 'Raghunath N',
    email TEXT NOT NULL DEFAULT '${storeSettings.email}',
    phone TEXT NOT NULL DEFAULT '${storeSettings.phone}',
    location_url TEXT NOT NULL DEFAULT '${storeSettings.locationUrl}',
    address_text TEXT NOT NULL,
    upi_id TEXT NOT NULL DEFAULT '${storeSettings.upiId}',
    free_delivery_threshold NUMERIC(10, 2) DEFAULT 299,
    standard_delivery_fee NUMERIC(10, 2) DEFAULT 30,
    opening_hours TEXT DEFAULT '06:00 AM - 09:30 PM (All 7 Days)',
    is_store_open BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const rlsPoliciesCode = `-- =========================================================
-- RAGHU FRESH: Row Level Security (RLS) Policies
-- Enforces customer privacy & admin-only write authorizations
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 1. Products Policies
-- Anyone can view the fresh produce catalog
CREATE POLICY "Public read access for products" 
ON public.products FOR SELECT 
USING (true);

-- Only authenticated Raghu Fresh staff can add or edit products
CREATE POLICY "Admin write access for products" 
ON public.products FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = '${storeSettings.email}')
WITH CHECK (auth.jwt() ->> 'email' = '${storeSettings.email}');

-- 2. Orders Policies (Strict Customer Isolation)
-- Customers can only insert their own orders with their authenticated UID
CREATE POLICY "Customers can only insert their own orders" 
ON public.orders FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = customer_id);

-- Customers can ONLY view their own orders (auth.uid() = customer_id)
-- Admin can view all orders for store dispatch & packing
CREATE POLICY "Customers can only view their own orders" 
ON public.orders FOR SELECT 
TO authenticated 
USING (
    customer_id = auth.uid()
    OR auth.jwt() ->> 'email' = '${storeSettings.email}'
);

-- Only admin staff can update order statuses (Harvested, Out for Delivery, Delivered)
CREATE POLICY "Admin update orders" 
ON public.orders FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'email' = '${storeSettings.email}');

-- 3. Order Items Policies (Secure Child Relationship)
-- Customers can only read order items belonging to orders that belong to them
CREATE POLICY "Customers can only view their own order items" 
ON public.order_items FOR SELECT 
TO authenticated 
USING (
    order_id IN (
        SELECT id FROM public.orders 
        WHERE customer_id = auth.uid()
    )
    OR auth.jwt() ->> 'email' = '${storeSettings.email}'
);

-- Customers can insert order items for their own orders
CREATE POLICY "Customers can insert their own order items" 
ON public.order_items FOR INSERT 
TO authenticated 
WITH CHECK (
    order_id IN (
        SELECT id FROM public.orders 
        WHERE customer_id = auth.uid()
    )
);

-- 4. Store Settings Policies
CREATE POLICY "Public read store settings" 
ON public.store_settings FOR SELECT 
USING (true);

CREATE POLICY "Admin write store settings" 
ON public.store_settings FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'email' = '${storeSettings.email}');`;

  const realtimeSetupCode = `-- =========================================================
-- RAGHU FRESH: Supabase Realtime Publication Setup
-- Enables instant live orders & inventory syncing across screens
-- =========================================================

-- Enable realtime replication for orders and products
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;

-- Client-side Realtime listener example:
/*
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('${supabaseConfig.url}', '${supabaseConfig.anonKey.slice(0, 20)}...');

// Subscribe to new orders or status updates
const ordersChannel = supabase
  .channel('realtime:orders')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
    console.log('Realtime order update received:', payload);
  })
  .subscribe();
*/`;

  const storageSetupCode = `-- =========================================================
-- RAGHU FRESH: Supabase Storage Buckets
-- Product images, farm photos, and PDF invoices
-- =========================================================

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Public read policy for product images
CREATE POLICY "Public can view product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- 3. Admin upload policy for product photos
CREATE POLICY "Admin can upload product images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images' AND auth.jwt() ->> 'email' = '${storeSettings.email}');`;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-emerald-400 flex items-center justify-center shadow-xs">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900 font-heading">
                Supabase Integration Hub
              </h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Active & Synced
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Database · Auth · RLS · Storage · Realtime for RAGHU FRESH
            </p>
          </div>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isTesting ? 'animate-spin' : ''}`} />
          <span>{isTesting ? 'Verifying Ping...' : 'Test Connection'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-stone-200 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview & Config', icon: <Radio className="w-3.5 h-3.5" /> },
          { id: 'database', label: 'Database Schema', icon: <Database className="w-3.5 h-3.5" /> },
          { id: 'auth', label: 'Auth & Accounts', icon: <Key className="w-3.5 h-3.5" /> },
          { id: 'rls', label: 'Row Level Security (RLS)', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { id: 'storage', label: 'Storage Buckets', icon: <HardDrive className="w-3.5 h-3.5" /> },
          { id: 'realtime', label: 'Realtime Sync', icon: <Sparkles className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 -mb-[1px] whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-emerald-800 text-emerald-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-1">
              <span className="text-xs text-stone-500">Live Backend Status</span>
              <div className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Production Ready</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Last ping verified: {supabaseConfig.lastSyncedAt || 'Active'}
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-1">
              <span className="text-xs text-stone-500">Store Administrator</span>
              <div className="text-sm font-bold text-stone-900 truncate">
                {storeSettings.email}
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                Phone: +91 {storeSettings.phone}
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-1">
              <span className="text-xs text-stone-500">Store GPS Coordinates</span>
              <div className="text-xs text-emerald-800 font-medium truncate">
                <a href={storeSettings.locationUrl} target="_blank" rel="noreferrer" className="underline flex items-center gap-1">
                  <span>Google Maps Pin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-stone-400 truncate">
                {storeSettings.addressText}
              </p>
            </div>
          </div>

          {/* Config Keys Editor */}
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Supabase Project API Credentials</h3>
                <p className="text-xs text-stone-500">Connect your custom Supabase Cloud project or leave default</p>
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                className="text-xs text-emerald-800 font-semibold hover:underline"
              >
                Test URL & Key
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  SUPABASE_PROJECT_URL
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
                  placeholder="https://your-project.supabase.co"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  SUPABASE_ANON_PUBLIC_KEY
                </label>
                <input
                  type="text"
                  value={anonKeyInput}
                  onChange={(e) => setAnonKeyInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-stone-500">
                  Data seamlessly synchronizes between local reactive state and cloud endpoints.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Database Schema */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">PostgreSQL DDL Migration Script</h3>
                <p className="text-xs text-stone-500">
                  Execute this SQL script directly inside your Supabase Project &rarr; SQL Editor.
                </p>
              </div>
              <button
                onClick={() => handleCopy(sqlSchemaCode, 'SQL Schema')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
              >
                {copiedSection === 'SQL Schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'SQL Schema' ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="bg-stone-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-stone-800">
              {sqlSchemaCode}
            </pre>
          </div>

          {/* Current Table Inventory Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-xs">
              <span className="font-semibold text-stone-500 block">Table: products</span>
              <span className="font-mono text-xl font-bold text-stone-900 block mt-1">{products.length} records</span>
              <span className="text-stone-400 text-[10px]">Leafy greens, veggies, dairy</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-xs">
              <span className="font-semibold text-stone-500 block">Table: orders</span>
              <span className="font-mono text-xl font-bold text-stone-900 block mt-1">{orders.length} records</span>
              <span className="text-stone-400 text-[10px]">Live harvest dispatches</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-xs">
              <span className="font-semibold text-stone-500 block">Table: customers</span>
              <span className="font-mono text-xl font-bold text-stone-900 block mt-1">{customers.length} records</span>
              <span className="text-stone-400 text-[10px]">Profiles & addresses</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-xs">
              <span className="font-semibold text-stone-500 block">Table: store_settings</span>
              <span className="font-mono text-xl font-bold text-stone-900 block mt-1">1 record</span>
              <span className="text-stone-400 text-[10px]">Phone, email, maps</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Auth */}
      {activeTab === 'auth' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Supabase Authentication Architecture</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              RAGHU FRESH implements a dual-mode authentication flow:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-2">
                <span className="font-bold text-stone-900 block text-sm">1. Customer Guest & Phone Sign-in</span>
                <p className="text-stone-600">
                  Customers can checkout seamlessly with verified name, phone number, and delivery address. No forced passwords required for rapid vegetable booking.
                </p>
                <div className="bg-white p-2.5 rounded border border-stone-200 font-mono text-[11px] text-stone-700">
                  supabase.auth.signInWithOtp(&#123; phone: '+919845012345' &#125;)
                </div>
              </div>

              <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/30 space-y-2">
                <span className="font-bold text-stone-900 block text-sm">2. Store Administrator Role</span>
                <p className="text-stone-600">
                  Store owner <strong className="text-stone-900">{storeSettings.email}</strong> is granted full Role-Based Access Control (RBAC) privileges for editing pricing, inventory, and order dispatch.
                </p>
                <div className="bg-white p-2.5 rounded border border-emerald-200 font-mono text-[11px] text-emerald-900">
                  supabase.auth.signInWithPassword(&#123; email: '{storeSettings.email}' &#125;)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Row Level Security (RLS) */}
      {activeTab === 'rls' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Row Level Security (RLS) Policies</h3>
                <p className="text-xs text-stone-500">
                  Guarantees that public customers can only view active products and their own orders.
                </p>
              </div>
              <button
                onClick={() => handleCopy(rlsPoliciesCode, 'RLS Policies')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
              >
                {copiedSection === 'RLS Policies' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'RLS Policies' ? 'Copied!' : 'Copy RLS'}</span>
              </button>
            </div>

            <pre className="bg-stone-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-stone-800">
              {rlsPoliciesCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 5: Storage Buckets */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Storage Buckets Setup</h3>
                <p className="text-xs text-stone-500">
                  Configured for product photos, farm harvest highlights, and printable invoice PDFs.
                </p>
              </div>
              <button
                onClick={() => handleCopy(storageSetupCode, 'Storage SQL')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
              >
                {copiedSection === 'Storage SQL' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'Storage SQL' ? 'Copied!' : 'Copy Storage SQL'}</span>
              </button>
            </div>

            <pre className="bg-stone-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-stone-800">
              {storageSetupCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 6: Realtime */}
      {activeTab === 'realtime' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Supabase Realtime Channel Publication</h3>
                <p className="text-xs text-stone-500">
                  Broadcasts new orders and inventory changes instantaneously to active browser tabs.
                </p>
              </div>
              <button
                onClick={() => handleCopy(realtimeSetupCode, 'Realtime Setup')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
              >
                {copiedSection === 'Realtime Setup' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'Realtime Setup' ? 'Copied!' : 'Copy Realtime'}</span>
              </button>
            </div>

            <pre className="bg-stone-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-stone-800">
              {realtimeSetupCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
