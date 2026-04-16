export type ExpenseCategory = 'cash' | 'credit_one_time' | 'credit_installments';
export type IncomeCategory = 'salary' | 'freelance' | 'investment' | 'other';

export interface Expense {
  id: string;
  description: string;
  value: number;
  category: ExpenseCategory;
  date: string; // ISO date string
  cardId?: string; // Link to a credit card
  totalInstallments?: number;
  remainingInstallments?: number;
  paidInstallments?: number[]; // Array of installment numbers that are paid (1-indexed)
}

export interface Income {
  id: string;
  description: string;
  value: number;
  category: IncomeCategory;
  date: string;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color: string;
}

export interface Invoice {
  id: string;
  cardId: string;
  month: string; // YYYY-MM
  isPaid: boolean;
}

export interface UserConfig {
  userName: string;
  darkMode: boolean;
  unlockedAchievements?: string[]; // Array of achievement IDs
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'info' | 'warning' | 'success';
  date: string;
  isRead: boolean;
}

export interface Achievement {
  id: string;
  emoji: string;
  label: string;
  description: string;
  condition: (state: { expenses: Expense[], incomes: Income[], cards: CreditCard[] }) => boolean;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  byCategory: Record<string, number>;
}
