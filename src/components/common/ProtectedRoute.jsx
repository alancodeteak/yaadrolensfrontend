import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingScreen from './Lottie/LoadingScreen';

const ProtectedRoute = ({ children, requiredRoles = ['org_admin'] }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Legacy tokens/users without a role are allowed through for backward compatibility
  if (user?.role && !requiredRoles.includes(user.role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and authorized, render the protected component
  return children;
};

export default ProtectedRoute;
