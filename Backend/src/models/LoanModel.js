import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loanApplication: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication' },
  amount: Number,
  interestRate: Number,
  tenure: Number,
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' }
});

export default mongoose.model('Loan', loanSchema);
