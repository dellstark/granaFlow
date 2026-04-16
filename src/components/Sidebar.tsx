import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  History, 
  BarChart3, 
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';

export type TabId = 'dashboard' | 'incomes' | 'expenses' | 'cards' | 'history' | 'analysis' | 'rewards' | 'settings';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'incomes', label: 'Receitas', icon: TrendingUp },
  { id: 'expenses', label: 'Gastos', icon: TrendingDown },
  { id: 'cards', label: 'Cartões', icon: CreditCard },
  { id: 'history', label: 'Histórico', icon: History },
  { id: 'analysis', label: 'Análise Financeira', icon: BarChart3 },
  { id: 'rewards', label: 'Recompensa', icon: Star },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full z-50 transition-all duration-300 sidebar-transition",
        "bg-glass dark:bg-dark-glass backdrop-blur-xl border-r border-glass-border dark:border-dark-glass-border",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-accent/20">
                  <TrendingUp size={20} />
                </div>
                <span className="font-black text-lg tracking-tight dark:text-white">Grana<span className="text-accent">Flow</span></span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white mx-auto">
                <TrendingUp size={20} />
              </div>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-text-muted dark:text-gray-400"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-text-muted dark:text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabId);
                    setIsMobileOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-accent text-white shadow-lg shadow-accent/20" 
                      : "text-text-muted dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-main dark:hover:text-white"
                  )}
                >
                  <item.icon size={20} className={cn(isActive ? "text-white" : "group-hover:text-accent transition-colors")} />
                  {!isCollapsed && <span className="text-sm font-bold">{item.label}</span>}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-glass-border dark:border-dark-glass-border">
            <div className={cn(
              "flex items-center gap-3 p-2 rounded-xl bg-black/5 dark:bg-white/5",
              isCollapsed ? "justify-center" : ""
            )}>
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-black text-xs">
                GR
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-text-main dark:text-white truncate">Gleicio Ribeiro</p>
                  <p className="text-[10px] text-text-muted dark:text-gray-500 truncate">Premium Plan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
