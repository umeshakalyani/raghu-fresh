import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductImage } from '../common/ProductImage';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck, ShoppingBag } from 'lucide-react';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    deliveryFee, 
    cartTotal,
    storeSettings, 
    setCustomerPage,
    showToast
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'RAGHU10' || code === 'FRESH10') {
      const discountVal = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discountVal);
      setCouponApplied(true);
      showToast('Coupon applied! 10% discount added to order.', 'success');
    } else if (code === 'WELCOME50' && cartSubtotal >= 200) {
      setAppliedDiscount(50);
      setCouponApplied(true);
      showToast('Coupon applied! ₹50 welcome discount applied.', 'success');
    } else {
      showToast('Invalid coupon code. Try "FRESH10" for 10% off.', 'warning');
    }
  };

  const finalPayable = Math.max(0, cartTotal - appliedDiscount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🧺
        </div>
        <h2 className="text-2xl font-bold text-stone-900 font-heading">Your Basket is Empty</h2>
        <p className="text-stone-500 text-sm mt-2 max-w-md mx-auto">
          You have no farm-fresh items in your shopping basket. Start exploring our daily morning harvests!
        </p>
        <button
          onClick={() => setCustomerPage('products')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Fresh Catalog</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button & Page Title */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCustomerPage('products')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-rose-600 transition-colors"
        >
          Clear Basket
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-heading mb-8">
        Shopping Basket ({cart.reduce((a, b) => a + b.quantity, 0)} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden divide-y divide-stone-100 shadow-xs">
            {cart.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-5 flex items-center gap-4">
                {/* Real Product Photo */}
                <div className="w-16 h-16 rounded-xl bg-stone-50 border border-stone-200/80 p-1.5 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <ProductImage 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                        {item.product.name}
                      </h3>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                        <span>{item.product.unit}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.product.origin}</span>
                      </div>
                    </div>
                    <span className="font-mono tabular-nums text-base font-bold text-stone-900 shrink-0">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 px-3 hover:bg-stone-100 text-stone-600 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono tabular-nums text-sm font-semibold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1.5 px-3 hover:bg-stone-100 text-stone-600 disabled:opacity-40 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Promise Card */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <p>
              <strong>Raghu Fresh Freshness Promise:</strong> All leafy greens and vegetables in this order are cut and bundled fresh on the morning of dispatch. 100% money back if quality is compromised.
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-5">
          {/* Coupon Code Box */}
          <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
            <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-emerald-700" />
              <span>Apply Coupon</span>
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Try FRESH10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 uppercase text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-700 font-mono"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </form>
            {couponApplied && (
              <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
                ✓ Coupon applied! Saved ₹{appliedDiscount}
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
              Order Breakdown
            </h3>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">₹{cartSubtotal}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono tabular-nums">-₹{appliedDiscount}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              {cartSubtotal < storeSettings.freeDeliveryThreshold && (
                <p className="text-[11px] text-stone-500 pt-1">
                  Add ₹{storeSettings.freeDeliveryThreshold - cartSubtotal} more to qualify for free delivery.
                </p>
              )}

              <div className="pt-3 border-t border-stone-100 flex justify-between text-base font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-lg text-emerald-900">
                  ₹{finalPayable}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCustomerPage('checkout')}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
