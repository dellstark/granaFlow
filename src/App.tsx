import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { TabId } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Incomes } from './components/Incomes';
import { Expenses } from './components/Expenses';
import { Cards } from './components/Cards';
import { History } from './components/History';
import { Analysis } from './components/Analysis';
import { Rewards } from './components/Rewards';
import { Settings } from './components/Settings';
import { Expense, Income, CreditCard, Invoice, UserConfig, MonthlySummary } from './types';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

import { Modal } from './components/Modal';
import { NotificationToast } from './components/NotificationToast';
import { ACHIEVEMENTS } from './constants/achievements';
import { Notification } from './types';

export default function App() {
  // Global State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [userConfig, setUserConfig] = useState<UserConfig>({
    userName: 'Gleicio Ribeiro',
    darkMode: false,
    unlockedAchievements: [],
  });
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info'
  });

  // Load from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('smart_finance_expenses');
    const savedIncomes = localStorage.getItem('smart_finance_incomes');
    const savedCards = localStorage.getItem('smart_finance_cards');
    const savedInvoices = localStorage.getItem('smart_finance_invoices');
    const savedConfig = localStorage.getItem('smart_finance_config');

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedIncomes) setIncomes(JSON.parse(savedIncomes));
    if (savedCards) setCards(JSON.parse(savedCards));
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
    if (savedConfig) setUserConfig(JSON.parse(savedConfig));
    
    const savedNotifications = localStorage.getItem('smart_finance_notifications');
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('smart_finance_expenses', JSON.stringify(expenses));
    localStorage.setItem('smart_finance_incomes', JSON.stringify(incomes));
    localStorage.setItem('smart_finance_cards', JSON.stringify(cards));
    localStorage.setItem('smart_finance_invoices', JSON.stringify(invoices));
    localStorage.setItem('smart_finance_config', JSON.stringify(userConfig));
    localStorage.setItem('smart_finance_notifications', JSON.stringify(notifications));
  }, [expenses, incomes, cards, invoices, userConfig, notifications]);

  // Achievement Checker
  useEffect(() => {
    const checkAchievements = () => {
      const unlocked = userConfig.unlockedAchievements || [];
      const newUnlocked: string[] = [];

      ACHIEVEMENTS.forEach(achievement => {
        if (!unlocked.includes(achievement.id)) {
          if (achievement.condition({ expenses, incomes, cards })) {
            newUnlocked.push(achievement.id);
            addNotification({
              title: `Conquista Desbloqueada! ${achievement.emoji}`,
              message: `Você ganhou: ${achievement.label}`,
              type: 'achievement'
            });
          }
        }
      });

      if (newUnlocked.length > 0) {
        setUserConfig(prev => ({
          ...prev,
          unlockedAchievements: [...(prev.unlockedAchievements || []), ...newUnlocked]
        }));
      }
    };

    // Debounce check to avoid multiple notifications on rapid state changes
    const timer = setTimeout(checkAchievements, 1000);
    return () => clearTimeout(timer);
  }, [expenses, incomes, cards]);

  const addNotification = (notif: Pick<Notification, 'title' | 'message' | 'type'>) => {
    const newNotif: Notification = {
      ...notif,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveNotifications(prev => [...prev, newNotif]);
  };

  const removeActiveNotification = (id: string) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Dark Mode Effect
  useEffect(() => {
    if (userConfig.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userConfig.darkMode]);

  // Calculations
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousMonthStr = previousMonthDate.toISOString().slice(0, 7);

  const calculateMonthlySummary = (date: Date): MonthlySummary => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthStr = date.toISOString().slice(0, 7);

    const filteredExpenses = expenses.filter(exp => {
      const expDate = parseISO(exp.date);
      if (exp.category === 'credit_installments' && exp.totalInstallments) {
        const monthsDiff = (date.getFullYear() - expDate.getFullYear()) * 12 + (date.getMonth() - expDate.getMonth());
        return monthsDiff >= 0 && monthsDiff < exp.totalInstallments;
      }
      return isWithinInterval(expDate, { start, end });
    });

    const filteredIncomes = incomes.filter(inc => {
      const incDate = parseISO(inc.date);
      return isWithinInterval(incDate, { start, end });
    });

    const totalExpenses = filteredExpenses.reduce((sum, exp) => {
      if (exp.category === 'credit_installments' && exp.totalInstallments) {
        return sum + (exp.value / exp.totalInstallments);
      }
      return sum + exp.value;
    }, 0);

    const totalIncome = filteredIncomes.reduce((sum, inc) => sum + inc.value, 0);

    const byCategory: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
      const val = exp.category === 'credit_installments' && exp.totalInstallments 
        ? exp.value / exp.totalInstallments 
        : exp.value;
      
      const catName = exp.category === 'cash' ? 'À Vista' : 'Crédito';
      byCategory[catName] = (byCategory[catName] || 0) + val;
    });

    return {
      month: monthStr,
      totalExpenses,
      totalIncome,
      balance: totalIncome - totalExpenses,
      byCategory
    };
  };

  const monthlySummary = useMemo(() => calculateMonthlySummary(new Date()), [expenses, incomes]);
  const previousSummary = useMemo(() => calculateMonthlySummary(previousMonthDate), [expenses, incomes]);

  // Handlers
  const handleAddExpense = (exp: Expense) => {
    setExpenses(prev => [...prev, exp]);
    addNotification({
      title: 'Gasto Adicionado',
      message: `${exp.description} no valor de R$ ${exp.value.toFixed(2)}`,
      type: 'success'
    });
  };
  const handleDeleteExpense = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Excluir Gasto',
      message: 'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.',
      type: 'danger',
      onConfirm: () => {
        setExpenses(prev => prev.filter(e => e.id !== id));
        addNotification({
          title: 'Gasto Excluído',
          message: 'O registro foi removido com sucesso',
          type: 'info'
        });
      }
    });
  };

  const handleAddIncome = (inc: Income) => {
    setIncomes(prev => [...prev, inc]);
    addNotification({
      title: 'Receita Adicionada',
      message: `${inc.description} no valor de R$ ${inc.value.toFixed(2)}`,
      type: 'success'
    });
  };
  const handleDeleteIncome = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Excluir Receita',
      message: 'Tem certeza que deseja excluir esta receita?',
      type: 'danger',
      onConfirm: () => {
        setIncomes(prev => prev.filter(i => i.id !== id));
        addNotification({
          title: 'Receita Excluída',
          message: 'O registro foi removido com sucesso',
          type: 'info'
        });
      }
    });
  };

  const handleAddCard = (card: CreditCard) => {
    setCards(prev => [...prev, card]);
    addNotification({
      title: 'Cartão Adicionado',
      message: `Cartão ${card.name} pronto para uso`,
      type: 'success'
    });
  };
  const handleDeleteCard = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Excluir Cartão',
      message: 'Ao excluir o cartão, todos os gastos vinculados perderão a referência. Deseja continuar?',
      type: 'danger',
      onConfirm: () => {
        setCards(prev => prev.filter(c => c.id !== id));
        addNotification({
          title: 'Cartão Excluído',
          message: 'O cartão foi removido do sistema',
          type: 'info'
        });
      }
    });
  };

  const handlePayInvoice = (cardId: string, month: string) => {
    const existing = invoices.find(i => i.cardId === cardId && i.month === month);
    if (existing) {
      setInvoices(prev => prev.map(i => i.id === existing.id ? { ...i, isPaid: true } : i));
    } else {
      setInvoices(prev => [...prev, { id: crypto.randomUUID(), cardId, month, isPaid: true }]);
    }
    addNotification({
      title: 'Fatura Paga',
      message: `Fatura de ${month} marcada como paga`,
      type: 'success'
    });
  };

  const handleClearData = () => {
    setModalConfig({
      isOpen: true,
      title: 'Limpar Todos os Dados',
      message: 'ATENÇÃO: Isso apagará permanentemente todos os seus gastos, receitas e cartões. Esta ação é irreversível.',
      type: 'danger',
      onConfirm: () => {
        setExpenses([]);
        setIncomes([]);
        setCards([]);
        setInvoices([]);
        setNotifications([]);
        localStorage.clear();
        addNotification({
          title: 'Dados Limpos',
          message: 'Todos os registros foram apagados',
          type: 'warning'
        });
      }
    });
  };

  const handleToggleInstallment = (expenseId: string, installmentNumber: number) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id === expenseId) {
        const paid = exp.paidInstallments || [];
        const isPaid = paid.includes(installmentNumber);
        const newPaid = isPaid 
          ? paid.filter(n => n !== installmentNumber)
          : [...paid, installmentNumber];
        
        if (!isPaid) {
          addNotification({
            title: 'Parcela Paga',
            message: `Parcela ${installmentNumber} de ${exp.description} quitada`,
            type: 'success'
          });
        }

        return {
          ...exp,
          paidInstallments: newPaid,
          remainingInstallments: exp.totalInstallments ? exp.totalInstallments - newPaid.length : exp.remainingInstallments
        };
      }
      return exp;
    }));
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      darkMode={userConfig.darkMode}
      setDarkMode={(dark) => setUserConfig(prev => ({ ...prev, darkMode: dark }))}
      userName={userConfig.userName}
      notifications={notifications}
      onMarkRead={markNotificationsAsRead}
    >
      <NotificationToast 
        notifications={activeNotifications} 
        onClose={removeActiveNotification} 
      />
      <Modal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
      {activeTab === 'dashboard' && (
        <Dashboard 
          expenses={expenses} 
          incomes={incomes} 
          summary={monthlySummary} 
          previousSummary={previousSummary}
          darkMode={userConfig.darkMode}
        />
      )}
      {activeTab === 'incomes' && (
        <Incomes 
          incomes={incomes} 
          onAdd={handleAddIncome} 
          onDelete={handleDeleteIncome} 
        />
      )}
      {activeTab === 'expenses' && (
        <Expenses 
          expenses={expenses} 
          cards={cards} 
          onAdd={handleAddExpense} 
          onDelete={handleDeleteExpense} 
          onToggleInstallment={handleToggleInstallment}
        />
      )}
      {activeTab === 'cards' && (
        <Cards 
          cards={cards} 
          expenses={expenses} 
          invoices={invoices} 
          onAddCard={handleAddCard} 
          onDeleteCard={handleDeleteCard} 
          onPayInvoice={handlePayInvoice}
        />
      )}
      {activeTab === 'history' && (
        <History 
          expenses={expenses} 
          incomes={incomes} 
        />
      )}
      {activeTab === 'analysis' && (
        <Analysis 
          expenses={expenses} 
          incomes={incomes} 
          summary={monthlySummary} 
          previousSummary={previousSummary}
          darkMode={userConfig.darkMode}
        />
      )}
      {activeTab === 'rewards' && (
        <Rewards unlockedAchievements={userConfig.unlockedAchievements} />
      )}
      {activeTab === 'settings' && (
        <Settings 
          userName={userConfig.userName}
          setUserName={(name) => {
            setUserConfig(prev => ({ ...prev, userName: name }));
            // Only notify on actual change, not every keystroke
          }}
          onNameUpdate={() => {
            addNotification({
              title: 'Perfil Atualizado',
              message: `Nome alterado para ${userConfig.userName}`,
              type: 'success'
            });
          }}
          darkMode={userConfig.darkMode}
          setDarkMode={(dark) => {
            setUserConfig(prev => ({ ...prev, darkMode: dark }));
            addNotification({
              title: dark ? 'Modo Escuro Ativado' : 'Modo Claro Ativado',
              message: 'Sua preferência de tema foi salva',
              type: 'info'
            });
          }}
          onClearData={handleClearData}
        />
      )}
    </Layout>
  );
}
