import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

// ==========================================
// CREATE COMMENT
// User submits a comment
// Status is ALWAYS pending
// ==========================================

export const createComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;

    if (!blogId || !content?.trim()) {
      return res.status(400).json({
        error: "Blog ID and comment content are required",
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    // Create comment
    // IMPORTANT:
    // Users cannot choose the status.
    // Every new comment starts as pending.
    const comment = await Comment.create({
      blog: blogId,
      user: req.user.id,
      content: content.trim(),
      status: "pending",
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name username email avatar")
      .populate("blog", "title slug");

    return res.status(201).json({
      message:
        "Comment submitted successfully. It will appear after admin approval.",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("CREATE COMMENT ERROR:", error);

    return res.status(500).json({
      error: "Failed to create comment",
    });
  }
};

// ==========================================
// GET APPROVED COMMENTS
// Public endpoint
// Only approved comments are returned
// ==========================================

// ==========================================
// GET APPROVED COMMENTS
// PUBLIC
// ==========================================

export const getApprovedComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!blogId) {
      return res.status(400).json({
        error: "Blog ID is required",
      });
    }

    const blog = await Blog.findById(blogId).select("_id");

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    const comments = await Comment.find({
      blog: blogId,
      status: "approved",
    })
      .populate("user", "name username avatar")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    console.error("GET APPROVED COMMENTS ERROR:", error);

    return res.status(500).json({
      error: "Failed to load comments",
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL COMMENTS
// Admin only
// ==========================================

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name username email avatar")
      .populate("blog", "title slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    console.error("GET ALL COMMENTS ERROR:", error);

    return res.status(500).json({
      error: "Failed to load comments",
    });
  }
};

// ==========================================
// APPROVE COMMENT
// Admin only
// ==========================================

export const approveComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    comment.status = "approved";

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("user", "name username email avatar")
      .populate("blog", "title slug");

    return res.status(200).json({
      message: "Comment approved successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("APPROVE COMMENT ERROR:", error);

    return res.status(500).json({
      error: "Failed to approve comment",
    });
  }
};

// ==========================================
// REJECT COMMENT
// Admin only
// ==========================================

export const rejectComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    comment.status = "rejected";

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("user", "name username email avatar")
      .populate("blog", "title slug");

    return res.status(200).json({
      message: "Comment rejected successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("REJECT COMMENT ERROR:", error);

    return res.status(500).json({
      error: "Failed to reject comment",
    });
  }
};

// ==========================================
// DELETE COMMENT
// Admin only
// ==========================================

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    await Comment.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);

    return res.status(500).json({
      error: "Failed to delete comment",
    });
  }
};
