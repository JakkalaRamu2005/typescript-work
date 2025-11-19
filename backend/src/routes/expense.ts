import { Router } from 'express';
import Expense from '../models/Expense';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes are protected - need to be logged in
router.use(authMiddleware);

// GET all expenses for logged-in user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId })
      .sort({ date: -1 })  // Newest first
      .limit(100);  // Limit to 100 records

    console.log(`✅ Retrieved ${expenses.length} expenses for user ${req.userId}`);
    res.json(expenses);
  } catch (err: any) {
    console.error('❌ Get expenses error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single expense by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId  // Make sure user owns this expense
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (err: any) {
    console.error('❌ Get expense error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST create new expense
router.post('/', async (req: AuthRequest, res) => {
  console.log('=== CREATE EXPENSE ===');
  console.log('Request body:', req.body);

  const { amount, category, date, notes, type } = req.body;

  try {
    // Validate
    if (!amount || !category) {
      return res.status(400).json({ message: 'Amount and category are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Create expense
    const newExpense = new Expense({
      userId: req.userId,
      amount,
      category,
      date: date || new Date(),
      notes: notes || '',
      type: type || 'expense'
    });

    await newExpense.save();
    console.log('✅ Expense created:', newExpense._id);

    res.status(201).json(newExpense);
  } catch (err: any) {
    console.error('❌ Create expense error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT update expense
router.put('/:id', async (req: AuthRequest, res) => {
  console.log('=== UPDATE EXPENSE ===');
  console.log('Expense ID:', req.params.id);
  console.log('Update data:', req.body);

  const { amount, category, date, notes, type } = req.body;

  try {
    // Find expense
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Validate
    if (amount && amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Update fields
    if (amount !== undefined) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = new Date(date);
    if (notes !== undefined) expense.notes = notes;
    if (type) expense.type = type;

    await expense.save();
    console.log('✅ Expense updated');

    res.json(expense);
  } catch (err: any) {
    console.error('❌ Update expense error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE expense
router.delete('/:id', async (req: AuthRequest, res) => {
  console.log('=== DELETE EXPENSE ===');
  console.log('Expense ID:', req.params.id);

  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    console.log('✅ Expense deleted');
    res.json({ message: 'Expense deleted successfully' });
  } catch (err: any) {
    console.error('❌ Delete expense error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET expenses by date range
router.get('/range/:startDate/:endDate', async (req: AuthRequest, res) => {
  const { startDate, endDate } = req.params;

  try {
    const expenses = await Expense.find({
      userId: req.userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: -1 });

    console.log(`✅ Retrieved ${expenses.length} expenses for date range`);
    res.json(expenses);
  } catch (err: any) {
    console.error('❌ Get expenses by range error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET summary statistics
router.get('/stats/summary', async (req: AuthRequest, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });

    // Calculate totals
    const totalExpense = expenses
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalIncome = expenses
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    // Group by category
    const byCategory = expenses.reduce((acc: any, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = 0;
      }
      acc[exp.category] += exp.amount;
      return acc;
    }, {});

    res.json({
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      byCategory,
      count: expenses.length
    });
  } catch (err: any) {
    console.error('❌ Get summary error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
