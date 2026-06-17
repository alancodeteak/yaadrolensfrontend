import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logout } from '../../store/slices';
import LoadingScreen from './Lottie/LoadingScreen';

const AuthChecker = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const user = localStorage.getItem('user');

    if (!accessToken || !refreshToken || !user) {
      if (isAuthenticated) {
        dispatch(logout());
      }
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const accessValid = tokenPayload.exp && tokenPayload.exp > currentTime;

      if (accessValid || refreshToken) {
        dispatch(setToken(accessToken));
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch(logout());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <LoadingScreen message="Loading application..." />;
  }

  return children;
};

export default AuthChecker;
