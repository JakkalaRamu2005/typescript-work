import React, { useState } from 'react';
import Navbar from '../Layout/Navbar';
import './Categories.css';

const CategoryManager: React.FC = () => {
  const expenseCategories = [
    { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
    { name: 'Transportation', icon: '🚗', color: '#4ECDC4' },
    { name: 'Shopping', icon: '🛍️', color: '#FFE66D' },
    { name: 'Entertainment', icon: '🎬', color: '#95E1D3' },
    { name: 'Bills & Utilities', icon: '💡', color: '#F38181' },
    { name: 'Health & Fitness', icon: '💪', color: '#AA96DA' },
    { name: 'Education', icon: '📚', color: '#FCBAD3' },
    { name: 'Travel', icon: '✈️', color: '#A8E6CF' },
    { name: 'Other', icon: '📦', color: '#DCEDC1' }
  ];

  const incomeCategories = [
    { name: 'Salary', icon: '💰', color: '#00C49F' },
    { name: 'Business', icon: '💼', color: '#0088FE' },
    { name: 'Freelance', icon: '💻', color: '#FFBB28' },
    { name: 'Investment', icon: '📈', color: '#FF8042' },
    { name: 'Gift', icon: '🎁', color: '#8884D8' },
    { name: 'Other', icon: '💵', color: '#82ca9d' }
  ];

  return (
    <>
      <Navbar />
      <div className="categories-container">
        <h1>Categories</h1>
        
        <section className="category-section">
          <h2>💸 Expense Categories</h2>
          <div className="category-grid">
            {expenseCategories.map((cat, index) => (
              <div 
                key={index} 
                className="category-card"
                style={{ borderLeft: `4px solid ${cat.color}` }}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="category-section">
          <h2>💵 Income Categories</h2>
          <div className="category-grid">
            {incomeCategories.map((cat, index) => (
              <div 
                key={index} 
                className="category-card"
                style={{ borderLeft: `4px solid ${cat.color}` }}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoryManager;
