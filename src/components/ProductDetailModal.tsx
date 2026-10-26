import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, ShieldCheck, Check, Sparkles, Truck, Droplet } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  lang: 'ur' | 'en';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  lang,
}) => {
  const isUrdu = lang === 'ur';
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const openWhatsApp = () => {
    const msg = `السلام علیکم ابو بکر بھائی! انصاف آٹوز (مچھ بولان) کے کیٹلاگ سے مجھے اس پروڈکٹ کے بارے میں معلومات چاہیے:\n\n*${product.nameUr}*\n(${product.nameEn})\nبرانڈ: ${product.brand}\nگریڈ/سائز: ${product.specs}\nقیمت: Rs. ${product.price.toLocaleString()} PKR\nشکریہ!`;
    window.open(`https://wa.me/923353832032?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0e111a] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-600/20 via-[#131622] to-amber-600/20 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {product.brand}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {product.specs}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col sm:flex-row gap-6">
          
          {/* Visual container */}
          <div className="sm:w-1/2 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square max-h-64 rounded-xl bg-gradient-to-b from-[#161a29] to-[#090a0f] border border-amber-500/25 p-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-radial-luxury pointer-events-none" />
              <img
                src={product.imageUrl}
                alt={product.nameUr}
                className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_16px_25px_rgba(0,0,0,0.9)]"
              />
            </div>

            <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% اصلی اور کمپنی سیل بند آئٹم</span>
            </div>
          </div>

          {/* Details */}
          <div className="sm:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-urdu leading-relaxed">
                {product.nameUr}
              </h2>
              <p className="text-xs text-slate-400 font-sans-ur mt-1">
                {product.nameEn}
              </p>

              {/* Price */}
              <div className="my-4 p-3 rounded-xl bg-[#141724] border border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-amber-400 font-bold">قیمت (Price): </span>
                  <span className="text-2xl font-extrabold text-white font-mono">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono ml-1">PKR</span>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-500 line-through font-mono">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 text-xs text-slate-300">
                <p className="font-urdu leading-loose">
                  {product.descriptionUr}
                </p>
                <p className="text-slate-400 font-sans-ur text-[11px]">
                  {product.descriptionEn}
                </p>
              </div>

              {/* Shop guarantee tags */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-slate-300">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>نیو ٹرک اڈہ پر فوری ترسیل</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>خالص معیار کی گارنٹی</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-700 bg-slate-900 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-2 text-slate-300 hover:bg-slate-800 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-amber-300">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((prev) => prev + 1)}
                    className="px-3 py-2 text-slate-300 hover:bg-slate-800 text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 hover:brightness-110'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{isUrdu ? 'کارٹ میں شامل کر دیا گیا!' : 'Added to Cart!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span>{isUrdu ? 'کارٹ میں شامل کریں' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp direct inquiry */}
              <button
                onClick={openWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-950/90 hover:bg-emerald-800 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isUrdu ? 'اس پروڈکٹ کے بارے میں واٹس ایپ پر پوچھیں' : 'Chat on WhatsApp about this'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
