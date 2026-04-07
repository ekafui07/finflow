import { Category } from '../types';

export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  budgets: {
    category: Category;
    limit: number;
  }[];
}

export const BUDGET_TEMPLATES: BudgetTemplate[] = [
  {
    id: 'monthly-allowance',
    name: 'Monthly Allowance Budget',
    description: 'A balanced budget for students on a GHS 500 monthly allowance.',
    totalAmount: 500,
    budgets: [
      { category: 'food', limit: 200 },
      { category: 'transport', limit: 50 },
      { category: 'utilities', limit: 50 },
      { category: 'entertainment', limit: 50 },
      { category: 'savings', limit: 100 },
      { category: 'others', limit: 50 },
    ]
  },
  {
    id: 'part-time-job',
    name: 'Part-time Job Budget',
    description: 'A budget for working students with GHS 800 monthly income.',
    totalAmount: 800,
    budgets: [
      { category: 'food', limit: 300 },
      { category: 'transport', limit: 100 },
      { category: 'rent', limit: 100 },
      { category: 'utilities', limit: 50 },
      { category: 'entertainment', limit: 100 },
      { category: 'savings', limit: 150 },
    ]
  },
  {
    id: 'hostel-budget',
    name: 'Hostel Budget',
    description: 'A focused budget for students living in hostels.',
    totalAmount: 400,
    budgets: [
      { category: 'food', limit: 250 },
      { category: 'transport', limit: 30 },
      { category: 'utilities', limit: 40 },
      { category: 'others', limit: 80 },
    ]
  }
];
