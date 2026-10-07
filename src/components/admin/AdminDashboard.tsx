import React from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { ProductImage } from '../common/ProductImage';
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  PackagePlus,
  Boxes,
  Database
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    products, 
    customers, 
    setAdminPage, 
    updateOrderStatus, 
    setSelectedOrderId,
    storeSettings 
  } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + (o.orderStatus !== 'Cancelled' ? o.total : 0), 0);
  const activeOrders = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled');
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered');
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  const recentOrders = orders.slice(0, 5);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-heading">
            Store Operations Overview
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time status for Raghu Fresh farm store · Bengaluru
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminPage('products')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Add Produce</span>
          </button>
          <button
            onClick={() => setAdminPage('inventory')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Restock Inventory</span>
          </button>
          <button
            onClick={() => setAdminPage('supabase')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Hub</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards (Zero-pill, refined metric styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
            ₹{totalRevenue}
          </div>
          <p className="text-[11px] text-stone-400">
            Across {orders.length} farm harvest orders
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Active Deliveries</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
            {activeOrders.length}
          </div>
          <p className="text-[11px] text-stone-400">
            {orders.filter((o) => o.orderStatus === 'Out for Delivery').length} currently on delivery route
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Delivered Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
            {deliveredOrders.length}
          </div>
          <p className="text-[11px] text-stone-400">
            Completed doorstep handovers
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Low Stock Alert</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
            {lowStockProducts.length}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">
            Requires harvest replenishment
          </p>
        </div>
      </div>

      {/* 7-Day Performance & Dispatch Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart representation */}
        <div className="lg:col-span-8 bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">7-Day Harvest Revenue Trend</h3>
              <p className="text-[11px] text-stone-500">Daily earnings in INR</p>
            </div>
            <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Avg ₹1,850/day
            </span>
          </div>

          {/* Clean CSS Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {[
              { day: 'Wed', amount: 1650, height: '55%' },
              { day: 'Thu', amount: 1980, height: '65%' },
              { day: 'Fri', amount: 2420, height: '80%' },
              { day: 'Sat', amount: 3100, height: '100%' },
              { day: 'Sun', amount: 2850, height: '92%' },
              { day: 'Mon', amount: 1740, height: '58%' },
              { day: 'Today', amount: 2120, height: '70%', isToday: true }
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="font-mono text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{bar.amount}
                </span>
                <div 
                  className={`w-full rounded-t-md transition-all ${
                    bar.isToday ? 'bg-emerald-800' : 'bg-stone-200 group-hover:bg-emerald-600'
                  }`}
                  style={{ height: bar.height }}
                />
                <span className={`text-[11px] font-medium ${bar.isToday ? 'text-emerald-900 font-bold' : 'text-stone-500'}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Inventory Watchlist */}
        <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Low Stock Items</h3>
            <button
              onClick={() => setAdminPage('inventory')}
              className="text-xs text-emerald-800 font-medium hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {lowStockProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-stone-50 border border-stone-200/80 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                    <ProductImage 
                      src={p.imageUrl} 
                      alt={p.name} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900 block truncate max-w-[140px]">{p.name}</span>
                    <span className="text-stone-500 text-[10px]">{p.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono tabular-nums text-xs font-bold text-amber-700">
                    {p.stock} units left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Live Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Recent Store Orders</h3>
            <p className="text-xs text-stone-500">Live order status and dispatch controller</p>
          </div>
          <button
            onClick={() => setAdminPage('orders')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All {orders.length} Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Slot</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-900 block">{order.customerName}</span>
                    <span className="text-[11px] text-stone-500 font-mono">{order.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {order.deliverySlot.split('(')[0]}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    ₹{order.total}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-medium text-stone-700">
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-xs font-medium border border-stone-200 rounded-md px-2 py-1 bg-white focus:outline-emerald-800"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Harvested & Packed">Harvested & Packed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setAdminPage('orders');
                      }}
                      className="text-xs text-emerald-800 font-semibold hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
