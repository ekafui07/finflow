import { Transaction, Budget, SavingsGoal } from '../types';
import { subDays, format, startOfMonth, endOfMonth } from 'date-fns';

const now = new Date();

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: format(now, 'yyyy-MM-dd'),
    amount: 3500,
    category: 'income',
    description: 'Monthly Salary',
    type: 'income',
  },
  {
    id: '2',
    date: format(subDays(now, 1), 'yyyy-MM-dd'),
    amount: 1200,
    category: 'rent',
    description: 'Apartment Rent',
    type: 'expense',
  },
  {
    id: '3',
    date: format(subDays(now, 2), 'yyyy-MM-dd'),
    amount: 85.50,
    category: 'food',
    description: 'Whole Foods Market',
    type: 'expense',
  },
  {
    id: '4',
    date: format(subDays(now, 3), 'yyyy-MM-dd'),
    amount: 45.00,
    category: 'transport',
    description: 'Uber Ride',
    type: 'expense',
  },
  {
    id: '5',
    date: format(subDays(now, 4), 'yyyy-MM-dd'),
    amount: 15.99,
    category: 'subscriptions',
    description: 'Netflix Subscription',
    type: 'expense',
    isRecurring: true,
  },
  {
    id: '6',
    date: format(subDays(now, 5), 'yyyy-MM-dd'),
    amount: 120.00,
    category: 'utilities',
    description: 'Electricity Bill',
    type: 'expense',
  },
  {
    id: '7',
    date: format(subDays(now, 6), 'yyyy-MM-dd'),
    amount: 200.00,
    category: 'savings',
    description: 'Emergency Fund Transfer',
    type: 'expense',
  },
  {
    id: '8',
    date: format(subDays(now, 7), 'yyyy-MM-dd'),
    amount: 65.20,
    category: 'entertainment',
    description: 'Cinema Tickets',
    type: 'expense',
  },
  {
    id: '9',
    date: format(subDays(now, 8), 'yyyy-MM-dd'),
    amount: 450.00,
    category: 'income',
    description: 'Freelance Project',
    type: 'income',
  }
];

export const MOCK_BUDGETS: Budget[] = [
  { id: 'b1', category: 'food', limit: 500, spent: 320, period: 'monthly' },
  { id: 'b2', category: 'transport', limit: 200, spent: 145, period: 'monthly' },
  { id: 'b3', category: 'entertainment', limit: 300, spent: 280, period: 'monthly' },
  { id: 'b4', category: 'utilities', limit: 250, spent: 120, period: 'monthly' },
];

export const MOCK_GOALS: SavingsGoal[] = [
  {
    id: 'g1',
    name: 'New MacBook Pro',
    targetAmount: 2500,
    currentAmount: 1200,
    deadline: '2026-12-31',
    color: '#3b82f6',
    category: 'savings'
  },
  {
    id: 'g2',
    name: 'Europe Trip',
    targetAmount: 5000,
    currentAmount: 1500,
    deadline: '2027-06-15',
    color: '#10b981',
    category: 'savings'
  }
];
