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

  // Personal Info
  personalInfo: {
    name: String,
    parentName: String,
    address: String,
    city: String,
    pincode: String,
    ownedOrRented: String,
    dob: Date,
    age: Number,
    photo: String,
    signature: String
  },

  // Occupation Info
  occupationDetails: {
    occupationType: {type: String, enum: ['authorized', 'unauthorized'], required: true},

    // Authorized worker details (only if occupationType is 'authorized')
    authorizedDetails: {
      department: String,
      designation: String,
      branch: String,
      income: Number,
      officeName: String,
      officePhone: String
    },

    // Unauthorized worker details (only if occupationType is 'unauthorized')
    unauthorizedDetails: {
      businessType: String,
      vendorLocation: String,
      dailyIncome: Number,
      shopType: String,
      workingHours: String,
      licenseNumber: String,
      contactNumber: String
    }
  },

  // Nominee Info
  nominee: {
    name: String,
    mobile: String,
    age: Number,
    relationship: String,
    occupation: String,
    address: String,
    photo: String,
    signature: String
  },

  // EMIs / Payments history (embedded for now)
  payments: [
    {
      paymentDate: Date,
      amountPaid: Number,
      mode: { type: String, enum: ['cash', 'bank', 'upi', 'cheque'], default: 'cash' },
      receiptNumber: String,
      remarks: String
    }
  ],

  // Repayment Schedule (due dates and EMI status)
  repaymentSchedule: [
    {
      dueDate: Date,
      amountDue: Number,
      status: { type: String, enum: ['paid', 'due', 'late'], default: 'due' },
      amountPaid: {type: Number, default: 0},
      paidDate: {type: Date},
      lateFee: {type: Number, default: 0}
    }
  ],

  // Loan approval and disbursement dates
  approvedDate: Date,
  disbursedDate: Date,

  // Late Fees / Penalty Charges
  lateFeesPenalty: {
    amount: { type: Number, default: 0 },
    dueDate: Date
  },

  // Collateral Information (if secured loan)
  collateral: {
    type: String, // e.g., property, vehicle
    details: String,
    value: Number
  },

  // Loan Disbursement Details
  disbursementDetails: {
    bankAccountNumber: String,
    accountHolderName: String,
    bankName: String
  },

  // Repayment Method (auto-debit or manual)
  repaymentMethod: { type: String, enum: ['auto-debit', 'manual'], default: 'manual' },
},{ timestamps: true });

export default mongoose.model('Loan', loanSchema);
