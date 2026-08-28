import express from "express";

import {
  createBlog,
  getPublishedBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  getAdminBlogById,
  updateBlog,
  deleteBlog,
  toggleLike,
} from "../controllers/blogController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

import { adminOnly, editorOrAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================================
// EDITOR + ADMIN
// ==========================================

// Get all blogs including Draft
router.get("/admin/all", authenticateToken, editorOrAdmin, getAllBlogsAdmin);

// Get admin blog by ID
router.get("/admin/:id", authenticateToken, editorOrAdmin, getAdminBlogById);

// Create blog
router.post("/", authenticateToken, editorOrAdmin, createBlog);

// Update blog
router.put("/:id", authenticateToken, editorOrAdmin, updateBlog);

// ==========================================
// ADMIN ONLY
// ==========================================

// Delete blog
router.delete("/:id", authenticateToken, adminOnly, deleteBlog);

// ==========================================
// LIKE
// ==========================================

router.post("/:id/like", authenticateToken, toggleLike);

// ==========================================
// PUBLIC
// ==========================================

// Published blogs
router.get("/", getPublishedBlogs);

// Single published blog
router.get("/:slug", getBlogBySlug);

export default router;
