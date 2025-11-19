import React, { useEffect, useState } from 'react';
import { expenseService } from '../../services/expenseService';
import { useNavigate } from 'react-router-dom';
import type { Expense } from '../../types';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import Navbar from '../Layout/Navbar';

import './Dashboard.css';




interface Summary {
    totalExpense: number;
    totalIncome: number;
    balance: number;
    byCategory: { [key: string]: number };
    count: number;
}

const Dashboard: React.FC = () => {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Colors for pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch summary statistics
            const summaryResponse = await fetch('http://localhost:8081/api/expenses/stats/summary', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const summaryData = await summaryResponse.json();
            setSummary(summaryData);

            // Fetch recent expenses
            const expenses = await expenseService.getAllExpenses();
            setRecentExpenses(expenses.slice(0, 5)); // Get latest 5

            setLoading(false);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            if (err.response?.status === 401) {
                navigate('/login');
            }
            setLoading(false);
        }
    };

    // Prepare data for pie chart
    const categoryData = summary ? Object.entries(summary.byCategory).map(([name, value]) => ({
        name,
        value
    })) : [];

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dashboard-loading">Loading...</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <button
                        className="btn-add-expense"
                        onClick={() => navigate('/expenses')}
                    >
                        + Add Expense
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="summary-cards">
                    <div className="card income-card">
                        <div className="card-icon">💵</div>
                        <div className="card-content">
                            <h3>Total Income</h3>
                            <p className="amount">₹{summary?.totalIncome.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className="card expense-card">
                        <div className="card-icon">💸</div>
                        <div className="card-content">
                            <h3>Total Expenses</h3>
                            <p className="amount">₹{summary?.totalExpense.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className="card balance-card">
                        <div className="card-icon">💰</div>
                        <div className="card-content">
                            <h3>Balance</h3>
                            <p className="amount">₹{summary?.balance.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className="card count-card">
                        <div className="card-icon">📊</div>
                        <div className="card-content">
                            <h3>Total Transactions</h3>
                            <p className="amount">{summary?.count || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                    {/* Pie Chart - Expenses by Category */}
                    <div className="chart-card">
                        <h2>Expenses by Category</h2>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`  // ✅ Fixed
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="no-data">No expense data available</div>
                        )}

                    </div>

                    {/* Recent Expenses List */}
                    <div className="chart-card">
                        <h2>Recent Transactions</h2>
                        {recentExpenses.length > 0 ? (
                            <div className="recent-list">
                                {recentExpenses.map((expense) => (
                                    <div key={expense._id} className="recent-item">
                                        <div className="recent-info">
                                            <span className="recent-category">{expense.category}</span>
                                            <span className="recent-date">
                                                {new Date(expense.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className={`recent-amount ${expense.type}`}>
                                            {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">No transactions yet</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;







