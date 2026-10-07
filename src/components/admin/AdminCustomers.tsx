import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Phone, Mail, MapPin, Search, Award, ShoppingBag } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { customers } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrdersAll = customers.reduce((acc, c) => acc + c.totalOrders, 0);
  const avgOrderValue = totalOrdersAll > 0 ? Math.round(totalSpentAll / totalOrdersAll) : 0;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-heading">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Registered farm produce consumers, delivery addresses, and lifetime spend
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-white"
          />
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-stone-500">Total Customer Count</span>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{customers.length}</div>
          <span className="text-[11px] text-emerald-700">100% Verified Local Delivery</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-stone-500">Cumulative Orders</span>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{totalOrdersAll}</div>
          <span className="text-[11px] text-stone-500">Morning & Evening batches</span>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-stone-500">Average Basket Value</span>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">₹{avgOrderValue}</div>
          <span className="text-[11px] text-stone-500">High repeat order index</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Delivery Address</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Last Harvest Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-stone-50/50">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-700">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 block">{cust.name}</span>
                        {cust.isVip && (
                          <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-0.5">
                            <Award className="w-3 h-3 text-emerald-600" />
                            <span>VIP Subscriber</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-stone-900">
                    <a href={`tel:${cust.phone}`} className="hover:underline text-emerald-800">
                      {cust.phone}
                    </a>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    <a href={`mailto:${cust.email}`} className="hover:underline">
                      {cust.email}
                    </a>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                    {cust.address}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-stone-900">
                    {cust.totalOrders}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">
                    ₹{cust.totalSpent}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-stone-500">
                    {cust.lastOrderDate}
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
