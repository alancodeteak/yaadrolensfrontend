import { useEffect, useId, useState } from 'react';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import ButtonSpinner from '../ButtonSpinner';
import useModalAccessibility from '../../../hooks/useModalAccessibility';

const VARIANTS = {
  primary: {
    icon: CheckCircle2,
    iconWrap: 'bg-[#007AFF]/10 text-[#007AFF]',
    confirmClass:
      'rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0066DD] disabled:cursor-not-allowed disabled:opacity-50',
  },
  destructive: {
    icon: AlertTriangle,
    iconWrap: 'bg-red-50 text-[#FF3B30]',
    confirmClass:
      'rounded-xl bg-[#FF3B30] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#E0352B] disabled:cursor-not-allowed disabled:opacity-50',
  },
  neutral: {
    icon: HelpCircle,
    iconWrap: 'bg-gray-100 text-gray-600',
    confirmClass:
      'rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0066DD] disabled:cursor-not-allowed disabled:opacity-50',
  },
};

const EXIT_MS = 200;

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  confirmButtonClass,
  isLoading = false,
  loadingText = 'Processing…',
  confirmDisabled = false,
  closeOnBackdrop = true,
}) => {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const titleId = `confirmation-dialog-title-${generatedId}`;

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const handleRequestClose = () => {
    if (isLoading) return;
    onClose?.();
  };

  const { dialogRef, onKeyDown } = useModalAccessibility({
    isOpen: isOpen && visible,
    onClose: handleRequestClose,
  });

  if (!mounted) return null;

  const config = VARIANTS[variant] || VARIANTS.primary;
  const Icon = config.icon;
  const confirmClass = confirmButtonClass || config.confirmClass;
  const content =
    children ||
    (message ? (
      <p className="whitespace-pre-line text-sm leading-relaxed text-gray-500">{message}</p>
    ) : null);

  const handleBackdropClick = () => {
    if (!closeOnBackdrop) return;
    handleRequestClose();
  };

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm',
        visible ? 'ui-modal-backdrop' : 'ui-modal-backdrop--exit'
      )}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={clsx(
          'flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
          visible ? 'ui-modal-panel' : 'ui-modal-panel--exit'
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="px-5 py-5">
          <div className="flex items-start gap-3">
            <div
              className={clsx(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300',
                config.iconWrap,
                isLoading && 'scale-95 opacity-90'
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 id={titleId} className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              {content ? (
                <div className="mt-1.5 text-sm leading-relaxed text-gray-500">{content}</div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={handleRequestClose}
            disabled={isLoading}
            className="ui-btn-motion rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading || confirmDisabled}
              className={clsx('ui-btn-motion inline-flex items-center gap-2', confirmClass)}
            >
              {isLoading && <ButtonSpinner size="sm" className="text-white" />}
              {isLoading ? loadingText : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
