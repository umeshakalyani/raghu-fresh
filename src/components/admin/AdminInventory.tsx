import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { Boxes, Plus, Minus, AlertTriangle, CheckCircle2, Search, RotateCcw, Save, X, Database } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { 
    products, 
    updateStock, 
    updateProductPrice, 
    toggleProductAvailability, 
    showToast 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const filteredProducts = products.filter((p) => {
    const isLow = p.stock <= (p.lowStockThreshold || 10) && p.stock > 0;
    const isOut = p.stock <= 0 || p.isAvailable === false;

    if (filterMode === 'low' && !isLow) return false;
    if (filterMode === 'out' && !isOut) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.origin.toLowerCase().includes(q) || p.category.includes(q);
    }
    return true;
  });

  const handleQuickAdd = (productId: string, currentStock: number, addAmount: number) => {
    updateStock(productId, currentStock + addAmount);
  };

  const handleSetZero = (productId: string) => {
    updateStock(productId, 0);
  };

  const handleSavePrice = (productId: string) => {
    if (!isNaN(tempPrice) && tempPrice >= 0) {
      updateProductPrice(productId, tempPrice);
      setEditingPriceId(null);
    }
  };

  const lowStockCount = products.filter((p) => p.stock <= (p.lowStockThreshold || 10) && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0 || p.isAvailable === false).length;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-heading">
            Inventory & Stock Manager
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time batch restock controller, price updates, and harvest thresholds
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterMode === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('low')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              filterMode === 'low'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Low Stock ({lowStockCount})</span>
          </button>
          <button
            onClick={() => setFilterMode('out')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              filterMode === 'out'
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>Out of Stock ({outOfStockCount})</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter inventory by name, category, or origin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-white"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Unit Weight</th>
                <th className="py-3 px-4">Price (₹) <span className="font-normal text-[10px] text-emerald-800">[Editable]</span></th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Low Threshold</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-center">Batch Restock (+ Units)</th>
                <th className="py-3 px-4 text-right">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredProducts.map((p) => {
                const threshold = p.lowStockThreshold || 10;
                const isLow = p.stock <= threshold && p.stock > 0;
                const isOut = p.stock <= 0 || p.isAvailable === false;
                const isEditingThisPrice = editingPriceId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-200/90 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                          <ProductImage src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block leading-tight">{p.name}</span>
                          <span className="text-[10px] text-stone-400">{p.origin}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-stone-600">
                      {p.category.replace('-', ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-stone-900">
                      {p.unit}
                    </td>

                    {/* Price with Inline Edit */}
                    <td className="py-3.5 px-4">
                      {isEditingThisPrice ? (
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-stone-400 text-xs">₹</span>
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSavePrice(p.id);
                              if (e.key === 'Escape') setEditingPriceId(null);
                            }}
                            className="w-16 px-1.5 py-1 text-xs font-mono font-bold border border-emerald-600 rounded bg-white"
                          />
                          <button
                            onClick={() => handleSavePrice(p.id)}
                            className="p-1 text-white bg-emerald-800 hover:bg-emerald-900 rounded"
                            title="Save"
                          >
                            <Save className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 text-stone-400 hover:text-stone-700"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingPriceId(p.id);
                            setTempPrice(p.price);
                          }}
                          className="group/p flex items-center gap-1 cursor-pointer py-1 px-1.5 -ml-1.5 rounded hover:bg-stone-100"
                          title="Click to edit price"
                        >
                          <span className="font-mono font-bold text-stone-900">₹{p.price}</span>
                          <span className="text-[10px] text-emerald-800 opacity-0 group-hover/p:opacity-100">
                            Edit
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Stock Stepper */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateStock(p.id, Math.max(0, p.stock - 1))}
                          className="p-1 border border-stone-200 rounded hover:bg-stone-100 text-stone-600"
                          title="Decrease 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={p.stock}
                          onChange={(e) => updateStock(p.id, Math.max(0, Number(e.target.value)))}
                          className="w-14 text-center font-mono font-bold text-xs py-1 border border-stone-200 rounded focus:outline-emerald-800"
                        />
                        <button
                          onClick={() => updateStock(p.id, p.stock + 1)}
                          className="p-1 border border-stone-200 rounded hover:bg-stone-100 text-stone-600"
                          title="Increase 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Low Stock Threshold */}
                    <td className="py-3.5 px-4 font-mono text-stone-500">
                      {threshold}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-4">
                      {p.isAvailable === false ? (
                        <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          Disabled
                        </span>
                      ) : isOut ? (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Healthy ({p.stock})
                        </span>
                      )}
                    </td>

                    {/* Quick Batch Restock Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleQuickAdd(p.id, p.stock, 5)}
                          className="px-2 py-1 bg-stone-100 hover:bg-emerald-800 hover:text-white rounded text-[11px] font-mono font-semibold transition-colors"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleQuickAdd(p.id, p.stock, 10)}
                          className="px-2 py-1 bg-stone-100 hover:bg-emerald-800 hover:text-white rounded text-[11px] font-mono font-semibold transition-colors"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleQuickAdd(p.id, p.stock, 25)}
                          className="px-2 py-1 bg-stone-100 hover:bg-emerald-800 hover:text-white rounded text-[11px] font-mono font-semibold transition-colors"
                        >
                          +25
                        </button>
                      </div>
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleProductAvailability(p.id)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                          p.isAvailable !== false
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                        title="Toggle availability"
                      >
                        {p.isAvailable !== false ? 'Available' : 'Make Available'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
