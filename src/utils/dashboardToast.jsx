import { toast } from 'react-toastify';
import DashboardToast from '../components/common/DashboardToast/DashboardToast';
import { dashboardToastTransition } from './dashboardToastTransition';

const DEFAULT_DURATION = 2500;
const CONFIRM_TOAST_ID = 'dashboard-toast-confirm';

/** Track live confirm toasts so we can dismiss/replace them reliably. */
const activeConfirmToastIds = new Set();

const toastOptions = () => ({
  autoClose: false,
  hideProgressBar: true,
  icon: false,
  closeButton: false,
  closeOnClick: false,
  draggable: false,
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
      ...toastOptions(),
      autoClose: false,
      toastId,
    }
  );
};

function dismissAllConfirms() {
  for (const id of [...activeConfirmToastIds]) {
    toast.dismiss(id);
    activeConfirmToastIds.delete(id);
  }
  // Legacy fixed IDs from earlier callers
  toast.dismiss(CONFIRM_TOAST_ID);
  toast.dismiss('shift-delete-confirm');
  toast.dismiss('shift-force-delete');
}

function mountConfirmToast({ title, message, variant, actions, idBase }) {
  const toastId = `${idBase}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  activeConfirmToastIds.add(toastId);

  const release = () => {
    activeConfirmToastIds.delete(toastId);
  };

  return toast(
    ({ closeToast }) => (
      <DashboardToast
        key={toastId}
        variant={variant}
        title={title}
        message={message}
        duration={0}
        actions={actions}
        closeToast={() => {
          release();
          closeToast?.();
        }}
      />
    ),
    {
      ...toastOptions(),
      toastId,
      onClose: release,
    }
  );
}

/**
 * Top toast with action buttons (stays until dismissed / action completes).
 * Always uses a fresh toast id so Cancel → open again works.
 */
const showConfirm = ({
  title,
  message,
  variant = 'warning',
  actions = [],
  toastId: idBase = CONFIRM_TOAST_ID,
}) => {
  const hadActive = activeConfirmToastIds.size > 0 || toast.isActive(idBase);
  dismissAllConfirms();

  const mount = () =>
    mountConfirmToast({
      title,
      message,
      variant,
      actions,
      idBase,
    });

  // After dismiss, react-toastify needs a tick before a new toast can mount cleanly.
  if (hadActive) {
    return window.setTimeout(mount, 60);
  }

  return mount();
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
  dismissConfirm: (toastId) => {
    if (toastId) {
      toast.dismiss(toastId);
      activeConfirmToastIds.delete(toastId);
      return;
    }
    dismissAllConfirms();
  },
  successAfterOverlay: (message, title, duration, delayMs) =>
    deferToast('success', message, title, duration, delayMs),
  errorAfterOverlay: (message, title, duration, delayMs) =>
    deferToast('error', message, title, duration, delayMs),
};

export default dashboardToast;
