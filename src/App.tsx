import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { ItemCard } from './components/ItemCard';
import { ItemDetails } from './components/ItemDetails';
import { CartDrawer } from './components/CartDrawer';
import { UserModal } from './components/UserModal';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistPage } from './components/WishlistPage';
import { UserOrders } from './components/UserOrders';
import { AdminPanel } from './components/AdminPanel';
import { authService } from './services/authService';
import { MOCK_ITEMS, CATEGORIES, MOCK_ORDERS } from './data/mockData';
import { Item, User, Order } from './types';
import { LayoutGrid, List, Sparkles, ShoppingBag, Search } from 'lucide-react';
import { Language, translations } from './data/translations';

export default function App() {
  const [view, setView] = useState<'home' | 'details' | 'wishlist' | 'admin' | 'orders'>('home');
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'product' | 'service'>('all');
  const [cart, setCart] = useState<Item[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [language, setLanguage] = useState<Language>('fr');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const t = translations[language];

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // Automatically upgrade to admin if email matches
      if (currentUser.email === 'aminehasni20@gmail.com' && currentUser.role !== 'admin') {
        const updatedUser = { ...currentUser, role: 'admin' as const };
        setUser(updatedUser);
        localStorage.setItem('marketvibe_current_user', JSON.stringify(updatedUser));
      } else {
        setUser(currentUser);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    // Ensure dark mode is removed from html element
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('brutalist');
  }, [language]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    if (view === 'admin') setView('home');
  };

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setIsUserModalOpen(false);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const typeMatch = filterType === 'all' || item.type === filterType;
      const searchMatch = 
        item.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description[language].toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && typeMatch && searchMatch;
    });
  }, [selectedCategory, filterType, searchQuery, language]);

  const wishlistItems = useMemo(() => {
    return items.filter(item => wishlist.includes(item.id));
  }, [wishlist, items]);

  const addToCart = (item: Item) => {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleCheckout = (shippingAddress: string) => {
    if (!user) {
      setIsUserModalOpen(true);
      return;
    }

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      userId: user.id,
      userEmail: user.email,
      items: [...cart],
      total: cart.reduce((acc, item) => acc + item.price, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutModalOpen(false);
    setView('orders');
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const index = prev.findIndex(i => i.id === itemId);
      if (index === -1) return prev;
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const toggleWishlist = (item: Item) => {
    setWishlist(prev => 
      prev.includes(item.id) 
        ? prev.filter(id => id !== item.id) 
        : [...prev, item.id]
    );
  };

  const initiateCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setView('details');
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen bg-zinc-50 flex flex-col transition-colors duration-300 ${language === 'ar' ? 'font-sans' : ''}`}>
      <Navbar 
        cartCount={cart.length} 
        wishlistCount={wishlist.length}
        language={language} 
        onLanguageChange={setLanguage} 
        onCartClick={() => setIsCartOpen(true)}
        onUserClick={() => setIsUserModalOpen(true)}
        onWishlistClick={() => setView('wishlist')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onCheckout={initiateCheckout}
        language={language}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onWishlistClick={() => setView('wishlist')}
        onOrdersClick={() => setView('orders')}
        onAdminClick={() => setView('admin')}
        language={language}
        user={user}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleCheckout}
        language={language}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === 'details' && selectedItem ? (
            <ItemDetails
              key="details"
              item={selectedItem}
              items={items}
              onBack={() => setView('home')}
              onAddToCart={addToCart}
              onToggleWishlist={toggleWishlist}
              onItemClick={handleItemClick}
              isWishlisted={wishlist.includes(selectedItem.id)}
              language={language}
            />
          ) : view === 'wishlist' ? (
            <WishlistPage
              key="wishlist"
              items={wishlistItems}
              onBack={() => setView('home')}
              onAddToCart={addToCart}
              onRemoveFromWishlist={toggleWishlist}
              onItemClick={handleItemClick}
              language={language}
            />
          ) : view === 'orders' ? (
            <UserOrders
              key="orders"
              orders={orders.filter(o => o.userId === user?.id)}
              language={language}
              onBack={() => setView('home')}
            />
          ) : view === 'admin' ? (
            user?.role === 'admin' ? (
              <AdminPanel
                key="admin"
                items={items}
                onUpdateItems={setItems}
                orders={orders}
                onUpdateOrders={setOrders}
                language={language}
                onBack={() => setView('home')}
              />
            ) : (
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100 mb-2">Accès restreint</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md">
                  Vous devez être administrateur pour accéder à cette page.
                </p>
                <button 
                  onClick={() => setView('home')}
                  className="bg-zinc-900 dark:bg-brand text-white px-8 py-3 rounded-xl font-bold"
                >
                  Retour à l'accueil
                </button>
              </div>
            )
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              {/* Hero Section */}
              <section className={`mb-12 text-center ${language === 'ar' ? 'lg:text-right' : 'lg:text-left'} lg:flex lg:items-center lg:justify-between gap-12`}>
                <div className="max-w-2xl mx-auto lg:mx-0">
                  <motion.div
                    initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 dark:bg-brand/20"
                  >
                    <Sparkles className="w-3 h-3" />
                    {t.heroBadge}
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight"
                  >
                    {t.heroTitle} <br />
                    <span className="text-brand">{t.heroTitleAccent}</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto lg:mx-0"
                  >
                    {t.heroDescription}
                  </motion.p>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 lg:mb-0">
                    <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 dark:bg-brand text-white rounded-2xl font-bold shadow-xl hover:shadow-brand/20 transition-all active:scale-95">
                      {t.getStarted}
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                      {t.allProducts}
                    </button>
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="hidden lg:block w-full max-w-sm aspect-square bg-brand/5 rounded-3xl border-2 border-dashed border-brand/20 relative"
                >
                  <div className="absolute inset-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center dark-glow">
                    <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-4 dark:bg-brand/20">
                      <ShoppingBag className="w-8 h-8 text-brand" />
                    </div>
                    <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t.readyToShop}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{t.startExploring}</p>
                    <button className="w-full py-2 bg-zinc-900 dark:bg-brand text-white rounded-xl font-medium hover:bg-brand dark:hover:bg-brand-dark transition-colors shadow-lg dark:shadow-brand/20">
                      {t.getStarted}
                    </button>
                  </div>
                </motion.div>
              </section>

              {/* Filters & Categories */}
              <section className="mb-8 sticky top-16 sm:top-20 z-40 py-4 glass -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          selectedCategory === category
                            ? 'bg-zinc-900 dark:bg-brand text-white shadow-md dark:shadow-brand/20'
                            : 'bg-white dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        {t.categories[category as keyof typeof t.categories] || category}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-800/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start md:self-auto">
                    {(['all', 'product', 'service'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          filterType === type
                            ? 'bg-brand/10 text-brand dark:bg-brand/20'
                            : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
                        }`}
                      >
                        {type === 'all' ? t.all : type === 'product' ? t.products : t.services}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Grid */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100">
                    {t.categories[selectedCategory as keyof typeof t.categories] || selectedCategory} {filterType !== 'all' ? (filterType === 'product' ? t.products : t.services) : ''}
                    <span className={`mx-2 text-sm font-normal text-zinc-400 dark:text-zinc-500`}>({filteredItems.length} {t.itemsFound})</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-brand bg-brand/10 dark:bg-brand/20 rounded-lg">
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300">
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                      <ItemCard 
                        key={item.id} 
                        item={item} 
                        onAddToCart={addToCart} 
                        onClick={handleItemClick}
                        language={language}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {filteredItems.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-100 mb-1">{t.noItemsFound}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400">{t.adjustFilters}</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12 mt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className={`col-span-1 md:col-span-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight dark:text-white">{t.appName}</span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
              {t.footerDescription}
            </p>
          </div>
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="font-bold text-zinc-900 dark:text-white mb-4">{t.marketplace}</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-brand transition-colors">{t.allProducts}</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">{t.allServices}</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">{t.featuredItems}</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">{t.newArrivals}</a></li>
            </ul>
          </div>
          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="font-bold text-zinc-900 dark:text-white mb-4">{t.support}</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-brand transition-colors">{t.helpCenter}</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">{t.terms}</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">{t.privacy}</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">{t.contact}</a></li>
              <li>
                <button 
                  onClick={() => setView('admin')}
                  className="hover:text-brand transition-colors font-bold"
                >
                  {t.adminPanel}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-400">
          © 2024 {t.appName}. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
        </div>
      </footer>
    </div>
  );
}
