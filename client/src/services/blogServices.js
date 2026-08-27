import axios from "axios";

const API_URL = "http://localhost:5001/api/blogs";

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
