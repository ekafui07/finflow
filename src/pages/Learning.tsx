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
