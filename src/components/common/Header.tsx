import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, ShieldCheck, MapPin, Phone, Search, Menu, X, User, ChevronDown, Check } from 'lucide-react';
import { CustomerPage } from '../../types';

export const Header: React.FC = () => {
  const { 
    customerPage, 
    setCustomerPage, 
    activePortal, 
    setActivePortal, 
    cartCount, 
    setIsCartDrawerOpen, 
    storeSettings,
    searchQuery,
    setSearchQuery,
    currentUser,
    openAuthModal,
    switchDemoCustomer
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navLinks: { label: string; page: CustomerPage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Products', page: 'products' },
    { label: 'Categories', page: 'categories' },
    { label: 'My Orders', page: 'orders' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: CustomerPage) => {
    setActivePortal('customer');
    setCustomerPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Bar (Slim, <= 36px) */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Fresh Morning Harvest
            </span>
            <span className="text-stone-500 hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline text-stone-300">
              Free delivery on orders above ₹{storeSettings.freeDeliveryThreshold}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <a 
              href={`tel:${storeSettings.phone}`} 
              className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span className="font-mono">{storeSettings.phone}</span>
            </a>
            <span className="text-stone-600 hidden md:inline" aria-hidden="true">·</span>
            <a 
              href={storeSettings.locationUrl} 
              target="_blank" 
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 text-stone-300 hover:text-white transition-colors"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Bangalore Store</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Top Bar: 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Mark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-emerald-600"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-lg font-heading group-hover:bg-emerald-900 transition-colors shadow-xs">
              R
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 font-heading block leading-none">
                RAGHU FRESH
              </span>
              <span className="text-[10px] tracking-wider uppercase text-emerald-800 font-semibold block mt-0.5">
                Farm to Door
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          {navLinks.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`hover:text-emerald-800 transition-colors relative py-1 text-sm whitespace-nowrap ${
                activePortal === 'customer' && customerPage === item.page
                  ? 'text-emerald-800 font-semibold'
                  : 'text-stone-600'
              }`}
            >
              {item.label}
              {activePortal === 'customer' && customerPage === item.page && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions (Search, Cart & Admin Portal Switcher) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={() => {
              setActivePortal('customer');
              setCustomerPage('search');
            }}
            className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors"
            title="Search Products"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Customer Account Button (Supabase Auth) */}
          <div className="relative">
            {currentUser ? (
              <div className="flex items-center">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Your Customer Account"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                    {currentUser.name || currentUser.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-emerald-700" />
                </button>

                {accountMenuOpen && (
                  <div 
                    className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 text-xs space-y-1 animate-in fade-in-50 duration-100"
                    onMouseLeave={() => setAccountMenuOpen(false)}
                  >
                    <div className="p-2 bg-stone-50 rounded-lg border border-stone-100 mb-1">
                      <p className="font-bold text-stone-900 truncate">{currentUser.name || 'Customer'}</p>
                      <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                      <p className="text-[9px] font-mono text-emerald-800 truncate mt-0.5">
                        auth.uid: {currentUser.id.slice(0, 12)}...
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        handleNavClick('orders');
                        setAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 rounded-md font-medium cursor-pointer"
                    >
                      My Farm Orders
                    </button>

                    <div className="pt-1 border-t border-stone-100">
                      <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-2 block mb-1">
                        Quick Switch (Testing RLS)
                      </span>
                      <button
                        onClick={() => {
                          switchDemoCustomer('A');
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-stone-50 text-stone-700 rounded-md flex items-center justify-between cursor-pointer"
                      >
                        <span>Customer A (Ananya)</span>
                        {currentUser.email.includes('ananya') && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>
                      <button
                        onClick={() => {
                          switchDemoCustomer('B');
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-stone-50 text-stone-700 rounded-md flex items-center justify-between cursor-pointer"
                      >
                        <span>Customer B (Rahul)</span>
                        {currentUser.email.includes('rahul') && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        onClick={() => {
                          openAuthModal('login');
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-rose-700 hover:bg-rose-50 rounded-md font-medium cursor-pointer"
                      >
                        Switch Account / Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Customer Sign In"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>

          {/* Cart Bag Drawer Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-900 rounded-lg transition-colors text-xs font-semibold"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-800" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-emerald-800 text-white rounded text-[11px]">
              {cartCount}
            </span>
          </button>

          {/* Admin Switcher Action */}
          <button
            onClick={() => {
              setActivePortal(activePortal === 'admin' ? 'customer' : 'admin');
            }}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activePortal === 'admin'
                ? 'bg-stone-900 text-stone-100 hover:bg-stone-800'
                : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-xs'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{activePortal === 'admin' ? 'Customer View' : 'Admin Portal'}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                activePortal === 'customer' && customerPage === item.page
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Helpline: {storeSettings.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <a href={storeSettings.locationUrl} target="_blank" rel="noreferrer" className="text-emerald-800 underline">
                View Farm Store on Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
