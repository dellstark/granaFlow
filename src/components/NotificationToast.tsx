import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../lib/utils';

interface NotificationToastProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export function NotificationToast({ notifications, onClose }: NotificationToastProps) {
  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={cn(
              "p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-4 group relative overflow-hidden",
              notif.type === 'achievement' ? "bg-accent/10 border-accent/20" : 
              notif.type === 'success' ? "bg-green-500/10 border-green-500/20" :
              notif.type === 'warning' ? "bg-yellow-500/10 border-yellow-500/20" :
              "bg-white/80 dark:bg-slate-900/80 border-glass-border dark:border-dark-glass-border"
            )}
          >
            {/* Progress Bar */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              onAnimationComplete={() => onClose(notif.id)}
              className={cn(
                "absolute bottom-0 left-0 h-1",
                notif.type === 'achievement' ? "bg-accent" : 
                notif.type === 'success' ? "bg-green-500" :
                notif.type === 'warning' ? "bg-yellow-500" :
                "bg-text-muted"
              )}
            />

            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              notif.type === 'achievement' ? "bg-accent text-white" : 
              notif.type === 'success' ? "bg-green-500 text-white" :
              notif.type === 'warning' ? "bg-yellow-500 text-white" :
              "bg-slate-200 dark:bg-slate-800 text-text-muted"
            )}>
              {notif.type === 'achievement' && <Trophy size={20} />}
              {notif.type === 'success' && <CheckCircle2 size={20} />}
              {notif.type === 'warning' && <AlertCircle size={20} />}
              {notif.type === 'info' && <Info size={20} />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black dark:text-white truncate">{notif.title}</h4>
              <p className="text-xs text-text-muted dark:text-gray-400 mt-1 leading-relaxed">
                {notif.message}
              </p>
            </div>

            <button 
              onClick={() => onClose(notif.id)}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-text-muted transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
