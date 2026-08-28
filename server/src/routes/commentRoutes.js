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

const router = express.Router();

// ==========================================
// PUBLIC
// ==========================================

// Get only approved comments for a blog
// GET /api/comments/blog/:blogId
router.get("/blog/:blogId", getApprovedComments);

// ==========================================
// AUTHENTICATED USER
// ==========================================

// Create comment
// Automatically starts as "pending"
// POST /api/comments
router.post("/", authenticateToken, createComment);

// ==========================================
// ADMIN
// ==========================================

// Get all comments
// GET /api/comments
router.get("/", authenticateToken, getAllComments);

// Approve comment
// PATCH /api/comments/:id/approve
router.patch("/:id/approve", authenticateToken, approveComment);

// Reject comment
// PATCH /api/comments/:id/reject
router.patch("/:id/reject", authenticateToken, rejectComment);

// Delete comment
// DELETE /api/comments/:id
router.delete("/:id", authenticateToken, deleteComment);

export default router;
