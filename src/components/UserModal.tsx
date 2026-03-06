import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, LogIn, UserPlus, Package, LogOut, Heart, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Language, translations } from '../data/translations';
import { User as UserType } from '../types';
import { authService } from '../services/authService';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWishlistClick: () => void;
  onOrdersClick: () => void;
  onAdminClick: () => void;
  language: Language;
  user: UserType | null;
  onLogout: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const UserModal: React.FC<UserModalProps> = ({ 
  isOpen, 
  onClose, 
  onWishlistClick, 
  onOrdersClick,
  onAdminClick,
  language,
  user,
  onLogout,
  onLoginSuccess
}) => {
  const t = translations[language];
  const [mode, setMode] = useState<'login' | 'signup' | 'profile'>(user ? 'profile' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const loggedUser = await authService.login(email, password);
        onLoginSuccess(loggedUser);
      } else {
        const newUser = await authService.signup(name, email, password);
        onLoginSuccess(newUser);
      }
    } catch (err: any) {
      setError(err.message === 'Invalid credentials' ? t.invalidCredentials : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300"
          >
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-100">
                {user ? t.profile : mode === 'login' ? t.login : t.signup}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
              </button>
            </div>

            <div className="p-8">
              {user ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-brand/10 dark:bg-brand/20 rounded-full flex items-center justify-center text-brand font-bold text-2xl mb-4">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{user.name}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400">{user.email}</p>
                    <div className="mt-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {user.role}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                    <button 
                      onClick={() => {
                        onWishlistClick();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">{t.wishlist}</span>
                    </button>
                    <button 
                      onClick={() => {
                        onOrdersClick();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      <span className="font-medium">{t.orders}</span>
                    </button>
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => {
                          onAdminClick();
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-brand/10 dark:hover:bg-brand/20 text-brand transition-colors"
                      >
                        <Lock className="w-5 h-5" />
                        <span className="font-medium">Admin Panel</span>
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">{t.logout}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {mode === 'login' ? t.loginToContinue : t.createAccount}
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  {mode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">
                        {t.fullName}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-transparent dark:border-zinc-800 rounded-xl text-sm focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none dark:text-zinc-100"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">
                      {t.email}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-transparent dark:border-zinc-800 rounded-xl text-sm focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">
                      {t.password}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-transparent dark:border-zinc-800 rounded-xl text-sm focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-zinc-900 dark:bg-brand text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand dark:hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : mode === 'login' ? (
                      <>
                        <LogIn className="w-4 h-4" />
                        {t.login}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        {t.signup}
                      </>
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand transition-colors"
                    >
                      {mode === 'login' ? t.noAccount : t.alreadyHaveAccount}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
