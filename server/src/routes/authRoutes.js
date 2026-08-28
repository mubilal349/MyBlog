import express from "express";

import {
  register,
  login,
  getProfile,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// AUTH ROUTES
// ==========================================

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get currently logged-in user
router.get("/profile", authenticateToken, getProfile);

// Change password
router.patch("/change-password", authenticateToken, changePassword);

// ==========================================
// DELETE ACCOUNT
// ==========================================

router.delete("/delete-account", authenticateToken, deleteAccount);

export default router;
