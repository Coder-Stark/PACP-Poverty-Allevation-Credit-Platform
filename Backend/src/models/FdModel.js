import mongoose from 'mongoose';

const fixedDepositSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  startDate: Date,
  maturityDate: Date
});

export default mongoose.model('FixedDeposit', fixedDepositSchema);
