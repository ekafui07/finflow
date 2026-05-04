import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { 
  Download, 
  FileText, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Coffee, 
  Smartphone, 
  GraduationCap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap
} from 'lucide-react';
import { useApp } from '../AppContext';
import { formatCurrency, exportToCSV, cn } from '../lib/utils';
import { 
  startOfMonth, 
  endOfMonth, 
  eachWeekOfInterval, 
  format, 
  isWithinInterval, 
  parseISO, 
  subMonths,
} from 'date-fns';

const Reports = () => {
  const { transactions, user, budgets, isLoading } = useApp();

  const reportData = useMemo(() => {
    if (isLoading || transactions.length === 0) return { 
      weeklyData: [], 
      categoryData: [], 
      insights: [], 
      comparisonData: [],
      healthScore: 0,
      topCategories: []
    };

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const prevMonthEnd = endOfMonth(subMonths(now, 1));
    const userCurrency = user?.currency || 'GHS';

    // 1. Weekly Data (Current Month)
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    const weeklyData = weeks.map((weekStart, i) => {
      const weekEnd = i === weeks.length - 1 ? monthEnd : weeks[i + 1];
      const weekTransactions = transactions.filter(t => 
        isWithinInterval(parseISO(t.date), { start: weekStart, end: weekEnd })
      );

      const income = weekTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expenses = weekTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

      return {
        name: `Week ${i + 1}`,
        income,
        expenses
      };
    });

    // 2. Category Data (Current Month)
    const categories: Record<string, number> = {};
    const currentMonthExpenses = transactions.filter(t => 
      t.type === 'expense' && 
      isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })
    );
    
    currentMonthExpenses.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    
    const categoryData = Object.entries(categories)
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
      .sort((a, b) => b.value - a.value);

    const totalExpenses = currentMonthExpenses.reduce((acc, t) => acc + t.amount, 0);
    const topCategories = categoryData.slice(0, 5).map(cat => ({
      ...cat,
      percentage: totalExpenses > 0 ? (cat.value / totalExpenses) * 100 : 0
    }));

    // 3. Monthly Comparison
    const currentIncome = transactions
      .filter(t => t.type === 'income' && isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd }))
      .reduce((acc, t) => acc + t.amount, 0);
    
    const prevIncome = transactions
      .filter(t => t.type === 'income' && isWithinInterval(parseISO(t.date), { start: prevMonthStart, end: prevMonthEnd }))
      .reduce((acc, t) => acc + t.amount, 0);

    const prevExpenses = transactions
      .filter(t => t.type === 'expense' && isWithinInterval(parseISO(t.date), { start: prevMonthStart, end: prevMonthEnd }))
      .reduce((acc, t) => acc + t.amount, 0);

    const comparisonData = [
      { name: 'Previous Month', income: prevIncome, expenses: prevExpenses },
      { name: 'Current Month', income: currentIncome, expenses: totalExpenses }
    ];

    // 4. Financial Health Score (0-100)
    // Factors: Savings Rate (40%), Budget Adherence (40%), Consistency (20%)
    const savingsRate = currentIncome > 0 ? (currentIncome - totalExpenses) / currentIncome : 0;
    const savingsScore = Math.min(100, Math.max(0, savingsRate * 200)); // 50% savings rate = 100 points

    const budgetAdherence = budgets.length > 0 
      ? budgets.filter(b => b.spent <= b.limit).length / budgets.length 
      : 1;
    const budgetScore = budgetAdherence * 100;

    const daysWithTransactions = new Set(transactions.map(t => t.date)).size;
    const consistencyScore = Math.min(100, (daysWithTransactions / 30) * 100);

    const healthScore = Math.round((savingsScore * 0.4) + (budgetScore * 0.4) + (consistencyScore * 0.2));

    // 5. Insights
    const coffeeSpending = transactions
      .filter(t => t.description.toLowerCase().includes('coffee') || t.description.toLowerCase().includes('cafe'))
      .reduce((acc, t) => acc + t.amount, 0);
    
    const subSpending = transactions
      .filter(t => t.category === 'subscriptions')
      .reduce((acc, t) => acc + t.amount, 0);

    const insights = [
      { 
        title: 'Coffee Spending', 
        value: formatCurrency(coffeeSpending, userCurrency), 
        desc: coffeeSpending > 50 ? 'Consider brewing at home to save for textbooks.' : 'Great job keeping your caffeine budget in check!',
        icon: <Coffee size={20} />,
        trend: coffeeSpending > 0 ? 'caution' : 'good'
      },
      { 
        title: 'Subscription Audit', 
        value: formatCurrency(subSpending, userCurrency), 
        desc: subSpending > 100 ? 'You could save by canceling unused services.' : 'Your subscription list is lean and mean.',
        icon: <Smartphone size={20} />,
        trend: subSpending > 80 ? 'caution' : 'good'
      },
      { 
        title: 'Student Savings', 
        value: formatCurrency(transactions.filter(t => t.category === 'savings').reduce((acc, t) => acc + t.amount, 0), userCurrency), 
        desc: 'Every GHS saved today is a step towards financial freedom.',
        icon: <GraduationCap size={20} />,
        trend: 'good'
      }
    ];

    return { weeklyData, categoryData, insights, comparisonData, healthScore, topCategories };
  }, [transactions, budgets, isLoading, user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const COLORS = ['#0e91e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Financial Reports</h2>
          <p className="text-slate-500 mt-1">Deep dive into your spending habits and trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="btn-primary" 
            onClick={() => exportToCSV(transactions, 'finflow-full-report.csv')}
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Financial Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity size={80} className="text-brand-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Financial Health Score</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 - (552.92 * reportData.healthScore) / 100}
                  strokeLinecap="round"
                  className={cn(
                    "transition-all duration-1000",
                    reportData.healthScore >= 80 ? "text-emerald-500" :
                    reportData.healthScore >= 50 ? "text-brand-500" : "text-rose-500"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900">{reportData.healthScore}</span>
                <span className="text-xs font-bold text-slate-400 uppercase mt-1">out of 100</span>
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-slate-600 max-w-[200px]">
              {reportData.healthScore >= 80 ? "Excellent! You're managing your money like a pro." :
               reportData.healthScore >= 50 ? "Good progress. There's room to optimize your savings." :
               "Let's work on reducing expenses and building a safety net."}
            </p>
          </div>

          <div className="lg:col-span-2 glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-brand-600" />
                Monthly Comparison
              </h3>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-brand-500" />
                  <span className="text-slate-500">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-slate-500">Expenses</span>
                </div>
              </div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.comparisonData} barGap={12}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                  />
                  <Bar dataKey="income" fill="#0e91e9" radius={[6, 6, 0, 0]} barSize={40} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
              <Zap size={20} className="text-brand-600" />
              Weekly Spending Flow
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
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
                  <Bar dataKey="income" fill="#0e91e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
              <Target size={20} className="text-brand-600" />
              Top Spending Categories
            </h3>
            <div className="space-y-6">
              {reportData.topCategories.length > 0 ? (
                reportData.topCategories.map((cat, i) => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-900">{formatCurrency(cat.value, user?.currency || 'GHS')}</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                          {Math.round(cat.percentage)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${cat.percentage}%`, 
                          backgroundColor: COLORS[i % COLORS.length] 
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                  No expense data for this month yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student-Specific Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportData.insights.map((insight) => (
              <div key={insight.title} className="p-6 bg-white rounded-2xl relative overflow-hidden group border border-slate-100 hover:border-brand-200 transition-all shadow-sm">
                <div className={cn(
                  "absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform",
                  insight.trend === 'good' ? "text-emerald-600" : "text-amber-600"
                )}>
                  {insight.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{insight.title}</p>
                  {insight.trend === 'good' ? (
                    <ArrowDownRight size={14} className="text-emerald-500" />
                  ) : (
                    <ArrowUpRight size={14} className="text-amber-500" />
                  )}
                </div>
                <p className="text-2xl font-black text-slate-900 mb-2">{insight.value}</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{insight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
