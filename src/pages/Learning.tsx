import React, { useState } from 'react';
import { BookOpen, ArrowRight, Clock, Tag, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ARTICLES, Article } from '../config/articles.config';
import { cn } from '../lib/utils';

const ArticleCard: React.FC<{ article: Article; onClick: (article: Article) => void }> = ({ article, onClick }) => (
  <motion.div
    layoutId={article.id}
    onClick={() => onClick(article)}
    className="glass-card overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
  >
    <div className="h-48 overflow-hidden relative">
      <img 
        src={article.image} 
        alt={article.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-brand-600 shadow-sm flex items-center gap-1">
          <Tag size={12} />
          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
        </span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mb-3">
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {article.readTime}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
        {article.title}
      </h3>
      <p className="text-slate-500 text-sm line-clamp-2 mb-4">
        {article.intro}
      </p>
      <div className="flex items-center gap-2 text-sm font-bold text-brand-600">
        Read Article
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </motion.div>
);

const Learning = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
            <BookOpen size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Financial Literacy Hub</h1>
        </div>
        <p className="text-slate-500 max-w-2xl">
          Master your money with practical, student-focused guides. Learn how to budget, save, and build a strong financial foundation.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} onClick={setSelectedArticle} />
        ))}
      </div>

      <section className="mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Tag size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sample Student Portfolios (Ghana)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'The Conservative Starter',
              desc: 'Focus on safety and liquidity. Best for short-term savings.',
              allocation: [
                { label: 'Treasury Bills', value: 80, color: '#0e91e9' },
                { label: 'MoMo Savings', value: 20, color: '#10b981' }
              ],
              risk: 'Low'
            },
            {
              name: 'The Balanced Builder',
              desc: 'Mix of safety and growth. Good for 1-2 year goals.',
              allocation: [
                { label: 'T-Bills', value: 50, color: '#0e91e9' },
                { label: 'Mutual Funds', value: 40, color: '#f59e0b' },
                { label: 'Stocks', value: 10, color: '#ef4444' }
              ],
              risk: 'Medium'
            },
            {
              name: 'The Aggressive Grower',
              desc: 'Maximum growth for long-term wealth (3+ years).',
              allocation: [
                { label: 'Equity Funds', value: 60, color: '#f59e0b' },
                { label: 'Stocks', value: 30, color: '#ef4444' },
                { label: 'T-Bills', value: 10, color: '#0e91e9' }
              ],
              risk: 'High'
            }
          ].map((portfolio, i) => (
            <div key={i} className="glass-card p-6 border-slate-100 hover:border-brand-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900">{portfolio.name}</h4>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  portfolio.risk === 'Low' ? "bg-emerald-50 text-emerald-600" :
                  portfolio.risk === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                )}>
                  {portfolio.risk} Risk
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">{portfolio.desc}</p>
              
              <div className="space-y-4">
                {portfolio.allocation.map((item, j) => (
                  <div key={j} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ delay: 0.5 + (i * 0.1) + (j * 0.1), duration: 1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Tag size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Student Discounts & Perks</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              brand: 'Spotify',
              discount: '50% OFF',
              category: 'Entertainment',
              desc: 'Premium for Students with Hulu & SHOWTIME.',
              color: 'bg-emerald-50 text-emerald-600'
            },
            {
              brand: 'Apple',
              discount: 'Save up to GHS 1,000',
              category: 'Tech',
              desc: 'Education pricing on Mac and iPad.',
              color: 'bg-slate-900 text-white'
            },
            {
              brand: 'Amazon Prime',
              discount: '6 Months Free',
              category: 'Shopping',
              desc: 'Then 50% off. Fast shipping & Prime Video.',
              color: 'bg-brand-50 text-brand-600'
            },
            {
              brand: 'Adobe',
              discount: '60% OFF',
              category: 'Creative',
              desc: 'Creative Cloud All Apps for students.',
              color: 'bg-rose-50 text-rose-600'
            }
          ].map((perk, i) => (
            <div key={i} className="glass-card p-6 border-slate-100 hover:border-brand-200 transition-all group">
              <div className={cn("w-full h-12 rounded-xl flex items-center justify-center font-black text-lg mb-4", perk.color)}>
                {perk.brand}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{perk.category}</span>
                  <span className="text-xs font-bold text-brand-600">{perk.discount}</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{perk.brand} Student</p>
                <p className="text-xs text-slate-500 leading-relaxed">{perk.desc}</p>
              </div>
              <button className="w-full mt-4 py-2 bg-slate-50 hover:bg-brand-600 hover:text-white rounded-lg text-xs font-bold text-slate-600 transition-all">
                Claim Discount
              </button>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={selectedArticle.id}
              className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 left-6 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-slate-600 hover:text-brand-600 transition-colors flex items-center gap-2 text-sm font-bold pr-4"
              >
                <ChevronLeft size={20} />
                Back
              </button>

              <div className="overflow-y-auto">
                <div className="h-64 md:h-96 relative">
                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>

                <div className="px-8 md:px-16 pb-16 -mt-20 relative">
                  <span className="px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full text-sm font-bold mb-6 inline-block">
                    {selectedArticle.category.charAt(0).toUpperCase() + selectedArticle.category.slice(1)}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    {selectedArticle.title}
                  </h2>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-400 mb-10 border-b border-slate-100 pb-6">
                    <span className="flex items-center gap-2">
                      <Clock size={18} />
                      {selectedArticle.readTime} read
                    </span>
                    <span className="flex items-center gap-2">
                      <BookOpen size={18} />
                      Student Guide
                    </span>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8 italic">
                      {selectedArticle.intro}
                    </p>
                    <div className="text-slate-600 leading-relaxed space-y-6 text-lg">
                      {selectedArticle.content.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    <div className="mt-12 bg-slate-50 rounded-3xl p-8 border border-slate-100">
                      <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Sparkles className="text-brand-600" size={24} />
                        Actionable Tips
                      </h4>
                      <ul className="space-y-4">
                        {selectedArticle.tips.map((tip, i) => (
                          <li key={i} className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                              {i + 1}
                            </div>
                            <p className="text-slate-700 font-medium">{tip}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sparkles = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

export default Learning;
