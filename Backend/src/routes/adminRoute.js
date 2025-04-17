import express from "express";
import { getSingleUserById } from "../controllers/adminController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddlware.js";

const router = express.Router();

router.get('/user/:id', authMiddleware, isAdmin, getSingleUserById);

export default router;