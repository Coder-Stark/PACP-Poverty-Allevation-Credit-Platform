import mongoose from 'mongoose';

const companyStatsSchema = new mongoose.Schema({
  totalLoans: Number,
  totalFDs: Number,
  totalRDs: Number,
  currentBalance: Number
});

export default mongoose.model('CompanyStats', companyStatsSchema);
