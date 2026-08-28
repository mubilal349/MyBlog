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

import {
  authenticateToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all blogs including Draft
router.get("/admin/all", authenticateToken, requireAdmin, getAllBlogsAdmin);

// Get admin blog by ID
router.get("/admin/:id", authenticateToken, requireAdmin, getAdminBlogById);

// Create
router.post("/", authenticateToken, requireAdmin, createBlog);

// Update
router.put("/:id", authenticateToken, requireAdmin, updateBlog);

// Delete
router.delete("/:id", authenticateToken, requireAdmin, deleteBlog);

// ==========================================
// LIKE ROUTE
// ==========================================

// Like / Unlike blog
router.post("/:id/like", authenticateToken, toggleLike);

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Published blogs
router.get("/", getPublishedBlogs);

// Single published blog
router.get("/:slug", getBlogBySlug);

export default router;
