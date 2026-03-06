import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Star, ShoppingCart, Calendar, ShieldCheck, 
  Truck, RotateCcw, Phone, MessageCircle, Plus, Minus, 
  Check, Info, List, MessageSquare, Share2 
} from 'lucide-react';
import { Item } from '../types';
import { Language, translations } from '../data/translations';

interface ItemDetailsProps {
  item: Item;
  items: Item[];
  onBack: () => void;
  onAddToCart: (item: Item) => void;
  onToggleWishlist: (item: Item) => void;
  onItemClick: (item: Item) => void;
  isWishlisted: boolean;
  language: Language;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({ 
  item, 
  items,
  onBack, 
  onAddToCart, 
  onToggleWishlist,
  onItemClick,
  isWishlisted,
  language 
}) => {
  const t = translations[language];
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'features' | 'specs'>('desc');

  const handleWhatsApp = () => {
    const phoneNumber = '+21612345678';
    const message = language === 'ar' 
      ? `مرحباً، أود طلب ${item.name.ar} (الكمية: ${quantity})`
      : `Bonjour, je souhaite commander ${item.name.fr} (Quantité: ${quantity})`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+21612345678';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name[language],
          text: item.description[language],
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(language === 'ar' ? 'تم نسخ الرابط' : 'Lien copié');
    }
  };

  const relatedItems = items
    .filter(i => i.category === item.category && i.id !== item.id)
    .slice(0, 4);

  const tabs = [
    { id: 'desc', label: t.description, icon: Info },
    { id: 'features', label: language === 'ar' ? 'المميزات' : 'Caractéristiques', icon: List },
    { id: 'specs', label: language === 'ar' ? 'المواصفات' : 'Spécifications', icon: ShieldCheck },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Breadcrumbs / Back */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-brand transition-colors group"
        >
          <ArrowLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
          <span className="font-medium">{t.back}</span>
        </button>
        
        <button 
          onClick={handleShare}
          className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-brand hover:text-white transition-all shadow-sm"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Left: Image Gallery Simulation */}
        <div className="space-y-6">
          <motion.div
            layoutId={`item-image-${item.id}`}
            className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl dark-glow"
          >
            <img
              src={item.image}
              alt={item.name[language]}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute top-8 ${language === 'ar' ? 'right-8' : 'left-8'}`}>
              <span className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md ${
                item.type === 'product' ? 'bg-blue-500/90 text-white' : 'bg-purple-500/90 text-white'
              }`}>
                {item.type === 'product' ? t.products.slice(0, -1) : t.services.slice(0, -1)}
              </span>
            </div>
          </motion.div>
          
          {/* Thumbnails Placeholder */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`aspect-square rounded-2xl overflow-hidden border-2 ${i === 1 ? 'border-brand' : 'border-transparent opacity-50 hover:opacity-100'} transition-all cursor-pointer`}>
                <img src={`${item.image}?sig=${i}`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3 text-brand font-bold text-xs uppercase tracking-widest mb-4">
              <span className="px-2 py-1 bg-brand/10 rounded-md">{t.categories[item.category as keyof typeof t.categories] || item.category}</span>
              <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
              <span className="text-zinc-400">SKU: MV-{item.id.padStart(4, '0')}</span>
            </div>
            
            <h1 className="text-5xl font-display font-black text-zinc-900 dark:text-zinc-100 mb-6 leading-[1.1] tracking-tight">
              {item.name[language]}
            </h1>

            <div className="flex items-center gap-8 mb-10">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(item.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-200 dark:text-zinc-800'}`} />
                  ))}
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 ml-1">{item.rating}</span>
                <span className="text-zinc-400 dark:text-zinc-500 text-sm">({item.reviews} {t.reviews})</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-wider">Qualité Garantie</span>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-[2rem] mb-10 border border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">{t.price}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-display font-black text-zinc-900 dark:text-zinc-100">
                      {item.price.toFixed(3)}
                    </span>
                    <span className="text-xl font-bold text-zinc-500 dark:text-zinc-400">{t.currency}</span>
                    {item.type === 'service' && <span className="text-zinc-400 text-sm ml-2">/ session</span>}
                  </div>
                </div>
                
                {item.type === 'product' && (
                  <div className="flex items-center bg-white dark:bg-zinc-800 rounded-2xl p-1.5 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mb-10">
              <div className="flex gap-8 border-b border-zinc-100 dark:border-zinc-800 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                      activeTab === tab.id 
                        ? 'text-brand' 
                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </div>
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" 
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[150px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'desc' && (
                    <motion.div
                      key="desc"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-zinc-600 dark:text-zinc-400 leading-relaxed"
                    >
                      {item.description[language]}
                      <p className="mt-4">
                        Conçu avec une attention méticuleuse aux détails, ce {item.type === 'product' ? 'produit' : 'service'} 
                        incarne l'excellence et l'innovation. Idéal pour ceux qui recherchent la qualité sans compromis.
                      </p>
                    </motion.div>
                  )}
                  {activeTab === 'features' && (
                    <motion.div
                      key="features"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {(item.features?.[language] || [
                        language === 'ar' ? 'جودة ممتازة' : 'Qualité Premium',
                        language === 'ar' ? 'تصميم عصري' : 'Design Moderne',
                        language === 'ar' ? 'سهولة الاستخدام' : 'Facile à utiliser',
                        language === 'ar' ? 'ضمان الرضا' : 'Satisfaction Garantie'
                      ]).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{feature}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === 'specs' && (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {Object.entries(item.specifications?.[language] || {
                        [language === 'ar' ? 'المنشأ' : 'Origine']: 'Tunisie',
                        [language === 'ar' ? 'الضمان' : 'Garantie']: '12 Mois',
                        [language === 'ar' ? 'التوفر' : 'Disponibilité']: 'En Stock'
                      }).map(([key, value], i) => (
                        <div key={i} className="flex justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                          <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{key}</span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onAddToCart(item)}
                  className="flex-[2] bg-zinc-900 dark:bg-brand text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand dark:hover:bg-brand-dark transition-all shadow-2xl hover:shadow-brand/40 active:scale-[0.98]"
                >
                  {item.type === 'product' ? (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {t.addToCart}
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      {t.bookNow}
                    </>
                  )}
                </button>
                <button 
                  onClick={() => onToggleWishlist(item)}
                  className={`flex-1 bg-white dark:bg-zinc-900 border-2 ${isWishlisted ? 'border-brand text-brand' : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'} py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2`}
                >
                  <Star className={`w-5 h-5 ${isWishlisted ? 'fill-brand' : ''}`} />
                  {t.wishlist}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t.orderWhatsApp}
                </button>
                <button
                  onClick={handleCall}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]"
                >
                  <Phone className="w-5 h-5" />
                  {t.callUs}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-zinc-100 dark:border-zinc-800 mb-20">
        {[
          { icon: Truck, label: 'Livraison Rapide', sub: 'Partout en Tunisie' },
          { icon: ShieldCheck, label: 'Paiement Sécurisé', sub: 'À la livraison' },
          { icon: RotateCcw, label: 'Retours Faciles', sub: 'Sous 30 jours' },
          { icon: MessageSquare, label: 'Support 24/7', sub: 'Experts à votre écoute' }
        ].map((badge, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-brand mb-4 shadow-sm">
              <badge.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest dark:text-zinc-200 mb-1">{badge.label}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{badge.sub}</span>
          </div>
        ))}
      </div>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-display font-black text-zinc-900 dark:text-zinc-100 mb-2">
                {t.relatedItems}
              </h2>
              <div className="h-1 w-12 bg-brand rounded-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedItems.map((relatedItem) => (
              <motion.div
                key={relatedItem.id}
                whileHover={{ y: -10 }}
                onClick={() => onItemClick(relatedItem)}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-4 border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <img src={relatedItem.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand transition-colors">{relatedItem.name[language]}</h3>
                <p className="text-brand font-black">{relatedItem.price.toFixed(3)} {t.currency}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
