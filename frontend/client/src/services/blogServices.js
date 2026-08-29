import axios from "axios";

const API_URL = "http://localhost:5001/api/blogs";
const COMMENTS_API_URL = "http://localhost:5001/api/comments";

// ============================================================
// AUTH HEADER
// ============================================================

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ============================================================
// GET PUBLISHED BLOGS
// PUBLIC
// ============================================================

export const getPublishedBlogs = async () => {
  try {
    const response = await axios.get(API_URL);

    return response.data?.blogs || [];
  } catch (error) {
    console.error(
      "Get published blogs error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ============================================================
// GET SINGLE BLOG BY SLUG
// PUBLIC
// ============================================================

export const getBlogBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/${slug}`);

    console.log("GET BLOG BY SLUG RESPONSE:", response.data);

    return response.data?.blog || null;
  } catch (error) {
    console.error(
      "Get blog by slug error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ============================================================
// GET ALL BLOGS
// EDITOR + ADMIN
// ============================================================

export const getAllBlogsAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/all`, getAuthConfig());

    console.log("GET ALL BLOGS RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Get admin blogs error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ============================================================
// GET SINGLE BLOG BY ID
// EDITOR + ADMIN
// ============================================================

export const getAdminBlogById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/admin/${id}`, getAuthConfig());

    return response.data;
  } catch (error) {
    console.error(
      "Get admin blog error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ============================================================
// CREATE BLOG
// EDITOR + ADMIN
// ============================================================

export const createBlog = async (blogData) => {
  try {
    const response = await axios.post(API_URL, blogData, getAuthConfig());

    console.log("CREATE BLOG RESPONSE:", response.data);

    // Return complete response so Posts.jsx can use response.blog
    return response.data;
  } catch (error) {
    console.error("=================================");
    console.error("CREATE BLOG ERROR");
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Message:", error.message);
    console.error("=================================");

    throw error;
  }
};

// ============================================================
// UPDATE BLOG
// EDITOR + ADMIN
// ============================================================

export const updateBlog = async (id, blogData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    if (!id) {
      throw new Error("Blog ID is required.");
    }

    console.log("=================================");
    console.log("UPDATE BLOG REQUEST");
    console.log("Blog ID:", id);
    console.log("Data:", blogData);
    console.log("Token exists:", !!token);
    console.log("=================================");

    const response = await axios.put(`${API_URL}/${id}`, blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("UPDATE BLOG RESPONSE:", response.data);

    return response.data.blog;
  } catch (error) {
    console.error("=================================");
    console.error("UPDATE BLOG ERROR");
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Message:", error.message);
    console.error("=================================");

    throw error;
  }
};

// ============================================================
// DELETE BLOG
// ADMIN ONLY
// ============================================================

export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());

    return response.data;
  } catch (error) {
    console.error("Delete blog error:", error.response?.data || error.message);

    throw error;
  }
};

// ============================================================
// LIKE / UNLIKE BLOG
// AUTHENTICATED USER
// ============================================================

export const toggleBlogLike = async (blogId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${blogId}/like`,
      {},
      getAuthConfig(),
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

// ============================================================
// GET APPROVED COMMENTS
// PUBLIC
// ============================================================

export const getApprovedComments = async (blogId) => {
  try {
    const response = await axios.get(`${COMMENTS_API_URL}/blog/${blogId}`);

    return response.data?.comments || [];
  } catch (error) {
    console.error(
      "Get approved comments error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ============================================================
// CREATE COMMENT
// AUTHENTICATED USER
// ============================================================

export const createComment = async (blogId, content) => {
  try {
    const response = await axios.post(
      COMMENTS_API_URL,
      {
        blogId,
        content,
      },
      getAuthConfig(),
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
