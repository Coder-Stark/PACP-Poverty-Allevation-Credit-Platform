import mongoose from 'mongoose';

const monthlyDepositSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  date: Date
});

export default mongoose.model('MonthlyDeposit', monthlyDepositSchema);
