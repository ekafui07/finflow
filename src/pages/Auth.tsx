import React, { useState } from 'react';
import { Wallet, Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';
import { useApp } from '../AppContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name || email.split('@')[0]);
      }
    } catch (error) {
      // Error handled by AppContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-200 group-hover:scale-110 transition-transform">
              <Wallet size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">UniWallet</h2>
          </Link>
          <p className="text-slate-500 text-center mt-2">
            {isLogin ? 'Welcome back! Please enter your details.' : 'Create your account to start tracking.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button type="button" className="text-sm font-bold text-brand-600 hover:text-brand-700">Forgot password?</button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-primary py-3 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-brand-600 hover:text-brand-700"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
