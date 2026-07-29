import { useId } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import useModalAccessibility from '../../../hooks/useModalAccessibility';

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

const ModalShell = ({
  isOpen,
  onClose,
  title,
  titleId,
  children,
  footer,
  size = 'md',
  className,
  initialFocusRef,
  showCloseButton = true,
  closeOnBackdrop = true,
}) => {
  const generatedId = useId();
  const resolvedTitleId = titleId || `modal-shell-title-${generatedId}`;
  const { dialogRef, onKeyDown } = useModalAccessibility({ isOpen, onClose, initialFocusRef });

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (!closeOnBackdrop) return;
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={clsx(
          'flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
          SIZE_CLASSES[size] || SIZE_CLASSES.md,
          className
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? resolvedTitleId : undefined}
        tabIndex={-1}
      >
        {title ? (
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 id={resolvedTitleId} className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
};

export default ModalShell;
