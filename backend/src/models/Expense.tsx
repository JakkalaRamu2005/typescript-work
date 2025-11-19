import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  date: Date;
  notes: string;
  type: 'expense' | 'income';
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  notes: { 
    type: String, 
    default: '',
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense'
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// Index for faster queries
ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
