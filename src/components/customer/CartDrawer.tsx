import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    deliveryFee, 
    cartTotal,
    storeSettings,
    setCustomerPage
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / storeSettings.freeDeliveryThreshold) * 100));
  const remainingForFree = Math.max(0, storeSettings.freeDeliveryThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="font-bold text-stone-900 text-lg font-heading">
                Your Basket ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-emerald-50/70 p-3.5 border-b border-emerald-100 text-xs">
            {remainingForFree > 0 ? (
              <p className="text-emerald-950 font-medium mb-1.5">
                Add <span className="font-mono font-bold text-emerald-800">₹{remainingForFree}</span> more for <strong className="font-semibold text-emerald-800">FREE Delivery</strong>
              </p>
            ) : (
              <p className="text-emerald-800 font-semibold mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Unlocked FREE doorstep delivery!
              </p>
            )}
            <div className="w-full bg-emerald-200/60 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-700 h-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <span className="text-5xl mb-3">🧺</span>
                <p className="font-medium text-stone-800 text-base">Your fresh basket is empty</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Discover fresh morning spinach, vine tomatoes, and sweet mangoes straight from the farm.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCustomerPage('products');
                  }}
                  className="mt-5 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Explore Fresh Harvest
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  {/* Real Product Photo */}
                  <div className="w-14 h-14 rounded-lg bg-stone-50 border border-stone-200/80 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    <ProductImage 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {item.product.unit} · <span className="font-mono tabular-nums text-stone-800 font-medium">₹{item.product.price}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-white text-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-stone-100 text-stone-600"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono tabular-nums font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-stone-100 text-stone-600"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right shrink-0">
                    <span className="font-mono tabular-nums text-sm font-bold text-stone-900 block">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-mono tabular-nums">
                    {deliveryFee === 0 ? (
                      <strong className="text-emerald-700 font-medium">FREE</strong>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total Payable</span>
                  <span className="font-mono tabular-nums text-base text-emerald-900">₹{cartTotal}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCustomerPage('cart');
                  }}
                  className="py-2.5 px-3 border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-lg text-xs font-semibold text-center transition-colors"
                >
                  View Full Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCustomerPage('checkout');
                  }}
                  className="py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
