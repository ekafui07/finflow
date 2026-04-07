import React from 'react';
import { motion } from 'motion/react';
import { PiggyBank, TrendingUp, ArrowUpRight, Sparkles } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatCurrency, formatPercent, cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { subMonths, format, isSameMonth, parseISO } from 'date-fns';

const SavingsInsightCard = () => {
  const { transactions, goals, user } = useApp();
  const now = new Date();

  // Calculate savings for last 3 months
  const last3Months = [
    subMonths(now, 2),
    subMonths(now, 1),
    now
  ];

  const savingsData = last3Months.map(month => {
    const monthTransactions = transactions.filter(t => isSameMonth(parseISO(t.date), month));
    const income = monthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return {
      name: format(month, 'MMM'),
      savings: Math.max(0, income - expenses),
      month: month
    };
  });

  const currentSavings = savingsData[2].savings;
  const lastMonthSavings = savingsData[1].savings;
  const savingsDiff = lastMonthSavings > 0 ? ((currentSavings - lastMonthSavings) / lastMonthSavings) * 100 : 0;
  
  const projectedYearlySavings = currentSavings * 12;

  // Find a goal to provide a tip for
  const targetGoal = goals.find(g => g.currentAmount < g.targetAmount);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <PiggyBank size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Savings Insights</h3>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1",
          savingsDiff >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {savingsDiff >= 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
          {Math.abs(Math.round(savingsDiff))}% vs last month
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-slate-50 rounded-2xl">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">This Month</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(currentSavings, user?.currency || 'USD')}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Projected Yearly</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(projectedYearlySavings, user?.currency || 'USD')}</p>
        </div>
      </div>

      <div className="h-32 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={savingsData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: '#0f172a'
              }}
            />
            <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
              {savingsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 2 ? '#f59e0b' : '#cbd5e1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {targetGoal && (
        <div className="mt-auto p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
            <Sparkles size={16} />
            Smart Tip
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            Reduce coffee spending by <span className="font-bold">{user?.currency || 'GHS'} 20/month</span> and hit your <span className="font-bold">{targetGoal.name}</span> goal <span className="font-bold">1 week early</span>.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SavingsInsightCard;
