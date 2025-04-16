import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationId: String,
  applicationDate: Date,
  memberId: String,
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
  occupationDetails: {
    occupation: String,
    department: String,
    designation: String,
    branch: String,
    income: Number,
    officeName: String,
    officePhone: String
  },
  nominee: {
    name: String,
    mobile: String,
    age: Number,
    relationship: String,
    occupation: String,
    address: String,
    photo: String,
    signature: String
  }
});

export default mongoose.model('LoanApplication', loanApplicationSchema);