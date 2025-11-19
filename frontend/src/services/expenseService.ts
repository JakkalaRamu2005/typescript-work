import api from './api';
import type { Expense, ExpenseFormData } from '../types';

export const expenseService = {
  getAllExpenses: async (): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses');
    return response.data;
  },

  getExpenseById: async (id: string): Promise<Expense> => {
    const response = await api.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (data: ExpenseFormData): Promise<Expense> => {
    const response = await api.post<Expense>('/expenses', data);
    return response.data;
  },

  updateExpense: async (id: string, data: ExpenseFormData): Promise<Expense> => {
    const response = await api.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  getExpensesByDateRange: async (startDate: string, endDate: string): Promise<Expense[]> => {
    const response = await api.get<Expense[]>(`/expenses/range?start=${startDate}&end=${endDate}`);
    return response.data;
  },
};
