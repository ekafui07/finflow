import React from 'react';
import { Bell, Search, Plus } from 'lucide-react';
import { useApp } from '../AppContext';

interface HeaderProps {
  title: string;
  onAddClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onAddClick }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 lg:hidden" /> {/* Spacer for mobile menu button */}
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 truncate">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-50 rounded-xl transition-all w-64 text-sm outline-none"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          {onAddClick && (
            <button 
              onClick={onAddClick}
              className="btn-primary"
            >
              <Plus size={18} />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
