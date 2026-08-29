import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log("PROTECTED ROUTE:", {
    loading,
    user,
    role: user?.role,
    allowedRoles,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = user.role?.toLowerCase();

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log("WRONG ROLE:", userRole);

    return <Navigate to="/unauthorized" replace />;
  }

  console.log("ACCESS GRANTED:", userRole);

  return children;
};

export default ProtectedRoute;
