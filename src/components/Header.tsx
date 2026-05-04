import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Plus, X, ArrowRight, Wallet, Target, Calendar, BookOpen, Trash2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { ARTICLES } from '../config/articles.config';
import { SearchResult, AppNotification } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface HeaderProps {
  title: string;
  onAddClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onAddClick }) => {
  const { transactions, budgets, goals, bills, user, notifications, markNotificationAsRead, deleteNotification, clearAllNotifications } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search Transactions
    transactions.forEach(t => {
      if (t.description.toLowerCase().includes(query) || t.category.toLowerCase().includes(query)) {
        results.push({
          id: t.id,
          title: t.description,
          subtitle: `Transaction • ${t.category}`,
          type: 'transaction',
          link: '/transactions',
          amount: t.amount
        });
      }
    });

    // Search Budgets
    budgets.forEach(b => {
      if (b.category.toLowerCase().includes(query)) {
        results.push({
          id: b.id,
          title: `${b.category.charAt(0).toUpperCase() + b.category.slice(1)} Budget`,
          subtitle: `Budget • ${formatCurrency(b.limit, user?.currency || 'GHS')}`,
          type: 'budget',
          link: '/budgets'
        });
      }
    });

    // Search Goals
    goals.forEach(g => {
      if (g.name.toLowerCase().includes(query)) {
        results.push({
          id: g.id,
          title: g.name,
          subtitle: `Savings Goal • ${formatCurrency(g.targetAmount, user?.currency || 'GHS')}`,
          type: 'goal',
          link: '/budgets'
        });
      }
    });

    // Search Bills
    bills.forEach(b => {
      if (b.name.toLowerCase().includes(query)) {
        results.push({
          id: b.id,
          title: b.name,
          subtitle: `Bill • Due ${b.dueDate}`,
          type: 'bill',
          link: '/transactions'
        });
      }
    });

    // Search Articles
    ARTICLES.forEach(a => {
      if (a.title.toLowerCase().includes(query) || a.category.toLowerCase().includes(query)) {
        results.push({
          id: a.id,
          title: a.title,
          subtitle: `Learning • ${a.category}`,
          type: 'article',
          link: '/learning'
        });
      }
    });

    setSearchResults(results.slice(0, 8));
  }, [searchQuery, transactions, budgets, goals, bills, user]);

  const handleResultClick = (link: string) => {
    navigate(link);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <Wallet size={16} className="text-emerald-500" />;
      case 'budget': return <Target size={16} className="text-brand-500" />;
      case 'goal': return <Target size={16} className="text-amber-500" />;
      case 'bill': return <Calendar size={16} className="text-rose-500" />;
      case 'article': return <BookOpen size={16} className="text-indigo-500" />;
      default: return <Search size={16} />;
    }
  };

  return (
    <>
    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-4 md:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 lg:hidden" />
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 truncate">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        {/* Mobile Search Toggle */}
        <button 
          onClick={() => setIsMobileSearchOpen(true)}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Search size={20} />
        </button>
        <div className="relative hidden md:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search records, goals, guides..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all w-64 lg:w-80 text-sm outline-none"
          />

          <AnimatePresence>
            {isSearchOpen && (searchQuery.length > 0 || searchResults.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result.link)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                      >
                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{result.title}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{result.subtitle}</p>
                        </div>
                        {result.amount && (
                          <span className="text-sm font-bold text-slate-900">
                            {formatCurrency(result.amount, user?.currency || 'GHS')}
                          </span>
                        )}
                        <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-500">No results found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Quick Search</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['Food', 'Rent', 'Savings', 'Bills'].map(tag => (
                          <button 
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="px-3 py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg text-xs font-medium text-slate-600 transition-colors text-left"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-brand-100 text-brand-600 rounded-full text-[10px] font-bold">
                          {unreadCount} New
                        </span>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearAllNotifications();
                          }}
                          className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id}
                          className={cn(
                            "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                            !n.isRead && "bg-brand-50/30"
                          )}
                          onClick={() => {
                            if (!n.isRead) markNotificationAsRead(n.id);
                            if (n.link) {
                              navigate(n.link);
                              setIsNotificationsOpen(false);
                            }
                          }}
                        >
                          <div className="flex gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              n.type === 'bill' ? "bg-rose-50 text-rose-600" :
                              n.type === 'budget' ? "bg-amber-50 text-amber-600" :
                              n.type === 'goal' ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600"
                            )}>
                              {n.type === 'bill' ? <Calendar size={16} /> :
                               n.type === 'budget' ? <Target size={16} /> :
                               n.type === 'goal' ? <Target size={16} /> : <Bell size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 mb-0.5">{n.title}</p>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                {formatDistanceToNow(parseISO(n.date), { addSuffix: true })}
                              </p>
                            </div>
                            {!n.isRead && (
                              <div className="w-2 h-2 bg-brand-500 rounded-full mt-1.5 shrink-0" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(n.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all shrink-0"
                              title="Delete notification"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-3">
                          <Bell size={24} />
                        </div>
                        <p className="text-sm text-slate-500">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {onAddClick && (
            <button 
              onClick={onAddClick}
              className="btn-primary"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add New</span>
            </button>
          )}
        </div>
      </div>
    </header>

    {/* Mobile Search Overlay */}
    <AnimatePresence>
      {isMobileSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-white md:hidden"
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  autoFocus
                  placeholder="Search records, goals, guides..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all text-sm outline-none"
                />
              </div>
            </div>

            <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => {
                        handleResultClick(result.link);
                        setIsMobileSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{result.title}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{result.subtitle}</p>
                      </div>
                      {result.amount && (
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(result.amount, user?.currency || 'GHS')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No results found for "{searchQuery}"</p>
                </div>
              ) : searchQuery.length === 0 ? (
                <div className="p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Search</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Food', 'Rent', 'Savings', 'Bills'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-2.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg text-sm font-medium text-slate-600 transition-colors text-left"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Header;
