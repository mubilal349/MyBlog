// ==========================================
// REQUIRE SPECIFIC ROLE
// ==========================================

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
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
