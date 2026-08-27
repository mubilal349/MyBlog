import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  console.log("PROTECTED ROUTE:", {
    loading,
    user,
    role: user?.role,
    requiredRole,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    console.log("NO USER → LOGIN");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log("WRONG ROLE:", user.role);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("ACCESS GRANTED");

  return children;
};

export default ProtectedRoute;
