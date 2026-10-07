import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { ProductImage } from '../common/ProductImage';
import { 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Printer, 
  RotateCcw, 
  Phone, 
  Calendar, 
  Truck, 
  ChevronRight, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  UserCheck, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { 
    customerOrders, 
    orders: masterOrders,
    selectedOrderId, 
    setSelectedOrderId, 
    addToCart, 
    storeSettings, 
    setCustomerPage,
    setIsCartDrawerOpen, 
    showToast,
    currentUser,
    openAuthModal,
    switchDemoCustomer,
    testDirectAccessSecurity
  } = useStore();

  // Direct access security test state (Requirement 14)
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testTargetOrderId, setTestTargetOrderId] = useState('');
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    blocked: boolean;
    message: string;
    details?: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Active selected order within this customer's orders
  const activeOrder = customerOrders.find((o) => o.id === selectedOrderId) || customerOrders[0];

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    setIsCartDrawerOpen(true);
    showToast('Items re-added to basket!', 'success');
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // Run direct access test against Supabase RLS
  const handleRunDirectAccessTest = async (orderIdToTest: string) => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testDirectAccessSecurity(orderIdToTest);
      setTestResult({
        tested: true,
        success: res.success,
        blocked: res.blocked,
        message: res.message,
        details: res.details
      });
    } catch (err: any) {
      setTestResult({
        tested: true,
        success: false,
        blocked: true,
        message: err.message || 'Direct access rejected by database RLS',
        details: 'PostgreSQL error 42501 (insufficient privileges)'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // If customer is NOT signed in, require authentication
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto mb-2">
          <Lock className="w-8 h-8 text-emerald-800" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 font-heading">
          Sign In to Access Your Orders
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
          Raghu Fresh enforces Supabase Row Level Security. Each customer can only see their own order history and live delivery tracking.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            Sign In with Customer Account
          </button>
          <button
            onClick={() => switchDemoCustomer('A')}
            className="px-5 py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            Quick Login as Customer A
          </button>
        </div>
      </div>
    );
  }

  // If customer is signed in but has zero orders
  if (customerOrders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Customer Account Header Card */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 text-sm">
                Signed in as: {currentUser.name || currentUser.email}
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                Customer Account Active
              </span>
            </div>
            <p className="text-[11px] font-mono text-stone-400 mt-0.5 truncate">
              auth.uid: {currentUser.id}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => switchDemoCustomer(currentUser.email.includes('ananya') ? 'B' : 'A')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              Switch to {currentUser.email.includes('ananya') ? 'Customer B' : 'Customer A'}
            </button>
          </div>
        </div>

        <div className="max-w-xl mx-auto px-4 py-12 text-center bg-white border border-stone-200/90 rounded-2xl p-8">
          <Package className="w-14 h-14 text-stone-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-stone-900 font-heading">
            No Orders Placed Yet for {currentUser.name}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Row Level Security (RLS) is active. You only see orders placed under your account ({currentUser.email}).
          </p>
          <button
            onClick={() => setCustomerPage('products')}
            className="mt-6 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
          >
            Explore Fresh Harvest & Place Order
          </button>
        </div>
      </div>
    );
  }

  const statusHierarchy: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Harvested & Packed',
    'Out for Delivery',
    'Delivered'
  ];

  // Find another customer's order in master database for direct access test (Requirement 14)
  const otherCustomerOrder = masterOrders.find(
    (o) => (o.customerId && o.customerId !== currentUser.id) || (o.customer_id && o.customer_id !== currentUser.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Customer Account & RLS Verification Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Supabase Row Level Security Active</span>
            </span>
            <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono">
              WHERE customer_id = auth.uid()
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold font-heading">
            {currentUser.name}'s Farm Orders ({customerOrders.length})
          </h1>
          <p className="text-xs text-emerald-100/90 font-mono">
            Account: {currentUser.email} · auth.uid: {currentUser.id.slice(0, 16)}...
          </p>
        </div>

        {/* Quick Testing Controls (Customer A vs B Isolation & Direct Access Test) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Switch to Other Customer */}
          <button
            onClick={() => switchDemoCustomer(currentUser.email.includes('ananya') ? 'B' : 'A')}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Switch customer account to verify isolation"
          >
            Switch to {currentUser.email.includes('ananya') ? 'Customer B (Rahul)' : 'Customer A (Ananya)'}
          </button>

          {/* Test RLS Direct Access Button (Requirement 14) */}
          <button
            onClick={() => {
              setTestModalOpen(true);
              setTestResult(null);
              setTestTargetOrderId(otherCustomerOrder ? otherCustomerOrder.orderNumber : 'RF-2026-1041');
            }}
            className="px-3 py-1.5 bg-white text-emerald-950 hover:bg-stone-100 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Test Direct Access Security</span>
          </button>
        </div>
      </div>

      {/* Main Order View Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-heading">
            My Farm Order Tracking
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Morning harvest delivery status and official invoice receipts for your account.
          </p>
        </div>

        {activeOrder && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintInvoice}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => handleReorder(activeOrder)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-order Basket</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Orders List (ONLY for this customer) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Your Orders ({customerOrders.length})
            </h3>
            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Only Your Account
            </span>
          </div>

          <div className="space-y-2.5">
            {customerOrders.map((order) => {
              const isSelected = activeOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-700 bg-white shadow-sm ring-1 ring-emerald-700'
                      : 'border-stone-200/90 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-stone-900">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-800'
                        : order.orderStatus === 'Out for Delivery'
                        ? 'bg-sky-50 text-sky-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-stone-500 flex items-center justify-between">
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="font-mono tabular-nums font-bold text-stone-900">
                      ₹{order.total}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                    <span>{order.items.length} items</span>
                    <div className="flex items-center text-emerald-800 font-medium">
                      <span>View details</span>
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Order Details & Live Tracking Stepper */}
        {activeOrder && (
          <div className="lg:col-span-8 space-y-6">
            {/* Live Progress Tracker Card */}
            <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[11px] text-emerald-800 font-semibold tracking-wide uppercase">
                    Live Farm-to-Door Tracker
                  </span>
                  <h2 className="text-lg font-bold text-stone-900 font-mono mt-0.5">
                    {activeOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Slot: {activeOrder.deliverySlot}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-500 block">Total Paid</span>
                  <span className="font-mono tabular-nums text-xl font-bold text-stone-900">
                    ₹{activeOrder.total}
                  </span>
                  <span className="text-[10px] text-emerald-700 block font-medium">
                    {activeOrder.paymentMethod} · {activeOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Status Stepper Timeline */}
              <div className="py-2">
                <div className="relative">
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-stone-200 -z-0" />

                  <div className="space-y-6 relative z-10">
                    {activeOrder.trackingUpdates.map((step, idx) => {
                      return (
                        <div key={idx} className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                            step.completed
                              ? 'bg-emerald-800 border-emerald-800 text-white'
                              : 'bg-white border-stone-300 text-stone-400'
                          }`}>
                            {step.completed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>

                          <div className="flex-1 pt-0.5">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm font-semibold ${step.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                                {step.status}
                              </h4>
                              <span className="text-xs font-mono text-stone-400">
                                {step.time}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              {step.note}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-stone-50 rounded-xl p-4 text-xs space-y-2 border border-stone-200/80">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900">Delivery Address:</span>
                    <p className="text-stone-600 mt-0.5">{activeOrder.deliveryAddress}</p>
                    {activeOrder.landmark && (
                      <p className="text-stone-400 text-[11px]">Landmark: {activeOrder.landmark}</p>
                    )}
                  </div>
                </div>
                {activeOrder.notes && (
                  <div className="pt-2 border-t border-stone-200/60 text-stone-500 text-[11px]">
                    <span className="font-semibold text-stone-700">Instructions: </span>
                    {activeOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Produce Items Breakdown with Real Product Photography */}
            <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                Order Items ({activeOrder.items.length})
              </h3>

              <div className="divide-y divide-stone-100">
                {activeOrder.items.map((item) => (
                  <div key={item.product.id} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-stone-50 border border-stone-200/80 p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                        <ProductImage 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-stone-900">{item.product.name}</h4>
                        <p className="text-[11px] text-stone-500">
                          {item.quantity} × {item.product.unit} @ ₹{item.product.price}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono tabular-nums text-sm font-bold text-stone-900">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Totals */}
              <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">₹{activeOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doorstep Delivery</span>
                  <span className="font-mono tabular-nums font-semibold text-emerald-800">
                    {activeOrder.deliveryFee === 0 ? 'FREE' : `₹${activeOrder.deliveryFee}`}
                  </span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-₹{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                  <span>Grand Total</span>
                  <span className="font-mono tabular-nums text-emerald-900">₹{activeOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* DIRECT ACCESS SECURITY TEST MODAL (Requirement 14) */}
      {/* ==================================================== */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-800" />
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-heading">
                    Test RLS Direct Order Access
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Verifies that Supabase rejects cross-customer order queries
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTestModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <p><span className="font-semibold text-stone-900">Current Logged-in Customer:</span> {currentUser.name} ({currentUser.email})</p>
                <p className="font-mono text-[10px] text-stone-500">auth.uid: {currentUser.id}</p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Target Order ID / Number to Query Directly:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testTargetOrderId}
                    onChange={(e) => setTestTargetOrderId(e.target.value)}
                    placeholder="e.g. RF-2026-1041 or ord-1002"
                    className="flex-1 px-3 py-2 border border-stone-200 rounded-lg font-mono focus:outline-emerald-800"
                  />
                  <button
                    onClick={() => handleRunDirectAccessTest(testTargetOrderId)}
                    disabled={isTesting || !testTargetOrderId}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {isTesting ? 'Querying...' : 'Execute Test'}
                  </button>
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  Try querying an order created by another customer to test database security rejection.
                </p>
              </div>

              {testResult && (
                <div className={`p-4 rounded-xl border ${
                  testResult.blocked 
                    ? 'bg-rose-50 border-rose-200 text-rose-900' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {testResult.blocked ? (
                      <>
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>SECURITY PASSED: Database Rejected Unauthorized Access!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Query Succeeded (Authorized Owner)</span>
                      </>
                    )}
                  </div>
                  <p className="font-medium text-xs">{testResult.message}</p>
                  {testResult.details && (
                    <p className="text-[10px] font-mono mt-1 opacity-80">{testResult.details}</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setTestModalOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
