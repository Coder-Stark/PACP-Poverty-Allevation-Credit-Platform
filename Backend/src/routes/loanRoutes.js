import express from 'express';
import {createLoan} from '../controllers/loanController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddlware.js';

const router = express.Router();

router.post('/create', authMiddleware, isAdmin, createLoan);

export default router;