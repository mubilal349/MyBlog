import express from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";

import {
  authenticateToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// USER MANAGEMENT ROUTES
// ==========================================

// Get all users
router.get("/", authenticateToken, requireAdmin, getUsers);

// Get single user
router.get("/:id", authenticateToken, requireAdmin, getUserById);

// Update user
router.put("/:id", authenticateToken, requireAdmin, updateUser);

// Change role
router.patch("/:id/role", authenticateToken, requireAdmin, updateUserRole);

// Delete user
router.delete("/:id", authenticateToken, requireAdmin, deleteUser);

export default router;
