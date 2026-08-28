import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

// ==========================================
// CREATE SLUG
// ==========================================

const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// ==========================================
// CREATE BLOG
// ADMIN ONLY
// ==========================================

export const createBlog = async (req, res) => {
  try {
    const { title, category, excerpt, content, image, status } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({
        error: "Title, category and content are required",
      });
    }

    let slug = createSlug(title);

    // Prevent duplicate slug
    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await Blog.create({
      title,
      slug,
      category,
      excerpt: excerpt || "",
      content,
      image: image || "",
      status: status || "Draft",
      author: req.user._id,
      publishedAt: status === "Published" ? new Date() : null,
    });

    const populatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "username email",
    );

    res.status(201).json({
      message: "Blog created successfully",

      blog: populatedBlog,
    });
  } catch (error) {
    console.error("Create blog error:", error);

    res.status(500).json({
      error: "Failed to create blog",
    });
  }
};

// ==========================================
// GET PUBLISHED BLOGS
// PUBLIC
// ==========================================

export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "Published",
    })
      .populate("author", "username name email")
      .sort({ publishedAt: -1 })
      .lean();

    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const commentsCount = await Comment.countDocuments({
          blog: blog._id,
          status: "approved",
        });

        return {
          ...blog,
          likesCount: blog.likes?.length || 0,
          commentsCount,
        };
      }),
    );

    res.status(200).json({
      blogs: blogsWithCounts,
    });
  } catch (error) {
    console.error("Get published blogs error:", error);

    res.status(500).json({
      error: "Failed to get published blogs",
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PUBLISHED BLOG BY SLUG
// PUBLIC
// ==========================================

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    console.log("Requested blog slug:", slug);

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

    // Count ONLY approved comments
    const commentsCount = await Comment.countDocuments({
      blog: blog._id,
      status: "approved",
    });

    const blogWithStats = {
      ...blog,

      likesCount: Array.isArray(blog.likes) ? blog.likes.length : 0,

      commentsCount,
    };

    console.log("Blog stats:", {
      likesCount: blogWithStats.likesCount,
      commentsCount: blogWithStats.commentsCount,
    });

    res.status(200).json({
      blog: blogWithStats,
    });
  } catch (error) {
    console.error("Get blog by slug error:", error);

    res.status(500).json({
      error: "Failed to get blog",
      message: error.message,
    });
  }
};
// ==========================================
// GET ALL BLOGS
// ADMIN ONLY
// ==========================================

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username email").sort({
      createdAt: -1,
    });

    res.status(200).json({
      blogs,
    });
  } catch (error) {
    console.error("Admin blogs error:", error);

    res.status(500).json({
      error: "Failed to fetch blogs",
    });
  }
};

// ==========================================
// GET SINGLE BLOG BY ID
// ADMIN
// ==========================================

export const getAdminBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username email",
    );

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    res.status(200).json({
      blog,
    });
  } catch (error) {
    console.error("Get admin blog error:", error);

    res.status(500).json({
      error: "Failed to fetch blog",
    });
  }
};

// ==========================================
// UPDATE BLOG
// ADMIN ONLY
// ==========================================

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    const { title, category, excerpt, content, image, status } = req.body;

    if (title !== undefined) {
      blog.title = title;

      let newSlug = createSlug(title);

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

    if (category !== undefined) {
      blog.category = category;
    }

    if (excerpt !== undefined) {
      blog.excerpt = excerpt;
    }

    if (content !== undefined) {
      blog.content = content;
    }

    if (image !== undefined) {
      blog.image = image;
    }

    if (status !== undefined) {
      if (blog.status !== "Published" && status === "Published") {
        blog.publishedAt = new Date();
      }

      if (status === "Draft") {
        blog.publishedAt = null;
      }

      blog.status = status;
    }

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id).populate(
      "author",
      "username email",
    );

    res.status(200).json({
      message: "Blog updated successfully",

      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    res.status(500).json({
      error: "Failed to update blog",
    });
  }
};

// ==========================================
// DELETE BLOG
// ADMIN ONLY
// ==========================================

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    res.status(500).json({
      error: "Failed to delete blog",
    });
  }
};

// ==========================================
// TOGGLE BLOG LIKE
// AUTHENTICATED USERS
// ==========================================

export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    // Make sure likes always exists
    if (!Array.isArray(blog.likes)) {
      blog.likes = [];
    }

    const userId = req.user._id.toString();

    const alreadyLiked = blog.likes.some(
      (likeId) => likeId.toString() === userId,
    );

    if (alreadyLiked) {
      // Remove like
      blog.likes = blog.likes.filter((likeId) => likeId.toString() !== userId);
    } else {
      // Add like
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
