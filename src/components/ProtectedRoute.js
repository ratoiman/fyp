import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();

  if (user != null) {
    if (Object.keys(user).length !== 0) {
      return children;
    }
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
