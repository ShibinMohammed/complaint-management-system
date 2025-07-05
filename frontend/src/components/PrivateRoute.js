import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-message">Loading...</div>; // Or a spinner
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If logged in but not an admin, redirect to home page
  if (!user.isAdmin) {
    return <Navigate to="/" />;
  }

  // If logged in and is admin, render children
  return children;
};

export default PrivateRoute;