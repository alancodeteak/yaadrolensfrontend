import { Navigate, useLocation } from 'react-router-dom';

const AdminDocsRedirect = () => {
  const location = useLocation();
  const suffix = location.pathname.replace(/^\/admin\/docs\/?/, '') || 'getting-started';
  return <Navigate to={`/docs/${suffix}`} replace />;
};

export default AdminDocsRedirect;
