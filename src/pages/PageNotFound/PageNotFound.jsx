import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  NotFoundState,
  notFoundActionClass,
  notFoundSecondaryActionClass,
} from '../../components/common';

const PageNotFound = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <NotFoundState
      fullScreen
      title="Page not found"
      message="The page you are looking for does not exist or may have been moved."
    >
      {isAuthenticated ? (
        <Link to="/admin/dashboard" className={notFoundActionClass}>
          Go to Dashboard
        </Link>
      ) : (
        <Link to="/login" className={notFoundActionClass}>
          Go to Login
        </Link>
      )}
      {isAuthenticated ? (
        <Link to="/docs/getting-started" className={notFoundSecondaryActionClass}>
          View help guide
        </Link>
      ) : null}
    </NotFoundState>
  );
};

export default PageNotFound;
