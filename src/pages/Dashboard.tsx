import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Wallet,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../AppContext';
import { formatCurrency, formatPercent, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import BillReminders from '../components/BillReminders';
import SavingsInsightCard from '../components/SavingsInsightCard';
import SplitBillCalculator from '../components/SplitBillCalculator';
import BudgetTemplatesModal from '../components/BudgetTemplatesModal';

import { 
  isSameMonth, 
  parseISO, 
  startOfMonth, 
  subMonths, 
  format, 
  eachMonthOfInterval,
  startOfYear,
  isBefore,
  addDays
} from 'date-fns';

const Dashboard = () => {
  const { transactions, budgets, user, bills, dismissedAlerts, dismissAlert, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate stats
  const now = new Date();
  
  const currentMonthTransactions = transactions.filter(t => 
    isSameMonth(parseISO(t.date), now)
  );

  const lastMonthTransactions = transactions.filter(t => 
    isSameMonth(parseISO(t.date), subMonths(now, 1))
  );

  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlyIncome - monthlyExpenses) / monthlyIncome : 0;
  
  // Smart Alerts logic
  const alerts = [];
  
  // 1. Upcoming Bills Alert
  const upcomingBills = bills.filter(b => !b.isPaid && isBefore(parseISO(b.dueDate), addDays(now, 3)));
  if (upcomingBills.length > 0) {
    alerts.push({
      id: 'alert-bills',
      type: 'bill',
      message: `You have ${upcomingBills.length} bills due in the next 3 days.`,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    });
  }
  
  // 2. Budget Alerts
  const overBudgets = budgets.filter(b => (b.spent / b.limit) > 0.9);
  if (overBudgets.length > 0) {
    alerts.push({
      id: 'alert-budget',
      type: 'budget',
      message: `You've used over 90% of your budget in ${overBudgets.length} categories.`,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    });
  }

  // 3. Subscription Alert
  const subSpending = currentMonthTransactions
    .filter(t => t.category === 'subscriptions')
    .reduce((acc, t) => acc + t.amount, 0);
  if (subSpending > 0) {
    alerts.push({
      id: 'alert-subs',
      type: 'subscription',
      message: `You've spent ${formatCurrency(subSpending, user?.currency || 'USD')} on subscriptions this month.`,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    });
  }

  // 4. Food Spending Increase Alert
  const currentFood = currentMonthTransactions
    .filter(t => t.category === 'food')
    .reduce((acc, t) => acc + t.amount, 0);
  const lastFood = lastMonthTransactions
    .filter(t => t.category === 'food')
    .reduce((acc, t) => acc + t.amount, 0);
  
  if (lastFood > 0 && currentFood > lastFood * 1.2) {
    alerts.push({
      id: 'alert-food',
      type: 'spending',
      message: `Your food spending is ${Math.round(((currentFood - lastFood) / lastFood) * 100)}% higher than last month.`,
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    });
  }

  const activeAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));

  // Generate Cash Flow Data (Last 6 months)
  const last6Months = eachMonthOfInterval({
    start: subMonths(now, 5),
    end: now
  });

  const cashFlowData = last6Months.map(month => {
    const monthTransactions = transactions.filter(t => isSameMonth(parseISO(t.date), month));
    return {
      name: format(month, 'MMM'),
      income: monthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
      expenses: monthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0),
    };
  });

  // Generate Category Data (Current Month)
  const categoryTotals = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const colors: Record<string, string> = {
    food: '#3b82f6',
    transport: '#10b981',
    rent: '#f59e0b',
    utilities: '#ef4444',
    entertainment: '#8b5cf6',
    health: '#ec4899',
    subscriptions: '#6366f1',
    savings: '#14b8a6',
    others: '#94a3b8'
  };

  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
    color: colors[name] || colors.others
  })).sort((a, b) => b.value - a.value);

  const totalMonthlySpending: number = (Object.values(categoryTotals) as number[]).reduce((acc: number, v: number) => acc + v, 0);

  const stats = [
    { label: 'Total Balance', value: totalBalance, icon: Wallet, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Monthly Income', value: monthlyIncome, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Monthly Expenses', value: monthlyExpenses, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Savings Rate', value: formatPercent(savingsRate), icon: PiggyBank, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const formatWithUserCurrency = (val: number) => formatCurrency(val, user?.currency || 'USD');

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <BudgetTemplatesModal />
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your finances today.</p>
        </div>
        
        <AnimatePresence>
          {activeAlerts.length > 0 && (
            <div className="flex flex-col gap-2">
              {activeAlerts.map((alert) => (
                <motion.div 
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn("px-4 py-2 rounded-xl border text-sm font-medium flex items-center gap-3 shadow-sm transition-colors", 
                    alert.type === 'bill' ? "bg-amber-50 text-amber-700 border-amber-200" :
                    alert.type === 'budget' ? "bg-rose-50 text-rose-700 border-rose-200" :
                    alert.type === 'subscription' ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                    "bg-orange-50 text-orange-700 border-orange-200"
                  )}
                >
                  <AlertCircle size={16} />
                  <span className="flex-1">{alert.message}</span>
                  <button 
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start">
              <div className={cn("p-3 rounded-xl", 
                stat.label === 'Total Balance' ? "bg-brand-50" :
                stat.label === 'Monthly Income' ? "bg-emerald-50" :
                stat.label === 'Monthly Expenses' ? "bg-rose-50" :
                "bg-amber-50"
              )}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {typeof stat.value === 'number' ? formatWithUserCurrency(stat.value) : stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Cash Flow Trend</h3>
            <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-lg px-3 py-1 outline-none">
              <option>Last 7 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e91e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0e91e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => formatWithUserCurrency(value)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    color: '#0f172a'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#0e91e9" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  fillOpacity={0} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Spending Breakdown</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-xs font-medium text-slate-500">Total</p>
              <p className="text-lg font-bold text-slate-900">{formatWithUserCurrency(totalMonthlySpending)}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{formatWithUserCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Bill Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SavingsInsightCard />
        <div className="lg:col-span-2">
          <BillReminders />
        </div>
      </div>

      {/* Split Bill & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SplitBillCalculator />
        </div>
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">View All</button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    t.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.description}</p>
                    <p className="text-xs text-slate-500">{format(parseISO(t.date), 'MMM dd, yyyy')} • {t.category}</p>
                  </div>
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  t.type === 'income' ? "text-emerald-600" : "text-slate-900"
                )}>
                  {t.type === 'income' ? '+' : '-'}{formatWithUserCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
