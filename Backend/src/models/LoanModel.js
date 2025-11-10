import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loanApplicationNumber: String,
  applicationDate: Date,

  // Core loan info
  amount: Number,
  interestRate: Number,
  tenureInMonths: Number, // in months
  loanType: {type: String, enum: ['secured', 'unsecured'], default: 'unsecured'},
  status: { type: String, enum: ['approved', 'pending', 'rejected', 'completed'], default: 'pending' },

  personalInfo: { name: String, parentName: String, address: String, city: String, pincode: String, ownedOrRented: String, dob: Date, age: Number, photo: String, signature: String},
  occupationDetails: {
    occupationType: {type: String, enum: ['authorized', 'unauthorized'], required: true},
    authorizedDetails: { department: String, designation: String, branch: String, income: Number, officeName: String, officePhone: String},
    unauthorizedDetails: { businessType: String, vendorLocation: String, dailyIncome: Number, shopType: String, workingHours: String, licenseNumber: String, contactNumber: String}
  },

  nominee: { name: String, mobile: String, age: Number, relationship: String, occupation: String, address: String, photo: String, signature: String},

  // EMIs / Payments history (embedded for now)
  payments: [{
    paymentDate: Date,
    amountPaid: Number,
    mode: { type: String, enum: ['cash', 'bank', 'upi', 'cheque'], default: 'cash' },
    receiptNumber: String,
    remarks: String,
    paymentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Payment'},
  }],

  // Repayment Schedule (due dates and EMI status)
  repaymentSchedule: [{
    dueDate: Date,
    amountDue: Number,
    status: { type: String, enum: ['paid', 'due', 'late'], default: 'due' },
    amountPaid: {type: Number, default: 0},
    paidDate: {type: Date},
    lateFee: {type: Number, default: 0},
    paymentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Payment'}
  }],

  lateFeesPenalty: { amount: { type: Number, default: 0 }, dueDate: Date},
  collateral: { type: String,  details: String, value: Number},
  repaymentMethod: { type: String, enum: ['auto-debit', 'manual'], default: 'manual' },
  totalPaidAmount: {type: Number, default: 0},
  outStandingAmount: {type: Number, default: 0}
},{ timestamps: true });


// Calculate outstanding amount before saving
loanSchema.pre('save', function(next) {
  if (this.amount && this.totalPaidAmount !== undefined) {
    this.outstandingAmount = this.amount - this.totalPaidAmount;
  }
  next();
});

export default mongoose.model('Loan', loanSchema);
