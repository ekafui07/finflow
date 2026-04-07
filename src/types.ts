export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'food' 
  | 'transport' 
  | 'rent' 
  | 'utilities' 
  | 'entertainment' 
  | 'health' 
  | 'subscriptions' 
  | 'savings' 
  | 'others'
  | 'income';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
  type: TransactionType;
  isRecurring?: boolean;
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  spent: number;
  period: 'monthly';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  category: Category;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: Category;
  isPaid: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  incomeFrequency: 'weekly' | 'bi-weekly' | 'monthly';
  monthlyIncome: number;
  financialGoals: string[];
  theme: 'light' | 'dark';
}
