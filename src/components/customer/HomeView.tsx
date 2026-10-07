import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight, Leaf, Sparkles, Clock, ShieldCheck, MapPin, Phone, ChevronRight } from 'lucide-react';
import { CategoryId } from '../../types';

export const HomeView: React.FC = () => {
  const { 
    products, 
    categories, 
    setSelectedCategory, 
    setCustomerPage, 
    storeSettings 
  } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const seasonalPicks = products.filter((p) => p.isSeasonal);

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setCustomerPage('products');
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Section 1: Hero Showcase */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-stone-900 to-stone-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Zone */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-900/40 border border-emerald-700/50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Morning Harvests Now Live · Same Day Doorstep Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-heading leading-[1.1] text-balance">
              Pure farm harvest, delivered fresh to your kitchen doorstep.
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Harvested at dawn from local Karnataka partner farms in Kolar and Malur. Crisp greens, heirloom country tomatoes, naturally ripened fruits, and pure Desi cow A2 milk.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCustomerPage('products')}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-98 flex items-center gap-2"
              >
                <span>Shop Today's Fresh Harvest</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCustomerPage('contact')}
                className="px-5 py-3.5 bg-stone-800/80 hover:bg-stone-800 text-white border border-stone-700 font-medium text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Visit Farm Store</span>
              </button>
            </div>

            {/* Quiet Real Trust Indicators with Unboxed Typographic Separators */}
            <div className="pt-6 border-t border-stone-800 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-400">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Cold Storage</span>
              </span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dawn Harvest (04:30 AM)</span>
              </span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chemical Residue Free</span>
              </span>
            </div>
          </div>

          {/* Right Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Today's Spotlight</span>
                  <h3 className="text-lg font-bold text-white font-heading mt-0.5">Farm Fresh Palak & Nati Tomato</h3>
                </div>
                <span className="font-mono text-emerald-400 text-sm font-bold bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  ₹24 onwards
                </span>
              </div>

              {/* Showcase visual basket representation */}
              <div className="h-52 bg-stone-950/70 rounded-2xl flex items-center justify-center p-4 border border-stone-800/80 relative overflow-hidden group">
                <div className="text-center space-y-2">
                  <div className="flex justify-center items-center gap-3 text-5xl">
                    <span className="animate-bounce" style={{ animationDuration: '3s' }}>🥬</span>
                    <span className="animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}>🍅</span>
                    <span className="animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.4s' }}>🥛</span>
                    <span className="animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '0.1s' }}>🥭</span>
                  </div>
                  <p className="text-xs text-stone-400 font-medium pt-2">
                    Hand-harvested within the last 6 hours
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5 text-xs text-stone-300">
                <div className="flex justify-between py-1.5 border-b border-stone-800">
                  <span className="text-stone-400">Current Harvest Batch</span>
                  <span className="font-medium text-stone-200">Batch #RF-0710 (Morning)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-800">
                  <span className="text-stone-400">Direct Farm Origins</span>
                  <span className="font-medium text-stone-200">Kolar & Malur Organic Belts</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-400">Direct Helpline</span>
                  <a href={`tel:${storeSettings.phone}`} className="font-mono text-emerald-400 font-bold hover:underline">
                    {storeSettings.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Explore by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Produce Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-heading mt-1">
              Shop by Fresh Harvest
            </h2>
          </div>
          <button
            onClick={() => setCustomerPage('categories')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const catEmoji = cat.id === 'leafy-greens' ? '🥬' :
                             cat.id === 'vegetables' ? '🥕' :
                             cat.id === 'fruits' ? '🥭' :
                             cat.id === 'dairy-eggs' ? '🥛' : '🌾';
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group p-5 bg-white border border-stone-200/90 hover:border-emerald-700/80 rounded-2xl cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-2xl flex items-center justify-center transition-colors">
                    {catEmoji}
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm mt-3 group-hover:text-emerald-900 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  {cat.kannadaName && (
                    <p className="text-[11px] text-stone-400 mt-0.5 font-normal">
                      {cat.kannadaName}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>{cat.badge}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-emerald-800 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Featured Harvest Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Today's Dawn Harvest
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-heading mt-1">
              Popular Daily Essentials
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCustomerPage('products');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-800 rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Section 4: The Raghu Fresh Story & Direct Farmer Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Our Farming Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white text-balance">
              Why produce from Raghu Fresh tastes completely different.
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed max-w-2xl">
              Commercial supermarkets harvest vegetables green, hold them in cold storage warehouses for weeks, and wax them for shelf life. At Raghu Fresh, produce is harvested after your order or in early morning batches. By avoiding weeks in cold rooms, natural sugars, vitamins, and aroma remain 100% intact.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
                <span className="text-2xl font-bold text-white font-mono block">100%</span>
                <span className="text-xs text-stone-400 mt-1 block">Carbide & synthetic wax free</span>
              </div>
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
                <span className="text-2xl font-bold text-white font-mono block">&lt; 6 hrs</span>
                <span className="text-xs text-stone-400 mt-1 block">Farm harvest to delivery window</span>
              </div>
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
                <span className="text-2xl font-bold text-white font-mono block">₹299+</span>
                <span className="text-xs text-stone-400 mt-1 block">Free delivery across city</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-stone-800 rounded-2xl p-6 border border-stone-700 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-900/80 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              📞
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Have Special Farm Requests?</h3>
              <p className="text-xs text-stone-400 mt-1">
                Speak directly with farm manager Raghunath N for fresh harvest bookings.
              </p>
            </div>
            <a
              href={`tel:${storeSettings.phone}`}
              className="inline-block w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-md"
            >
              Call +91 {storeSettings.phone}
            </a>
            <p className="text-[11px] text-stone-400">
              Email: {storeSettings.email}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
