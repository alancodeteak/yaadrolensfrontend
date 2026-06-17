import { useLocation } from 'react-router-dom';
import { resolvePageDocsHref } from './pageDocsRoutes';

export function usePageDocsHref(overrideHref) {
  const { pathname } = useLocation();
  return overrideHref ?? resolvePageDocsHref(pathname);
}
