// ==========================================
// REQUIRE SPECIFIC ROLE
// ==========================================

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Normalize the user's role
    const userRole = String(req.user.role || "")
      .trim()
      .toLowerCase();

    // Normalize allowed roles
    const normalizedAllowedRoles = allowedRoles.map((role) =>
      String(role).trim().toLowerCase(),
    );

    console.log("ROLE CHECK:", {
      userId: req.user._id,
      username: req.user.username,
      originalRole: req.user.role,
      normalizedRole: userRole,
      allowedRoles: normalizedAllowedRoles,
    });

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "You do not have permission to perform this action.",
        role: req.user.role,
        requiredRoles: allowedRoles,
      });
    }

    next();
  };
};

// ==========================================
// ADMIN ONLY
// ==========================================

export const adminOnly = requireRole("admin");

// ==========================================
// EDITOR OR ADMIN
// ==========================================

export const editorOrAdmin = requireRole("editor", "admin");
