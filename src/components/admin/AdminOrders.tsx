import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { ProductImage } from '../common/ProductImage';
import { 
  ShoppingBag, 
  Search, 
  Printer, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Eye, 
  X,
  FileText
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    storeSettings, 
    showToast 
  } = useStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'all' && order.orderStatus !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.deliveryAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statuses: { label: string; value: string }[] = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Harvested & Packed', value: 'Harvested & Packed' },
    { label: 'Out for Delivery', value: 'Out for Delivery' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-heading">
            Orders Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Dispatch, packing slip printing, and order state advancement
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statuses.map((tab) => {
          const count = tab.value === 'all' 
            ? orders.length 
            : orders.filter((o) => o.orderStatus === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === tab.value
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Delivery Slot</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status Transition</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No orders matching selected criteria
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-stone-900 block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900 block">{order.customerName}</span>
                      <span className="text-[11px] text-stone-500 font-mono">{order.customerPhone}</span>
                      <span className="text-[10px] text-stone-400 block truncate max-w-xs">{order.deliveryAddress}</span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {order.deliverySlot}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-900">{order.items.length} items</span>
                      <span className="text-[10px] text-stone-400 block">
                        ({order.items.reduce((acc, i) => acc + i.quantity, 0)} units)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 text-sm">
                      ₹{order.total}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-stone-900 block text-[11px]">
                        {order.paymentMethod}
                      </span>
                      <span className={`text-[10px] font-semibold ${
                        order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-semibold rounded-md px-2.5 py-1 border transition-colors ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : order.orderStatus === 'Out for Delivery'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : order.orderStatus === 'Harvested & Packed'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
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
                        onClick={() => setActiveModalOrder(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-stone-200 hover:bg-stone-100 text-stone-800 rounded text-xs font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Modal Detail Inspection */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-800 font-semibold">
                  Order Inspection & Packing Sheet
                </span>
                <h2 className="text-xl font-bold font-mono text-stone-900 mt-0.5">
                  {activeModalOrder.orderNumber}
                </h2>
                <p className="text-xs text-stone-500">
                  Created {new Date(activeModalOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setActiveModalOrder(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-stone-900">Customer:</span>
                <p>{activeModalOrder.customerName}</p>
                <p className="font-mono">{activeModalOrder.customerPhone}</p>
                <p>{activeModalOrder.customerEmail}</p>
                <p className="text-[10px] font-mono text-emerald-800 pt-0.5">
                  <span className="font-semibold">auth.uid:</span> {activeModalOrder.customerId || activeModalOrder.customer_id || 'Legacy / Guest'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-stone-900">Delivery Address:</span>
                <p>{activeModalOrder.deliveryAddress}</p>
                {activeModalOrder.landmark && <p className="text-stone-500">Landmark: {activeModalOrder.landmark}</p>}
                <p className="font-semibold text-emerald-900 pt-1">Slot: {activeModalOrder.deliverySlot}</p>
              </div>
            </div>

            {/* Produce item list */}
            <div>
              <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-2">
                Items to Pack:
              </h3>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {activeModalOrder.items.map((item) => (
                  <div key={item.product.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-200/80 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                        <ProductImage 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 block">{item.product.name}</span>
                        <span className="text-stone-500">{item.product.unit} · {item.product.origin}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-stone-500 block text-[11px]">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Change CTA in modal */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <div className="text-xs">
                <span>Current Status: </span>
                <strong className="text-stone-900">{activeModalOrder.orderStatus}</strong>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateOrderStatus(activeModalOrder.id, 'Harvested & Packed');
                    setActiveModalOrder({ ...activeModalOrder, orderStatus: 'Harvested & Packed' });
                  }}
                  className="px-3 py-1.5 bg-purple-100 text-purple-900 rounded-lg text-xs font-semibold hover:bg-purple-200"
                >
                  Mark Harvested & Packed
                </button>
                <button
                  onClick={() => {
                    updateOrderStatus(activeModalOrder.id, 'Out for Delivery');
                    setActiveModalOrder({ ...activeModalOrder, orderStatus: 'Out for Delivery' });
                  }}
                  className="px-3 py-1.5 bg-sky-100 text-sky-900 rounded-lg text-xs font-semibold hover:bg-sky-200"
                >
                  Mark Out for Delivery
                </button>
                <button
                  onClick={() => {
                    updateOrderStatus(activeModalOrder.id, 'Delivered');
                    setActiveModalOrder({ ...activeModalOrder, orderStatus: 'Delivered' });
                  }}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
