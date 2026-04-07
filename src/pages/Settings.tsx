import React from 'react';
import { User, Bell, Shield, CreditCard, Globe, Moon, Trash2 } from 'lucide-react';
import { useApp } from '../AppContext';

const Settings = () => {
  const { user } = useApp();

  const sections = [
    { icon: User, label: 'Profile Information', desc: 'Update your name, email, and avatar.' },
    { icon: Globe, label: 'Currency & Region', desc: 'Set your preferred currency and time zone.' },
    { icon: Bell, label: 'Notifications', desc: 'Manage how you receive alerts and updates.' },
    { icon: Shield, label: 'Security', desc: 'Change password and manage two-factor auth.' },
    { icon: Moon, label: 'Appearance', desc: 'Toggle between light and dark mode.' },
    { icon: CreditCard, label: 'Subscription', desc: 'Manage your plan and billing details.' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage your account preferences and application settings.</p>
      </div>

      <div className="glass-card divide-y divide-slate-100">
        {sections.map((section) => (
          <div key={section.label} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                <section.icon size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{section.label}</h4>
                <p className="text-sm text-slate-500">{section.desc}</p>
              </div>
            </div>
            <button className="text-sm font-bold text-brand-600">Edit</button>
          </div>
        ))}
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
          <button className="px-4 py-2 border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
