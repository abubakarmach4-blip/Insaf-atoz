/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Droplet,
  Sparkles,
  Camera,
  Layers,
  Settings,
  Gauge,
  Disc,
  RotateCcw,
  Star,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { Product, CartItem, CustomerOrder, CategoryId } from './types';
import { CATEGORIES, INITIAL_PRODUCTS } from './data/seedProducts';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AddProductModal } from './components/AddProductModal';
import { CameraBgRemoverModal } from './components/CameraBgRemoverModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';

const STORAGE_KEY_PRODUCTS = 'insaf_autos_products_v1';
const STORAGE_KEY_ORDERS = 'insaf_autos_orders_v1';

export default function App() {
  const [lang, setLang] = useState<'ur' | 'en'>('ur');
  const isUrdu = lang === 'ur';

  // Products State (Loaded from localStorage or initial seed)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Orders State (Loaded from localStorage)
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load orders from storage', e);
    }
    return [];
  });

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular'>('default');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Transferred image from camera modal to add-product modal
  const [capturedImageForForm, setCapturedImageForForm] = useState<string | null>(null);

  // Save products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSaveOrder = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Add Product Handler
  const handleAddNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setCapturedImageForForm(null);
  };

  // Reset to default seed products
  const handleResetCatalog = () => {
    if (window.confirm(isUrdu ? 'کیا آپ تمام مصنوعات اصل فہرست پر ری سیٹ کرنا چاہتے ہیں؟' : 'Reset catalog to defaults?')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    }
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        if (!q) return matchesCategory;

        const matchesQuery =
          p.nameUr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.specs.toLowerCase().includes(q) ||
          p.descriptionUr.toLowerCase().includes(q);

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const cartTotalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const totalCartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Icon mapping for categories
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet':
        return <Droplet className="w-4 h-4" />;
      case 'Disc':
        return <Disc className="w-4 h-4" />;
      case 'Settings':
        return <Settings className="w-4 h-4" />;
      case 'Gauge':
        return <Gauge className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans-ur ${isUrdu ? 'rtl' : 'ltr'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Navbar Component */}
      <Navbar
        lang={lang}
        setLang={setLang}
        cartCount={totalCartItemsCount}
        cartTotal={cartTotalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        orderCount={orders.length}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#11131c] via-[#0c0d14] to-[#08090d] border-b border-amber-500/20 pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        {/* Glow and truck art aesthetic elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Hero Left / Urdu Content */}
            <div className="flex-1 text-center lg:text-right space-y-4">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>نیو ٹرک اڈہ، مچھ بولان کا سب سے بڑا اور معتبر اسٹور</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight font-urdu">
                انصاف آٹوز <span className="text-gold-gradient">— مچھ بولان</span>
              </h1>

              <p className="text-base sm:text-xl text-amber-200/90 font-medium font-urdu max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                مالک: <span className="text-white font-bold underline decoration-amber-500">ابو بکر</span>۔ تمام اقسام کے بھاری ٹرکوں، ٹرالروں، ڈمپر اور گاڑیوں کے اصل انجن آئل، فلٹرز، گیئر آئل اور ہائڈرولک آئل کی بااعتماد دکان۔
              </p>

              {/* Features Pill Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141724] border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% اصلی و سیل بند آئل</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141724] border border-slate-800">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>24 گھنٹے ڈرائیورز کی خدمت میں</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141724] border border-slate-800">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>فوری واٹس ایپ آرڈر و ترسیل</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
                <a
                  href="https://wa.me/923353832032"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:brightness-110 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/25 transition-all border border-emerald-400/40"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>واٹس ایپ آرڈر کریں (0335 3832032)</span>
                </a>

                <button
                  onClick={() => setIsCameraOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#171a27] hover:bg-[#1f2334] text-amber-300 border border-amber-500/40 hover:border-amber-400 font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>لائیو کیمرہ و بیک گراؤنڈ ریموور</span>
                </button>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>نیا سامان درج کریں</span>
                </button>
              </div>

            </div>

            {/* Hero Right: Shop Identity Card */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="relative bg-[#0f111a] border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/20 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">
                      OFFICIAL PROFILE
                    </span>
                    <h3 className="text-lg font-extrabold text-white font-brand">INSAF AUTOS</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3 pt-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">مقام (Location)</span>
                      <span className="text-slate-200 font-semibold font-urdu">
                        نیو ٹرک اڈہ، مچھ بولان، بلوچستان
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">فون و واٹس ایپ</span>
                      <a href="tel:03353832032" className="text-emerald-400 font-mono font-bold hover:underline" dir="ltr">
                        0335 3832032
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">پروپرائیٹر</span>
                      <span className="text-amber-300 font-bold font-urdu">
                        ابو بکر (Abu Bakr)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="p-2.5 rounded-xl bg-[#141724] border border-amber-500/20 text-[11px] text-amber-200/90 font-urdu leading-relaxed">
                      کوئٹہ کراچی شاہراہ کے ٹرک ڈرائیورز اور ورکشاپوں کے لیے فوری ترسیل کی سہولت دستیاب ہے۔
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f111a] border border-amber-500/20 shadow-xl">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'تلاش کریں: رمولا 15W40، گارڈ فلٹر، ہائڈرولک آئل، پالش...' : 'Search by name, viscosity, brand or part...'}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm font-urdu placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                صاف کریں
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0 font-medium">
              {isUrdu ? 'ترتیب:' : 'Sort by:'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 text-amber-300 text-xs font-semibold focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="default">{isUrdu ? 'پہلے سے طے شدہ' : 'Default'}</option>
              <option value="popular">{isUrdu ? 'سب سے مقبول' : 'Most Popular'}</option>
              <option value="price-asc">{isUrdu ? 'قیمت: کم سے زیادہ' : 'Price: Low to High'}</option>
              <option value="price-desc">{isUrdu ? 'قیمت: زیادہ سے کم' : 'Price: High to Low'}</option>
            </select>

            {/* Reset Catalog Button */}
            <button
              onClick={handleResetCatalog}
              className="p-2 rounded-xl border border-slate-800 bg-[#12141e] hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
              title={isUrdu ? 'کیٹلاگ ری سیٹ کریں' : 'Reset default catalog'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Categories Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? products.length
                : products.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20 scale-102'
                    : 'bg-[#10121b] text-slate-300 border-slate-800 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <span className={isSelected ? 'text-slate-950' : 'text-amber-400'}>
                  {getCategoryIcon(cat.iconName)}
                </span>
                <span className="font-urdu">{cat.nameUr}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-urdu flex items-center gap-2">
              <span>
                {CATEGORIES.find((c) => c.id === selectedCategory)?.nameUr || 'مصنوعات کی فہرست'}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                ({filteredProducts.length} آئٹمز)
              </span>
            </h2>

            <span className="text-xs text-slate-400">
              قیمتیں پاکستانی روپے (PKR) میں
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#0f111a] rounded-2xl border border-slate-800 p-8">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300 font-urdu mb-1">
                {isUrdu ? 'کوئی پروڈکٹ نہیں ملا' : 'No matching items found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                {isUrdu
                  ? 'آپ اپنی تلاش کا لفظ تبدیل کر کے دیکھیں یا نیا پروڈکٹ فارم سے شامل کریں۔'
                  : 'Try searching for another keyword or add a new spare part to the inventory.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
              >
                تمام مصنوعات دیکھیں
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={setSelectedProduct}
                  lang={lang}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Camera & Background Remover Spotlight Feature Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#131726] to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>خصوصی لائیو کیمرہ ٹول برائے انصاف آٹوز</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-urdu">
              نئی آئل بوتل یا فلٹر کی تصویر لیں اور بیک گراؤنڈ خودکار ہٹائیں
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-urdu leading-relaxed">
              ابو بکر صاحب کسی بھی نئی پروڈکٹ کی تصویر موبائل یا کمپیوٹر کیمرے سے کھینچیں؛ سسٹم پس منظر کو فوری صاف کر کے شفاف PNG تصویر بنا کر اسٹور میں شامل کر دے گا۔
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:brightness-110 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>کیمرہ ٹول اوپن کریں</span>
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-500/20 bg-[#07080c] py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-lg font-extrabold text-white font-urdu">انصاف آٹوز (INSAF AUTOS)</span>
              <span className="text-amber-400 font-bold">— نیو ٹرک اڈہ، مچھ بولان</span>
            </div>
            <p className="text-slate-500 text-[11px] font-urdu">
              مالک: ابو بکر | رابطہ و واٹس ایپ: <span className="text-amber-400 font-mono font-bold" dir="ltr">0335 3832032</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <a href="tel:03353832032" className="hover:text-amber-400 transition-colors">
              ڈائریکٹ کال
            </a>
            <span>•</span>
            <a href="https://wa.me/923353832032" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
              واٹس ایپ چیٹ
            </a>
            <span>•</span>
            <button onClick={() => setIsAddProductOpen(true)} className="hover:text-amber-400 transition-colors">
              ایڈمن پینل (نیا پروڈکٹ)
            </button>
            <span>•</span>
            <button onClick={() => setIsOrderHistoryOpen(true)} className="hover:text-amber-400 transition-colors">
              سابقہ آرڈرز
            </button>
          </div>

          <div className="text-[11px] text-slate-600">
            © {new Date().getFullYear()} انصاف آٹوز مچھ بولان۔ جملہ حقوق محفوظ ہیں۔
          </div>

        </div>
      </footer>

      {/* Floating Bottom Quick Action Bar for Mobile Phones */}
      <div className="sm:hidden fixed bottom-3 inset-x-3 z-30 flex items-center justify-between gap-2 p-2 rounded-2xl bg-[#0d0f17]/95 backdrop-blur-md border border-amber-500/40 shadow-2xl">
        <a
          href="tel:03353832032"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
        >
          <Phone className="w-4 h-4 text-amber-400" />
          <span>کال</span>
        </a>

        <a
          href="https://wa.me/923353832032"
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-700 text-white text-xs font-bold"
        >
          <MessageCircle className="w-4 h-4" />
          <span>واٹس ایپ</span>
        </a>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-extrabold relative shadow-lg"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>کارٹ</span>
          {totalCartItemsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
              {totalCartItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onSaveOrder={handleSaveOrder}
        lang={lang}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddNewProduct}
        onTriggerCamera={() => setIsCameraOpen(true)}
        capturedImageUrl={capturedImageForForm}
        lang={lang}
      />

      <CameraBgRemoverModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCaptured={(url) => {
          setCapturedImageForForm(url);
          setIsAddProductOpen(true);
        }}
        lang={lang}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        lang={lang}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        lang={lang}
      />

    </div>
  );
}
