import React from 'react';
import { Settings as SettingsIcon, User, Moon, Sun, Trash2, ShieldCheck, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsProps {
  userName: string;
  setUserName: (name: string) => void;
  onNameUpdate: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onClearData: () => void;
}

export function Settings({ userName, setUserName, onNameUpdate, darkMode, setDarkMode, onClearData }: SettingsProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-glass dark:bg-dark-glass backdrop-blur-md p-8 rounded-[2.5rem] border border-glass-border dark:border-dark-glass-border shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2 dark:text-white">
          <User size={18} className="text-accent" />
          Perfil do Usuário
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Nome de Exibição</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="flex-1 bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white font-bold"
                placeholder="Seu nome"
              />
              <button 
                onClick={onNameUpdate}
                className="px-6 bg-accent text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 active:scale-95 transition-all"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-glass dark:bg-dark-glass backdrop-blur-md p-8 rounded-[2.5rem] border border-glass-border dark:border-dark-glass-border shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2 dark:text-white">
          <Smartphone size={18} className="text-accent" />
          Preferências do Aplicativo
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold dark:text-white">Modo Escuro</p>
              <p className="text-[10px] text-text-muted dark:text-gray-500 font-bold uppercase">Alternar entre tema claro e escuro</p>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "w-12 h-6 rounded-full transition-all relative",
                darkMode ? "bg-accent" : "bg-slate-200 dark:bg-slate-800"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all flex items-center justify-center",
                darkMode ? "left-7" : "left-1"
              )}>
                {darkMode ? <Moon size={10} className="text-accent" /> : <Sun size={10} className="text-yellow-500" />}
              </div>
            </button>
          </div>

          <div className="h-px bg-glass-border dark:bg-dark-glass-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-red-500">Limpar Dados</p>
              <p className="text-[10px] text-text-muted dark:text-gray-500 font-bold uppercase">Apagar todos os registros permanentemente</p>
            </div>
            <button 
              onClick={onClearData}
              className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-accent/5 dark:bg-accent/10 p-6 rounded-3xl border border-accent/20 flex items-center gap-4">
        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-accent">Privacidade e Segurança</p>
          <p className="text-[10px] text-text-muted dark:text-gray-400 font-bold uppercase mt-1">Seus dados são armazenados localmente e nunca saem do seu dispositivo.</p>
        </div>
      </div>
    </div>
  );
}
