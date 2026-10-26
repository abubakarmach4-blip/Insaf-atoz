import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle, MapPin, Truck, ShieldCheck, User, Phone } from 'lucide-react';
import { CartItem, CustomerOrder } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSaveOrder: (order: CustomerOrder) => void;
  lang: 'ur' | 'en';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onSaveOrder,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (نقد ادائیگی)');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Totals
  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cart.length === 0) {
      setErrorMsg(isUrdu ? 'آپ کا کارٹ خالی ہے!' : 'Your cart is empty!');
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg(isUrdu ? 'براہ کرم خریدار کا نام درج کریں۔' : 'Please provide your name.');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMsg(isUrdu ? 'براہ کرم رابطہ نمبر درج کریں۔' : 'Please provide your phone number.');
      return;
    }

    if (!address.trim()) {
      setErrorMsg(
        isUrdu
          ? 'براہ کرم ترسیل کا پتہ یا ٹرک اڈے کا نام درج کریں۔'
          : 'Please enter delivery address or truck stop location.'
      );
      return;
    }

    const orderId = `IA-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Build WhatsApp Order Receipt Message
    const orderLines = cart.map((item, idx) => {
      const lineTotal = item.product.price * item.quantity;
      return `${idx + 1}. *${item.product.nameUr}*
   ${item.product.nameEn}
   مقدار: ${item.quantity} | قیمت: Rs. ${item.product.price.toLocaleString()} = *Rs. ${lineTotal.toLocaleString()} PKR*`;
    });

    const whatsAppMessage = `🛒 *نیا آن لائن آرڈر - انصاف آٹوز*
━━━━━━━━━━━━━━━━━━━━
🆔 *انوائس نمبر:* #${orderId}
📅 *تاریخ:* ${formattedDate}
━━━━━━━━━━━━━━━━━━━━
👤 *خریدار:* ${customerName.trim()}
📱 *فون نمبر:* ${phoneNumber.trim()}
📍 *پتہ / اڈہ:* ${address.trim()}
🚛 *گاڑی / ٹرک:* ${vehicleDetails.trim() || 'ذاتی / معلوم نہیں'}
💳 *ادائیگی کا طریقہ:* ${paymentMethod}
${notes.trim() ? `📝 *اضافی نوٹ:* ${notes.trim()}\n` : ''}━━━━━━━━━━━━━━━━━━━━
📦 *آرڈر کی فہرست (${cart.length} اشیاء):*

${orderLines.join('\n\n')}

━━━━━━━━━━━━━━━━━━━━
💰 *کل رقم (Total): Rs. ${totalAmount.toLocaleString()} PKR*
━━━━━━━━━━━━━━━━━━━━
🏬 *انصاف آٹوز (INSAF AUTOS)*
👤 مالک: ابو بکر
📍 مقام: نیو ٹرک اڈہ، مچھ بولان، بلوچستان
📞 رابطہ: 0335 3832032
شکریہ برائے رابطہ انصاف آٹوز! ہم فوری آرڈر کی تصدیق کریں گے۔`;

    // Save to local order history
    const savedOrder: CustomerOrder = {
      id: orderId,
      date: formattedDate,
      customerName: customerName.trim(),
      phone: phoneNumber.trim(),
      address: address.trim(),
      vehicleDetails: vehicleDetails.trim() || 'Truck / Vehicle',
      paymentMethod,
      notes: notes.trim(),
      items: [...cart],
      totalAmount,
    };
    onSaveOrder(savedOrder);

    // Encode and redirect to WhatsApp wa.me
    const targetWhatsAppUrl = `https://wa.me/923353832032?text=${encodeURIComponent(whatsAppMessage)}`;
    window.open(targetWhatsAppUrl, '_blank');

    // Clear cart and close drawer
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-lg bg-[#0b0d14] border-l border-amber-500/30 text-white h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-600/20 via-[#12141f] to-amber-600/20 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-urdu">
                {isUrdu ? 'خریداری کا تھیلا (کارٹ)' : 'Your Shopping Cart'}
              </h2>
              <p className="text-xs text-amber-200/70 font-medium">
                {cart.length} {isUrdu ? 'اشیاء منتخب ہیں' : 'items selected'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-5">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
              <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-4">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-slate-300 font-urdu mb-1">
                {isUrdu ? 'کارٹ ابھی خالی ہے' : 'Your Cart is Empty'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                {isUrdu
                  ? 'انجن آئل، فلٹرز، گیئر آئل یا پالش کیٹلاگ سے منتخب کر کے کارٹ میں شامل کریں۔'
                  : 'Browse engine oils, filters, gear lubricants or polishes to add items.'}
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs shadow-md"
              >
                {isUrdu ? 'کیٹلاگ دیکھیں' : 'Browse Products'}
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
                  <span>{isUrdu ? 'منتخب سامان' : 'Selected Items'}</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-400 hover:text-red-300 text-[11px] underline"
                  >
                    {isUrdu ? 'تمام خالی کریں' : 'Clear All'}
                  </button>
                </div>

                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-xl bg-[#121522] border border-slate-800 flex items-center gap-3 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg bg-black/60 border border-slate-700/80 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.nameUr}
                        className="w-full h-full object-contain filter drop-shadow"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white font-urdu truncate leading-relaxed">
                        {item.product.nameUr}
                      </h4>
                      <div className="text-[10px] text-amber-400 font-mono truncate">
                        {item.product.specs}
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-300 mt-0.5">
                        Rs. {item.product.price.toLocaleString()} × {item.quantity} ={' '}
                        <span className="text-amber-400">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title={isUrdu ? 'ختم کریں' : 'Remove'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-slate-700 bg-slate-900 rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-800"
                        >
                          -
                        </button>
                        <span className="px-1.5 text-xs font-mono font-bold text-amber-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#161a29] to-[#0e1019] border border-amber-500/30">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span>{isUrdu ? 'اشیاء کی کل قیمت:' : 'Subtotal:'}</span>
                  <span className="font-mono font-bold text-white">Rs. {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isUrdu ? 'ڈیلیوری مچھ بولان ٹرک اڈہ:' : 'Machh Bolan Pickup:'}</span>
                  </span>
                  <span className="text-emerald-400 font-bold text-xs">{isUrdu ? 'مفت' : 'FREE'}</span>
                </div>
                <div className="pt-2 border-t border-slate-700/80 flex items-baseline justify-between">
                  <span className="text-sm font-extrabold text-amber-400 font-urdu">
                    {isUrdu ? 'کل واجب الادا رقم:' : 'Grand Total:'}
                  </span>
                  <span className="text-xl font-extrabold font-mono text-amber-300 tracking-tight">
                    Rs. {totalAmount.toLocaleString()} PKR
                  </span>
                </div>
              </div>

              {/* Customer Checkout Form */}
              <form onSubmit={handleSendToWhatsApp} className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 border-b border-slate-800 pb-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isUrdu ? 'آرڈر اور ترسیل کی معلومات:' : 'Customer & Delivery Info:'}</span>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                    {errorMsg}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isUrdu ? 'خریدار کا نام (Customer Name) *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثلاً: حاجی سلیم خان / محمد قاسم"
                    className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs font-urdu"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isUrdu ? 'فون / واٹس ایپ نمبر (Phone) *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="مثلاً: 0333 1234567"
                    className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs font-mono"
                  />
                </div>

                {/* Delivery Address / Truck Stop */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isUrdu ? 'پتہ یا گاڑی اڈہ، مچھ بولان (Delivery Spot) *' : 'Delivery Address / Truck Adda *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="نیو ٹرک اڈہ، ہوٹل یا ورکشاپ کا نام"
                    className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs font-urdu"
                  />
                </div>

                {/* Truck / Vehicle Info */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isUrdu ? 'گاڑی یا ٹرک کا ماڈل و نمبر (اختیاری)' : 'Vehicle / Truck Model & Number'}
                  </label>
                  <input
                    type="text"
                    value={vehicleDetails}
                    onChange={(e) => setVehicleDetails(e.target.value)}
                    placeholder="ہینو 500 / بیڈفورڈ / شہزور / نمبر پلیٹ"
                    className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-white text-xs"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {isUrdu ? 'ادائیگی کا طریقہ' : 'Payment Preference'}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141724] border border-slate-700 focus:border-amber-400 focus:outline-none text-amber-300 text-xs font-medium cursor-pointer"
                  >
                    <option value="Cash on Delivery (نقد ادائیگی)">Cash on Delivery (نقد سامان ملنے پر)</option>
                    <option value="Easypaisa (ایزی پیسہ)">Easypaisa (ایزی پیسہ آن لائن)</option>
                    <option value="JazzCash (جاز کیش)">JazzCash (جاز کیش)</option>
                    <option value="Bank Transfer (بینک ٹرانسفر)">Bank Transfer (بینک منتقلی)</option>
                  </select>
                </div>

                {/* Submit to WhatsApp Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:brightness-110 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all border border-emerald-400/30"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                    <span>
                      {isUrdu ? 'واٹس ایپ پر آرڈر بھیجیں (+923353832032)' : 'Send Order to WhatsApp'}
                    </span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>آرڈر براہ راست دکان دار ابو بکر کو موصول ہوگا</span>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
