import User from "../models/User.js";

// ==========================================
// GET ALL USERS
// ==========================================

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
};

// ==========================================
// GET SINGLE USER
// ==========================================

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
};

// ==========================================
// UPDATE USER
// ==========================================

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name;
    user.email = email;
    user.role = role; // ⭐ IMPORTANT

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// ==========================================
// CHANGE USER ROLE
// ==========================================

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role. Role must be user or admin",
      });
    }

    // Prevent admin from changing their own role
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        error: "You cannot change your own role",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.role = role;

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Update role error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to update user role",
    });
  }
};

// ==========================================
// DELETE USER
// ==========================================

export const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        error: "You cannot delete your own account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
};
