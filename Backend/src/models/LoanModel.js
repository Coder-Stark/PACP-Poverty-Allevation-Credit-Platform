import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loanApplicationNumber: String,
  applicationDate: Date,

  // Core loan info
  amount: Number,
  interestRate: Number,
  tenure: Number, // in months
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },

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
    occupation: String,
    department: String,
    designation: String,
    branch: String,
    income: Number,
    officeName: String,
    officePhone: String
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
  ]
});

export default mongoose.model('Loan', loanSchema);
