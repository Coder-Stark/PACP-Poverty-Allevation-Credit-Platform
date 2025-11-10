import razorpayInstance from '../config/razorpay.js';


const generateOrderId = ()=>{
    return `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

//create razorpay Order
export const createOrder = async (req, res)=>{
    try{
        const {amount, paymentType, referenceId, description, emiDetails} = req.body;
        
        if(!amount || amount <= 0){
            return res.status(400).json({success: false, message: 'Invalid amount'});
        }

        if(!paymentType || !['FD', 'RD', 'LOAN', 'LOAN_EMI', 'OTHER'].includes(paymentType)){
            return res.status(400).json({success: false, message: 'Invalid Payment type'});
        }

        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'});
        }

        //validate reference based on payment type
        let referenceModel = null;
        let applicationNumber = null;
        let referenceDoc = null;

        if(paymentType === 'FD' && referenceId){
            referenceDoc = await FD.findById(referenceId);
            if(!referenceDoc){
                return res.status(404).json({success: false, message: 'FD not found'});
            } 
            referenceModel = 'FD';
            applicationNumber = referenceDoc.applicationNumber;
        }else if(paymentType === 'RD' && referenceId){
            referenceDoc = await RD.findById(referenceId);
            if(!referenceDoc){
                return res.status(404).json({success: false, message: 'RD not found'});
            }
            referenceModel = 'RD';
            applicationNumber = referenceDoc.applicationNumber;
        }else if((paymentType === 'LOAN' || paymentType === 'LOAN_EMI') && referenceId){
            referenceDoc = await Loan.findById(referenceId);
            if (!referenceDoc) {
              return res.status(404).json({
                success: false,
                message: 'Loan not found',
              });
            }
            referenceModel = 'Loan';
            applicationNumber = referenceDoc.loanApplicationNumber;
        }

        //create razorpay order
        const options = {
            amount: Math.round(amount * 100),          //amount in paise
            currency: 'INR',
            receipt: generateOrderId(),                //calling function is above
            payment_capture: 1,                       //auto capture
            notes: {
                userId: req.user._id.toString(),
                userName: user.name,
                paymentType: paymentType,
                applicationNumber: applicationNumber || 'N/A',
            }
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        //create payment record in database
        const paymentData = {
            userId: req.user._id,
            orderId: options.receipt,
            razarpayOrderId: razorpayOrder.id,
            amount: amount,
            currency: 'INR',
            status: 'created',
            paymentType,
            referenceId: referenceId || null,
            referenceModel: referenceModel,
            description: description || `${paymentType} Payment`,
            metadata: {
                applicationNumber: applicationNumber,
                userName: user.name,
                userEmail: user.email,
                userPhone: user.phone,
            }
        };

        //add emi if it's a loan emi payment
        if (paymentType === 'LOAN_EMI' && emiDetails) {
            paymentData.emiDetails = emiDetails;
        }

        const payment = await Payment.create(paymentData);

        res.status(201).json({
          success: true,
          message: 'Order created successfully',
          data: {
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            paymentId: payment._id,
            key: process.env.RAZORPAY_KEY_ID,
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone,
          },
        });
    }catch(error){
        console.error('Create Order error: ', error);
        res.status(500).json({success: false, message: 'Failed to create order', error: error.message});
    }
};

// Verify Payment with signature validation
export const verifyPayment = async (req, res) => {
    try {
        const {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        } = req.body;
      
        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return res.status(400).json({
            success: false,
            message: 'Missing payment verification details',
          });
        }
      
        // Find payment record
        const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      
        if (!payment) {
          return res.status(404).json({
            success: false,
            message: 'Payment record not found',
          });
        }
      
        // Verify signature
        const generatedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');
      
        if (generatedSignature === razorpay_signature) {
          // Payment is verified
          payment.razorpayPaymentId = razorpay_payment_id;
          payment.razorpaySignature = razorpay_signature;
          payment.status = 'success';

          // Fetch payment details from Razorpay
          try {
            const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);
            payment.paymentMethod = paymentDetails.method;
          } catch (fetchError) {
            console.error('Error fetching payment details:', fetchError);
          }
        
          await payment.save();
        
          // Update respective model based on payment type
          await updateModelAfterPayment(payment);
        
          res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            data: {
              paymentId: payment._id,
              orderId: payment.orderId,
              receiptNumber: payment.receiptNumber,
              status: payment.status,
            },
          });
        } else {
          // Signature mismatch
          payment.status = 'failed';
          payment.failureReason = 'Signature verification failed';
          await payment.save();

          res.status(400).json({
            success: false,
            message: 'Payment verification failed',
          });
        }
    }catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to verify payment',
          error: error.message,
        });
    }
};

// Helper function to update models after successful payment
const updateModelAfterPayment = async (payment) => {
    try {
        if(payment.paymentType === 'FD' && payment.referenceId) {
            // Update FD
            const fd = await FD.findById(payment.referenceId);
            if (fd) {
              fd.payments.push(payment._id);
              fd.paidAmount = (fd.paidAmount || 0) + payment.amount;

              // Update payment status
              if (fd.paidAmount >= fd.depositAmount) {
                fd.paymentStatus = 'paid';
              } else if (fd.paidAmount > 0) {
                fd.paymentStatus = 'partial';
              }

              await fd.save();
            }
        }   else if (payment.paymentType === 'RD' && payment.referenceId) {
            // Update RD
            const rd = await RD.findById(payment.referenceId);
            if (rd) {
              rd.payments.push(payment._id);
              rd.totalInvestedAmount = (rd.totalInvestedAmount || 0) + payment.amount;
              rd.lastDepositeDate = new Date();

              // Update monthly payment status if applicable
              const currentMonth = new Date().getMonth() + 1;
              const currentYear = new Date().getFullYear();

              const monthlyPayment = rd.monthlyPayments.find(
                mp => mp.month === currentMonth && mp.year === currentYear
              );

              if (monthlyPayment) {
                monthlyPayment.status = 'paid';
                monthlyPayment.paidDate = new Date();
                monthlyPayment.paymentId = payment._id;
              } else {
                rd.monthlyPayments.push({
                  month: currentMonth,
                  year: currentYear,
                  dueDate: new Date(),
                  paidDate: new Date(),
                  amount: payment.amount,
                  status: 'paid',
                  paymentId: payment._id
                });
              }

              await rd.save();
            }
        }   else if ((payment.paymentType === 'LOAN' || payment.paymentType === 'LOAN_EMI') && payment.referenceId) {
            // Update Loan
            const loan = await Loan.findById(payment.referenceId);
            if (loan) {
              // Add to payments array
              loan.payments.push({
                paymentDate: new Date(),
                amountPaid: payment.amount,
                mode: 'online',
                receiptNumber: payment.receiptNumber,
                remarks: `Online payment via Razorpay`,
                paymentId: payment._id
              });

              // Update total paid amount
              loan.totalPaidAmount = (loan.totalPaidAmount || 0) + payment.amount;

              // If it's an EMI payment, update the repayment schedule
              if (payment.paymentType === 'LOAN_EMI' && payment.emiDetails) {
                const schedule = loan.repaymentSchedule.id(payment.emiDetails.repaymentScheduleId);
                if (schedule) {
                  schedule.amountPaid = (schedule.amountPaid || 0) + payment.amount;
                  schedule.paidDate = new Date();
                  schedule.paymentId = payment._id;

                  if (schedule.amountPaid >= schedule.amountDue) {
                    schedule.status = 'paid';
                  } else if (schedule.amountPaid > 0) {
                    schedule.status = 'partial';
                  }
                }
              }

              // Update loan status if fully paid
              if (loan.totalPaidAmount >= loan.amount) {
                loan.status = 'completed';
              }

              await loan.save();
            }
        }
    }catch (error) {
        console.error('Error updating model after payment:', error);
    }   
};  

// Get Payment Details
export const getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;
        
        const payment = await Payment.findById(paymentId)
          .populate('userId', 'name email phone')
          .populate('referenceId');
        
        if (!payment) {
          return res.status(404).json({
            success: false,
            message: 'Payment not found',
          });
        }
      
        // Check if user is authorized to view this payment
        if (payment.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to view this payment',
          });
        }
      
        res.status(200).json({
          success: true,
          data: payment,
        });
    }catch (error) {
        console.error('Get payment details error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch payment details',
          error: error.message,
        });
    }
};

// Get User Payments
export const getUserPayments = async (req, res) => {
    try {
        const { status, paymentType, page = 1, limit = 10 } = req.query;
        
        const query = { userId: req.user._id };
        
        if (status) {
          query.status = status;
        }
      
        if (paymentType) {
          query.paymentType = paymentType;
        }
      
        const skip = (page - 1) * limit;
      
        const payments = await Payment.find(query)
          .populate('referenceId')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      
        const total = await Payment.countDocuments(query);
      
        // Calculate user statistics
        const userStats = await Payment.aggregate([
          { $match: { userId: req.user._id } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' },
            },
          },
        ]);
      
        res.status(200).json({
          success: true,
          data: {
            payments,
            statistics: userStats,
            pagination: {
              total,
              page: parseInt(page),
              pages: Math.ceil(total / limit),
            },
          },
        });
    }catch (error) {
        console.error('Get user payments error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch payments',
          error: error.message,
        });
    }
};

// Get All Payments (Admin Only)
export const getAllPayments = async (req, res) => {
    try {
        const { status, paymentType, userId, page = 1, limit = 10 } = req.query;
        
        const query = {};
        
        if (status) {
          query.status = status;
        }
      
        if (paymentType) {
          query.paymentType = paymentType;
        }
      
        if (userId) {
          query.userId = userId;
        }
      
        const skip = (page - 1) * limit;
      
        const payments = await Payment.find(query)
          .populate('userId', 'name email phone')
          .populate('referenceId')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      
        const total = await Payment.countDocuments(query);
      
        // Calculate statistics
        const stats = await Payment.aggregate([
          { $match: query },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' },
            },
          },
        ]);
      
        // Payment type wise statistics
        const typeStats = await Payment.aggregate([
          { $match: { status: 'success' } },
          {
            $group: {
              _id: '$paymentType',
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' },
            },
          },
        ]);
      
        res.status(200).json({
          success: true,
          data: {
            payments,
            statistics: {
              byStatus: stats,
              byType: typeStats,
            },
            pagination: {
              total,
              page: parseInt(page),
              pages: Math.ceil(total / limit),
            },
          },
        });
    }catch (error) {
        console.error('Get all payments error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch payments',
          error: error.message,
        });
    }   
};  

// Handle Payment Failure
export const handlePaymentFailure = async (req, res) => {
    try {
        const { razorpay_order_id, error } = req.body;
        
        const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
        
        if (!payment) {
            return res.status(404).json({
              success: false,
              message: 'Payment record not found',
            });
        }
      
        payment.status = 'failed';
        payment.failureReason = error?.description || error?.reason || 'Payment failed';
        await payment.save();
      
        res.status(200).json({
            success: true,
            message: 'Payment failure recorded',
            data: {
              paymentId: payment._id,
              status: payment.status,
            },
        });
    }catch (error) {
        console.error('Handle payment failure error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to handle payment failure',
            error: error.message,
        });
    }
};

// Refund Payment (Admin Only)
export const refundPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { amount, reason } = req.body;
        
        const payment = await Payment.findById(paymentId);
        
        if (!payment) {
          return res.status(404).json({
            success: false,
            message: 'Payment not found',
          });
        }
      
        if (payment.status !== 'success') {
          return res.status(400).json({
            success: false,
            message: 'Only successful payments can be refunded',
          });
        }
      
        // Create refund on Razorpay
        const refundAmount = amount ? Math.round(amount * 100) : Math.round(payment.amount * 100);
      
        const refund = await razorpayInstance.payments.refund(payment.razorpayPaymentId, {
          amount: refundAmount,
          notes: {
            reason: reason || 'Refund requested',
            refundedBy: req.user.name,
          },
        });
      
        payment.status = 'refunded';
        payment.refundDetails = {
          refundId: refund.id,
          refundAmount: refundAmount / 100,
          refundReason: reason || 'Refund requested',
          refundDate: new Date(),
        };
        await payment.save();
      
        // Update the related model (FD/RD/Loan) to reflect refund
        await updateModelAfterRefund(payment);
      
        res.status(200).json({
          success: true,
          message: 'Payment refunded successfully',
          data: {
            refundId: refund.id,
            amount: refundAmount / 100,
          },
        });
    }catch (error) {
        console.error('Refund payment error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to process refund',
          error: error.message,
        });
    }
};

// Helper function to update models after refund
const updateModelAfterRefund = async (payment) => {
    try {
        if (payment.paymentType === 'FD' && payment.referenceId) {
            const fd = await FD.findById(payment.referenceId);
            if (fd) {
                fd.paidAmount = Math.max(0, (fd.paidAmount || 0) - (payment.refundDetails.refundAmount || 0));

                if (fd.paidAmount === 0) {
                  fd.paymentStatus = 'pending';
                } else if (fd.paidAmount < fd.depositAmount) {
                  fd.paymentStatus = 'partial';
                }

                await fd.save();
            }
        } else if (payment.paymentType === 'RD' && payment.referenceId) {
            const rd = await RD.findById(payment.referenceId);
            if (rd) {
                rd.totalInvestedAmount = Math.max(0, (rd.totalInvestedAmount || 0) - (payment.refundDetails.refundAmount || 0));
                await rd.save();
            }
        } else if ((payment.paymentType === 'LOAN' || payment.paymentType === 'LOAN_EMI') && payment.referenceId) {
            const loan = await Loan.findById(payment.referenceId);
            if (loan) {
                loan.totalPaidAmount = Math.max(0, (loan.totalPaidAmount || 0) - (payment.refundDetails.refundAmount || 0));
                await loan.save();
            }
        }
    } catch (error) {
        console.error('Error updating model after refund:', error);
    }
};

// Get Payment Receipt
export const getPaymentReceipt = async (req, res) => {
    try {
        const { paymentId } = req.params;
        
        const payment = await Payment.findById(paymentId)
          .populate('userId', 'name email phone')
          .populate('referenceId');
        
        if (!payment) {
            return res.status(404).json({
              success: false,
              message: 'Payment not found',
            });
        }
      
        // Check if user is authorized
        if (payment.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this receipt',
            });
        }
      
        if (payment.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: 'Receipt only available for successful payments',
            });
        }
      
        res.status(200).json({
            success: true,
            data: {
                receiptNumber: payment.receiptNumber,
                orderId: payment.orderId,
                paymentId: payment.razorpayPaymentId,
                amount: payment.amount,
                currency: payment.currency,
                paymentMethod: payment.paymentMethod,
                paymentType: payment.paymentType,
                date: payment.updatedAt,
                user: {
                    name: payment.userId.name,
                    email: payment.userId.email,
                    phone: payment.userId.phone,
                },
                metadata: payment.metadata,
            },
        });
    }catch (error) {
        console.error('Get payment receipt error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment receipt',
            error: error.message,
        });
    }
};
