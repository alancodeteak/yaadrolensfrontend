import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { LottieLoader } from '../../components/common';
import { login } from '../../store/slices';

const CODETEAK_LOGO = '/assets/Copy of logo-with-text-ho.png';
const CODETEAK_URL = 'https://www.codeteak.com/';

const labelClass = 'mb-1.5 block text-xs font-medium text-gray-500';
const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

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

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#007AFF]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#5856D6]/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/assets/yadro-logo-blue.png"
            alt="YaadroLens"
            className="mx-auto h-14 w-auto"
          />
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#007AFF]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#007AFF]">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Organization Admin
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Sign in to YaadroLens</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage attendance, employees, and your organization
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#007AFF]/10 text-[#007AFF]">
              <LogIn className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Admin login</h2>
              <p className="text-[11px] text-gray-500">Enter your organization credentials</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login_id" className={labelClass}>
                User ID
              </label>
              <input
                type="text"
                id="login_id"
                name="login_id"
                value={formData.login_id}
                onChange={handleInputChange}
                placeholder="Enter your user ID"
                className={inputClass}
                required
                autoComplete="username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
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
                  className={clsx(inputClass, 'pr-11')}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={2} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0066DD] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <LottieLoader size="xs" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <a
            href={CODETEAK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-gray-100/80"
            aria-label="Powered by CodeTeak — opens codeteak.com"
          >
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Powered by
            </span>
            <img
              src={CODETEAK_LOGO}
              alt="CodeTeak"
              className="h-6 w-auto max-w-[180px] object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
