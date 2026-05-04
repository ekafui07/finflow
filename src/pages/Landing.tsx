import React from 'react';
import { Wallet, Shield, Zap, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
            <Wallet size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">UniWallet</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm font-bold text-slate-600 hover:text-slate-900">Log in</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full text-sm font-bold mb-6">
                Powerful Financial Insights ✨
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
            Master your money with <br />
            <span className="text-brand-600">effortless clarity.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 leading-relaxed">
            UniWallet helps you track spending, set budgets, and reach your savings goals with a premium, intuitive dashboard designed for modern life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth" className="btn-primary px-10 py-4 text-lg shadow-xl shadow-brand-200">
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Hero Image / Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
          <div className="glass-card p-4 shadow-2xl border-slate-200 max-w-5xl mx-auto overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
              alt="Dashboard Preview" 
              className="rounded-xl w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need to thrive.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Powerful tools that feel simple. Built for people who care about their financial future.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Zap, 
                title: 'Real-time Tracking', 
                desc: 'See your transactions as they happen. Categorized automatically for you.' 
              },
              { 
                icon: BarChart3, 
                title: 'Deep Insights', 
                desc: 'Understand your spending habits with beautiful, interactive charts and reports.' 
              },
              { 
                icon: Shield, 
                title: 'Bank-grade Security', 
                desc: 'Your data is encrypted and protected with the highest security standards.' 
              }
            ].map((feature, i) => (
              <div key={i} className="space-y-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-16">Trusted by 50,000+ users worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "The best finance app I've ever used. Period.",
              "Finally, a dashboard that actually makes sense.",
              "Reached my savings goal 3 months early!",
              "Beautiful design and super fast."
            ].map((quote, i) => (
              <div key={i} className="glass-card p-8 text-left italic text-slate-600">
                "{quote}"
                <div className="mt-4 flex items-center gap-2 not-italic">
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                  <span className="text-sm font-bold text-slate-900">User {i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="bg-slate-900 rounded-[32px] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent"></div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Ready to take control?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-12 text-lg relative z-10">Join thousands of others who are building a better financial future with UniWallet.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link to="/auth" className="btn-primary px-10 py-4 text-lg w-full sm:w-auto">Join UniWallet Now</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <Wallet size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">UniWallet</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 UniWallet Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
