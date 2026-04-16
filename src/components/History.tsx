import React, { useState, useMemo } from 'react';
import { History as HistoryIcon, Search, Filter, Calendar, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { Expense, Income } from '../types';

interface HistoryProps {
  expenses: Expense[];
  incomes: Income[];
}

export function History({ expenses, incomes }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const allTransactions = useMemo(() => {
    const combined = [
      ...incomes.map(i => ({ ...i, type: 'income' as const })),
      ...expenses.map(e => ({ ...e, type: 'expense' as const }))
    ];

    return combined
      .filter(item => {
        const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        const matchesMonth = item.date.startsWith(selectedMonth);
        return matchesSearch && matchesType && matchesMonth;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, incomes, searchTerm, filterType, selectedMonth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 dark:text-white">
          <HistoryIcon size={18} className="text-text-muted" />
          Histórico e Linha do Tempo
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-glass dark:bg-dark-glass border border-glass-border dark:border-dark-glass-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white w-full md:w-48"
            />
          </div>
          <select 
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-glass dark:bg-dark-glass border border-glass-border dark:border-dark-glass-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent transition-all dark:text-white"
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const d = new Date();
              d.setMonth(d.getMonth() - i);
              const val = d.toISOString().slice(0, 7);
              return (
                <option key={val} value={val}>
                  {d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </option>
              );
            })}
          </select>
          <div className="flex bg-glass dark:bg-dark-glass border border-glass-border dark:border-dark-glass-border rounded-xl p-1">
            {(['all', 'income', 'expense'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  filterType === t ? "bg-accent text-white" : "text-text-muted dark:text-gray-400 hover:text-text-main dark:hover:text-white"
                )}
              >
                {t === 'all' ? 'Todos' : t === 'income' ? 'Receitas' : 'Gastos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-0.5 before:bg-glass-border dark:before:bg-dark-glass-border">
        {allTransactions.length > 0 ? allTransactions.map((item, index) => {
          const isIncome = item.type === 'income';
          return (
            <div key={item.id} className="relative pl-12">
              <div className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-slate-50 dark:border-slate-950 z-10",
                isIncome ? "bg-green-500" : "bg-red-500"
              )} />
              
              <div className="bg-glass dark:bg-dark-glass backdrop-blur-md p-4 rounded-2xl border border-glass-border dark:border-dark-glass-border shadow-sm flex items-center justify-between hover:border-accent/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isIncome ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-text-main dark:text-white">{item.description}</p>
                      {item.type === 'expense' && (item as Expense).category === 'credit_installments' && (
                        <div className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[8px] font-black uppercase">
                          {(item as Expense).paidInstallments?.length || 0}/{(item as Expense).totalInstallments} Pagas
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-muted dark:text-gray-500 font-bold uppercase mt-1">
                      <Calendar size={12} />
                      {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      <span>•</span>
                      <Tag size={12} />
                      {item.category}
                    </div>
                  </div>
                </div>
                <p className={cn(
                  "text-sm font-black",
                  isIncome ? "text-green-500" : "text-red-500"
                )}>
                  {isIncome ? '+' : '-'}{formatCurrency(item.value)}
                </p>
              </div>
            </div>
          );
        }) : (
          <div className="py-20 flex flex-col items-center justify-center text-text-muted dark:text-gray-500 space-y-4">
            <HistoryIcon size={48} className="opacity-10" />
            <p className="text-xs font-black uppercase tracking-widest italic">Nenhum registro encontrado para este período</p>
          </div>
        )}
      </div>
    </div>
  );
}
