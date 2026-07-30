import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import LoadingScreen from './Lottie/LoadingScreen';

const ProtectedRoute = ({ children, requiredRoles = ['org_admin'] }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const didLogoutRef = useRef(false);
  const hasWrongRole = Boolean(
    isAuthenticated && user?.role && !requiredRoles.includes(user.role)
  );

  useEffect(() => {
    if (!hasWrongRole) {
      didLogoutRef.current = false;
      return;
    }
    if (didLogoutRef.current) return;
    didLogoutRef.current = true;
    dispatch(logout());
  }, [dispatch, hasWrongRole]);

  if (loading) {
    return <LoadingScreen message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (hasWrongRole) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, unauthorized: true }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
