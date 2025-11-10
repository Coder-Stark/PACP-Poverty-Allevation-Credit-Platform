import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/authMiddlware.js';
import { createOrder, getAllPayments, getPaymentDetails, getPaymentReceipt, getUserPayments, handlePaymentFailure, refundPayment, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

//user routes
router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.post('/failure', authMiddleware, handlePaymentFailure);
router.get('/my-payments', authMiddleware, getUserPayments);
router.get('/:paymentId/receipt', authMiddleware, getPaymentReceipt);
router.get('/:paymentId', authMiddleware, getPaymentDetails);

//admin routes
router.get('/all', authMiddleware, isAdmin, getAllPayments);
router.post('/:paymentId/refund', authMiddleware, isAdmin, refundPayment);

export default router;
