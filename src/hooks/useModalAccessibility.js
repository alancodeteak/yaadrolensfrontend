import { useCallback, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (container) => {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  );
};

/**
 * Shared accessibility behavior for modal dialogs:
 * - Saves and restores the previously focused element
 * - Moves initial focus into the dialog (or a given ref) on open
 * - Traps Tab / Shift+Tab focus within the dialog container
 * - Calls onClose when Escape is pressed
 * - Locks body scroll while open
 *
 * Attach `dialogRef` to the dialog panel element and spread/attach
 * `onKeyDown` on the same element (or a parent that wraps all focusable content).
 */
const useModalAccessibility = ({ isOpen, onClose, initialFocusRef } = {}) => {
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;

    const focusTimer = window.setTimeout(() => {
      const target =
        initialFocusRef?.current || getFocusableElements(dialogRef.current)[0] || dialogRef.current;
      target?.focus?.();
    }, 0);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;

      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
      previouslyFocusedRef.current = null;
    };
  }, [isOpen, initialFocusRef]);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isInsideDialog = dialogRef.current.contains(active);

      if (event.shiftKey) {
        if (!isInsideDialog || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!isInsideDialog || active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  return { dialogRef, onKeyDown };
};

export default useModalAccessibility;
