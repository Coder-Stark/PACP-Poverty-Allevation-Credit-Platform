import express from 'express';
import {authMiddleware, isAdmin} from '../middleware/authMiddlware.js';
import {createOrUpdateRD, getRdByUser, getRdByApplicationNumber} from '../controllers/financeController.js';

const router = express.Router();

router.post('/rd', authMiddleware, isAdmin, createOrUpdateRD);              //create or update Rd
router.get('/rd/:userId', authMiddleware, isAdmin, getRdByUser);            //get rd by user id
router.get('/rd/app/:applicationNumber', authMiddleware, isAdmin, getRdByApplicationNumber);    //get id by application number

export default router;