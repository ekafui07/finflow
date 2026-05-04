import React, { useState } from 'react';
import { 
  Plus, 
  AlertCircle, 
  ChevronRight, 
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
  X,
  Trash2
} from 'lucide-react';
import { useApp } from '../AppContext';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Budget, Category } from '../types';

const Budgets = () => {
  const { budgets, applyBudgetTemplate, addBudget, updateBudget, deleteBudget, user, isLoading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  const [newBudget, setNewBudget] = useState<Omit<Budget, 'id'>>({
    category: 'food',
    limit: 0,
    spent: 0,
    period: 'monthly'
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const categories: Category[] = [
    'food', 'transport', 'rent', 'utilities', 'entertainment', 'health', 'subscriptions', 'savings', 'others'
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBudget.limit <= 0) return;

    setIsSubmitting(true);
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, newBudget);
      } else {
        await addBudget(newBudget);
      }
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
    setNewBudget({
      category: 'food',
      limit: 0,
      spent: 0,
      period: 'monthly'
    });
  };

  const openEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      limit: budget.limit,
      spent: budget.spent,
      period: budget.period
    });
    setIsModalOpen(true);
  };

  const studentTemplates = [
    {
      name: "On-Campus Living",
      desc: "Focus on meal plans and small personal expenses.",
      icon: "🏫",
      template: [
        { category: 'food', limit: 200, spent: 0, period: 'monthly' },
        { category: 'entertainment', limit: 100, spent: 0, period: 'monthly' },
        { category: 'others', limit: 50, spent: 0, period: 'monthly' },
      ]
    },
    {
      name: "Off-Campus Living",
      desc: "Includes rent, utilities, and groceries.",
      icon: "🏠",
      template: [
        { category: 'rent', limit: 800, spent: 0, period: 'monthly' },
        { category: 'utilities', limit: 150, spent: 0, period: 'monthly' },
        { category: 'food', limit: 300, spent: 0, period: 'monthly' },
        { category: 'transport', limit: 100, spent: 0, period: 'monthly' },
      ]
    },
    {
      name: "Study Abroad",
      desc: "Higher budget for travel and experiences.",
      icon: "✈️",
      template: [
        { category: 'food', limit: 400, spent: 0, period: 'monthly' },
        { category: 'entertainment', limit: 500, spent: 0, period: 'monthly' },
        { category: 'transport', limit: 200, spent: 0, period: 'monthly' },
      ]
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Budgets</h2>
          <p className="text-slate-500">Plan your spending and stay on track.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary w-full sm:w-auto">
          <Plus size={18} />
          Create Budget
        </button>
      </div>

      {/* Student Templates */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-amber-500" size={20} />
          Student Budget Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {studentTemplates.map((t) => (
            <button 
              key={t.name}
              onClick={() => applyBudgetTemplate(t.template as any)}
              className="glass-card p-4 text-left hover:border-brand-300 hover:bg-brand-50/30 transition-all group"
            >
              <div className="text-3xl mb-2">{t.icon}</div>
              <h4 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{t.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-brand-500">
          <p className="text-sm font-medium text-slate-500">Total Budgeted</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(budgets.reduce((acc, b) => acc + b.limit, 0), user?.currency || 'USD')}
          </h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-emerald-500">
          <p className="text-sm font-medium text-slate-500">Total Spent</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(budgets.reduce((acc, b) => acc + b.spent, 0), user?.currency || 'USD')}
          </h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-amber-500">
          <p className="text-sm font-medium text-slate-500">Remaining</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(budgets.reduce((acc, b) => acc + (b.limit - b.spent), 0), user?.currency || 'USD')}
          </h3>
        </div>
      </div>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget, i) => {
          const percent = (budget.spent / budget.limit) * 100;
          const isOver = percent > 100;
          const isNear = percent > 85;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => openEdit(budget)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <PieIcon size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 capitalize">{budget.category}</h4>
                    <p className="text-sm text-slate-500">Monthly Budget</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Progress</span>
                  <span className={cn(
                    isOver ? "text-rose-600" : isNear ? "text-amber-600" : "text-slate-900"
                  )}>
                    {Math.round(percent)}%
                  </span>
                </div>
                
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percent, 100)}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isOver ? "bg-rose-500" : isNear ? "bg-amber-500" : "bg-brand-500"
                    )}
                  />
                </div>

                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Spent</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(budget.spent, user?.currency || 'USD')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Limit</p>
                    <p className="text-lg font-bold text-slate-900">{formatCurrency(budget.limit, user?.currency || 'USD')}</p>
                  </div>
                </div>

                {isNear && (
                  <div className={cn(
                    "flex items-center gap-2 p-3 rounded-xl text-sm font-medium",
                    isOver ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                  )}>
                    <AlertCircle size={16} />
                    {isOver 
                      ? `You've exceeded your ${budget.category} budget!` 
                      : `You're nearing your ${budget.category} limit.`}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Budget Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingBudget ? 'Edit Budget' : 'Create Budget'}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Category</label>
                  <select 
                    value={newBudget.category}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all capitalize"
                    disabled={!!editingBudget}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Monthly Limit</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={newBudget.limit || ''}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, limit: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  {editingBudget && (
                    <button 
                      type="button" 
                      onClick={() => {
                        deleteBudget(editingBudget.id);
                        closeModal();
                      }}
                      className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : (editingBudget ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Insights Section */}
      {budgets.length > 0 && (
        <div className="glass-card p-8 bg-brand-600 text-white overflow-hidden relative">
          <div className="relative z-10 max-w-lg">
            <h3 className="text-2xl font-bold mb-2">Smart Budgeting Insights</h3>
            {(() => {
              const overBudgets = budgets.filter(b => b.spent > b.limit);
              const nearBudgets = budgets.filter(b => b.spent > b.limit * 0.85 && b.spent <= b.limit);
              
              if (overBudgets.length > 0) {
                const b = overBudgets[0];
                const suggestion = Math.ceil((b.spent - b.limit + 50) / 10) * 10;
                return (
                  <>
                    <p className="text-brand-100 mb-6">
                      You've exceeded your <span className="font-bold capitalize">{b.category}</span> budget by {formatCurrency(b.spent - b.limit, user?.currency || 'USD')}. 
                      We recommend increasing it by <span className="font-bold">{formatCurrency(suggestion, user?.currency || 'USD')}</span> to stay on track next month.
                    </p>
                    <button 
                      onClick={() => updateBudget(b.id, { limit: b.limit + suggestion })}
                      className="bg-white text-brand-600 px-6 py-2 rounded-xl font-bold hover:bg-brand-50 transition-colors"
                    >
                      Apply Suggestion
                    </button>
                  </>
                );
              } else if (nearBudgets.length > 0) {
                const b = nearBudgets[0];
                return (
                  <p className="text-brand-100 mb-6">
                    You're doing great! You're nearing your <span className="font-bold capitalize">{b.category}</span> limit, but still within budget. 
                    Keep an eye on your spending for the rest of the month.
                  </p>
                );
              } else {
                return (
                  <p className="text-brand-100 mb-6">
                    Excellent work! All your budgets are well-managed this month. You're on track to save more than projected.
                  </p>
                );
              }
            })()}
          </div>
          <TrendingUp className="absolute right-[-20px] bottom-[-20px] text-brand-500/20 w-64 h-64 -rotate-12" />
        </div>
      )}
    </div>
  );
};

export default Budgets;
