export interface User {
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
  type: 'expense' | 'income';
  createdAt: string;
}

export interface ExpenseFormData {
  amount: number;
  category: string;
  date: string;
  notes: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
}
