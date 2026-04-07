import React, { useState } from 'react';
import { 
  Plus, 
  Target, 
  Calendar, 
  TrendingUp,
  ChevronRight,
  Sparkles,
  X,
  Trash2
} from 'lucide-react';
import { useApp } from '../AppContext';
import { formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { differenceInMonths, parseISO } from 'date-fns';
import { SavingsGoal } from '../types';

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal, user, isLoading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [savingsAmount, setSavingsAmount] = useState(0);
  
  const [newGoal, setNewGoal] = useState<Omit<SavingsGoal, 'id'>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date().toISOString().split('T')[0],
    category: 'savings',
    color: '#3b82f6'
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || newGoal.targetAmount <= 0) return;

    setIsSubmitting(true);
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, newGoal);
      } else {
        await addGoal(newGoal);
      }
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    setNewGoal({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: new Date().toISOString().split('T')[0],
      category: 'savings',
      color: '#3b82f6'
    });
  };

  const openEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline,
      category: goal.category,
      color: goal.color
    });
    setIsModalOpen(true);
  };

  const handleAddSavings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || savingsAmount <= 0) return;
    
    setIsSubmitting(true);
    try {
      await updateGoal(editingGoal.id, {
        currentAmount: editingGoal.currentAmount + savingsAmount
      });
      
      setIsSavingsModalOpen(false);
      setEditingGoal(null);
      setSavingsAmount(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Savings Goals</h2>
          <p className="text-slate-500">Dream big, save smart. Track your progress.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={18} />
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {goals.map((goal, i) => {
            const percent = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const monthsLeft = differenceInMonths(parseISO(goal.deadline), new Date());
            const monthlyNeeded = monthsLeft > 0 ? remaining / monthsLeft : remaining;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: goal.color }}
                      >
                        <Target size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{goal.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar size={14} />
                          <span>Target: {goal.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">{Math.round(percent)}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percent, 100)}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: goal.color }}
                      />
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-900">{formatCurrency(goal.currentAmount, user?.currency || 'USD')}</span>
                      <span className="text-slate-400">{formatCurrency(goal.targetAmount, user?.currency || 'USD')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Remaining</p>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(remaining, user?.currency || 'USD')}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Needed</p>
                      <p className="text-sm font-bold text-brand-600">{formatCurrency(monthlyNeeded, user?.currency || 'USD')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-48 flex flex-col justify-center gap-3">
                  <button 
                    onClick={() => {
                      setEditingGoal(goal);
                      setIsSavingsModalOpen(true);
                    }}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                  >
                    Add Savings
                  </button>
                  <button 
                    onClick={() => openEdit(goal)}
                    className="w-full py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                  >
                    Edit Goal
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Sparkles className="mb-4 text-brand-200" size={24} />
            <h3 className="text-xl font-bold mb-2">Savings Tip</h3>
            <p className="text-brand-100 text-sm mb-6">Automating your savings can help you reach your goals 2x faster.</p>
            <button className="w-full py-3 bg-white text-brand-600 rounded-xl font-bold text-sm">
              Set Up Auto-Save
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Goal Modal */}
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
                  {editingGoal ? 'Edit Goal' : 'New Goal'}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Goal Name</label>
                  <input 
                    type="text" 
                    required
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    placeholder="e.g. New Laptop"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Target Amount</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={newGoal.targetAmount || ''}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Deadline</label>
                    <input 
                      type="date" 
                      required
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Theme Color</label>
                  <div className="flex gap-2">
                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewGoal(prev => ({ ...prev, color }))}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          newGoal.color === color ? "border-slate-900 scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  {editingGoal && (
                    <button 
                      type="button" 
                      onClick={() => {
                        deleteGoal(editingGoal.id);
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
                    {isSubmitting ? 'Saving...' : (editingGoal ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Savings Modal */}
      <AnimatePresence>
        {isSavingsModalOpen && editingGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Add Savings</h3>
                <button onClick={() => setIsSavingsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddSavings} className="p-6 space-y-4">
                <p className="text-sm text-slate-500">How much would you like to add to your <span className="font-bold text-slate-900">{editingGoal.name}</span> goal?</p>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Amount</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={savingsAmount || ''}
                    onChange={(e) => setSavingsAmount(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsSavingsModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Savings'}
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

export default Goals;
