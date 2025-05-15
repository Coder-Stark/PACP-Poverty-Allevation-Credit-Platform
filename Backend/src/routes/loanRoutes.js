import express from 'express';
import {createLoan, getLoanByApplicationNumber, getUserLoans, payEMI} from '../controllers/loanController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddlware.js';

const router = express.Router();

router.post('/create', authMiddleware, isAdmin, createLoan);
router.put('/payemi/:userId/:loanId', authMiddleware, isAdmin, payEMI);
router.get('/:userId', authMiddleware, isAdmin, getUserLoans);
router.get('/app/:loanApplicationNumber', authMiddleware, isAdmin, getLoanByApplicationNumber);

export default router;