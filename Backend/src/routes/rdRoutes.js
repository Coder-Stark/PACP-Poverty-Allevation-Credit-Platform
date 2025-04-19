import express from 'express';
import {authMiddleware, isAdmin} from '../middleware/authMiddlware.js';
import {createRD, updateRD, getUserRD, getRDByApplicationNumber} from '../controllers/rdController.js';

const router = express.Router();

router.post('/rd/create', authMiddleware, isAdmin, createRD);
router.put('/rd/update/:userId', authMiddleware, isAdmin, updateRD);
router.get('/rd/:userId', authMiddleware, isAdmin, getUserRD);
router.get('/rd/app/:applicationNumber', authMiddleware, isAdmin, getRDByApplicationNumber);

// router.get('/rd', authMiddleware, isAdmin, getAllRDs);

export default router;
