import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, User, Menu, Heart } from 'lucide-react';
import { Language, translations } from '../data/translations';
import { User as UserType } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onCartClick: () => void;
  onUserClick: () => void;
  onWishlistClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  user: UserType | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  wishlistCount,
  language, 
  onLanguageChange, 
  onCartClick,
  onUserClick,
  onWishlistClick,
  searchQuery,
  onSearchChange,
  user
}) => {
  const t = translations[language];
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight dark:text-white">{t.appName}</span>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full ${language === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-2 bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-full text-sm focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none dark:text-zinc-200`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center bg-zinc-100 rounded-full p-1 border border-transparent">
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'fr' ? 'bg-white dark:bg-zinc-700 shadow-sm text-brand' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              >
                FR
              </button>
              <button
                onClick={() => onLanguageChange('ar')}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'ar' ? 'bg-white dark:bg-zinc-700 shadow-sm text-brand' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              >
                AR
              </button>
            </div>

            <button 
              onClick={onUserClick}
              className="flex items-center gap-2 p-2 text-zinc-600 dark:text-zinc-400 hover:text-brand transition-colors"
            >
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand/10 dark:bg-brand/20 flex items-center justify-center text-brand font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">{user.name}</span>
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>
            
            <button 
              onClick={onWishlistClick}
              className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-brand transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className={`absolute top-1 ${language === 'ar' ? 'left-1' : 'right-1'} w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full`}>
                  {wishlistCount}
                </span>
              )}
            </button>

            <button 
              onClick={onCartClick}
              className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-brand transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className={`absolute top-1 ${language === 'ar' ? 'left-1' : 'right-1'} w-4 h-4 bg-brand text-white text-[10px] font-bold flex items-center justify-center rounded-full`}>
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-400"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 overflow-y-auto max-h-[calc(100vh-64px)]"
          >
            <div className="p-4 space-y-4">
              <div className="relative w-full">
                <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className={`w-full ${language === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-2 bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-full text-sm outline-none dark:text-zinc-200`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    onWishlistClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 font-medium"
                >
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>{t.wishlist}</span>
                  {wishlistCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => {
                    onUserClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 font-medium"
                >
                  {user ? (
                    <div className="w-6 h-6 rounded-full bg-brand/10 dark:bg-brand/20 flex items-center justify-center text-brand font-bold text-[10px]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User className="w-5 h-5 text-brand" />
                  )}
                  <span className="truncate max-w-[80px]">{user ? user.name : t.profile}</span>
                </button>
              </div>
              <div className="flex items-center justify-between p-2 bg-zinc-50 rounded-xl">
                <span className="text-sm font-medium text-zinc-600">Language / Langue</span>
                <div className="flex items-center bg-zinc-200 rounded-full p-1">
                  <button
                    onClick={() => onLanguageChange('fr')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'fr' ? 'bg-white shadow-sm text-brand' : 'text-zinc-500'}`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => onLanguageChange('ar')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'ar' ? 'bg-white shadow-sm text-brand' : 'text-zinc-500'}`}
                  >
                    AR
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
