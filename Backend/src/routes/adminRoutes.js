import express from "express";
import { authMiddleware, isAdmin } from "../middleware/authMiddlware.js";
import {getUserData, getSingleUserById, getAllUsers, getAllAdmins, uploadUserImage, uploadUserSignature} from "../controllers/adminController.js";

const router = express.Router();

//should not admin
router.get('/me', authMiddleware, getUserData);

router.get('/user/:id', authMiddleware, isAdmin, getSingleUserById);
router.get('/allusers', authMiddleware, isAdmin, getAllUsers);
router.get('/alladmins', authMiddleware, isAdmin, getAllAdmins);

//image and signature upload
router.post('/upload-user-image', uploadUserImage);
router.post('/upload-user-signature', uploadUserSignature);

export default router;