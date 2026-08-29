import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ==========================================
  // ROLE CHECK
  // ==========================================

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ==========================================
  // AUTHORIZED
  // ==========================================

  return children;
};

export default ProtectedRoute;
