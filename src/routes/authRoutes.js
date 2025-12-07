import express from "express";
import { register, login, refreshToken } from "../controllers/authController.js";
import { loginLimiter, registerLimiter } from "../config/rateLimit.js";

const router = express.Router();

router.post("/register",registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh-token", refreshToken);

export default router;
