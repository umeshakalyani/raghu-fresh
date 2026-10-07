/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/customer/CartDrawer';
import { CustomerAuthModal } from './components/customer/CustomerAuthModal';

// Customer Pages
import { HomeView } from './components/customer/HomeView';
import { ProductsView } from './components/customer/ProductsView';
import { CategoriesView } from './components/customer/CategoriesView';
import { SearchView } from './components/customer/SearchView';
import { CartView } from './components/customer/CartView';
import { CheckoutView } from './components/customer/CheckoutView';
import { OrdersView } from './components/customer/OrdersView';
import { ContactLocationView } from './components/customer/ContactLocationView';

// Admin Pages
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminSupabase } from './components/admin/AdminSupabase';

const MainAppContent: React.FC = () => {
  const { 
    activePortal, 
    customerPage, 
    adminPage, 
    isAdminAuthenticated 
  } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
      <ToastContainer />
      <CartDrawer />
      <CustomerAuthModal />

      {activePortal === 'customer' ? (
        // Customer Storefront
        <>
          <Header />
          <main className="flex-1">
            {customerPage === 'home' && <HomeView />}
            {customerPage === 'products' && <ProductsView />}
            {customerPage === 'categories' && <CategoriesView />}
            {customerPage === 'search' && <SearchView />}
            {customerPage === 'cart' && <CartView />}
            {customerPage === 'checkout' && <CheckoutView />}
            {customerPage === 'orders' && <OrdersView />}
            {customerPage === 'contact' && <ContactLocationView />}
          </main>
          <Footer />
        </>
      ) : (
        // Admin Portal
        <>
          {!isAdminAuthenticated ? (
            <>
              <Header />
              <main className="flex-1 flex items-center justify-center p-4">
                <AdminLogin />
              </main>
              <Footer />
            </>
          ) : (
            <div className="min-h-screen flex flex-col bg-stone-100">
              <Header />
              <div className="flex-1 flex flex-col md:flex-row">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto bg-stone-50 min-h-[calc(100vh-4rem)]">
                  {adminPage === 'dashboard' && <AdminDashboard />}
                  {adminPage === 'orders' && <AdminOrders />}
                  {adminPage === 'products' && <AdminProducts />}
                  {adminPage === 'inventory' && <AdminInventory />}
                  {adminPage === 'customers' && <AdminCustomers />}
                  {adminPage === 'reports' && <AdminReports />}
                  {adminPage === 'settings' && <AdminSettings />}
                  {adminPage === 'supabase' && <AdminSupabase />}
                </main>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
