import { useEffect, useMemo, useState } from 'react';
import { getDefaultAvatar, resolveAvatar } from '../../../utils/avatar';

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

  useEffect(() => {
    setFailed(false);
  }, [primary]);

  return (
    <img
      className={className}
      src={failed ? fallback : primary}
      alt={alt ?? name ?? 'User'}
      onError={() => setFailed(true)}
    />
  );
};

export default UserAvatar;
