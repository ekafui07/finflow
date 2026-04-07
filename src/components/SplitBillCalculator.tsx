import React, { useState } from 'react';
import { Users, Plus, Minus, Receipt, Share2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { useApp } from '../AppContext';
import toast from 'react-hot-toast';

const SplitBillCalculator = () => {
  const { user } = useApp();
  const [amount, setAmount] = useState<number>(0);
  const [people, setPeople] = useState<number>(2);
  const [tip, setTip] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);

  const total = amount + (amount * (tip / 100)) + (amount * (tax / 100));
  const perPerson = total / people;

  const copyToClipboard = () => {
    const text = `Hey! Our total bill is ${formatCurrency(total, user?.currency || 'GHS')}. Split between ${people} people, it's ${formatCurrency(perPerson, user?.currency || 'GHS')} each.`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
          <Receipt size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Split Bill</h3>
          <p className="text-xs text-slate-500">Quickly split expenses with friends</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Total Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              {user?.currency || 'GHS'}
            </span>
            <input 
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full pl-14 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all outline-none text-lg font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Number of People</label>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 transition-colors"
            >
              <Minus size={20} />
            </button>
            <div className="flex-1 h-12 bg-slate-50 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-900">
              <Users size={18} className="text-slate-400" />
              {people}
            </div>
            <button 
              onClick={() => setPeople(people + 1)}
              className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Tip (%)</label>
            <input 
              type="number"
              value={tip || ''}
              onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Tax (%)</label>
            <input 
              type="number"
              value={tax || ''}
              onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all outline-none"
            />
          </div>
        </div>

        <div className="p-6 bg-brand-600 rounded-2xl text-white shadow-lg shadow-brand-200">
          <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-4">
            <span className="text-sm font-medium opacity-80">Total Bill</span>
            <span className="text-xl font-bold">{formatCurrency(total, user?.currency || 'GHS')}</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Per Person</p>
              <p className="text-3xl font-black">{formatCurrency(perPerson, user?.currency || 'GHS')}</p>
            </div>
            <button 
              onClick={copyToClipboard}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              title="Copy split details"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitBillCalculator;
