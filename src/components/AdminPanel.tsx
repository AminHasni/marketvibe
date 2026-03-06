import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Users,
  X,
  Save,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import { ShoppingBag, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { Item, Order } from '../types';
import { CATEGORIES } from '../data/mockData';
import { Language, translations } from '../data/translations';

interface AdminPanelProps {
  items: Item[];
  onUpdateItems: (items: Item[]) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  language: Language;
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  items, 
  onUpdateItems, 
  orders,
  onUpdateOrders,
  language,
  onBack
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'orders'>('dashboard');
  const [editingItem, setEditingItem] = useState<Partial<Item> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = {
    totalItems: items.length,
    totalRevenue: orders.reduce((acc, order) => acc + order.total, 0),
    activeServices: items.filter(i => i.type === 'service').length,
    avgRating: (items.reduce((acc, item) => acc + item.rating, 0) / items.length).toFixed(1)
  };

  const handleDelete = (id: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العنصر؟' : 'Êtes-vous sûr de vouloir supprimer cet article ?')) {
      onUpdateItems(items.filter(item => item.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (editingItem.id) {
      // Update
      onUpdateItems(items.map(item => item.id === editingItem.id ? (editingItem as Item) : item));
    } else {
      // Create
      const newItem: Item = {
        ...editingItem as Item,
        id: Math.random().toString(36).substr(2, 9),
        rating: 0,
        reviews: 0
      };
      onUpdateItems([...items, newItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <ArrowLeft className={`w-5 h-5 dark:text-zinc-400 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </button>
              <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100">{t.adminPanel}</h1>
            </div>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'dashboard' ? 'bg-white dark:bg-zinc-700 text-brand shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t.dashboard}
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'items' ? 'bg-white dark:bg-zinc-700 text-brand shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <Package className="w-4 h-4" />
                {t.manageItems}
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'orders' ? 'bg-white dark:bg-zinc-700 text-brand shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {t.orders}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: t.totalItems, value: stats.totalItems, icon: Package, color: 'blue' },
                { label: t.totalRevenue, value: `${stats.totalRevenue.toFixed(3)} ${t.currency}`, icon: TrendingUp, color: 'emerald' },
                { label: t.activeServices, value: stats.activeServices, icon: Users, color: 'purple' },
                { label: t.manageOrders, value: orders.length, icon: ShoppingBag, color: 'amber' }
              ].map((stat, i) => {
                const colorClasses = {
                  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                  emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
                  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
                  amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                }[stat.color as keyof typeof colorClasses];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl dark:hover:shadow-brand/5 transition-all group dark-glow"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${colorClasses}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Performance Overview */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100 mb-6">Performance Overview</h2>
              <div className="h-64 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-700">
                <p className="text-zinc-400 dark:text-zinc-500 italic">Analytics visualization placeholder</p>
              </div>
            </div>
          </div>
        ) : activeTab === 'items' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100">{t.manageItems}</h2>
              <button
                onClick={() => {
                  setEditingItem({
                    name: { fr: '', ar: '' },
                    description: { fr: '', ar: '' },
                    price: 0,
                    category: CATEGORIES[1],
                    type: 'product',
                    image: 'https://picsum.photos/seed/new/600/400'
                  });
                  setIsModalOpen(true);
                }}
                className="bg-zinc-900 dark:bg-brand text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand transition-all shadow-lg hover:shadow-brand/20"
              >
                <Plus className="w-5 h-5" />
                {t.addItem}
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">Item</th>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">Category</th>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">Price</th>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">Type</th>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.name[language]}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100">
                          {item.price.toFixed(3)} {t.currency}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.type === 'product' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-zinc-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100">{t.manageOrders}</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.orderId}</th>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.customer}</th>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.date}</th>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.total}</th>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.status}</th>
                      <th className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 text-right">{t.updateStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{order.userEmail}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          {new Date(order.createdAt).toLocaleDateString(language)}
                        </td>
                        <td className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-100">
                          {order.total.toFixed(2)} {t.currency}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {order.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                            {order.status === 'processing' && <Clock className="w-4 h-4 text-blue-500" />}
                            {order.status === 'shipped' && <Truck className="w-4 h-4 text-indigo-500" />}
                            {order.status === 'delivered' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            {order.status === 'cancelled' && <XCircle className="w-4 h-4 text-red-500" />}
                            <span className="text-xs font-bold uppercase tracking-wider">
                              {t.orderStatus[order.status]}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as Order['status'];
                              onUpdateOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                            }}
                            className="bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-lg text-xs font-bold p-2 outline-none focus:ring-2 focus:ring-brand/20 transition-all dark:text-zinc-200"
                          >
                            {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
                              <option key={s} value={s}>{t.orderStatus[s]}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100">
                  {editingItem.id ? t.editItem : t.addItem}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                  <X className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{t.nameFr}</label>
                    <input
                      required
                      type="text"
                      value={editingItem.name?.fr}
                      onChange={e => setEditingItem({...editingItem, name: {...editingItem.name!, fr: e.target.value}})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all dark:text-zinc-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{t.nameAr}</label>
                    <input
                      required
                      type="text"
                      dir="rtl"
                      value={editingItem.name?.ar}
                      onChange={e => setEditingItem({...editingItem, name: {...editingItem.name!, ar: e.target.value}})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{t.descFr}</label>
                  <textarea
                    required
                    rows={3}
                    value={editingItem.description?.fr}
                    onChange={e => setEditingItem({...editingItem, description: {...editingItem.description!, fr: e.target.value}})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{t.descAr}</label>
                  <textarea
                    required
                    rows={3}
                    dir="rtl"
                    value={editingItem.description?.ar}
                    onChange={e => setEditingItem({...editingItem, description: {...editingItem.description!, ar: e.target.value}})}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all dark:text-zinc-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{t.priceLabel}</label>
                    <input
                      required
                      type="number"
                      step="0.001"
                      value={editingItem.price}
                      onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all dark:text-zinc-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{t.categoryLabel}</label>
                    <select
                      value={editingItem.category}
                      onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all dark:text-zinc-100"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{t.typeLabel}</label>
                    <select
                      value={editingItem.type}
                      onChange={e => setEditingItem({...editingItem, type: e.target.value as 'product' | 'service'})}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all dark:text-zinc-100"
                    >
                      <option value="product">Product</option>
                      <option value="service">Service</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{t.imageLabel}</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        required
                        type="url"
                        value={editingItem.image}
                        onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all dark:text-zinc-100"
                      />
                    </div>
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      {editingItem.image ? (
                        <img src={editingItem.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-zinc-900 dark:bg-brand text-white rounded-2xl font-bold hover:bg-brand dark:hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand/20 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {t.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
