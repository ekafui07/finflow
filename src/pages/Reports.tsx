import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Download, FileText, Calendar } from 'lucide-react';
import { useApp } from '../AppContext';
import { formatCurrency } from '../lib/utils';

const Reports = () => {
  const data = [
    { name: 'Week 1', income: 1200, expenses: 800 },
    { name: 'Week 2', income: 1500, expenses: 1100 },
    { name: 'Week 3', income: 900, expenses: 1200 },
    { name: 'Week 4', income: 2000, expenses: 900 },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Reports</h2>
          <p className="text-slate-500">Deep dive into your spending habits and trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Calendar size={18} />
            March 2026
          </button>
          <button className="btn-primary">
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Income vs Expenses</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="income" fill="#0e91e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Savings Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Student-Specific Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: 'Coffee Spending', 
              value: '$120', 
              desc: 'That\'s equivalent to 3 textbooks or 15 cafeteria meals.',
              icon: '☕'
            },
            { 
              title: 'Subscription Audit', 
              value: '4 Active', 
              desc: 'You could save $25/mo by canceling unused services.',
              icon: '📱'
            },
            { 
              title: 'Student Discounts', 
              value: '$45 Saved', 
              desc: 'Great job using your ID at local shops this month!',
              icon: '🎓'
            }
          ].map((insight) => (
            <div key={insight.title} className="p-4 bg-slate-50 rounded-2xl relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] text-4xl opacity-10 group-hover:scale-110 transition-transform">
                {insight.icon}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">{insight.title}</p>
              <p className="text-lg font-bold text-slate-900">{insight.value}</p>
              <p className="text-sm text-slate-500">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
