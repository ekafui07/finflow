import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, Globe, Moon, Trash2, LogOut, Save } from 'lucide-react';
import { useApp } from '../AppContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile, logout } = useApp();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'GHS');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, currency });
    setIsEditingProfile(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      toast.error('Account deletion is currently disabled for safety.');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-500">Manage your account preferences and application settings.</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-all"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      <div className="glass-card divide-y divide-slate-100">
        {/* Profile Section */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Profile Information</h4>
                <p className="text-sm text-slate-500">Update your name and email.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-sm font-bold text-brand-600"
            >
              {isEditingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Email (Read-only)</label>
                <input 
                  type="email" 
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="btn-primary">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</p>
                <p className="text-slate-900 font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-slate-900 font-medium">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Currency Section */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
              <Globe size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Currency & Region</h4>
              <p className="text-sm text-slate-500">Set your preferred currency.</p>
            </div>
          </div>
          <select 
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              updateProfile({ currency: e.target.value });
            }}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold"
          >
            <option value="GHS">GHS (₵)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      <div className="glass-card p-6 border-rose-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <Trash2 size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Delete Account</h4>
              <p className="text-sm text-slate-500">Permanently remove your account and all financial data.</p>
            </div>
          </div>
          <button 
            onClick={handleDeleteAccount}
            className="px-4 py-2 border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
