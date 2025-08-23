import express from 'express';
import {generateProfilePDF} from '../controllers/printController.js';
import {authMiddleware} from '../middleware/authMiddlware.js';

const router = express.Router();

router.get('/profile/:userId', authMiddleware, generateProfilePDF);

export default router;