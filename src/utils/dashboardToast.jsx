import { toast } from 'react-toastify';
import DashboardToast from '../components/common/DashboardToast/DashboardToast';
import { dashboardToastTransition } from './dashboardToastTransition';

const DEFAULT_DURATION = 2500;

const toastOptions = (duration = DEFAULT_DURATION) => ({
  autoClose: false,
  hideProgressBar: true,
  icon: false,
  closeButton: false,
  closeOnClick: false,
  transition: dashboardToastTransition,
  className: 'dashboard-toast-item',
  bodyClassName: 'dashboard-toast-body',
});

const showToast = (variant, message, title, duration = DEFAULT_DURATION) => {
  const refreshKey = Date.now();
  toast.dismiss();

  const notify = variant === 'success' ? toast.success : variant === 'error' ? toast.error : toast.info;
  const toastId = `dashboard-${variant}-${refreshKey}`;

  return notify(
    ({ closeToast }) => (
      <DashboardToast
        key={refreshKey}
        variant={variant}
        message={message}
        title={title}
        closeToast={closeToast}
        duration={duration}
      />
    ),
    {
      ...toastOptions(duration),
      toastId,
    }
  );
};

export const dashboardToast = {
  success: (message, title, duration) => showToast('success', message, title, duration),
  error: (message, title, duration) => showToast('error', message, title, duration),
  info: (message, title, duration) => showToast('info', message, title, duration),
};

export default dashboardToast;
