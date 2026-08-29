import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==========================================
// REGISTER
// ==========================================

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already registered",
      });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    // ==========================================
    // MARK USER AS ONLINE
    // ==========================================

    user.isOnline = true;
    user.lastSeen = new Date();

    await user.save();

    // ==========================================
    // CREATE JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isOnline: true,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from your current password",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Server error while changing password",
    });
  }
};

// ==========================================
// DELETE ACCOUNT
// ==========================================

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user.id);

    return res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    return res.status(500).json({
      message: "Server error while deleting account",
    });
  }
};
