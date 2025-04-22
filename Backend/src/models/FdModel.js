import mongoose from 'mongoose';

const fdSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },

  depositAmount: {
    type: Number,
    required: true
  },

  // currentInvestmentValue: {
  //   type: Number,
  //   default: 0  // backend can calculate and update this later
  // },

  maturityAmount: {
    type: Number,
    default: 0  // backend can calculate and update this later
  },

  interestRate: {
    type: Number,
    required: true
  },

  tenureInMonths: {
    type: Number,
    required: true
  },

  startDate: {
    type: Date,
    default: Date.now
  },

  maturityDate: {
    type: Date
    // Can be calculated on backend based on tenure + startDate
  },

  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },

  fdCount: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

export default mongoose.model('FD', fdSchema);
