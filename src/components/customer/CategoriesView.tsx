import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { CategoryId } from '../../types';

export const CategoriesView: React.FC = () => {
  const { categories, products, setSelectedCategory, setCustomerPage } = useStore();

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setCustomerPage('products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Harvest Taxonomy
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-heading">
          Explore by Farm Category
        </h1>
        <p className="text-stone-600 text-sm">
          Everything harvested locally with direct farm transparency and certified organic standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const categoryProducts = products.filter((p) => p.category === cat.id);
          const catEmoji = cat.id === 'leafy-greens' ? '🥬' :
                           cat.id === 'vegetables' ? '🥕' :
                           cat.id === 'fruits' ? '🥭' :
                           cat.id === 'dairy-eggs' ? '🥛' : '🌾';

          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="group bg-white border border-stone-200/90 hover:border-emerald-700/80 rounded-2xl p-6 cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50/80 group-hover:bg-emerald-100 text-3xl flex items-center justify-center transition-colors">
                    {catEmoji}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-100 text-stone-700">
                    {categoryProducts.length} items
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-bold text-stone-900 font-heading group-hover:text-emerald-900 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.kannadaName && (
                    <p className="text-xs text-stone-400 font-normal mt-0.5">
                      {cat.kannadaName}
                    </p>
                  )}
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Sample items preview */}
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1.5">
                    Popular in this harvest:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryProducts.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="text-xs text-stone-600 bg-stone-50 px-2 py-0.5 rounded border border-stone-100"
                      >
                        {item.name.split('(')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
