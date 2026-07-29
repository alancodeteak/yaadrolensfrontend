import { toast } from 'react-toastify';
import DashboardToast from '../components/common/DashboardToast/DashboardToast';
import { dashboardToastTransition } from './dashboardToastTransition';

const DEFAULT_DURATION = 2500;
const CONFIRM_TOAST_ID = 'dashboard-toast-confirm';

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

const TOAST_IDS = {
  success: 'dashboard-toast-success',
  error: 'dashboard-toast-error',
  info: 'dashboard-toast-info',
  warning: 'dashboard-toast-warning',
};

const showToast = (variant, message, title, duration = DEFAULT_DURATION) => {
  const refreshKey = Date.now();
  const toastId = `${TOAST_IDS[variant] || `dashboard-${variant}`}-${refreshKey}`;

  const notify =
    variant === 'success'
      ? toast.success
      : variant === 'error'
        ? toast.error
        : variant === 'warning'
          ? toast.warn
          : toast.info;

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

/**
 * Top toast with action buttons (stays until dismissed / action completes).
 */
const showConfirm = ({
  title,
  message,
  variant = 'warning',
  actions = [],
  toastId = CONFIRM_TOAST_ID,
}) => {
  toast.dismiss(toastId);
  const refreshKey = Date.now();

  return toast(
    ({ closeToast }) => (
      <DashboardToast
        key={refreshKey}
        variant={variant}
        title={title}
        message={message}
        closeToast={closeToast}
        duration={0}
        actions={actions}
      />
    ),
    {
      ...toastOptions(0),
      toastId,
    }
  );
};

const deferToast = (variant, message, title, duration, delayMs = 200) => {
  window.setTimeout(() => showToast(variant, message, title, duration), delayMs);
};

export const dashboardToast = {
  success: (message, title, duration) => showToast('success', message, title, duration),
  error: (message, title, duration) => showToast('error', message, title, duration),
  info: (message, title, duration) => showToast('info', message, title, duration),
  warning: (message, title, duration) => showToast('warning', message, title, duration),
  confirm: showConfirm,
  dismissConfirm: (toastId = CONFIRM_TOAST_ID) => toast.dismiss(toastId),
  successAfterOverlay: (message, title, duration, delayMs) =>
    deferToast('success', message, title, duration, delayMs),
  errorAfterOverlay: (message, title, duration, delayMs) =>
    deferToast('error', message, title, duration, delayMs),
};

export default dashboardToast;
