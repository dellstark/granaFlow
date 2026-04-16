import React, { useState } from 'react';
import { Plus, Trash2, TrendingDown, Calendar, CreditCard as CardIcon, Tag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import { Expense, ExpenseCategory, CreditCard } from '../types';

interface ExpensesProps {
  expenses: Expense[];
  cards: CreditCard[];
  onAdd: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onToggleInstallment: (expenseId: string, installmentNumber: number) => void;
}

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; color: string }[] = [
  { value: 'cash', label: 'À Vista (Dinheiro/Débito)', color: '#10b981' },
  { value: 'credit_one_time', label: 'Crédito à Vista', color: '#f59e0b' },
  { value: 'credit_installments', label: 'Crédito Parcelado', color: '#6366f1' },
];

export function Expenses({ expenses, cards, onAdd, onDelete, onToggleInstallment }: ExpensesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [expandedExpense, setExpandedExpense] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Expense>>({
    description: '',
    value: 0,
    category: 'cash',
    date: new Date().toISOString().split('T')[0],
    cardId: '',
    totalInstallments: 1,
    remainingInstallments: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.value) return;

    onAdd({
      id: crypto.randomUUID(),
      description: formData.description,
      value: Number(formData.value),
      category: formData.category as ExpenseCategory,
      date: formData.date || new Date().toISOString().split('T')[0],
      cardId: formData.cardId || undefined,
      totalInstallments: formData.category === 'credit_installments' ? Number(formData.totalInstallments) : undefined,
      remainingInstallments: formData.category === 'credit_installments' ? Number(formData.totalInstallments) : undefined,
      paidInstallments: [],
    });

    setFormData({
      description: '',
      value: 0,
      category: 'cash',
      date: new Date().toISOString().split('T')[0],
      cardId: '',
      totalInstallments: 1,
      remainingInstallments: 1,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 dark:text-white">
          <TrendingDown size={18} className="text-red-500" />
          Meus Gastos
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Novo Gasto
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
                    placeholder="Ex: Supermercado"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Valor Total (R$)</label>
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
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))}
                    className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                  >
                    {EXPENSE_CATEGORIES.map(cat => (
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

              {formData.category?.startsWith('credit') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Cartão</label>
                    <select 
                      required
                      value={formData.cardId}
                      onChange={e => setFormData(prev => ({ ...prev, cardId: e.target.value }))}
                      className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                    >
                      <option value="">Selecione um cartão</option>
                      {cards.map(card => (
                        <option key={card.id} value={card.id}>{card.name}</option>
                      ))}
                    </select>
                  </div>
                  {formData.category === 'credit_installments' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-text-muted dark:text-gray-400 uppercase tracking-widest">Parcelas</label>
                      <input 
                        type="number" 
                        min="2"
                        value={formData.totalInstallments}
                        onChange={e => setFormData(prev => ({ ...prev, totalInstallments: Number(e.target.value) }))}
                        className="w-full bg-white/50 dark:bg-white/5 border border-glass-border dark:border-dark-glass-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
                      />
                    </div>
                  )}
                </div>
              )}

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
                  Salvar Gasto
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
              {expenses.length > 0 ? expenses.map((expense) => {
                const category = EXPENSE_CATEGORIES.find(c => c.value === expense.category);
                const card = cards.find(c => c.id === expense.cardId);
                const isExpanded = expandedExpense === expense.id;
                const paidCount = expense.paidInstallments?.length || 0;
                const totalCount = expense.totalInstallments || 0;

                return (
                  <React.Fragment key={expense.id}>
                    <tr 
                      onClick={() => expense.category === 'credit_installments' && setExpandedExpense(isExpanded ? null : expense.id)}
                      className={cn(
                        "border-b border-glass-border dark:border-dark-glass-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                        expense.category === 'credit_installments' && "cursor-pointer"
                      )}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-text-main dark:text-white">{expense.description}</p>
                          {expense.category === 'credit_installments' && (
                            <div className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase">
                              {paidCount}/{totalCount} Pagas
                            </div>
                          )}
                        </div>
                        {card && (
                          <div className="flex items-center gap-1 text-[9px] font-black text-accent uppercase mt-1">
                            <CardIcon size={10} />
                            <span>{card.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category?.color }} />
                          <span className="text-xs font-bold text-text-muted dark:text-gray-400">{category?.label.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-400">
                          <Calendar size={14} />
                          {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-sm font-black text-red-500">{formatCurrency(expense.value)}</p>
                        {expense.category === 'credit_installments' && (
                          <p className="text-[9px] text-text-muted dark:text-gray-500 font-bold">
                            {formatCurrency(expense.value / totalCount)} / mês
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(expense.id);
                            }}
                            className="p-2 text-text-muted dark:text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Installment Details Expansion */}
                    <AnimatePresence>
                      {isExpanded && expense.category === 'credit_installments' && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-black/5 dark:bg-white/5"
                            >
                              <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest dark:text-white">Controle de Parcelas</h4>
                                  <span className="text-[10px] font-black text-accent uppercase">{paidCount} de {totalCount} pagas</span>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                                  {Array.from({ length: totalCount }).map((_, i) => {
                                    const n = i + 1;
                                    const isPaid = expense.paidInstallments?.includes(n);
                                    return (
                                      <button
                                        key={n}
                                        onClick={() => onToggleInstallment(expense.id, n)}
                                        className={cn(
                                          "aspect-square rounded-lg flex flex-col items-center justify-center transition-all border",
                                          isPaid 
                                            ? "bg-green-500 border-green-600 text-white shadow-lg shadow-green-500/20" 
                                            : "bg-white dark:bg-slate-800 border-glass-border dark:border-dark-glass-border text-text-muted dark:text-gray-400 hover:border-accent"
                                        )}
                                      >
                                        <span className="text-[10px] font-black">{n}</span>
                                        {isPaid && <CheckCircle2 size={10} className="mt-0.5" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-text-muted dark:text-gray-500 space-y-4">
                      <Tag size={48} className="opacity-10" />
                      <p className="text-xs font-black uppercase tracking-widest italic">Nenhum gasto registrado</p>
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
