import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login first");
    }

    const response = await axios.put(
      `${API_URL}/change-password`,
      {
        currentPassword,
        newPassword,
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
      "Change password error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// DELETE ACCOUNT
// AUTHENTICATED USER
// ==========================================

export const deleteAccount = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login first");
    }

    const response = await axios.delete(`${API_URL}/delete-account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Delete account error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
