import React from 'react';
import { ShoppingBag, Phone, MapPin, Wrench, PlusCircle, ShieldCheck, MessageCircle } from 'lucide-react';

interface NavbarProps {
  lang: 'ur' | 'en';
  setLang: (lang: 'ur' | 'en') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenAddProduct: () => void;
  onOpenOrderHistory: () => void;
  orderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenAddProduct,
  onOpenOrderHistory,
  orderCount,
}) => {
  const isUrdu = lang === 'ur';

  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/95 backdrop-blur-md border-b border-amber-500/20 shadow-2xl">
      {/* Top Gold Utility Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 px-3 py-1 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>نیو ٹرک اڈہ، مچھ بولان (بلوچستان)</span>
            </span>
            <span className="hidden sm:inline-block opacity-40">|</span>
            <span className="hidden sm:flex items-center gap-1 font-bold">
              <span>پروپرائیٹر: ابو بکر</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="tel:03353832032"
              className="flex items-center gap-1 hover:underline font-bold"
              title="Call Insaf Autos"
            >
              <Phone className="w-3.5 h-3.5" />
              <span dir="ltr">0335 3832032</span>
            </a>
            <span className="opacity-40">|</span>
            <a
              href="https://wa.me/923353832032"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:underline font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واٹس ایپ رابطہ</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d0e14] rounded-[10px] flex items-center justify-center border border-amber-500/30">
                  <span className="text-amber-400 font-extrabold text-2xl font-brand">IA</span>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#090a0f] animate-pulse" title="Open 24/7" />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-urdu">
                  انصاف آٹوز
                </h1>
                <span className="text-xs sm:text-sm font-brand font-bold text-amber-400 tracking-wider">
                  INSAF AUTOS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/70 font-medium -mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                <span>100% اصل آئل و ٹرک فلٹرز — مالک: ابو بکر</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switch */}
            <button
              onClick={() => setLang(isUrdu ? 'en' : 'ur')}
              className="px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-[#141620] hover:bg-amber-500/10 text-xs font-semibold text-amber-300 transition-colors flex items-center gap-1 shadow-sm"
              title="Toggle Language"
            >
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Add Product / Admin Button */}
            <button
              onClick={onOpenAddProduct}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600/30 to-amber-500/10 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all shadow-sm"
              title={isUrdu ? 'نیا سامان شامل کریں' : 'Add New Spare Part / Oil'}
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>{isUrdu ? '+ نیا پروڈکٹ' : '+ Add Product'}</span>
            </button>

            {/* Past Orders History */}
            {orderCount > 0 && (
              <button
                onClick={onOpenOrderHistory}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#12141c] hover:bg-slate-800 text-xs text-slate-300 transition-colors"
                title={isUrdu ? 'سابقہ آرڈرز' : 'Order History'}
              >
                <span>{isUrdu ? 'آرڈرز' : 'Orders'}</span>
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {orderCount}
                </span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-950 stroke-[2.2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#090a0f] animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              
              <div className="hidden sm:flex flex-col text-right leading-none">
                <span className="text-[10px] uppercase font-bold text-slate-900/80">
                  {isUrdu ? 'کارٹ رقم' : 'Cart Total'}
                </span>
                <span className="text-xs font-extrabold font-mono text-slate-950">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
