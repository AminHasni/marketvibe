import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { Item } from '../types';
import { Language, translations } from '../data/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
  language: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onCheckout, language }) => {
  const t = translations[language];

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: language === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${language === 'ar' ? 'left-0' : 'right-0'} bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-[70] flex flex-col transition-colors duration-300`}
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100">{t.cart}</h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{items.length} {t.itemsFound}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-zinc-900/50">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-zinc-200 dark:text-zinc-700" />
                  </div>
                  <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 mb-1">{t.emptyCart}</h3>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">{t.startExploring}</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800/50 flex-shrink-0 bg-white dark:bg-zinc-800">
                      <img
                        src={item.image}
                        alt={item.name[language]}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 truncate pr-2">
                          {item.name[language]}
                        </h4>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="p-1 text-zinc-300 dark:text-zinc-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">
                        {t.categories[item.category as keyof typeof t.categories] || item.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand">{item.price.toFixed(3)} {t.currency}</span>
                        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-1">
                          <button className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors">
                            <Minus className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center dark:text-zinc-200">1</span>
                          <button className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded transition-colors">
                            <Plus className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <span>{t.subtotal}</span>
                    <span>{total.toFixed(3)} {t.currency}</span>
                  </div>
                  <div className="flex justify-between text-lg font-display font-bold text-zinc-900 dark:text-zinc-100">
                    <span>{t.total}</span>
                    <span>{total.toFixed(3)} {t.currency}</span>
                  </div>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-zinc-900 dark:bg-brand text-white py-4 rounded-2xl font-bold hover:bg-brand dark:hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
                >
                  {t.checkout}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
