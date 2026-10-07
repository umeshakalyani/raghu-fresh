import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Plus, Minus, Check, Eye } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCartQuantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0 || product.isAvailable === false;

  return (
    <>
      <div className="group relative bg-white border border-stone-200/90 rounded-xl overflow-hidden hover:border-emerald-600/70 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        {/* Product Visual Area */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="relative h-44 sm:h-48 cursor-pointer flex items-center justify-center p-2 bg-stone-50/70 overflow-hidden"
        >
          {/* Subtle Organic Badge if applicable */}
          <div className="absolute top-2.5 left-2.5 z-10 text-[11px] font-medium tracking-wide text-stone-600 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs">
            {product.isOrganic && (
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Certified Organic
              </span>
            )}
            {product.isSeasonal && (
              <>
                <span className="text-stone-300">·</span>
                <span className="text-amber-800 font-medium">Seasonal</span>
              </>
            )}
          </div>

          {/* Quick Details Eye Icon */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-md bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Real Product Image (Photograph) */}
          <div className="w-full h-full p-2 group-hover:scale-105 transition-transform duration-300 ease-out flex items-center justify-center">
            <ProductImage 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain max-h-40" 
            />
          </div>

          {/* Stock threshold alert if low */}
          {product.stock > 0 && product.isAvailable !== false && product.stock <= (product.lowStockThreshold || 10) && (
            <div className="absolute bottom-2 left-2 z-10 text-[10px] font-semibold text-amber-800 bg-amber-50/95 px-2 py-0.5 rounded border border-amber-200 shadow-2xs">
              Only {product.stock} left in farm stock
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 bg-stone-900/50 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-stone-900 text-white text-xs font-semibold px-3 py-1 rounded shadow-sm">
                {!product.isAvailable ? 'Temporarily Unavailable' : 'Sold Out for Today'}
              </span>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Origin & Unit metadata with unboxed typographic separators */}
            <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mb-1">
              <span>{product.origin}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-stone-700">{product.unit}</span>
            </div>

            {/* Title and Kannada Subname */}
            <h3 
              onClick={() => setIsModalOpen(true)}
              className="font-semibold text-stone-900 text-sm sm:text-base leading-snug cursor-pointer hover:text-emerald-800 transition-colors line-clamp-1"
            >
              {product.name}
            </h3>
            {product.kannadaName && (
              <p className="text-xs text-stone-400 mt-0.5 font-normal">
                {product.kannadaName}
              </p>
            )}

            {/* Quick Nutrition Highlights */}
            <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
              {product.nutritionHighlights}
            </p>
          </div>

          {/* Pricing & Cart Action Row */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono tabular-nums text-lg font-bold text-stone-900">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="font-mono tabular-nums text-xs text-stone-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">
                {product.originalPrice > product.price 
                  ? `Save ₹${product.originalPrice - product.price}` 
                  : 'Farm Direct Price'}
              </span>
            </div>

            {/* Action Button: Add or Stepper */}
            {isOutOfStock ? (
              <span className="text-xs text-stone-400 font-medium py-1.5 px-3">
                Unavailable
              </span>
            ) : inCartQuantity > 0 ? (
              <div className="flex items-center bg-emerald-800 text-white rounded-lg shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, inCartQuantity - 1)}
                  className="px-2.5 py-1.5 hover:bg-emerald-900 active:scale-95 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono tabular-nums text-xs font-semibold px-2">
                  {inCartQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  disabled={inCartQuantity >= product.stock}
                  className="px-2.5 py-1.5 hover:bg-emerald-900 disabled:opacity-50 active:scale-95 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium rounded-lg shadow-xs active:scale-95 transition-all whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal View */}
      {isModalOpen && (
        <ProductDetailModal
          product={product}
          inCartQuantity={inCartQuantity}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
