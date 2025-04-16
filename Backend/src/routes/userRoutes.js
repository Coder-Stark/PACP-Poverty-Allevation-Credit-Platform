import express from 'express';
import { getUserData, getAllAdmins, getAllUsers } from '../controllers/userController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddlware.js';

const router = express.Router();

router.get('/me', authMiddleware, getUserData);

//only for admins
router.get('/allusers', authMiddleware, isAdmin, getAllUsers);     
router.get('/alladmins', authMiddleware, isAdmin, getAllAdmins);     

export default router;
