import express from 'express';
import {authMiddleware, isAdmin} from '../middleware/authMiddlware.js';
import {createRD, updateRD, getUserRD, getRDByApplicationNumber} from '../controllers/rdController.js';

const router = express.Router();

router.post('/create', authMiddleware, isAdmin, createRD);
router.put('/update/:userId', authMiddleware, isAdmin, updateRD);
router.get('/:userId', authMiddleware, getUserRD);
router.get('/app/:applicationNumber', authMiddleware, isAdmin, getRDByApplicationNumber);

// router.get('/rd', authMiddleware, isAdmin, getAllRDs);

export default router;
