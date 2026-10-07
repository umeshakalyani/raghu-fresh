import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminPage } from '../../types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Boxes, 
  Users, 
  BarChart3, 
  Settings, 
  Database, 
  LogOut, 
  ArrowLeft,
  Store,
  ExternalLink
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { 
    adminPage, 
    setAdminPage, 
    setActivePortal, 
    logoutAdmin, 
    orders, 
    products, 
    storeSettings 
  } = useStore();

  const pendingOrdersCount = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  const navItems: { id: AdminPage; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" />, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" />, badge: products.length },
    { id: 'inventory', label: 'Inventory', icon: <Boxes className="w-4 h-4" />, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'supabase', label: 'Supabase Hub', icon: <Database className="w-4 h-4 text-emerald-400" /> }
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between border-r border-stone-800 shrink-0">
      <div>
        {/* Store Title */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-base font-heading">
              R
            </div>
            <div>
              <h2 className="font-bold text-white text-sm font-heading leading-tight">
                RAGHU FRESH
              </h2>
              <span className="text-[10px] text-emerald-400 font-medium">
                Store Operations Admin
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = adminPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-emerald-950 text-emerald-200'
                      : typeof item.badge === 'string' && item.badge.includes('low')
                      ? 'bg-amber-950 text-amber-300'
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switcher & Logout */}
      <div className="p-3 border-t border-stone-800 space-y-1">
        <button
          onClick={() => setActivePortal('customer')}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-stone-300 hover:bg-stone-800 transition-colors"
        >
          <Store className="w-4 h-4 text-emerald-400" />
          <span>Switch to Customer Store</span>
        </button>

        <a
          href={storeSettings.locationUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800/40 transition-colors"
        >
          <span>Store Map Location</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={logoutAdmin}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin</span>
        </button>
      </div>
    </aside>
  );
};
