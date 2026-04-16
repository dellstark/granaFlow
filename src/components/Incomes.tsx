import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import { Income, IncomeCategory } from '../types';

interface IncomesProps {
  incomes: Income[];
  onAdd: (income: Income) => void;
  onDelete: (id: string) => void;
}

const INCOME_CATEGORIES: { value: IncomeCategory; label: string; color: string }[] = [
  { value: 'salary', label: 'Salário', color: '#10b981' },
  { value: 'freelance', label: 'Freelance', color: '#6366f1' },
  { value: 'investment', label: 'Investimento', color: '#f59e0b' },
  { value: 'other', label: 'Outros', color: '#64748b' },
];

export function Incomes({ incomes, onAdd, onDelete }: IncomesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Income>>({
    description: '',
    value: 0,
    category: 'salary',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.value) return;

    onAdd({
      id: crypto.randomUUID(),
      description: formData.description,
      value: Number(formData.value),
      category: formData.category as IncomeCategory,
      date: formData.date || new Date().toISOString().split('T')[0],
    });

    setFormData({
      description: '',
      value: 0,
      category: 'salary',
      date: new Date().toISOString().split('T')[0],
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 dark:text-white">
          <TrendingUp size={18} className="text-green-500" />
          Minhas Receitas
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Nova Receita
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Descrição</label>
                  <input 
                    required
                    type="text" 
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                    placeholder="Ex: Salário Mensal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Valor (R$)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={formData.value || ''}
                    onChange={e => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Categoria</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as IncomeCategory }))}
                    className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                  >
                    {INCOME_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Data</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest text-text-muted dark:text-gray-400 hover:text-text-main dark:hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-accent text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 active:scale-95 transition-all"
                >
                  Salvar Receita
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-glass dark:bg-dark-glass backdrop-blur-md rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border dark:border-dark-glass-border">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-gray-400">Descrição</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-gray-400">Categoria</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-gray-400">Data</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-gray-400 text-right">Valor</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-gray-400 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {incomes.length > 0 ? incomes.map((income) => {
                const category = INCOME_CATEGORIES.find(c => c.value === income.category);
                return (
                  <tr key={income.id} className="border-b border-glass-border dark:border-dark-glass-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold text-text-main dark:text-white">{income.description}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category?.color }} />
                        <span className="text-xs font-bold text-text-muted dark:text-gray-400">{category?.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400">
                        <Calendar size={14} />
                        {new Date(income.date).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-sm font-black text-green-500">{formatCurrency(income.value)}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => onDelete(income.id)}
                          className="p-2 text-text-muted dark:text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-text-muted dark:text-gray-500 space-y-4">
                      <Tag size={48} className="opacity-10" />
                      <p className="text-xs font-black uppercase tracking-widest italic">Nenhuma receita registrada</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
