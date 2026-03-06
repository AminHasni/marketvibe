import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { Language, translations } from '../data/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: string) => void;
  language: Language;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onConfirm, language }) => {
  const t = translations[language];
  const [address, setAddress] = React.useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 text-center transition-colors duration-300"
          >
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t.checkout}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              Veuillez entrer votre adresse de livraison pour finaliser la commande.
            </p>
            
            <div className="mb-6 text-left">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">
                Adresse de livraison
              </label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: 123 Rue de la Paix, Tunis"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-transparent dark:border-zinc-800 rounded-xl text-sm focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none dark:text-zinc-100 mt-1"
                rows={3}
              />
            </div>

            <button
              onClick={() => onConfirm(address)}
              disabled={!address.trim()}
              className="w-full bg-zinc-900 dark:bg-brand text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand dark:hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-5 h-5" />
              {t.checkout}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
