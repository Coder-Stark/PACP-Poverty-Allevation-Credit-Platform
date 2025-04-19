import mongoose from 'mongoose';

const rdSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  amountPerMonth: {
    type: Number,
    required: true
  },
  totalInvestedAmount:{
    type: Number,
    default: 0,
  },
  currentInvestmentValue:{
    type: Number,
    default: 0,
  },
  interestRate: {
    type: Number,
    required: true
  },
  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },
  rdCount: {
    type: Number,
    default: 1,
  },
  lastDepositeDate: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true});

export default mongoose.model('RD', rdSchema);

