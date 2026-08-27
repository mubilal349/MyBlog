import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // RESTORE AUTHENTICATION ON PAGE REFRESH
  // ==========================================
  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios.get(
          "http://localhost:5001/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("PROFILE RESPONSE:", response.data);

        // Supports both:
        // response.data = user
        // response.data = { user: user }
        const currentUser = response.data.user || response.data;

        console.log("RESTORED USER:", currentUser);

        setUser(currentUser);
      } catch (error) {
        console.error(
          "PROFILE ERROR:",
          error.response?.status,
          error.response?.data || error.message,
        );

        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  // ==========================================
  // REGISTER
  // ==========================================
  const register = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        userData,
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Registration error:", error);

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================
  const login = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        credentials,
      );

      const { token, user } = response.data;

      // Save token
      localStorage.setItem("token", token);

      // Set axios token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set user
      setUser(user);

      console.log("Login successful:", user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {
    localStorage.removeItem("token");

    delete axios.defaults.headers.common["Authorization"];

    setUser(null);
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================
  const value = {
    user,
    setUser,
    register,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
