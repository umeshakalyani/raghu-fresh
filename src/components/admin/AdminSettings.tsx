import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Settings, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  ShieldCheck, 
  RotateCcw,
  Clock,
  Banknote
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { storeSettings, updateStoreSettings, resetToDefaultData, showToast } = useStore();

  const [form, setForm] = useState({
    storeName: storeSettings.storeName,
    ownerName: storeSettings.ownerName,
    email: storeSettings.email,
    phone: storeSettings.phone,
    locationUrl: storeSettings.locationUrl,
    addressText: storeSettings.addressText,
    upiId: storeSettings.upiId,
    freeDeliveryThreshold: storeSettings.freeDeliveryThreshold,
    standardDeliveryFee: storeSettings.standardDeliveryFee,
    openingHours: storeSettings.openingHours,
    isStoreOpen: storeSettings.isStoreOpen
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      ...form,
      freeDeliveryThreshold: Number(form.freeDeliveryThreshold),
      standardDeliveryFee: Number(form.standardDeliveryFee)
    });
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-heading">
            Store Profile & Operating Rules
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure contact info, Google Maps coordinates, delivery thresholds, and payment UPI
          </p>
        </div>

        <button
          onClick={resetToDefaultData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand & Owner */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            Store Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Owner / Manager Name
              </label>
              <input
                type="text"
                required
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Contact & Google Maps Location (Exact required parameters) */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-800" />
            <span>Contact & Map Location Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>Contact Email *</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
              />
              <span className="text-[10px] text-stone-400">Current: raghunathn783@gmail.com</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Phone Helpline *</span>
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
              />
              <span className="text-[10px] text-stone-400">Current: 9035143783</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-stone-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Google Maps Location URL *</span>
              </label>
              <a
                href={form.locationUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-800 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="url"
              required
              value={form.locationUrl}
              onChange={(e) => setForm({ ...form, locationUrl: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
            />
            <span className="text-[10px] text-stone-400">Direct location: https://maps.app.goo.gl/251CN717yYCp2KuV7?g_st=aw</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Store Physical Address
            </label>
            <input
              type="text"
              required
              value={form.addressText}
              onChange={(e) => setForm({ ...form, addressText: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
            />
          </div>
        </div>

        {/* Operating Hours & Payment UPI */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            Operations & Payment Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Operating Timings</span>
              </label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-stone-400" />
                <span>UPI ID (for QR payment)</span>
              </label>
              <input
                type="text"
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={form.freeDeliveryThreshold}
                onChange={(e) => setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
              />
              <span className="text-[10px] text-stone-400">Cart values &ge; this amount get zero delivery fee.</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Standard Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={form.standardDeliveryFee}
                onChange={(e) => setForm({ ...form, standardDeliveryFee: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </form>
    </div>
  );
};
