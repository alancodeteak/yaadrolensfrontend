import { useEffect, useMemo, useState } from 'react';
import { getDefaultAvatar, resolveAvatar } from '../../../utils/avatar';
import {
  ensureAuthenticatedPhotoObjectUrl,
  isAuthenticatedPhotoPath,
  resolveEmployeePhotoUrl,
} from '../../../utils/employeePhoto';

const UserAvatar = ({ src, name, seed, className, alt }) => {
  const fallback = useMemo(
    () => getDefaultAvatar(seed ?? name ?? 'user'),
    [seed, name]
  );
  const primary = useMemo(
    () => resolveAvatar(src, seed ?? name),
    [src, seed, name]
  );
  const [failed, setFailed] = useState(false);
  const [authSrc, setAuthSrc] = useState(null);

  useEffect(() => {
    setFailed(false);
  }, [primary]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!src || !isAuthenticatedPhotoPath(src)) {
        setAuthSrc(null);
        return;
      }
      const objectUrl = await ensureAuthenticatedPhotoObjectUrl(src);
      if (cancelled) {
        return;
      }
      if (!objectUrl) {
        setAuthSrc(null);
        setFailed(true);
        return;
      }
      setAuthSrc(objectUrl);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [src]);

  const displaySrc = useMemo(() => {
    if (failed) {
      return fallback;
    }
    if (authSrc) {
      return authSrc;
    }
    if (src && isAuthenticatedPhotoPath(src)) {
      return fallback;
    }
    return primary || resolveEmployeePhotoUrl(src) || fallback;
  }, [authSrc, failed, fallback, primary, src]);

  return (
    <img
      className={className}
      src={displaySrc}
      alt={alt ?? name ?? 'User'}
      onError={() => setFailed(true)}
    />
  );
};

export default UserAvatar;
