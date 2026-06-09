import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    login_id: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await dispatch(login(formData)).unwrap();
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#007aff' }}>
      <div className="absolute inset-0" style={{ backgroundColor: '#007aff' }}></div>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="text-center">
          <div className="mb-4">
            <img
              src="/assets/yadro-logo-blue.png"
              alt="Yadro Logo"
              className="h-16 w-auto mx-auto transform transition-transform hover:scale-105"
            />
          </div>
          <div className="text-xl font-medium text-white tracking-wide">
            YaadroLens
          </div>
          <p className="text-sm text-blue-100 mt-2">Organization Admin Portal</p>
        </div>
      </div>

      <div className="relative z-10 w-full px-4 pb-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-50 rounded-3xl shadow-2xl p-8 w-full">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
              Log in
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="login_id" className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  id="login_id"
                  name="login_id"
                  value={formData.login_id}
                  onChange={handleInputChange}
                  placeholder="Enter your user ID"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-2xl font-bold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <div className="mt-6 pt-4 text-center">
              <div className="text-sm text-gray-500">
                <div className="mb-2">Powered by</div>
                <div className="flex items-center justify-center">
                  <img
                    src="/assets/codeteak-logo.png"
                    alt="CodeTeak"
                    className="h-4 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
