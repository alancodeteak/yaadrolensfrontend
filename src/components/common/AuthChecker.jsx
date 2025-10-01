import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setToken } from '../../store/slices';

const AuthChecker = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const user = localStorage.getItem('user');

      if (accessToken && refreshToken && user) {
        try {
          // Parse the stored user data
          const userData = JSON.parse(user);
          
          // Check if token is expired (basic check)
          const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (tokenPayload.exp && tokenPayload.exp > currentTime) {
            // Token is still valid, restore auth state
            dispatch(setToken(accessToken));
          } else {
            // Token is expired, try to refresh or logout
            // For now, just logout - refresh logic is handled by interceptors
            dispatch(logout());
          }
        } catch (error) {
          // Invalid token format or corrupted data, logout
          console.error('Error checking auth status:', error);
          dispatch(logout());
        }
      } else {
        // No valid auth data found
        if (isAuthenticated) {
          dispatch(logout());
        }
      }
    };

    checkAuthStatus();
  }, [dispatch, isAuthenticated]);

  // Show loading spinner during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthChecker;
