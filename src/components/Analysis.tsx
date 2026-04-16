import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { formatCurrency, cn } from '../lib/utils';
import { Expense, Income, MonthlySummary } from '../types';

interface AnalysisProps {
  expenses: Expense[];
  incomes: Income[];
  summary: MonthlySummary;
  previousSummary: MonthlySummary;
  darkMode: boolean;
}

export function Analysis({ expenses, incomes, summary, previousSummary, darkMode }: AnalysisProps) {
  const comparisonData = useMemo(() => {
    const current = summary.totalExpenses;
    const previous = previousSummary.totalExpenses;
    
    const diff = current - previous;
    const percentage = previous > 0 ? (diff / previous) * 100 : 0;
    const hasPrevious = previous > 0;

    return {
      current,
      previous,
      diff,
      percentage,
      isHigher: diff > 0,
      hasPrevious
    };
  }, [summary, previousSummary]);

  const categoryData = useMemo(() => {
    return Object.entries(summary.byCategory)
      .map(([name, value]) => ({
        name,
        value,
        percentage: summary.totalExpenses > 0 ? (value / summary.totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [summary]);

  return (
    <div className="space-y-8">
      {/* Comparison Header */}
      <div className="bg-glass dark:bg-dark-glass backdrop-blur-md p-8 rounded-[2.5rem] border border-glass-border dark:border-dark-glass-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted dark:text-gray-400 mb-2">Análise de Gastos</h3>
            <h2 className="text-3xl font-black dark:text-white">
              {comparisonData.isHigher ? 'Seus gastos aumentaram' : 'Seus gastos diminuíram'}
            </h2>
            <p className="text-sm text-text-muted dark:text-gray-500 mt-2">
              Em comparação ao mês anterior, você gastou <span className={cn("font-bold", comparisonData.isHigher ? "text-red-500" : "text-green-500")}>
                {Math.abs(comparisonData.percentage).toFixed(1)}% {comparisonData.isHigher ? 'a mais' : 'a menos'}
              </span>.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-gray-500">Este Mês</p>
              <p className="text-xl font-black text-accent">{formatCurrency(comparisonData.current)}</p>
            </div>
            <div className="w-px h-10 bg-glass-border dark:bg-dark-glass-border" />
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-gray-500">Mês Anterior</p>
              <p className="text-xl font-black text-text-muted dark:text-gray-400">{formatCurrency(comparisonData.previous)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 dark:text-white">
            <Target size={18} className="text-accent" />
            Gastos por Categoria
          </h3>
          <div className="space-y-6">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="dark:text-gray-300">{cat.name}</span>
                  <span className="dark:text-white">{cat.percentage.toFixed(1)}% • {formatCurrency(cat.value)}</span>
                </div>
                <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>
            ))}
            {categoryData.length === 0 && (
              <p className="text-sm text-text-muted dark:text-gray-500 italic text-center py-10">Sem dados para analisar.</p>
            )}
          </div>
        </div>

        {/* Efficiency Chart */}
        <div className="bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 dark:text-white">
            <Zap size={18} className="text-yellow-500" />
            Eficiência Financeira
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Receita', value: summary.totalIncome, fill: '#10b981' },
                { name: 'Gastos', value: summary.totalExpenses, fill: '#ef4444' },
                { name: 'Saldo', value: summary.balance, fill: '#6366f1' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: darkMode ? '#94a3b8' : '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: darkMode ? '#94a3b8' : '#64748b' }}
                  tickFormatter={(val) => `R$ ${val}`}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    background: darkMode ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(8px)',
                    color: darkMode ? '#fff' : '#000'
                  }}
                  formatter={(val: number) => [formatCurrency(val), 'Valor']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
