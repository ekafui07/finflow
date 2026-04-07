import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, ArrowRight, X } from 'lucide-react';
import { BUDGET_TEMPLATES, BudgetTemplate } from '../config/budgetTemplates.config';
import { useApp } from '../AppContext';
import { formatCurrency, cn } from '../lib/utils';

const BudgetTemplatesModal = () => {
  const { hasCompletedOnboarding, applyBudgetTemplate, completeOnboarding, user } = useApp();
  const [selectedTemplate, setSelectedTemplate] = React.useState<BudgetTemplate | null>(null);

  if (hasCompletedOnboarding) return null;

  const handleApply = () => {
    if (selectedTemplate) {
      applyBudgetTemplate(selectedTemplate.budgets);
    } else {
      completeOnboarding();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-[32px] w-full max-w-4xl relative z-10 shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Welcome to UniWallet!</h2>
                  <p className="text-slate-500">Let's set up your first budget in 60 seconds.</p>
                </div>
              </div>
              <button 
                onClick={completeOnboarding}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {BUDGET_TEMPLATES.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={cn(
                    "p-6 rounded-3xl border-2 transition-all cursor-pointer relative group",
                    selectedTemplate?.id === template.id 
                      ? "border-brand-600 bg-brand-50/50 shadow-lg shadow-brand-100" 
                      : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                  )}
                >
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center text-white">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">{template.description}</p>
                  <div className="text-sm font-bold text-brand-600">
                    Total: {formatCurrency(template.totalAmount, user?.currency || 'USD')}
                  </div>
                </div>
              ))}
              <div 
                onClick={() => setSelectedTemplate(null)}
                className={cn(
                  "p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center group",
                  selectedTemplate === null 
                    ? "border-brand-600 bg-brand-50/50" 
                    : "border-slate-200 hover:border-brand-300 hover:bg-slate-50"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                  <X size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Skip Template</h3>
                <p className="text-xs text-slate-500 mt-1">Start from scratch</p>
              </div>
            </div>

            {selectedTemplate && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-3xl p-8 mb-12"
              >
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Budget Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {selectedTemplate.budgets.map((b, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-xs font-bold text-slate-500 uppercase">{b.category}</span>
                      <span className="text-lg font-bold text-slate-900">{formatCurrency(b.limit, user?.currency || 'USD')}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
              <button 
                onClick={completeOnboarding}
                className="text-slate-500 font-bold hover:text-slate-900 transition-colors px-6 py-3"
              >
                Maybe Later
              </button>
              <button 
                onClick={handleApply}
                className="btn-primary px-10 py-4 text-lg w-full sm:w-auto shadow-xl shadow-brand-200"
              >
                {selectedTemplate ? 'Apply Template' : 'Start from Scratch'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BudgetTemplatesModal;
