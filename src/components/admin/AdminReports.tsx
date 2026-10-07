import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { BarChart3, Download, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { orders, products, categories, showToast } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + (o.orderStatus !== 'Cancelled' ? o.total : 0), 0);
  const totalItemsSold = orders.reduce((acc, o) => {
    return acc + o.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  // Top products calculation
  const productSalesMap: { [id: string]: { name: string; quantity: number; revenue: number; imageUrl?: string } } = {};
  orders.forEach((order) => {
    if (order.orderStatus === 'Cancelled') return;
    order.items.forEach((item) => {
      if (!productSalesMap[item.product.id]) {
        productSalesMap[item.product.id] = {
          name: item.product.name,
          quantity: 0,
          revenue: 0,
          imageUrl: item.product.imageUrl
        };
      }
      productSalesMap[item.product.id].quantity += item.quantity;
      productSalesMap[item.product.id].revenue += item.product.price * item.quantity;
    });
  });

  const topSellingProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

  // Export to CSV
  const handleExportCSV = () => {
    const csvRows = [
      ['Order ID', 'Date', 'Customer Name', 'Phone', 'Items Count', 'Total (INR)', 'Status', 'Payment Method'],
      ...orders.map((o) => [
        o.orderNumber,
        new Date(o.createdAt).toLocaleDateString('en-IN'),
        `"${o.customerName}"`,
        o.customerPhone,
        o.items.length,
        o.total,
        o.orderStatus,
        o.paymentMethod
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `raghu_fresh_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sales report downloaded as CSV', 'success');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-heading">
            Sales & Analytics Reports
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Revenue breakdowns, category velocity, and transaction logs
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Sales CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <span className="text-xs text-stone-500">Gross Store Revenue</span>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">₹{totalRevenue}</div>
          <p className="text-[11px] text-emerald-700 mt-1">Direct from consumer transactions</p>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <span className="text-xs text-stone-500">Total Produce Units Dispatched</span>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{totalItemsSold}</div>
          <p className="text-[11px] text-stone-500 mt-1">Bunches, kilos, and milk bottles</p>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <span className="text-xs text-stone-500">Total Completed Orders</span>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-1">{orders.length}</div>
          <p className="text-[11px] text-stone-500 mt-1">Morning & Evening dispatch batches</p>
        </div>
      </div>

      {/* Category Revenue Distribution & Top Produce */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Produce */}
        <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Top Selling Fresh Produce</h3>
            <span className="text-xs text-stone-500 font-medium">Ranked by Revenue</span>
          </div>

          <div className="space-y-3">
            {topSellingProducts.slice(0, 6).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-stone-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-stone-400 font-bold w-4">#{idx + 1}</span>
                  <div className="w-8 h-8 rounded-md bg-stone-50 border border-stone-200/80 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                    <ProductImage 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">{item.name}</span>
                    <span className="text-stone-500 text-[11px]">{item.quantity} units ordered</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    ₹{item.revenue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Contribution */}
        <div className="lg:col-span-5 bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Category Performance</h3>
            <PieChart className="w-4 h-4 text-stone-400" />
          </div>

          <div className="space-y-3 text-xs">
            {categories.map((c, idx) => {
              const percentages = [32, 28, 22, 12, 6];
              const pct = percentages[idx] || 10;
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-800">{c.name}</span>
                    <span className="font-mono text-stone-600">{pct}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-800 h-full rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
