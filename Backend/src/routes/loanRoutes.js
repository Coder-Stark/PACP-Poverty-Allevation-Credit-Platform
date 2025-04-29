import express from 'express';
import {createLoan, getLoanByApplicationNumber, getUserLoan, payEMI} from '../controllers/loanController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddlware.js';

const router = express.Router();

router.post('/create', authMiddleware, isAdmin, createLoan);
router.post('/payemi/:userId', authMiddleware, isAdmin, payEMI);
router.get('/:userId', authMiddleware, isAdmin, getUserLoan);
router.get('/app/:loanApplicationNumber', authMiddleware, isAdmin, getLoanByApplicationNumber);

export default router;