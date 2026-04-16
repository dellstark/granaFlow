import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'first_100', 
    emoji: '💰', 
    label: 'Poupador Iniciante', 
    description: 'Economizou seus primeiros R$ 100',
    condition: ({ expenses, incomes }) => {
      const totalIncome = incomes.reduce((sum, inc) => sum + inc.value, 0);
      const totalExpense = expenses.reduce((sum, exp) => sum + exp.value, 0);
      return (totalIncome - totalExpense) >= 100;
    }
  },
  { 
    id: 'card_master', 
    emoji: '💳', 
    label: 'Mestre do Cartão', 
    description: 'Cadastrou seu primeiro cartão de crédito',
    condition: ({ cards }) => cards.length >= 1
  },
  { 
    id: 'investor', 
    emoji: '📈', 
    label: 'Investidor', 
    description: 'Adicionou sua primeira receita de investimentos',
    condition: ({ incomes }) => incomes.some(inc => inc.category === 'investment')
  },
  { 
    id: 'expense_tracker', 
    emoji: '🔥', 
    label: 'Foco Total', 
    description: 'Registrou mais de 5 gastos no sistema',
    condition: ({ expenses }) => expenses.length >= 5
  },
  { 
    id: 'big_earner', 
    emoji: '🚀', 
    label: 'Meta Atingida', 
    description: 'Registrou uma receita maior que R$ 5.000',
    condition: ({ incomes }) => incomes.some(inc => inc.value >= 5000)
  },
  { 
    id: 'debt_free', 
    emoji: '🏆', 
    label: 'Elite Financeira', 
    description: 'Manteve o saldo positivo com mais de 10 registros',
    condition: ({ expenses, incomes }) => {
      const totalIncome = incomes.reduce((sum, inc) => sum + inc.value, 0);
      const totalExpense = expenses.reduce((sum, exp) => sum + exp.value, 0);
      return (expenses.length + incomes.length) >= 10 && (totalIncome - totalExpense) > 0;
    }
  },
  { 
    id: 'savings_1000', 
    emoji: '💎', 
    label: 'Milionário em Treinamento', 
    description: 'Economizou seus primeiros R$ 1.000',
    condition: ({ expenses, incomes }) => {
      const totalIncome = incomes.reduce((sum, inc) => sum + inc.value, 0);
      const totalExpense = expenses.reduce((sum, exp) => sum + exp.value, 0);
      return (totalIncome - totalExpense) >= 1000;
    }
  },
  { 
    id: 'organization_20', 
    emoji: '📚', 
    label: 'Organização Impecável', 
    description: 'Registrou um total de 20 transações',
    condition: ({ expenses, incomes }) => (expenses.length + incomes.length) >= 20
  },
  { 
    id: 'diversified', 
    emoji: '🌈', 
    label: 'Diversificador', 
    description: 'Recebeu ganhos de 3 categorias diferentes',
    condition: ({ incomes }) => {
      const categories = new Set(incomes.map(inc => inc.category));
      return categories.size >= 3;
    }
  },
  { 
    id: 'installment_pro', 
    emoji: '🗓️', 
    label: 'Planejador', 
    description: 'Marcou 5 parcelas como pagas',
    condition: ({ expenses }) => {
      const totalPaid = expenses.reduce((sum, exp) => sum + (exp.paidInstallments?.length || 0), 0);
      return totalPaid >= 5;
    }
  }
];
