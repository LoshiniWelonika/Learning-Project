import React from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");
  return Boolean(token);
};

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;