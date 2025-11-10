import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    orderId: {type: String, unique: true, required: true},
    razorpayOrderId: {type: String, unique: true, required: true},
    razorpayPaymentId: {type: String, unique: true, required: true},
    razorpaySignature: {type: String, default: null},
    amount: {type: Number, required: true},
    currency: {type: String, default: 'INR'},
    status: {type: String, enum: ['created', 'pending', 'success', 'failed', 'refunded'], default: 'created'},
    paymentType: {type: String, enum: ['FD', 'RD', 'LOAN', 'LOAN_EMI', 'OTHER'], required: true},
    refrenceId: {type: mongoose.Schema.Types.ObjectId, refPath: 'referenceModel'},
    emiDetails: {installmentNumber: {type: Number}, dueDate: {type: Date}, repaymentScheduled: {type: mongoose.Schema.Types.ObjectId}},
    paymentMethod: {type: String, default: null},
    description: {type: String},
    failureReason: {type: String, default: null},
    metaData: {applicationNumber: {type: String}, userName: {type: String}, userEmail: {type: String}, userPhone: {type: String}},
    receiptNumber: {type: String, unique: true, sparse: true},   //sparse (only for successfulll payments)
    refundDetails: {refundId: {type: String}, refundAmount: {type: Number}, refundReason: {type: String}, refundDate: {type: Date}},
}, {timestamps: true});


// Indexes for better query performance
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ referenceId: 1, paymentType: 1 });
paymentSchema.index({ 'metadata.applicationNumber': 1 });
paymentSchema.index({ receiptNumber: 1 });

// Generate receipt number for successful payments
paymentSchema.pre('save', function(next) {
  if (this.status === 'success' && !this.receiptNumber) {
    this.receiptNumber = `RCPT_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
