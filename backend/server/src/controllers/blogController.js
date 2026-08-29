import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

// ============================================================
// CREATE SLUG
// ============================================================

const createSlug = (title) => {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// ============================================================
// NORMALIZE STATUS
// ============================================================

const normalizeStatus = (status) => {
  if (!status) {
    return "Draft";
  }

  const normalized = String(status).trim().toLowerCase();

  if (normalized === "draft") {
    return "Draft";
  }

  if (
    normalized === "pending" ||
    normalized === "pending review" ||
    normalized === "pending-review" ||
    normalized === "in review" ||
    normalized === "in-review" ||
    normalized === "review"
  ) {
    return "Pending Review";
  }

  if (
    normalized === "published" ||
    normalized === "publish" ||
    normalized === "live"
  ) {
    return "Published";
  }

  return "Draft";
};

// ============================================================
// GET USER ROLE
// ============================================================

const getUserRole = (req) => {
  return String(req.user?.role || "").toLowerCase();
};

// ============================================================
// CHECK ADMIN
// ============================================================

const isAdmin = (req) => {
  return getUserRole(req) === "admin";
};

// ============================================================
// CHECK EDITOR
// ============================================================

const isEditor = (req) => {
  return getUserRole(req) === "editor";
};

// ============================================================
// CHECK POST OWNERSHIP
// ============================================================

const isPostOwner = (blog, req) => {
  if (!blog?.author || !req.user?._id) {
    return false;
  }

  return String(blog.author) === String(req.user._id);
};

// ============================================================
// CREATE BLOG
// EDITOR + ADMIN
// ============================================================

export const createBlog = async (req, res) => {
  try {
    const { title, category, excerpt, content, image, status } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!title?.trim() || !category?.trim() || !content?.trim()) {
      return res.status(400).json({
        error: "Title, category and content are required",
      });
    }

    // --------------------------------------------------------
    // ROLE
    // --------------------------------------------------------

    const role = getUserRole(req);

    if (role !== "admin" && role !== "editor") {
      return res.status(403).json({
        error: "Only administrators and editors can create posts.",
      });
    }

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    let finalStatus = normalizeStatus(status);

    // Editors cannot publish
    if (role === "editor" && finalStatus === "Published") {
      return res.status(403).json({
        error: "Editors cannot publish posts. Submit the post for review.",
      });
    }

    // --------------------------------------------------------
    // SLUG
    // --------------------------------------------------------

    let slug = createSlug(title);

    if (!slug) {
      slug = `blog-${Date.now()}`;
    }

    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    // --------------------------------------------------------
    // PUBLISHED DATE
    // --------------------------------------------------------

    const publishedAt = finalStatus === "Published" ? new Date() : null;

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const blog = await Blog.create({
      title: title.trim(),
      slug,
      category: category.trim(),
      excerpt: excerpt?.trim() || "",
      content,
      image: image?.trim() || "",
      status: finalStatus,
      author: req.user._id,
      publishedAt,
    });

    // --------------------------------------------------------
    // POPULATE AUTHOR
    // --------------------------------------------------------

    const populatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "username name email role",
    );

    return res.status(201).json({
      message: "Blog created successfully",
      blog: populatedBlog,
    });
  } catch (error) {
    console.error("Create blog error:", error);

    return res.status(500).json({
      error: "Failed to create blog",
      message: error.message,
    });
  }
};

// ============================================================
// GET PUBLISHED BLOGS
// PUBLIC
// ============================================================

export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "Published",
    })
      .populate("author", "username name email")
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .lean();

    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const commentsCount = await Comment.countDocuments({
          blog: blog._id,
          status: "approved",
        });

        return {
          ...blog,
          likesCount: Array.isArray(blog.likes) ? blog.likes.length : 0,
          commentsCount,
        };
      }),
    );

    return res.status(200).json({
      blogs: blogsWithCounts,
    });
  } catch (error) {
    console.error("Get published blogs error:", error);

    return res.status(500).json({
      error: "Failed to get published blogs",
      message: error.message,
    });
  }
};

// ============================================================
// GET SINGLE PUBLISHED BLOG BY SLUG
// PUBLIC
// ============================================================

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug,
      status: "Published",
    })
      .populate("author", "username name email")
      .lean();

    if (!blog) {
      return res.status(404).json({
        error: "Published blog not found",
      });
    }

    const commentsCount = await Comment.countDocuments({
      blog: blog._id,
      status: "approved",
    });

    const blogWithStats = {
      ...blog,
      likesCount: Array.isArray(blog.likes) ? blog.likes.length : 0,
      commentsCount,
    };

    return res.status(200).json({
      blog: blogWithStats,
    });
  } catch (error) {
    console.error("Get blog by slug error:", error);

    return res.status(500).json({
      error: "Failed to get blog",
      message: error.message,
    });
  }
};

// ============================================================
// GET ALL BLOGS
// EDITOR + ADMIN
// ============================================================

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const role = getUserRole(req);

    let query = {};

    // Editors only get their own posts
    if (role === "editor") {
      query = {
        author: req.user._id,
      };
    }

    // Admin gets everything
    if (role === "admin") {
      query = {};
    }

    const blogs = await Blog.find(query)
      .populate("author", "username name email role")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      blogs,
    });
  } catch (error) {
    console.error("Get all blogs error:", error);

    return res.status(500).json({
      error: "Failed to fetch blogs",
      message: error.message,
    });
  }
};

// ============================================================
// GET SINGLE BLOG BY ID
// EDITOR + ADMIN
// ============================================================

export const getAdminBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username name email role",
    );

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    // Editors can only access their own posts
    if (isEditor(req) && !isPostOwner(blog, req)) {
      return res.status(403).json({
        error: "You can only access your own posts.",
      });
    }

    return res.status(200).json({
      blog,
    });
  } catch (error) {
    console.error("Get admin blog error:", error);

    return res.status(500).json({
      error: "Failed to fetch blog",
      message: error.message,
    });
  }
};

// ============================================================
// UPDATE BLOG
// EDITOR + ADMIN
// ============================================================

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    const role = getUserRole(req);

    // --------------------------------------------------------
    // PERMISSION
    // --------------------------------------------------------

    // Editor can only update own post
    if (role === "editor" && !isPostOwner(blog, req)) {
      return res.status(403).json({
        error: "Editors can only edit their own posts.",
      });
    }

    // Only admin/editor
    if (role !== "admin" && role !== "editor") {
      return res.status(403).json({
        error: "You are not authorized to update this post.",
      });
    }

    const { title, category, excerpt, content, image, status } = req.body;

    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({
          error: "Title cannot be empty.",
        });
      }

      blog.title = String(title).trim();

      let newSlug = createSlug(title);

      if (!newSlug) {
        newSlug = `blog-${Date.now()}`;
      }

      const existingBlog = await Blog.findOne({
        slug: newSlug,
        _id: {
          $ne: blog._id,
        },
      });

      if (existingBlog) {
        newSlug = `${newSlug}-${Date.now()}`;
      }

      blog.slug = newSlug;
    }

    // --------------------------------------------------------
    // CATEGORY
    // --------------------------------------------------------

    if (category !== undefined) {
      if (!String(category).trim()) {
        return res.status(400).json({
          error: "Category cannot be empty.",
        });
      }

      blog.category = String(category).trim();
    }

    // --------------------------------------------------------
    // EXCERPT
    // --------------------------------------------------------

    if (excerpt !== undefined) {
      blog.excerpt = String(excerpt);
    }

    // --------------------------------------------------------
    // CONTENT
    // --------------------------------------------------------

    if (content !== undefined) {
      if (!String(content).trim()) {
        return res.status(400).json({
          error: "Content cannot be empty.",
        });
      }

      blog.content = content;
    }

    // --------------------------------------------------------
    // IMAGE
    // --------------------------------------------------------

    if (image !== undefined) {
      blog.image = String(image);
    }

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    if (status !== undefined) {
      const newStatus = normalizeStatus(status);

      // ------------------------------------------------------
      // EDITOR CANNOT PUBLISH
      // ------------------------------------------------------

      if (role === "editor" && newStatus === "Published") {
        return res.status(403).json({
          error: "Editors cannot publish posts. Submit the post for review.",
        });
      }

      // ------------------------------------------------------
      // PUBLISH
      // ------------------------------------------------------

      if (blog.status !== "Published" && newStatus === "Published") {
        blog.publishedAt = new Date();
      }

      // ------------------------------------------------------
      // ALREADY PUBLISHED
      // ------------------------------------------------------

      if (blog.status === "Published" && newStatus === "Published") {
        if (!blog.publishedAt) {
          blog.publishedAt = new Date();
        }
      }

      // ------------------------------------------------------
      // UNPUBLISH / DRAFT
      // ------------------------------------------------------

      if (newStatus === "Draft") {
        blog.publishedAt = null;
      }

      // ------------------------------------------------------
      // PENDING REVIEW
      // ------------------------------------------------------

      if (newStatus === "Pending Review") {
        blog.publishedAt = null;
      }

      blog.status = newStatus;
    }

    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    await blog.save();

    // --------------------------------------------------------
    // RETURN UPDATED BLOG
    // --------------------------------------------------------

    const updatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "username name email role",
    );

    return res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    return res.status(500).json({
      error: "Failed to update blog",
      message: error.message,
    });
  }
};

// ============================================================
// DELETE BLOG
// ADMIN ONLY
// ============================================================

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    return res.status(500).json({
      error: "Failed to delete blog",
      message: error.message,
    });
  }
};

// ============================================================
// TOGGLE BLOG LIKE
// AUTHENTICATED USERS
// ============================================================

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    if (!Array.isArray(blog.likes)) {
      blog.likes = [];
    }

    const userId = req.user._id.toString();

    const alreadyLiked = blog.likes.some(
      (likeId) => likeId.toString() === userId,
    );

    if (alreadyLiked) {
      blog.likes = blog.likes.filter((likeId) => likeId.toString() !== userId);
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();

    return res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Blog liked",
      liked: !alreadyLiked,
      likesCount: blog.likes.length,
    });
  } catch (error) {
    console.error("Toggle like error:", error);

    return res.status(500).json({
      error: "Failed to update like",
      message: error.message,
    });
  }
};
