import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, CategoryId } from '../../types';
import { ProductImage } from '../common/ProductImage';
import { PRESET_GROCERY_PHOTOS, getRealisticProductImage } from '../../data/productImages';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Database, 
  Save, 
  Image as ImageIcon, 
  Upload, 
  Wand2, 
  CheckCircle2, 
  Layers,
  Tag,
  Boxes,
  Camera,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    updateProductPrice, 
    toggleProductAvailability, 
    deleteProduct, 
    showToast 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Dedicated Change Image Modal
  const [changeImageProduct, setChangeImageProduct] = useState<Product | null>(null);
  const [changeImageUrl, setChangeImageUrl] = useState('');
  const [changeImageUrlError, setChangeImageUrlError] = useState('');
  const [isTestingChangeUrl, setIsTestingChangeUrl] = useState(false);

  // Dedicated Quick Price Modal
  const [priceModalProduct, setPriceModalProduct] = useState<Product | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState(0);
  const [quickOriginalPriceVal, setQuickOriginalPriceVal] = useState(0);

  // Dedicated Stock Modal
  const [stockModalProduct, setStockModalProduct] = useState<Product | null>(null);
  const [quickStockVal, setQuickStockVal] = useState(0);
  const [quickThresholdVal, setQuickThresholdVal] = useState(10);
  const [quickAvailability, setQuickAvailability] = useState(true);

  // Photo library picker modal state
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [photoSearch, setPhotoSearch] = useState('');
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState<string>('all');
  const [photoPickerTarget, setPhotoPickerTarget] = useState<'form' | 'changeImageModal'>('form');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const changeImageFileInputRef = useRef<HTMLInputElement>(null);

  // Inline Price Editing State (quick double-click inline)
  const [inlinePrices, setInlinePrices] = useState<{ [id: string]: number }>({});
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    kannadaName: '',
    category: 'vegetables' as CategoryId,
    price: 30,
    originalPrice: 40,
    unit: '500 g',
    stock: 50,
    lowStockThreshold: 10,
    isAvailable: true,
    isOrganic: true,
    isSeasonal: false,
    isFeatured: false,
    description: '',
    origin: 'Kolar Organic Belt',
    nutritionHighlights: 'Natural Nutrients • Farm Fresh',
    imageUrl: ''
  });

  const [formUrlError, setFormUrlError] = useState('');
  const [isTestingFormUrl, setIsTestingFormUrl] = useState(false);

  // Validate and optimize image upload
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 1. File size check (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size exceeds 5MB limit. Please select a smaller photo.'));
        return;
      }
      if (file.size === 0) {
        reject(new Error('Selected image file is empty.'));
        return;
      }

      // 2. File type check (JPG, JPEG, PNG, WEBP)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        reject(new Error('Unsupported file format. Please upload JPG, JPEG, PNG, or WEBP.'));
        return;
      }

      // 3. Read and resize with offscreen canvas to keep storage lightweight (<120KB)
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(optimizedDataUrl);
          } else {
            resolve(readerEvent.target?.result as string);
          }
        };
        img.onerror = () => reject(new Error('Unable to parse the image file.'));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read image file from disk.'));
      reader.readAsDataURL(file);
    });
  };

  // Test if an image URL loads successfully
  const testImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const cleanUrl = url.trim();
      if (!cleanUrl) {
        resolve(false);
        return;
      }
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = cleanUrl;
    });
  };

  const handleTestFormUrl = async () => {
    if (!formData.imageUrl.trim()) {
      setFormUrlError('Please enter an image URL first');
      return;
    }
    setIsTestingFormUrl(true);
    setFormUrlError('');
    const isValid = await testImageUrl(formData.imageUrl);
    setIsTestingFormUrl(false);
    if (!isValid) {
      setFormUrlError('Unable to load image. Please choose another image.');
      showToast('Unable to load image. Please choose another image.', 'error');
    } else {
      setFormUrlError('');
      showToast('Image URL verified successfully!', 'success');
    }
  };

  const handleTestChangeModalUrl = async () => {
    if (!changeImageUrl.trim()) {
      setChangeImageUrlError('Please enter an image URL first');
      return;
    }
    setIsTestingChangeUrl(true);
    setChangeImageUrlError('');
    const isValid = await testImageUrl(changeImageUrl);
    setIsTestingChangeUrl(false);
    if (!isValid) {
      setChangeImageUrlError('Unable to load image. Please choose another image.');
      showToast('Unable to load image. Please choose another image.', 'error');
    } else {
      setChangeImageUrlError('');
      showToast('Image URL verified successfully!', 'success');
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) || 
        p.kannadaName?.toLowerCase().includes(q) || 
        p.origin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormUrlError('');
    setFormData({
      name: '',
      kannadaName: '',
      category: 'vegetables',
      price: 35,
      originalPrice: 45,
      unit: '500 g',
      stock: 40,
      lowStockThreshold: 10,
      isAvailable: true,
      isOrganic: true,
      isSeasonal: false,
      isFeatured: false,
      description: 'Handpicked fresh early morning harvest directly from partner groves.',
      origin: 'Kolar Organic Belt',
      nutritionHighlights: 'High Micronutrients • 100% Residue-Free',
      imageUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormUrlError('');
    setFormData({
      name: product.name,
      kannadaName: product.kannadaName || '',
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      unit: product.unit,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold || 10,
      isAvailable: product.isAvailable !== false,
      isOrganic: product.isOrganic,
      isSeasonal: !!product.isSeasonal,
      isFeatured: !!product.isFeatured,
      description: product.description,
      origin: product.origin,
      nutritionHighlights: product.nutritionHighlights,
      imageUrl: product.imageUrl || getRealisticProductImage(product.name, product.category)
    });
    setIsModalOpen(true);
  };

  // Open Dedicated Change Image Modal
  const handleOpenChangeImageModal = (product: Product) => {
    setChangeImageProduct(product);
    setChangeImageUrl(product.imageUrl || getRealisticProductImage(product.name, product.category));
    setChangeImageUrlError('');
  };

  // Save Dedicated Change Image Modal
  const handleSaveChangeImageModal = async () => {
    if (!changeImageProduct) return;
    
    // If URL is provided, validate it
    if (changeImageUrl.trim()) {
      const isValid = await testImageUrl(changeImageUrl);
      if (!isValid) {
        setChangeImageUrlError('Unable to load image. Please choose another image.');
        showToast('Unable to load image. Please choose another image.', 'error');
        return;
      }
    }

    updateProduct(changeImageProduct.id, {
      imageUrl: changeImageUrl.trim()
    });
    showToast(`Updated photo for "${changeImageProduct.name}"!`, 'success');
    setChangeImageProduct(null);
  };

  // Open Dedicated Quick Price Modal
  const handleOpenQuickPriceModal = (product: Product) => {
    setPriceModalProduct(product);
    setQuickPriceVal(product.price);
    setQuickOriginalPriceVal(product.originalPrice || product.price);
  };

  const handleSaveQuickPrice = () => {
    if (!priceModalProduct) return;
    if (quickPriceVal < 0) {
      showToast('Price cannot be negative', 'warning');
      return;
    }
    updateProductPrice(priceModalProduct.id, quickPriceVal);
    if (quickOriginalPriceVal !== priceModalProduct.originalPrice) {
      updateProduct(priceModalProduct.id, { originalPrice: quickOriginalPriceVal });
    }
    showToast(`Updated price for "${priceModalProduct.name}" to ₹${quickPriceVal}`, 'success');
    setPriceModalProduct(null);
  };

  // Open Dedicated Stock Modal
  const handleOpenStockModal = (product: Product) => {
    setStockModalProduct(product);
    setQuickStockVal(product.stock);
    setQuickThresholdVal(product.lowStockThreshold || 10);
    setQuickAvailability(product.isAvailable !== false);
  };

  const handleSaveQuickStock = () => {
    if (!stockModalProduct) return;
    updateProduct(stockModalProduct.id, {
      stock: Math.max(0, quickStockVal),
      lowStockThreshold: Math.max(1, quickThresholdVal),
      isAvailable: quickStockVal > 0 ? quickAvailability : false
    });
    showToast(`Stock updated for "${stockModalProduct.name}"!`, 'success');
    setStockModalProduct(null);
  };

  const handleAutoSuggestPhoto = () => {
    if (!formData.name.trim()) {
      showToast('Please type a product name first', 'warning');
      return;
    }
    const matchedPhoto = getRealisticProductImage(formData.name, formData.category);
    setFormData((prev) => ({ ...prev, imageUrl: matchedPhoto }));
    setFormUrlError('');
    showToast('Auto-matched realistic grocery photograph!', 'success');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await processImageFile(file);
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      setFormUrlError('');
      showToast('Product photo uploaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error processing image', 'error');
    }
  };

  const handleChangeImageModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await processImageFile(file);
      setChangeImageUrl(dataUrl);
      setChangeImageUrlError('');
      showToast('Product photo uploaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error processing image', 'error');
    }
  };

  const handleSelectPresetPhoto = (url: string, name: string) => {
    if (photoPickerTarget === 'form') {
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      setFormUrlError('');
    } else {
      setChangeImageUrl(url);
      setChangeImageUrlError('');
    }
    setIsPhotoPickerOpen(false);
    showToast(`Assigned realistic photo for "${name}"`, 'success');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a product name', 'warning');
      return;
    }

    // Check if custom URL was typed and is broken
    if (formData.imageUrl.trim() && formData.imageUrl.startsWith('http')) {
      const isValid = await testImageUrl(formData.imageUrl);
      if (!isValid) {
        setFormUrlError('Unable to load image. Please choose another image.');
        showToast('Unable to load image. Please choose another image.', 'error');
        return;
      }
    }

    const finalPhoto = formData.imageUrl.trim() || getRealisticProductImage(formData.name, formData.category);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name.trim(),
        kannadaName: formData.kannadaName.trim(),
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        unit: formData.unit.trim(),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        isAvailable: formData.isAvailable,
        isOrganic: formData.isOrganic,
        isSeasonal: formData.isSeasonal,
        isFeatured: formData.isFeatured,
        description: formData.description.trim(),
        origin: formData.origin.trim(),
        nutritionHighlights: formData.nutritionHighlights.trim(),
        imageUrl: finalPhoto
      });
      showToast(`Updated "${formData.name}" with realistic photo`, 'success');
    } else {
      addProduct({
        name: formData.name.trim(),
        kannadaName: formData.kannadaName.trim(),
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        unit: formData.unit.trim(),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        isAvailable: formData.isAvailable,
        isOrganic: formData.isOrganic,
        isSeasonal: formData.isSeasonal,
        isFeatured: formData.isFeatured,
        description: formData.description.trim(),
        origin: formData.origin.trim(),
        nutritionHighlights: formData.nutritionHighlights.trim(),
        imageUrl: finalPhoto,
        colorScheme: {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          badge: 'bg-emerald-800 text-white'
        }
      });
      showToast(`Added "${formData.name}" to store catalog`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleSaveInlinePrice = (id: string) => {
    const newPrice = inlinePrices[id];
    if (newPrice !== undefined && !isNaN(newPrice) && newPrice >= 0) {
      updateProductPrice(id, newPrice);
      setEditingPriceId(null);
      showToast('Price updated successfully', 'success');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from store catalog?`)) {
      deleteProduct(id);
    }
  };

  // Filtered preset photos in library modal
  const filteredPresets = PRESET_GROCERY_PHOTOS.filter((p) => {
    if (photoCategoryFilter !== 'all' && p.category !== photoCategoryFilter) return false;
    if (photoSearch.trim()) {
      const q = photoSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
    }
    return true;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900 font-heading">
              Products Catalog ({products.length})
            </h1>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Realistic Grocery Photos Active</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Complete store produce: Fruits ({products.filter(p => p.category === 'fruits').length}), Vegetables ({products.filter(p => p.category === 'vegetables').length}), Leafy Greens ({products.filter(p => p.category === 'leafy-greens').length}), Dairy & Staples ({products.filter(p => p.category === 'dairy-eggs' || p.category === 'organic-staples').length})
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter(p => p.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search produce name, origin, or Kannada..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-lg focus:outline-emerald-800 text-stone-900"
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* COMPLETE ADMIN PRODUCT TABLE */}
      {/* Image | Product Name | Category | Price | Unit | Stock | Status | Actions */}
      {/* Actions: Edit, Quick Price, Stock, Change Image, Delete */}
      {/* ==================================================== */}
      <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredProducts.map((p) => {
                const isEditingPrice = editingPriceId === p.id;
                const currentInlinePrice = inlinePrices[p.id] !== undefined ? inlinePrices[p.id] : p.price;
                const isLow = p.stock <= (p.lowStockThreshold || 10) && p.stock > 0;
                const isOutOfStock = p.stock <= 0 || p.isAvailable === false;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* 1. Image (Real Product Photograph) */}
                    <td className="py-3 px-4">
                      <div 
                        onClick={() => handleOpenChangeImageModal(p)}
                        className="w-12 h-12 rounded-lg bg-stone-50 border border-stone-200/90 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs cursor-pointer hover:border-emerald-600 transition-colors group relative"
                        title="Click to Change Image"
                      >
                        <ProductImage 
                          src={p.imageUrl} 
                          alt={p.name} 
                          className="w-full h-full object-contain" 
                        />
                        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Camera className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </td>

                    {/* 2. Product Name */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 leading-tight">{p.name}</span>
                          {p.isFeatured && (
                            <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-0.5">
                          {p.kannadaName && <span>{p.kannadaName} ·</span>}
                          <span>{p.origin}</span>
                          {p.isOrganic && <span className="text-emerald-700 font-semibold">· Organic</span>}
                        </div>
                      </div>
                    </td>

                    {/* 3. Category */}
                    <td className="py-3 px-4 text-stone-600 capitalize">
                      {p.category.replace('-', ' ')}
                    </td>

                    {/* 4. Price */}
                    <td className="py-3 px-4">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1">
                          <span className="text-stone-400 font-mono">₹</span>
                          <input
                            type="number"
                            min="0"
                            autoFocus
                            value={currentInlinePrice}
                            onChange={(e) => setInlinePrices({ ...inlinePrices, [p.id]: Number(e.target.value) })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveInlinePrice(p.id);
                              if (e.key === 'Escape') setEditingPriceId(null);
                            }}
                            className="w-16 px-1.5 py-1 text-xs font-mono font-bold border border-emerald-600 rounded bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveInlinePrice(p.id)}
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Save price"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenQuickPriceModal(p)}
                            className="group flex items-baseline gap-1 text-left cursor-pointer"
                            title="Click to edit price"
                          >
                            <span className="font-mono font-bold text-stone-900 text-sm group-hover:text-emerald-700 transition-colors">
                              ₹{p.price}
                            </span>
                            {p.originalPrice > p.price && (
                              <span className="font-mono text-[10px] text-stone-400 line-through">
                                ₹{p.originalPrice}
                              </span>
                            )}
                          </button>
                        </div>
                      )}
                    </td>

                    {/* 5. Unit */}
                    <td className="py-3 px-4 font-mono font-medium text-stone-900">
                      {p.unit}
                    </td>

                    {/* 6. Stock */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleOpenStockModal(p)}
                        className="cursor-pointer hover:underline text-left"
                        title="Click to change stock"
                      >
                        <span className={`font-mono font-bold ${isOutOfStock ? 'text-rose-600' : isLow ? 'text-amber-700' : 'text-stone-800'}`}>
                          {p.stock}
                        </span>
                        <span className="text-[10px] text-stone-400 block font-normal">
                          thresh: {p.lowStockThreshold || 10}
                        </span>
                      </button>
                    </td>

                    {/* 7. Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleProductAvailability(p.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold tracking-wide transition-colors cursor-pointer ${
                          !p.isAvailable || p.stock <= 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isLow
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${!p.isAvailable || p.stock <= 0 ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span>
                          {!p.isAvailable || p.stock <= 0 ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                        </span>
                      </button>
                    </td>

                    {/* 8. Actions (Edit, Quick Price, Stock, Change Image, Delete) */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Price */}
                        <button
                          onClick={() => handleOpenQuickPriceModal(p)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                          title="Quick Price"
                        >
                          <Tag className="w-3.5 h-3.5" />
                        </button>

                        {/* Stock */}
                        <button
                          onClick={() => handleOpenStockModal(p)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                          title="Stock Management"
                        >
                          <Boxes className="w-3.5 h-3.5" />
                        </button>

                        {/* Change Image */}
                        <button
                          onClick={() => handleOpenChangeImageModal(p)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                          title="Change Product Image"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================== */}
      {/* DEDICATED CHANGE PRODUCT IMAGE MODAL */}
      {/* ==================================================== */}
      {changeImageProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900 font-heading flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-800" />
                  <span>Change Product Image: {changeImageProduct.name}</span>
                </h2>
                <p className="text-xs text-stone-500">
                  Update with clear, realistic grocery store photography
                </p>
              </div>
              <button
                onClick={() => setChangeImageProduct(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Image Preview Box */}
              <div className="text-center">
                <span className="text-xs font-semibold text-stone-700 block mb-2">
                  Current Product Image Preview:
                </span>
                <div className="w-44 h-44 mx-auto rounded-xl bg-white border-2 border-stone-200/90 p-3 flex items-center justify-center overflow-hidden shadow-xs relative">
                  <ProductImage 
                    src={changeImageUrl} 
                    alt={changeImageProduct.name} 
                    className="w-full h-full object-contain" 
                  />
                  {changeImageUrl && (
                    <span className="absolute bottom-1.5 bg-stone-900/70 text-white text-[9px] px-2 py-0.5 rounded">
                      Live Preview
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Choose Image, Remove Image, Library, Auto-Match */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {/* Choose Image from Computer */}
                <button
                  type="button"
                  onClick={() => changeImageFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Image</span>
                </button>

                <input
                  ref={changeImageFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleChangeImageModalFileUpload}
                />

                {/* Remove Image */}
                <button
                  type="button"
                  onClick={() => {
                    setChangeImageUrl('');
                    setChangeImageUrlError('');
                    showToast('Removed custom image (shows clean fallback)', 'info');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>

                {/* Browse Library */}
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPickerTarget('changeImageModal');
                    setIsPhotoPickerOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-stone-500" />
                  <span>Browse Library</span>
                </button>

                {/* Auto Match */}
                <button
                  type="button"
                  onClick={() => {
                    const matched = getRealisticProductImage(changeImageProduct.name, changeImageProduct.category);
                    setChangeImageUrl(matched);
                    setChangeImageUrlError('');
                    showToast('Matched realistic produce photo', 'success');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Auto-Match</span>
                </button>
              </div>

              {/* Image URL Input Option with Preview Button */}
              <div className="pt-2 border-t border-stone-100 space-y-1.5">
                <label className="block text-xs font-medium text-stone-700">
                  Or Paste Image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={changeImageUrl}
                    onChange={(e) => {
                      setChangeImageUrl(e.target.value);
                      setChangeImageUrlError('');
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 text-xs px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTestChangeModalUrl}
                    disabled={isTestingChangeUrl}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                  >
                    {isTestingChangeUrl ? 'Testing...' : 'Preview'}
                  </button>
                </div>

                {/* Error message if broken URL */}
                {changeImageUrlError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{changeImageUrlError}</span>
                  </p>
                )}
                <p className="text-[10px] text-stone-400">
                  Supported formats: JPG, JPEG, PNG, WEBP.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setChangeImageProduct(null)}
                className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg text-xs font-semibold hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChangeImageModal}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save New Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* QUICK PRICE MODAL */}
      {/* ==================================================== */}
      {priceModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 font-heading">
                  Quick Price: {priceModalProduct.name}
                </h2>
                <p className="text-[11px] text-stone-500">
                  Selling unit: {priceModalProduct.unit}
                </p>
              </div>
              <button
                onClick={() => setPriceModalProduct(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Selling Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-stone-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    autoFocus
                    value={quickPriceVal}
                    onChange={(e) => setQuickPriceVal(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-base font-mono font-bold border border-emerald-600 rounded-lg focus:outline-emerald-800 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  MRP / Strike Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-stone-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={quickOriginalPriceVal}
                    onChange={(e) => setQuickOriginalPriceVal(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm font-mono border border-stone-200 rounded-lg focus:outline-emerald-800 text-stone-900"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800">
                Customer website updates price immediately without reload.
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPriceModalProduct(null)}
                className="px-3 py-1.5 border border-stone-200 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickPrice}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* QUICK STOCK MODAL */}
      {/* ==================================================== */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 font-heading">
                  Stock Management: {stockModalProduct.name}
                </h2>
                <p className="text-[11px] text-stone-500">
                  Update inventory levels and availability
                </p>
              </div>
              <button
                onClick={() => setStockModalProduct(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Stock Quantity (units)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    autoFocus
                    value={quickStockVal}
                    onChange={(e) => setQuickStockVal(Number(e.target.value))}
                    className="flex-1 px-3 py-2 text-base font-mono font-bold border border-stone-200 rounded-lg focus:outline-emerald-800 text-stone-900"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setQuickStockVal(prev => prev + 10)}
                      className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono font-semibold rounded"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickStockVal(prev => prev + 50)}
                      className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono font-semibold rounded"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickStockVal(0);
                        setQuickAvailability(false);
                      }}
                      className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium rounded"
                    >
                      Zero
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Low-Stock Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={quickThresholdVal}
                  onChange={(e) => setQuickThresholdVal(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono border border-stone-200 rounded-lg focus:outline-emerald-800 text-stone-900"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={quickAvailability && quickStockVal > 0}
                    disabled={quickStockVal <= 0}
                    onChange={(e) => setQuickAvailability(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span className="font-semibold text-stone-800">
                    {quickStockVal <= 0 ? 'Automatically Marked OUT OF STOCK' : 'Available for Customers to Order'}
                  </span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setStockModalProduct(null)}
                className="px-3 py-1.5 border border-stone-200 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickStock}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ==================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-heading">
                  {editingProduct ? 'Edit Product & Photograph' : 'Add New Produce to Catalog'}
                </h2>
                <p className="text-xs text-stone-500">
                  Update grocery details, farm pricing, and real photographic product image
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {/* ==================================================== */}
              {/* PRODUCT IMAGE SECTION */}
              {/* [Upload Image] / [Choose Image] */}
              {/* [Remove Image] */}
              {/* [Image URL] with [Preview] button */}
              {/* Image Preview */}
              {/* Validation error display if broken URL */}
              {/* ==================================================== */}
              <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-800" />
                    <span className="text-xs font-bold text-stone-900">
                      Product Image (Real Product Photograph) *
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                    Clean Light Background · Centered Produce
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Real-time photo preview */}
                  <div className="relative w-28 h-28 rounded-xl bg-white border-2 border-stone-200/90 p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs group">
                    <ProductImage 
                      src={formData.imageUrl || getRealisticProductImage(formData.name, formData.category)} 
                      alt={formData.name || 'Produce Preview'} 
                      className="w-full h-full object-contain" 
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-stone-900/60 backdrop-blur-xs py-0.5 text-center text-[9px] text-white font-medium">
                      Live Preview
                    </div>
                  </div>

                  {/* Image Options and Actions */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Choose Image from Device */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Image</span>
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileUpload}
                      />

                      {/* Remove Image */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, imageUrl: '' }));
                          setFormUrlError('');
                          showToast('Removed custom image (shows fallback)', 'info');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Image</span>
                      </button>

                      {/* Browse Photo Library */}
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPickerTarget('form');
                          setIsPhotoPickerOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-stone-500" />
                        <span>Browse Library</span>
                      </button>

                      {/* Auto-Match Realistic Photo */}
                      <button
                        type="button"
                        onClick={handleAutoSuggestPhoto}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        title="Auto-picks photo based on product name"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Auto-Match</span>
                      </button>
                    </div>

                    {/* Image URL Input Option with Preview Button */}
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => {
                            setFormData({ ...formData, imageUrl: e.target.value });
                            setFormUrlError('');
                          }}
                          placeholder="Paste image URL (e.g. Unsplash or CDN photo)..."
                          className="flex-1 text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono text-stone-800"
                        />
                        <button
                          type="button"
                          onClick={handleTestFormUrl}
                          disabled={isTestingFormUrl}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                        >
                          {isTestingFormUrl ? 'Testing...' : 'Preview'}
                        </button>
                      </div>

                      {/* URL Error Message */}
                      {formUrlError && (
                        <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{formUrlError}</span>
                        </p>
                      )}

                      <p className="text-[10px] text-stone-400">
                        Leave blank to automatically use Raghu Fresh verified photographic image. Supported: JPG, JPEG, PNG, WEBP.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
                    placeholder="e.g. Kinnaur Royal Apple, Ooty Carrot"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Regional Name (Kannada / Hindi)
                  </label>
                  <input
                    type="text"
                    value={formData.kannadaName}
                    onChange={(e) => setFormData({ ...formData, kannadaName: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
                    placeholder="e.g. ಸೇಬು ಹಣ್ಣು, ಕ್ಯಾರೆಟ್"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryId })}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Price (₹) * [Editable in Supabase]
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-emerald-600 rounded-lg focus:outline-emerald-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    MRP / Original (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
                  />
                </div>
              </div>

              {/* Unit, Stock & Low threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Selling Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
                    placeholder="e.g. 500 g, 1 kg, 1 bunch, 1 pc"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Low-Stock Threshold *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800 font-mono"
                  />
                </div>
              </div>

              {/* Origin and Nutritional Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Farm Origin Location
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
                    placeholder="e.g. Kolar Organic Belt, Malur Groves"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nutritional Highlight
                  </label>
                  <input
                    type="text"
                    value={formData.nutritionHighlights}
                    onChange={(e) => setFormData({ ...formData, nutritionHighlights: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
                    placeholder="e.g. High Pectin • Vitamin C"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-emerald-800"
                  placeholder="Describe texture, flavor, farm freshness, and culinary uses..."
                />
              </div>

              {/* Status Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-1 text-xs border-t border-stone-100 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span className="font-semibold text-stone-900">Available for Ordering</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOrganic}
                    onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span className="font-medium text-stone-800">Certified Organic</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSeasonal}
                    onChange={(e) => setFormData({ ...formData, isSeasonal: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span className="font-medium text-stone-800">Seasonal Pick</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span className="font-medium text-stone-800">Feature on Storefront</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Save & Sync with Supabase' : 'Publish to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* REALISTIC PHOTO LIBRARY PICKER MODAL */}
      {/* ==================================================== */}
      {isPhotoPickerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-heading flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-800" />
                  <span>Choose Realistic Grocery Photograph</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Select authentic, centered grocery store produce photography on clean light background
                </p>
              </div>
              <button
                onClick={() => setIsPhotoPickerOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Search */}
            <div className="p-4 bg-stone-50/70 border-b border-stone-200/80 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter photos: apple, carrot, spinach, mango..."
                  value={photoSearch}
                  onChange={(e) => setPhotoSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-emerald-800"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPhotoCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                    photoCategoryFilter === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  All ({PRESET_GROCERY_PHOTOS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoCategoryFilter('fruits')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                    photoCategoryFilter === 'fruits'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Fruits
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoCategoryFilter('vegetables')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                    photoCategoryFilter === 'vegetables'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Vegetables
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoCategoryFilter('leafy-greens')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                    photoCategoryFilter === 'leafy-greens'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Leafy Greens
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoCategoryFilter('dairy-eggs')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer ${
                    photoCategoryFilter === 'dairy-eggs'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  Dairy & Eggs
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPresetPhoto(preset.url, preset.name)}
                  className="group relative bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-600 rounded-xl p-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center shadow-2xs"
                >
                  <div className="w-full h-24 bg-white rounded-lg p-1.5 border border-stone-200/60 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800 mt-1.5 line-clamp-1 group-hover:text-emerald-800">
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-stone-400 capitalize">
                    {preset.category.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Showing {filteredPresets.length} realistic photographs</span>
              <button
                type="button"
                onClick={() => setIsPhotoPickerOpen(false)}
                className="px-3 py-1 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-md font-medium cursor-pointer"
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
