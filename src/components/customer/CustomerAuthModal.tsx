import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { DEMO_CUSTOMERS } from '../../lib/supabase';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    openAuthModal,
    customerSignIn, 
    customerSignUp,
    switchDemoCustomer,
    currentUser,
    customerSignOut
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        const res = await customerSignIn(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
        } else {
          closeAuthModal();
        }
      } else {
        const res = await customerSignUp(email, password, name, phone);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to create account. Please try again.');
        } else {
          closeAuthModal();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (target: 'A' | 'B') => {
    switchDemoCustomer(target);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-heading">
                {currentUser 
                  ? 'Your Customer Account' 
                  : authModalMode === 'login' 
                  ? 'Customer Sign In' 
                  : 'Create Customer Account'}
              </h2>
              <p className="text-[11px] text-stone-500">
                Supabase Auth & Row Level Security Protected
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Currently logged-in profile view */}
        {currentUser ? (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Authenticated Customer</span>
                </span>
                <span className="bg-emerald-800 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  Active Session
                </span>
              </div>
              <div className="text-stone-700 space-y-1 pt-1 border-t border-emerald-200/60">
                <p><span className="font-medium text-stone-900">Name:</span> {currentUser.name || 'Customer'}</p>
                <p><span className="font-medium text-stone-900">Email:</span> {currentUser.email}</p>
                {currentUser.phone && <p><span className="font-medium text-stone-900">Phone:</span> {currentUser.phone}</p>}
                <p className="text-[10px] font-mono text-emerald-900 pt-1 truncate">
                  <span className="font-bold">auth.uid:</span> {currentUser.id}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  customerSignOut();
                  closeAuthModal();
                }}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Sign Out
              </button>
              <button
                type="button"
                onClick={closeAuthModal}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Quick Demo Switcher Buttons for Customer A vs Customer B testing */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Quick Test Accounts</span>
                </span>
                <span className="text-[10px] text-stone-500">1-Click Login</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('A')}
                  className="p-2.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-600 rounded-lg text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
                      Customer A
                    </span>
                    <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-700" />
                  </div>
                  <span className="text-[10px] text-stone-500 block truncate">
                    {DEMO_CUSTOMERS[0].name}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('B')}
                  className="p-2.5 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-600 rounded-lg text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
                      Customer B
                    </span>
                    <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-emerald-700" />
                  </div>
                  <span className="text-[10px] text-stone-500 block truncate">
                    {DEMO_CUSTOMERS[1].name}
                  </span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-200">
              <button
                type="button"
                onClick={() => {
                  openAuthModal('login');
                  setErrorMessage('');
                }}
                className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  authModalMode === 'login'
                    ? 'border-emerald-800 text-emerald-800'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  openAuthModal('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                  authModalMode === 'signup'
                    ? 'border-emerald-800 text-emerald-800'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authModalMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sundaram"
                        className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-emerald-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9845012345"
                        className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@gmail.com"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-emerald-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <span>{authModalMode === 'login' ? 'Sign In to Raghu Fresh' : 'Create Customer Account'}</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
