import express from "express";

import {
  createComment,
  getApprovedComments,
  getAllComments,
  approveComment,
  rejectComment,
  deleteComment,
} from "../controllers/commentController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

// Get approved comments for a blog
// GET /api/comments/blog/:blogId
router.get("/blog/:blogId", getApprovedComments);

// ==========================================
// AUTHENTICATED USER
// ==========================================

// Create a comment
// POST /api/comments
router.post("/", authenticateToken, createComment);

// ==========================================
// ADMIN ONLY
// ==========================================

// Get all comments
// GET /api/comments
router.get("/", authenticateToken, adminOnly, getAllComments);

// Approve comment
// PATCH /api/comments/:id/approve
router.patch("/:id/approve", authenticateToken, adminOnly, approveComment);

// Reject comment
// PATCH /api/comments/:id/reject
router.patch("/:id/reject", authenticateToken, adminOnly, rejectComment);

// Delete comment
// DELETE /api/comments/:id
router.delete("/:id", authenticateToken, adminOnly, deleteComment);

export default router;
