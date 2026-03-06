import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Item } from '../types';
import { Language, translations } from '../data/translations';

interface WishlistPageProps {
  items: Item[];
  onBack: () => void;
  onAddToCart: (item: Item) => void;
  onRemoveFromWishlist: (item: Item) => void;
  onItemClick: (item: Item) => void;
  language: Language;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  items,
  onBack,
  onAddToCart,
  onRemoveFromWishlist,
  onItemClick,
  language
}) => {
  const t = translations[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-brand transition-colors mb-8 group"
      >
        <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
        <span className="font-medium">{t.back}</span>
      </button>

      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-red-500 dark:text-red-400">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100">{t.wishlist}</h1>
          <p className="text-zinc-500 dark:text-zinc-400">{items.length} {t.itemsFound}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
          <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-zinc-200 dark:text-zinc-700" />
          </div>
          <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {language === 'ar' ? 'قائمة الأمنيات فارغة' : 'Votre liste de souhaits est vide'}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            {language === 'ar' ? 'ابدأ بإضافة بعض العناصر التي تحبها!' : 'Commencez à ajouter des articles que vous aimez !'}
          </p>
          <button
            onClick={onBack}
            className="bg-zinc-900 dark:bg-brand text-white px-8 py-3 rounded-xl font-bold hover:bg-brand dark:hover:bg-brand-dark transition-all"
          >
            {t.continueShopping}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden group hover:shadow-xl dark:hover:shadow-brand/5 transition-all dark-glow"
            >
              <div 
                className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <img
                  src={item.image}
                  alt={item.name[language]}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWishlist(item);
                    }}
                    className="p-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    className="font-display font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand transition-colors cursor-pointer"
                    onClick={() => onItemClick(item)}
                  >
                    {item.name[language]}
                  </h3>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.price.toFixed(3)} {t.currency}</span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2">
                  {item.description[language]}
                </p>
                <button
                  onClick={() => onAddToCart(item)}
                  className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand hover:text-white transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t.addToCart}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
