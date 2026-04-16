import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}

export function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar',
  type = 'info'
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  type === 'danger' ? "bg-red-500/10 text-red-500" : "bg-accent/10 text-accent"
                )}>
                  {type === 'danger' ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-text-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-xl font-black dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                {message}
              </p>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-text-muted dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  {cancelText}
                </button>
                <button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={cn(
                    "flex-1 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95",
                    type === 'danger' ? "bg-red-500 shadow-red-500/20" : "bg-accent shadow-accent/20"
                  )}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { ShieldCheck } from 'lucide-react';
