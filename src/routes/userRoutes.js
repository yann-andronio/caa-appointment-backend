import express from 'express';
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/', protect, isAdmin, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, isAdmin, deleteUser);

export default router;
