import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, Plus, X } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatCurrency, cn } from '../lib/utils';
import { isAfter, parseISO, format, addDays, isBefore } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Bill } from '../types';

const BillReminders = () => {
  const { bills, toggleBillPaid, addBill } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBill, setNewBill] = useState<Omit<Bill, 'id' | 'isPaid'>>({
    name: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    category: 'utilities'
  });

  const sortedBills = [...bills].sort((a, b) => 
    parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime()
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addBill({ ...newBill, isPaid: false });
    setIsModalOpen(false);
    setNewBill({
      name: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      category: 'utilities'
    });
  };

  const categories: Category[] = [
    'food', 'transport', 'rent', 'utilities', 'entertainment', 'health', 'subscriptions', 'savings', 'others'
  ];

  return (
    <div className="glass-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Calendar size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Upcoming Bills</h3>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {sortedBills.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-3">
              <Calendar size={24} />
            </div>
            <p className="text-sm text-slate-500">No bills added yet.</p>
          </div>
        ) : (
          sortedBills.map((bill) => {
            const isOverdue = !bill.isPaid && isAfter(new Date(), parseISO(bill.dueDate));
            const isUpcoming = !bill.isPaid && isBefore(parseISO(bill.dueDate), addDays(new Date(), 7));
            
            return (
              <motion.div 
                layout
                key={bill.id} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all",
                  bill.isPaid 
                    ? "bg-slate-50 border-slate-100 opacity-60" 
                    : isUpcoming 
                      ? "bg-amber-50 border-amber-200 shadow-sm" 
                      : "bg-white border-slate-200 shadow-sm"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    bill.isPaid ? "bg-emerald-50 text-emerald-600" : isOverdue ? "bg-rose-50 text-rose-600" : "bg-brand-50 text-brand-600"
                  )}>
                    {bill.isPaid ? <CheckCircle2 size={20} /> : isOverdue ? <AlertCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{bill.name}</p>
                    <p className="text-xs text-slate-500">
                      Due: {format(parseISO(bill.dueDate), 'MMM dd')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-900">{formatCurrency(bill.amount)}</span>
                  <button 
                    onClick={() => toggleBillPaid(bill.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      bill.isPaid 
                        ? "bg-slate-200 text-slate-600" 
                        : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-md"
                    )}
                  >
                    {bill.isPaid ? 'Paid' : 'Pay Now'}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-md relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Add New Bill</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAdd} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Bill Name</label>
                    <input 
                      required
                      type="text" 
                      value={newBill.name}
                      onChange={e => setNewBill({ ...newBill, name: e.target.value })}
                      placeholder="e.g., Internet, Rent, Spotify"
                      className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Amount (GHS)</label>
                      <input 
                        required
                        type="number" 
                        value={newBill.amount || ''}
                        onChange={e => setNewBill({ ...newBill, amount: parseFloat(e.target.value) })}
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Due Date</label>
                      <input 
                        required
                        type="date" 
                        value={newBill.dueDate}
                        onChange={e => setNewBill({ ...newBill, dueDate: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <select 
                      value={newBill.category}
                      onChange={e => setNewBill({ ...newBill, category: e.target.value as Category })}
                      className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all outline-none appearance-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-lg mt-4">
                    Add Bill
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillReminders;
