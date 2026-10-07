import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';
import { ProductImage } from '../common/ProductImage';
import { ArrowLeft, CheckCircle2, ShieldCheck, QrCode, Banknote, CreditCard, Clock, MapPin, Phone } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    deliveryFee, 
    cartTotal, 
    storeSettings, 
    createOrder, 
    setCustomerPage,
    setSelectedOrderId,
    currentUser,
    openAuthModal
  } = useStore();

  const [name, setName] = useState(currentUser?.name || 'Ananya Sharma');
  const [phone, setPhone] = useState(currentUser?.phone || '9845012345');
  const [email, setEmail] = useState(currentUser?.email || 'ananya.s@gmail.com');
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bengaluru');
  const [landmark, setLandmark] = useState('Opposite Sobha Lakeview Club');
  const [deliverySlot, setDeliverySlot] = useState('Morning (06:30 AM - 09:00 AM)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [orderNotes, setOrderNotes] = useState('Please leave with security if doorbell not answered.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update fields when customer account switches (e.g. Customer A vs Customer B)
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.email.includes('rahul')) {
        setAddress('#12, 1st Cross, HSR Layout Sector 2, Bengaluru');
        setLandmark('Near BDA Complex');
      } else if (currentUser.email.includes('ananya')) {
        setAddress('Flat 402, Green Glen Layout, Bellandur, Bengaluru');
        setLandmark('Opposite Sobha Lakeview Club');
      }
    }
  }, [currentUser]);

  const deliverySlots = [
    { id: 'morning', label: 'Morning (06:30 AM - 09:00 AM)', tag: 'Fresh Harvest Slot' },
    { id: 'afternoon', label: 'Afternoon (12:00 PM - 03:00 PM)', tag: 'Standard Slot' },
    { id: 'evening', label: 'Evening (05:30 PM - 08:30 PM)', tag: 'Fresh Dinner Prep' },
  ];

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in your name, contact phone, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const order = createOrder({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        deliveryAddress: address,
        landmark,
        deliverySlot,
        paymentMethod,
        notes: orderNotes
      });

      setSelectedOrderId(order.id);
      setIsSubmitting(false);
      setCustomerPage('orders');
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-900 font-heading">No items to checkout</h2>
        <p className="text-stone-500 text-sm mt-1">Please add produce to your basket first.</p>
        <button
          onClick={() => setCustomerPage('products')}
          className="mt-4 px-5 py-2.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => setCustomerPage('cart')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Basket</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-heading mb-8">
        Delivery & Payment
      </h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Details & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Contact & Delivery Address */}
          <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <MapPin className="w-4 h-4 text-emerald-800" />
              <h2 className="font-semibold text-stone-900 text-sm sm:text-base">
                1. Delivery Location
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-700"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mobile Number (for delivery updates) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-700 font-mono"
                  placeholder="e.g. 9845012345"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Email Address (for receipt & invoice)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-700"
                placeholder="e.g. ramesh@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Street Address / Apartment / House No. *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-700"
                placeholder="House / Flat #, Apartment Name, Street, Area, Bengaluru"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-700"
                  placeholder="Near metro, temple, or club"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Delivery Instructions
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-700"
                  placeholder="e.g. Leave at door, call on arrival"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Slot Picker */}
          <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Clock className="w-4 h-4 text-emerald-800" />
              <h2 className="font-semibold text-stone-900 text-sm sm:text-base">
                2. Select Fresh Delivery Slot
              </h2>
            </div>

            <div className="space-y-2.5">
              {deliverySlots.map((slot) => (
                <label
                  key={slot.id}
                  className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${
                    deliverySlot === slot.label
                      ? 'border-emerald-700 bg-emerald-50/50 text-stone-900'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliverySlot"
                      value={slot.label}
                      checked={deliverySlot === slot.label}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                      className="text-emerald-800 focus:ring-emerald-700"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold block">{slot.label}</span>
                      <span className="text-[11px] text-stone-500">{slot.tag}</span>
                    </div>
                  </div>
                  {deliverySlot === slot.label && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Banknote className="w-4 h-4 text-emerald-800" />
              <h2 className="font-semibold text-stone-900 text-sm sm:text-base">
                3. Choose Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              {/* UPI Option */}
              <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                paymentMethod === 'UPI' ? 'border-emerald-700 bg-emerald-50/40' : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-emerald-800 focus:ring-emerald-700"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-stone-900 block">
                        Instant UPI (GPay / PhonePe / Paytm / BHIM)
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Instant verification & zero transaction charges
                      </span>
                    </div>
                  </div>
                  <QrCode className="w-5 h-5 text-emerald-800 shrink-0" />
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-3 pt-3 border-t border-emerald-100 bg-white p-3.5 rounded-lg flex flex-col sm:flex-row items-center gap-4">
                    {/* Visual QR Code Display */}
                    <div className="w-24 h-24 bg-stone-100 border border-stone-300 rounded-lg p-1.5 flex flex-col items-center justify-center shrink-0">
                      <div className="w-full h-full bg-stone-900 rounded flex flex-col items-center justify-center p-1 text-center">
                        <span className="text-white font-mono text-[9px] leading-tight">SCAN & PAY</span>
                        <span className="text-emerald-400 font-mono text-[10px] font-bold">₹{cartTotal}</span>
                        <span className="text-[8px] text-stone-300">RAGHU FRESH</span>
                      </div>
                    </div>
                    <div className="text-xs text-stone-600 space-y-1">
                      <p>Scan with any UPI app or transfer directly to:</p>
                      <p className="font-mono text-sm font-bold text-stone-900 bg-stone-50 px-2 py-1 rounded border border-stone-200 inline-block">
                        {storeSettings.upiId}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Recipient: Raghunath N (Raghu Fresh Operations)
                      </p>
                    </div>
                  </div>
                )}
              </label>

              {/* Cash On Delivery Option */}
              <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                paymentMethod === 'COD' ? 'border-emerald-700 bg-emerald-50/40' : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-emerald-800 focus:ring-emerald-700"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-stone-900 block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Pay cash or scan partner's QR when crate arrives at your doorstep
                      </span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-stone-600 shrink-0" />
                </div>
              </label>

              {/* Card / Netbanking */}
              <label className={`block p-4 border rounded-xl cursor-pointer transition-colors ${
                paymentMethod === 'Card / Netbanking' ? 'border-emerald-700 bg-emerald-50/40' : 'border-stone-200 hover:bg-stone-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card / Netbanking"
                      checked={paymentMethod === 'Card / Netbanking'}
                      onChange={() => setPaymentMethod('Card / Netbanking')}
                      className="text-emerald-800 focus:ring-emerald-700"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-stone-900 block">
                        Debit / Credit Cards / Netbanking
                      </span>
                      <span className="text-[11px] text-stone-500">
                        All major Indian debit cards and banking gateways accepted
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-stone-600 shrink-0" />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4 sticky top-24">
            <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-3">
              Order Summary ({cart.length} produce types)
            </h3>

            {/* Produce item list */}
            <div className="max-h-56 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-2 text-xs">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-stone-50 border border-stone-200/80 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                      <ProductImage 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 block line-clamp-1">{item.product.name}</span>
                      <span className="text-stone-500 text-[11px]">{item.quantity} × {item.product.unit}</span>
                    </div>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-stone-900 shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-lg text-emerald-900">₹{cartTotal}</span>
              </div>
            </div>

            {/* Confirm & Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Place Order (₹{cartTotal})</span>
                </>
              )}
            </button>

            {/* Guarantee note */}
            <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Direct harvest guarantee. Instant tracking details sent upon confirmation.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
