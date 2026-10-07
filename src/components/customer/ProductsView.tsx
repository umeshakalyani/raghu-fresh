import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { CategoryId } from '../../types';
import { Filter, ArrowUpDown, Search, Check, Sparkles } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Filtering
  const filteredProducts = products.filter((product) => {
    // Category match
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchKannada = product.kannadaName?.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchOrigin = product.origin.toLowerCase().includes(q);
      if (!matchName && !matchKannada && !matchDesc && !matchOrigin) {
        return false;
      }
    }
    // Organic filter
    if (onlyOrganic && !product.isOrganic) {
      return false;
    }
    // Stock filter
    if (onlyInStock && (product.stock <= 0 || product.isAvailable === false)) {
      return false;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Direct Farm Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-heading mt-1">
            All Farm-Fresh Produce
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Harvested daily, quality graded, zero preservatives or wax treatments.
          </p>
        </div>

        {/* Search input in catalog */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search spinach, tomato, milk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-emerald-800 bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Controls */}
      <div className="space-y-4">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Secondary Toggles and Sorting Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-2">
            {/* Organic filter toggle */}
            <button
              onClick={() => setOnlyOrganic(!onlyOrganic)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                onlyOrganic
                  ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-semibold'
                  : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Organic Only</span>
            </button>

            {/* In stock toggle */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                onlyInStock
                  ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-semibold'
                  : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <span>In Stock Only</span>
            </button>

            <span className="text-stone-400 pl-2">
              Showing {sortedProducts.length} items
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-emerald-800 text-stone-800 font-medium"
            >
              <option value="featured">Featured / Harvest Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-base font-bold text-stone-900">No matching produce found</h3>
          <p className="text-xs text-stone-500">
            Try adjusting your search query or reset your active filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyOrganic(false);
              setOnlyInStock(false);
            }}
            className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
