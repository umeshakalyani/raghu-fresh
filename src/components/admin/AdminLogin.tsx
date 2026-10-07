import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, storeSettings, setActivePortal } = useStore();
  const [email, setEmail] = useState('raghunathn783@gmail.com');
  const [password, setPassword] = useState('raghufresh');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (!success) {
      setError(true);
    }
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('raghufresh');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <button
          onClick={() => setActivePortal('customer')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customer Store</span>
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-800 text-white rounded-xl flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-heading">
            RAGHU FRESH Admin Login
          </h1>
          <p className="text-xs text-stone-500">
            Store operations, inventory control, and Supabase database manager.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-stone-50/50"
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-1">Official store email: {storeSettings.email}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Password / Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-stone-200 rounded-lg focus:outline-emerald-800"
                placeholder="Enter password..."
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">
                Incorrect password. Hint: enter "raghufresh" or click Quick Demo Sign-in below.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Sign In to Admin Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-100 space-y-3">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
            <span>1-Click Owner Sign-in (Raghunath N)</span>
          </button>

          <p className="text-center text-[11px] text-stone-400">
            Emergency contact: +91 {storeSettings.phone}
          </p>
        </div>
      </div>
    </div>
  );
};
