import axios from "axios";

const API_URL = "http://localhost:5001/api/blogs";
const COMMENTS_API_URL = "http://localhost:5001/api/comments";

// ==========================================
// GET PUBLISHED BLOGS
// PUBLIC
// ==========================================

export const getPublishedBlogs = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data.blogs || [];
  } catch (error) {
    console.error(
      "Get published blogs error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// GET SINGLE BLOG BY SLUG
// PUBLIC
// ==========================================

export const getBlogBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/${slug}`);

    console.log("GET BLOG BY SLUG RESPONSE:", response.data);

    return response.data.blog;
  } catch (error) {
    console.error(
      "Get blog by slug error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// GET ALL BLOGS
// ADMIN
// ==========================================

export const getAllBlogsAdmin = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.blogs || [];
  } catch (error) {
    console.error(
      "Get admin blogs error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// GET SINGLE BLOG BY ID
// ADMIN
// ==========================================

export const getAdminBlogById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.blog;
  } catch (error) {
    console.error(
      "Get admin blog error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// CREATE BLOG
// ADMIN
// ==========================================

export const createBlog = async (blogData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(API_URL, blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.blog;
  } catch (error) {
    console.error("Create blog error:", error.response?.data || error.message);

    throw error;
  }
};

// ==========================================
// UPDATE BLOG
// ADMIN
// ==========================================

export const updateBlog = async (id, blogData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(`${API_URL}/${id}`, blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.blog;
  } catch (error) {
    console.error("Update blog error:", error.response?.data || error.message);

    throw error;
  }
};

// ==========================================
// DELETE BLOG
// ADMIN
// ==========================================

export const deleteBlog = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Delete blog error:", error.response?.data || error.message);

    throw error;
  }
};

// ==========================================
// LIKE / UNLIKE BLOG
// AUTHENTICATED USER
// ==========================================

export const toggleBlogLike = async (blogId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login to like this blog.");
    }

    const response = await axios.post(
      `${API_URL}/${blogId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Toggle blog like error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// GET APPROVED COMMENTS
// PUBLIC
// ==========================================

export const getApprovedComments = async (blogId) => {
  try {
    const response = await axios.get(`${COMMENTS_API_URL}/blog/${blogId}`);

    console.log("Approved comments API response:", response.data);

    // If backend returns { comments: [...] }
    return response.data.comments || [];
  } catch (error) {
    console.error(
      "Get approved comments error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// CREATE COMMENT
// AUTHENTICATED USER
// ==========================================

export const createComment = async (blogId, content) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login to comment");
    }

    const response = await axios.post(
      COMMENTS_API_URL,
      {
        blogId,
        content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create comment error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
