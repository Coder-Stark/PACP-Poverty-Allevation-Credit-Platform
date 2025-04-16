import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit', 'withdrawal', 'loanDisbursed', 'loanRepaid'] },
  amount: Number,
  date: Date,
  note: String
});

export default mongoose.model('Transaction', transactionSchema);
