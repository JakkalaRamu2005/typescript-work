import React, { useEffect, useState } from 'react';
import { expenseService } from '../../services/expenseService';
import type { Expense } from '../../types';
import Navbar from '../Layout/Navbar';
import ExpenseForm from './ExpenseForm';
import './Expenses.css';

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await expenseService.deleteExpense(id);
      setExpenses(expenses.filter(e => e._id !== id));
      alert('Expense deleted successfully!');
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Failed to delete expense');
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpense(null);
    fetchExpenses();
  };

  const filteredExpenses = expenses.filter(exp => 
    filter === 'all' ? true : exp.type === filter
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="expense-loading">Loading expenses...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="expenses-container">
        <div className="expenses-header">
          <h1>All Transactions</h1>
          <button 
            className="btn-add"
            onClick={() => setShowForm(true)}
          >
            + Add New
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'expense' ? 'active' : ''}
            onClick={() => setFilter('expense')}
          >
            Expenses
          </button>
          <button 
            className={filter === 'income' ? 'active' : ''}
            onClick={() => setFilter('income')}
          >
            Income
          </button>
        </div>

        {/* Expense List */}
        {filteredExpenses.length === 0 ? (
          <div className="no-expenses">
            <p>No transactions found. Click "Add New" to create one!</p>
          </div>
        ) : (
          <div className="expense-list">
            {filteredExpenses.map((expense) => (
              <div key={expense._id} className="expense-item">
                <div className="expense-icon">
                  {expense.type === 'income' ? '💵' : '💸'}
                </div>
                <div className="expense-details">
                  <h3>{expense.category}</h3>
                  <p className="expense-notes">{expense.notes || 'No notes'}</p>
                  <span className="expense-date">
                    {new Date(expense.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="expense-actions">
                  <span className={`expense-amount ${expense.type}`}>
                    {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toLocaleString()}
                  </span>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(expense)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(expense._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <ExpenseForm 
            expense={editingExpense}
            onClose={handleFormClose}
          />
        )}
      </div>
    </>
  );
};

export default ExpenseList;
