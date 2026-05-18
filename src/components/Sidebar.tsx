import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  ShieldCheck, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  MessageSquare,
  History,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'manager', 'admin'] },
    { id: 'my-goals', label: 'Performance Goals', icon: Target, roles: ['employee', 'manager'] },
    { id: 'team', label: 'Team Pulse', icon: Users, roles: ['manager', 'admin'] },
    { id: 'analytics', label: 'Insights', icon: TrendingUp, roles: ['manager', 'admin'] },
    { id: 'admin', label: 'HR Governance', icon: ShieldCheck, roles: ['admin'] },
    { id: 'reports', label: 'Audit Logs', icon: History, roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="w-72 sidebar-gradient text-slate-400 flex flex-col h-screen overflow-hidden group">
      <div className="p-8 pb-12 flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-display font-black tracking-tighter text-white">GOALSPHERE</span>
          <span className="text-[10px] font-bold tracking-[0.3em] text-indigo-400 uppercase leading-none mt-1">Enterprise</span>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-4">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Workspace</p>
        </div>
        {filteredMenu.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group font-medium text-sm relative",
              activeTab === item.id 
                ? "bg-white/10 text-white shadow-inner" 
                : "hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5 transition-colors", activeTab === item.id ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
            <span className="tracking-tight">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
              />
            )}
            {activeTab === item.id && <ChevronRight className="w-3 h-3 ml-auto text-indigo-400" />}
          </button>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-3xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg overflow-hidden">
                {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{user?.role} • {user?.department || 'Internal'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all font-bold text-[10px] uppercase tracking-widest border border-white/5"
          >
            <LogOut className="w-3 h-3" />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
