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

// ============================================================
// ADMIN + EDITOR
// ============================================================

// Get all posts
router.get("/admin/all", authenticateToken, editorOrAdmin, getAllBlogsAdmin);

// Get one post by ID
router.get("/admin/:id", authenticateToken, editorOrAdmin, getAdminBlogById);

// Create post
router.post("/", authenticateToken, editorOrAdmin, createBlog);

// Update post
router.put("/:id", authenticateToken, editorOrAdmin, updateBlog);

// ============================================================
// ADMIN ONLY
// ============================================================

// Delete post
router.delete("/:id", authenticateToken, adminOnly, deleteBlog);

// ============================================================
// AUTHENTICATED USERS
// ============================================================

// Like / unlike
router.post("/:id/like", authenticateToken, toggleLike);

// ============================================================
// PUBLIC
// ============================================================

// Published posts
router.get("/", getPublishedBlogs);

// Single published post
router.get("/:slug", getBlogBySlug);

export default router;
