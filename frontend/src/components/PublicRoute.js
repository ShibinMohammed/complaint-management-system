import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-message">Loading...</div>; // Or a spinner
  }

  // If user is logged in AND is an admin, redirect to admin dashboard
  if (user && user.isAdmin) {
    return <Navigate to="/admin" />;
  }

  // Otherwise, allow access to the public route
  return children;
};

export default PublicRoute;