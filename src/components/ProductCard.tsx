import React, { useState } from 'react';
import { ShoppingBag, Check, Eye, MessageCircle, Sparkles, Shield } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  lang: 'ur' | 'en';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  lang,
}) => {
  const isUrdu = lang === 'ur';
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const openWhatsAppDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `السلام علیکم انصاف آٹوز! میں اس آئٹم کے بارے میں معلومات اور ریٹ معلوم کرنا چاہتا ہوں:\n\n*${product.nameUr}*\n(${product.nameEn})\nبرانڈ: ${product.brand}\nقیمت: Rs. ${product.price.toLocaleString()} PKR\nمقام: نیو ٹرک اڈہ، مچھ بولان`;
    window.open(`https://wa.me/923353832032?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative bg-[#0e111a] border border-amber-500/20 hover:border-amber-400/60 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer overflow-hidden"
    >
      {/* Background radial gold glow effect on hover */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

      {/* Top Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {product.brand}
          </span>

          {product.isPopular && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{isUrdu ? 'زیادہ فروخت' : 'Top Choice'}</span>
            </span>
          )}

          {product.stockStatus === 'in_stock' ? (
            <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isUrdu ? 'دستیاب' : 'In Stock'}</span>
            </span>
          ) : (
            <span className="text-[10px] font-medium text-amber-400">
              {isUrdu ? 'آرڈر پر' : 'On Order'}
            </span>
          )}
        </div>

        {/* Product Visual Container with Pedestal */}
        <div className="relative w-full aspect-square max-h-52 my-1 rounded-xl bg-gradient-to-b from-[#141724]/60 to-[#0a0b10] flex items-center justify-center p-3 overflow-hidden border border-slate-800/80 group-hover:border-amber-500/30 transition-colors">
          {/* Circular glow pedestal under bottle */}
          <div className="absolute bottom-2 w-3/4 h-8 bg-amber-500/15 blur-md rounded-full pointer-events-none" />

          <img
            src={product.imageUrl}
            alt={product.nameUr}
            className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Quick View Floating Eye */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            title={isUrdu ? 'تفصیلات دیکھیں' : 'View Specs'}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Titles & Specs */}
        <div className="mt-3">
          <div className="text-[11px] font-mono text-amber-400/90 font-semibold mb-0.5 flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{product.specs}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white leading-snug font-urdu line-clamp-2 min-h-[2.5rem]">
            {product.nameUr}
          </h3>

          <p className="text-xs text-slate-400 font-sans-ur truncate mt-0.5">
            {product.nameEn}
          </p>
        </div>
      </div>

      {/* Pricing & Add-to-Cart Row */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-amber-400 font-bold">Rs.</span>
              <span className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-tight">
                {product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-slate-500 line-through font-mono">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Quick Direct WhatsApp Button */}
          <button
            onClick={openWhatsAppDirect}
            className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 text-[11px] font-semibold transition-colors flex items-center gap-1"
            title="Chat on WhatsApp about this item"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">پوچھیں</span>
          </button>
        </div>

        {/* Quantity and Add to Cart Button */}
        <div className="flex items-center gap-2">
          {/* Quantity selector */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center border border-slate-700 bg-[#121520] rounded-xl overflow-hidden shrink-0"
          >
            <button
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              className="px-2.5 py-1.5 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              -
            </button>
            <span className="px-2 text-xs font-mono font-bold text-amber-300 min-w-[20px] text-center">
              {qty}
            </span>
            <button
              onClick={() => setQty((prev) => prev + 1)}
              className="px-2.5 py-1.5 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 hover:brightness-110 shadow-amber-500/20'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{isUrdu ? 'کارٹ میں شامل!' : 'Added!'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isUrdu ? 'کارٹ میں شامل کریں' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
