import React, { useState } from 'react';
import { Sidebar, TabId } from './Sidebar';
import { Menu, Sun, Moon, Bell, Trophy, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Notification } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  userName: string;
  notifications?: Notification[];
  onMarkRead?: () => void;
}

export function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode,
  userName,
  notifications = [],
  onMarkRead
}: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return <Trophy size={16} className="text-accent" />;
      case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className={cn(
        "transition-all duration-300 min-h-screen flex flex-col",
        isCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        {/* Top Header */}
        <header className="h-16 bg-glass/80 dark:bg-dark-glass/80 backdrop-blur-md border-b border-glass-border dark:border-dark-glass-border sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-text-muted dark:text-gray-400"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-black uppercase tracking-widest text-text-muted dark:text-gray-400">
              {activeTab === 'dashboard' && 'Visão Geral'}
              {activeTab === 'incomes' && 'Minhas Receitas'}
              {activeTab === 'expenses' && 'Meus Gastos'}
              {activeTab === 'cards' && 'Cartões de Crédito'}
              {activeTab === 'history' && 'Histórico Financeiro'}
              {activeTab === 'analysis' && 'Análise e Insights'}
              {activeTab === 'rewards' && 'Recompensas e Emojis'}
              {activeTab === 'settings' && 'Configurações'}
            </h2>
          </div>

          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && onMarkRead) onMarkRead();
              }}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-text-muted dark:text-gray-400 transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 max-h-[480px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-glass-border dark:border-dark-glass-border z-50 overflow-hidden flex flex-col"
                  >
                    <div className="p-4 border-b border-glass-border dark:border-dark-glass-border flex items-center justify-between bg-black/5 dark:bg-white/5">
                      <h3 className="text-xs font-black uppercase tracking-widest dark:text-white">Notificações</h3>
                      <button onClick={() => setShowNotifications(false)} className="text-text-muted hover:text-text-main dark:hover:text-white">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={cn(
                              "p-4 border-b border-glass-border dark:border-dark-glass-border flex gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                              !notif.isRead && "bg-accent/5"
                            )}
                          >
                            <div className="mt-1">{getIcon(notif.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black dark:text-white truncate">{notif.title}</p>
                              <p className="text-[10px] text-text-muted dark:text-gray-400 mt-0.5 leading-relaxed">{notif.message}</p>
                              <p className="text-[9px] text-text-muted dark:text-gray-500 mt-1 font-bold">
                                {new Date(notif.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell size={32} className="mx-auto text-text-muted opacity-20 mb-2" />
                          <p className="text-xs text-text-muted dark:text-gray-500 font-bold">Nenhuma notificação</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-text-muted dark:text-gray-400 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-8 w-[1px] bg-glass-border dark:border-dark-glass-border mx-2 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-3 pl-2">
              <span className="text-xs font-black text-text-main dark:text-white">{userName}</span>
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-black">
                {userName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
