import React, { useEffect } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Minus, Check, MapPin, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import { ProductImage } from './ProductImage';

interface ProductDetailModalProps {
  product: Product;
  inCartQuantity: number;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  inCartQuantity,
  onClose
}) => {
  const { addToCart, updateQuantity } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Real Product Photo */}
        <div className="relative p-6 flex flex-col items-center justify-center bg-stone-50 border-b border-stone-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 transition-colors shadow-xs"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-48 h-48 my-2 rounded-xl bg-white p-3 border border-stone-200/80 shadow-xs flex items-center justify-center overflow-hidden">
            <ProductImage 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain" 
            />
          </div>

          <div className="text-center mt-2">
            <span className="text-xs uppercase tracking-wider text-emerald-800 font-semibold">
              {product.origin}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 font-heading">
              {product.name}
            </h2>
            {product.kannadaName && (
              <p className="text-sm text-stone-500 font-normal mt-0.5">
                {product.kannadaName}
              </p>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono tabular-nums text-2xl font-bold text-stone-900">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="font-mono tabular-nums text-sm text-stone-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-stone-500">/ {product.unit}</span>
              </div>
              <span className="text-xs text-emerald-700 font-medium">
                {product.isOrganic ? '100% Certified Organic & Chemical Free' : 'Natural Farm Fresh Standard'}
              </span>
            </div>

            <div className="text-right">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                !product.isAvailable
                  ? 'bg-stone-100 text-stone-700 border border-stone-200'
                  : product.stock > (product.lowStockThreshold || 10)
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : product.stock > 0 
                  ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {!product.isAvailable ? 'Unavailable' : product.stock > (product.lowStockThreshold || 10) ? 'In Stock (Farm Ready)' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Farm Promises List */}
          <div className="bg-stone-50 rounded-xl p-3.5 space-y-2 border border-stone-100 text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Grown & sourced from: <strong className="font-medium text-stone-900">{product.origin}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Nutritional highlight: <strong className="font-medium text-stone-900">{product.nutritionHighlights}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Harvest time: Harvested daily between 4:30 AM – 6:00 AM</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% replacement guarantee if not fresh upon arrival</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Back to Catalog
            </button>

            {product.stock <= 0 || !product.isAvailable ? (
              <button
                disabled
                className="flex-1 py-2.5 bg-stone-200 text-stone-500 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                {!product.isAvailable ? 'Temporarily Unavailable' : 'Out of Stock Today'}
              </button>
            ) : inCartQuantity > 0 ? (
              <div className="flex items-center bg-emerald-800 text-white rounded-lg shadow-sm px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, inCartQuantity - 1)}
                  className="p-1 hover:bg-emerald-900 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-mono tabular-nums text-sm font-bold px-4">
                  {inCartQuantity} in basket
                </span>
                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  disabled={inCartQuantity >= product.stock}
                  className="p-1 hover:bg-emerald-900 rounded disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  addToCart(product, 1);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold rounded-lg shadow-xs active:scale-98 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Basket (₹{product.price})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
