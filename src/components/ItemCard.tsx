import React from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { Item } from '../types';
import { Language, translations } from '../data/translations';

interface ItemCardProps {
  item: Item;
  onAddToCart: (item: Item) => void;
  onClick: (item: Item) => void;
  language: Language;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onAddToCart, onClick, language }) => {
  const t = translations[language];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-brand/5 transition-all cursor-pointer dark-glow"
      onClick={() => onClick(item)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name[language]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'}`}>
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            item.type === 'product' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
          }`}>
            {item.type === 'product' ? t.products.slice(0, -1) : t.services.slice(0, -1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-brand transition-colors">
            {item.name[language]}
          </h3>
          <div className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>{item.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 h-10">
          {item.description[language]}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block">{t.price}</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{item.price.toFixed(3)} {t.currency}</span>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 dark:bg-brand text-white hover:bg-brand dark:hover:bg-brand-dark transition-colors group/btn"
          >
            {item.type === 'product' ? (
              <ShoppingCart className="w-5 h-5" />
            ) : (
              <ArrowRight className={`w-5 h-5 group-hover/btn:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
