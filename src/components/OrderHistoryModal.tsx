import React from 'react';
import { X, MessageCircle, Clock, Truck, User, ShoppingBag } from 'lucide-react';
import { CustomerOrder } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CustomerOrder[];
  lang: 'ur' | 'en';
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  if (!isOpen) return null;

  const resendOrder = (order: CustomerOrder) => {
    const orderLines = order.items.map((item, idx) => {
      const lineTotal = item.product.price * item.quantity;
      return `${idx + 1}. *${item.product.nameUr}* (مقدار: ${item.quantity}) = Rs. ${lineTotal.toLocaleString()} PKR`;
    });

    const msg = `🛒 *آرڈر فالو اپ - انصاف آٹوز*
━━━━━━━━━━━━━━━━━━━━
🆔 *انوائس:* #${order.id}
📅 *تاریخ:* ${order.date}
👤 *خریدار:* ${order.customerName}
📱 *فون:* ${order.phone}
📍 *پتہ:* ${order.address}
🚛 *گاڑی:* ${order.vehicleDetails}
━━━━━━━━━━━━━━━━━━━━
📦 *سامان:*
${orderLines.join('\n')}
━━━━━━━━━━━━━━━━━━━━
💰 *کل رقم:* Rs. ${order.totalAmount.toLocaleString()} PKR
سلام ابو بکر بھائی، اس آرڈر کی کیا صورتحال ہے؟`;

    window.open(`https://wa.me/923353832032?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0e111a] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-600/20 via-[#131622] to-amber-600/20 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-urdu">
                {isUrdu ? 'سابقہ واٹس ایپ آرڈرز کی تاریخ' : 'Recent WhatsApp Orders'}
              </h3>
              <p className="text-xs text-amber-200/70">
                {isUrdu ? 'اس ڈیوائس پر کیے گئے آرڈرز کا ریکارڈ' : 'Orders sent to Abu Bakr via WhatsApp'}
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

        {/* Orders list */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-urdu">{isUrdu ? 'ابھی تک کوئی آرڈر نہیں بھیجا گیا' : 'No past orders found.'}</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl bg-[#141724] border border-slate-800 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    #{ord.id}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {ord.date}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-semibold text-white">{ord.customerName}</span>
                    <span className="text-slate-500">({ord.phone})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{ord.address} — {ord.vehicleDetails}</span>
                  </div>
                </div>

                {/* Items summary */}
                <div className="py-2 border-y border-slate-800 text-[11px] text-slate-300">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-0.5">
                      <span className="truncate max-w-[240px]">{it.product.nameUr} × {it.quantity}</span>
                      <span className="font-mono text-amber-300">Rs. {(it.product.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-slate-400">کل رقم: </span>
                    <span className="text-sm font-mono font-bold text-white">
                      Rs. {ord.totalAmount.toLocaleString()} PKR
                    </span>
                  </div>

                  <button
                    onClick={() => resendOrder(ord)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-emerald-300 border border-emerald-600/40 text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'واٹس ایپ پر رابطہ' : 'Track on WA'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
