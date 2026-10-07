import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { products, searchQuery, setSearchQuery } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const popularSearches = [
    'Palak',
    'Nati Tomato',
    'A2 Milk',
    'Mango',
    'Malai Paneer',
    'Ooty Carrot',
    'Vedic Ghee',
    'Organic Rice'
  ];

  const searchResults = products.filter((product) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      product.kannadaName?.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.origin.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Big Search Bar Area */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farm fresh vegetables, fruits, A2 milk, country eggs..."
            className="w-full pl-12 pr-10 py-3.5 bg-white border-2 border-stone-200 focus:border-emerald-800 rounded-2xl text-sm sm:text-base outline-none shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Quick-Search Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-600">
          <span className="flex items-center gap-1 text-stone-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            Popular:
          </span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setSearchQuery(term)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg text-stone-700 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 text-xs text-stone-500">
        <span>
          {searchQuery.trim()
            ? `Found ${searchResults.length} items matching "${searchQuery}"`
            : `Showing all ${products.length} farm products`}
        </span>
        {searchQuery.trim() && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-emerald-800 hover:underline font-medium"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Results Grid */}
      {searchResults.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <span className="text-4xl block">🌱</span>
          <h3 className="text-base font-bold text-stone-900">No produce matched your search</h3>
          <p className="text-xs text-stone-500">
            We might not have that specific item in today's harvest. Try searching for vegetables, milk, or spinach.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
