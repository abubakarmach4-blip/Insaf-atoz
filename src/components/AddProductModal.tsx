import React, { useState } from 'react';
import { X, Camera, Upload, Plus, Sparkles, Check, Package } from 'lucide-react';
import { CategoryId, Product } from '../types';
import { CATEGORIES } from '../data/seedProducts';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  onTriggerCamera: () => void;
  capturedImageUrl?: string | null;
  lang: 'ur' | 'en';
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  onTriggerCamera,
  capturedImageUrl,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  const [nameUr, setNameUr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<CategoryId>('engine-oil');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [brand, setBrand] = useState('Shell');
  const [specs, setSpecs] = useState('');
  const [descriptionUr, setDescriptionUr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageUrl, setImageUrl] = useState<string>(capturedImageUrl || '');
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'low_stock' | 'order_basis'>('in_stock');
  const [error, setError] = useState<string | null>(null);

  // Sync captured image when prop updates
  React.useEffect(() => {
    if (capturedImageUrl) {
      setImageUrl(capturedImageUrl);
    }
  }, [capturedImageUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nameUr.trim() && !nameEn.trim()) {
      setError(isUrdu ? 'براہ کرم پروڈکٹ کا نام درج کریں۔' : 'Please provide a product name.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError(isUrdu ? 'براہ کرم درست قیمت (PKR) درج کریں۔' : 'Please enter a valid price in PKR.');
      return;
    }

    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      nameUr: nameUr.trim() || nameEn.trim(),
      nameEn: nameEn.trim() || nameUr.trim(),
      category,
      price: Math.round(numPrice),
      originalPrice: originalPrice ? Math.round(parseFloat(originalPrice)) : undefined,
      brand: brand.trim() || 'Insaf Autos',
      specs: specs.trim() || 'Genuine Heavy Duty',
      descriptionUr: descriptionUr.trim() || 'انصاف آٹوز مچھ بولان سے تصدیق شدہ اصلی آئل و پارٹس۔',
      descriptionEn: descriptionEn.trim() || 'Genuine heavy-duty automotive product from Insaf Autos Machh Bolan.',
      imageUrl: imageUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231a1d26"/><text x="100" y="105" fill="%23f59e0b" font-size="14" text-anchor="middle">INSAF AUTOS</text></svg>',
      stockStatus,
      rating: 5.0,
      isPopular: false,
    };

    onAddProduct(newProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d0f17] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-600/20 via-[#131622] to-amber-600/20 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-urdu">
                {isUrdu ? 'نیا پروڈکٹ شامل کریں (مالک ابو بکر)' : 'Add New Spare Part / Oil'}
              </h3>
              <p className="text-xs text-amber-200/70">
                {isUrdu ? 'انصاف آٹوز مچھ بولان کے کیٹلاگ میں نیا سامان شامل کریں' : 'Add new items to the Insaf Autos catalog'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
              {error}
            </div>
          )}

          {/* Image & Camera Section */}
          <div className="p-4 rounded-xl bg-[#121520] border border-amber-500/25 flex flex-col sm:flex-row items-center gap-4">
            {/* Image Preview Box */}
            <div className="relative w-28 h-28 rounded-xl bg-black/60 border border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0 group">
              {/* Checkerboard Pattern */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #2a2e3d 25%, transparent 25%), linear-gradient(-45deg, #2a2e3d 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2e3d 75%), linear-gradient(-45deg, transparent 75%, #2a2e3d 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              />
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="relative z-10 w-full h-full object-contain p-1.5 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                />
              ) : (
                <div className="relative z-10 text-center text-slate-500 text-[11px] p-2">
                  <span>{isUrdu ? 'کوئی تصویر نہیں' : 'No Image'}</span>
                </div>
              )}
            </div>

            {/* Camera & Upload Action Buttons */}
            <div className="flex-1 flex flex-col gap-2 w-full">
              <span className="text-xs font-bold text-amber-300">
                {isUrdu ? 'پروڈکٹ کی تصویر (کیمرہ یا فائل):' : 'Product Photo (Live Camera / File):'}
              </span>

              <div className="flex flex-wrap gap-2">
                {/* Trigger Camera with Background Remover */}
                <button
                  type="button"
                  onClick={onTriggerCamera}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:brightness-110 active:scale-98 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all"
                >
                  <Camera className="w-4 h-4 text-slate-950" />
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isUrdu ? 'لائیو کیمرہ اور بیک گراؤنڈ ریموور' : 'Camera & Remove BG'}</span>
                </button>

                {/* Upload File */}
                <label className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer text-xs font-semibold">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>{isUrdu ? 'فائل اپلوڈ' : 'Upload'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>

              <p className="text-[11px] text-slate-400">
                {isUrdu
                  ? 'کیمرے سے تصویر کھینچ کر خودکار طریقے سے سفید یا گہرا پس منظر ہٹا کر شفاف PNG بنائی جا سکتی ہے۔'
                  : 'Capture oil bottles or filters; the algorithm cleans backgrounds into crisp transparent PNGs.'}
              </p>
            </div>
          </div>

          {/* Names in Urdu & English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isUrdu ? 'پروڈکٹ کا نام (اردو میں) *' : 'Name in Urdu *'}
              </label>
              <input
                type="text"
                value={nameUr}
                onChange={(e) => setNameUr(e.target.value)}
                placeholder="مثلاً: شیل رمولا R4 15W-40 (4 لیٹر)"
                className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs font-urdu"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isUrdu ? 'پروڈکٹ کا نام (انگریزی میں)' : 'Name in English'}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Shell Rimula R4 15W-40 (4L)"
                className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs font-sans-ur"
              />
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isUrdu ? 'کیٹیگری منتخب کریں *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-amber-300 text-xs font-medium cursor-pointer"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameUr} ({cat.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isUrdu ? 'کمپنی / برانڈ کا نام' : 'Brand / Manufacturer'}
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Shell, Caltex, Guard, ZIC, Total, etc."
                className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs"
              />
            </div>
          </div>

          {/* Price & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">
                {isUrdu ? 'قیمت (PKR روپے میں) *' : 'Price in PKR *'}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="مثلاً: 6850"
                className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-amber-500/50 focus:border-amber-400 focus:outline-none text-amber-300 text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {isUrdu ? 'پرانی قیمت (اختیاری کٹ)' : 'Original / Cut Price'}
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="مثلاً: 7200"
                className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-slate-500 focus:outline-none text-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isUrdu ? 'پیکنگ یا گریڈ (Specs)' : 'Size / Viscosity Grade'}
              </label>
              <input
                type="text"
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder="15W-40 / 4L / ISO 68"
                className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isUrdu ? 'تفصیل (اردو میں)' : 'Description (Urdu / Details)'}
            </label>
            <textarea
              rows={2}
              value={descriptionUr}
              onChange={(e) => setDescriptionUr(e.target.value)}
              placeholder="ٹرکوں اور ہیوی ڈیزل انجنوں کے لیے موزوں۔ تیل کا پریشر برقرار رکھتا ہے۔"
              className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs font-urdu"
            />
          </div>

          {/* Stock Status Selection */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-300 font-semibold">{isUrdu ? 'دستیابی:' : 'Stock Status:'}</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-emerald-400">
              <input
                type="radio"
                name="stock"
                checked={stockStatus === 'in_stock'}
                onChange={() => setStockStatus('in_stock')}
                className="accent-emerald-500"
              />
              <span>{isUrdu ? 'دکان پر دستیاب (In Stock)' : 'In Stock'}</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-amber-400">
              <input
                type="radio"
                name="stock"
                checked={stockStatus === 'order_basis'}
                onChange={() => setStockStatus('order_basis')}
                className="accent-amber-500"
              />
              <span>{isUrdu ? 'آرڈر پر منگوایا جائے گا' : 'On Order'}</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              {isUrdu ? 'منسوخ کریں' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:brightness-110 active:scale-98 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{isUrdu ? 'کیٹلاگ میں شامل کریں' : 'Save Product to Shop'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
