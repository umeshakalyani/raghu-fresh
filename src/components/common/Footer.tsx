import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake, Truck, Leaf, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { storeSettings, setCustomerPage, setActivePortal } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* 4 Pillars Trust Bar */}
      <div className="border-b border-stone-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Harvested Daily at 5 AM</h4>
              <p className="text-xs text-stone-400 mt-1">Direct from partnered natural farms in Kolar & Malur.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Same-Day Door Delivery</h4>
              <p className="text-xs text-stone-400 mt-1">Temperature-preserved eco-crates to preserve freshness.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Quality Guarantee</h4>
              <p className="text-xs text-stone-400 mt-1">No questions asked instant replacement or refund.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Fair Farmer Pricing</h4>
              <p className="text-xs text-stone-400 mt-1">80%+ consumer rupee goes directly to local farming families.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Contact Info */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand & Mission */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-base font-heading">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-heading">
              RAGHU FRESH
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Raghu Fresh brings pure, nutrient-dense farm harvests straight to Bengaluru kitchens. Zero middleman markups, zero cold-storage holding, 100% fresh natural goodness.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-emerald-400 font-medium">Accepting fresh harvest orders now</span>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Catalog</h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <button 
                onClick={() => { setActivePortal('customer'); setCustomerPage('products'); }} 
                className="hover:text-emerald-400 transition-colors"
              >
                All Produce
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActivePortal('customer'); setCustomerPage('categories'); }} 
                className="hover:text-emerald-400 transition-colors"
              >
                Leafy Greens
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActivePortal('customer'); setCustomerPage('categories'); }} 
                className="hover:text-emerald-400 transition-colors"
              >
                Desi Cow A2 Milk
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActivePortal('customer'); setCustomerPage('categories'); }} 
                className="hover:text-emerald-400 transition-colors"
              >
                Seasonal Fruits
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActivePortal('customer'); setCustomerPage('orders'); }} 
                className="hover:text-emerald-400 transition-colors"
              >
                Track My Order
              </button>
            </li>
          </ul>
        </div>

        {/* Store Timings */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Store Hours</h4>
          <div className="space-y-2 text-xs text-stone-400">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-stone-200 font-medium">{storeSettings.openingHours}</p>
                <p className="text-stone-500 text-[11px] mt-0.5">Morning harvest slots dispatch from 06:30 AM</p>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setActivePortal('admin')}
                className="text-[11px] text-stone-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors underline"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Store Admin Portal
              </button>
            </div>
          </div>
        </div>

        {/* Contact & Location Info (Exact requested details) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Contact & Farm Store</h4>
          <div className="space-y-2.5 text-xs text-stone-300">
            {/* Phone */}
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex items-center gap-2">
                <a 
                  href={`tel:${storeSettings.phone}`} 
                  className="font-mono hover:text-white transition-colors"
                >
                  +91 {storeSettings.phone}
                </a>
                <span className="text-stone-600">/</span>
                <a 
                  href={`https://wa.me/91${storeSettings.phone}?text=Hello%20Raghu%20Fresh%2C%20I%20would%20like%20to%20order%20fresh%20produce.`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <a 
                href={`mailto:${storeSettings.email}`}
                className="hover:text-white transition-colors"
              >
                {storeSettings.email}
              </a>
            </div>

            {/* Google Maps Location */}
            <div className="flex items-start gap-2.5 pt-1">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-stone-200">{storeSettings.addressText}</p>
                <a 
                  href={storeSettings.locationUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 mt-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-stone-800 py-4 px-4 sm:px-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} RAGHU FRESH. All rights reserved.</p>
          <p className="text-stone-500">
            Owner & Operations: Raghunath N · Phone: {storeSettings.phone} · Email: {storeSettings.email}
          </p>
        </div>
      </div>
    </footer>
  );
};
