import { lazy, Suspense, useEffect, useState } from 'react';
import { dashboardToastTransition } from '../../../utils/dashboardToastTransition';

const LazyToastContainer = lazy(async () => {
  await import('react-toastify/dist/ReactToastify.css');
  const { ToastContainer } = await import('react-toastify');
  return { default: ToastContainer };
});

const DeferredAppToasts = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const enable = () => setEnabled(true);
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(enable, { timeout: 1500 });
    } else {
      window.setTimeout(enable, 1);
    }
  }, []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <LazyToastContainer
        position="top-center"
        className="dashboard-toast-container"
        transition={dashboardToastTransition}
        autoClose={false}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        toastClassName="dashboard-toast-item"
        bodyClassName="dashboard-toast-body"
      />
    </Suspense>
  );
};

export default DeferredAppToasts;
