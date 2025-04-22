import express from 'express';
import {authMiddleware, isAdmin} from '../middleware/authMiddlware.js';
import {createFD, getUserFD, getFDByApplicationNumber} from '../controllers/fdController.js';

const router = express.Router();

router.post('/create', authMiddleware, isAdmin, createFD);
router.get('/:userId', authMiddleware, isAdmin, getUserFD);
router.get('/app/:applicationNumber', authMiddleware, isAdmin, getFDByApplicationNumber);


export default router;
