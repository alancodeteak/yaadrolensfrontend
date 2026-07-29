import React, { useEffect, useState } from 'react';

const NetworkErrorHandler = ({ children }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#f5f5f7',
            color: '#1d1d1f',
            borderBottom: '1px solid #d2d2d7',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#007AFF',
              display: 'inline-block',
            }}
          />
          You're currently offline. Some features may not work until your connection is restored.
        </div>
      )}
      {children}
    </>
  );
};

export default NetworkErrorHandler;
