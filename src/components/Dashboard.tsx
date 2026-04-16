import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Lightbulb,
  History
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { formatCurrency } from '../lib/utils';
import { Expense, Income, MonthlySummary } from '../types';

interface DashboardProps {
  expenses: Expense[];
  incomes: Income[];
  summary: MonthlySummary;
  previousSummary: MonthlySummary;
  darkMode: boolean;
}

export function Dashboard({ expenses, incomes, summary, previousSummary, darkMode }: DashboardProps) {
  const chartData = useMemo(() => {
    const data = Object.entries(summary.byCategory).map(([name, value]) => ({
      name,
      value,
    })).filter(d => d.value > 0);
    return data;
  }, [summary]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const insights = useMemo(() => {
    const list: string[] = [];
    const totalIncome = summary.totalIncome;
    const totalExpenses = summary.totalExpenses;

    if (totalIncome > 0) {
      const expensePercentage = (totalExpenses / totalIncome) * 100;
      if (expensePercentage > 80) {
        list.push(`Você está gastando ${expensePercentage.toFixed(1)}% da sua renda. Atenção ao seu orçamento!`);
      } else {
        list.push(`Seus gastos representam ${expensePercentage.toFixed(1)}% da sua renda mensal.`);
      }
    }

    // Category specific insights
    Object.entries(summary.byCategory).forEach(([cat, value]) => {
      if (totalIncome > 0 && value > 0) {
        const percentage = (value / totalIncome) * 100;
        if (percentage > 20) {
          list.push(`Você está gastando ${percentage.toFixed(1)}% da sua renda com ${cat}.`);
          const potentialSaving = value * 0.1;
          list.push(`Se reduzir gastos em ${cat} em 10%, você economizará ${formatCurrency(potentialSaving)} por mês.`);
        }
      }
    });

    // Month over month comparison
    if (previousSummary.totalExpenses > 0) {
      const diff = totalExpenses - previousSummary.totalExpenses;
      const percentage = (diff / previousSummary.totalExpenses) * 100;
      if (diff > 0) {
        list.push(`Seus gastos aumentaram ${percentage.toFixed(1)}% em relação ao mês anterior.`);
      } else if (diff < 0) {
        list.push(`Parabéns! Seus gastos diminuíram ${Math.abs(percentage).toFixed(1)}% em relação ao mês anterior.`);
      }
    }

    if (totalExpenses > totalIncome && totalIncome > 0) {
      list.push("Seus gastos superaram sua receita este mês. Considere revisar despesas não essenciais.");
    }

    return list;
  }, [summary, previousSummary]);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Receitas</span>
          </div>
          <h3 className="text-2xl font-black text-text-main dark:text-white">{formatCurrency(summary.totalIncome)}</h3>
          <p className="text-[10px] text-text-muted dark:text-gray-500 font-bold uppercase mt-2">Total recebido este mês</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
              <TrendingDown size={24} />
            </div>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Gastos</span>
          </div>
          <h3 className="text-2xl font-black text-text-main dark:text-white">{formatCurrency(summary.totalExpenses)}</h3>
          <p className="text-[10px] text-text-muted dark:text-gray-500 font-bold uppercase mt-2">Total gasto este mês</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Saldo</span>
          </div>
          <h3 className={cn(
            "text-2xl font-black",
            summary.balance >= 0 ? "text-text-main dark:text-white" : "text-red-500"
          )}>
            {formatCurrency(summary.balance)}
          </h3>
          <p className="text-[10px] text-text-muted dark:text-gray-500 font-bold uppercase mt-2">Disponível para o mês</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribution Chart */}
        <div className="lg:col-span-1 bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 dark:text-white">
            <PieChartIcon size={18} className="text-accent" />
            Distribuição de Gastos
          </h3>
          <div className="h-[240px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      background: darkMode ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(8px)',
                      color: darkMode ? '#fff' : '#000'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-muted dark:text-gray-500 text-sm italic">
                <PieChartIcon size={48} className="mb-2 opacity-20" />
                Sem dados para exibir
              </div>
            )}
          </div>
        </div>

        {/* Insights & Recent */}
        <div className="lg:col-span-2 space-y-6">
          {/* Insights */}
          <div className="bg-accent/5 dark:bg-accent/10 p-6 rounded-3xl border border-accent/20">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-accent">
              <Lightbulb size={18} />
              Insights Inteligentes
            </h3>
            <div className="space-y-3">
              {insights.length > 0 ? insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-text-main dark:text-gray-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p>{insight}</p>
                </div>
              )) : (
                <p className="text-sm text-text-muted dark:text-gray-400 italic">Adicione mais dados para receber sugestões personalizadas.</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-glass dark:bg-dark-glass backdrop-blur-md p-6 rounded-3xl border border-glass-border dark:border-dark-glass-border shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 dark:text-white">
              <History size={18} className="text-text-muted" />
              Atividade Recente
            </h3>
            <div className="space-y-4">
              {[...expenses, ...incomes]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 4)
                .map((item) => {
                  const isIncome = 'category' in item && ['salary', 'freelance', 'investment', 'other'].includes(item.category);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          isIncome ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-main dark:text-white">{item.description}</p>
                          <p className="text-[10px] text-text-muted dark:text-gray-500 font-bold uppercase">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <p className={cn(
                        "text-sm font-black",
                        isIncome ? "text-green-500" : "text-red-500"
                      )}>
                        {isIncome ? '+' : '-'}{formatCurrency(item.value)}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
