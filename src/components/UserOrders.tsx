import React from 'react';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowLeft } from 'lucide-react';
import { Order, Language } from '../types';
import { translations } from '../data/translations';

interface UserOrdersProps {
  orders: Order[];
  language: Language;
  onBack: () => void;
}

export const UserOrders: React.FC<UserOrdersProps> = ({ orders, language, onBack }) => {
  const t = translations[language];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'processing': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-indigo-500" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 dark:text-white" />
        </button>
        <h1 className="text-3xl font-display font-bold dark:text-white">{t.orderHistory}</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
          <Package className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400">{t.noOrders}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{t.orderId}</p>
                  <p className="font-mono font-bold dark:text-white">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{t.date}</p>
                  <p className="text-sm dark:text-zinc-300">{new Date(order.createdAt).toLocaleDateString(language)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{t.status}</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-bold dark:text-zinc-200">
                      {t.orderStatus[order.status]}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{t.total}</p>
                  <p className="text-lg font-bold text-brand">{order.total.toFixed(2)} {t.currency}</p>
                </div>
              </div>
              
              {order.items.length > 0 && (
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {order.items.map((item, idx) => (
                      <img
                        key={`${order.id}-${idx}`}
                        src={item.image}
                        alt={item.name[language]}
                        className="w-12 h-12 rounded-lg object-cover border border-zinc-100 dark:border-zinc-800"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
