/**
 * Lock the real admin page scroller (#main-content), not document.body.
 * Ref-counted so nested modals/overlays can open/close safely.
 */

const MAIN_ID = 'main-content';
const LOCK_ATTR = 'data-app-scroll-locked';

let lockCount = 0;
let previousMainOverflow = '';
let previousHtmlOverflow = '';

function getMainScroller() {
  return document.getElementById(MAIN_ID);
}

export function lockAppScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  const main = getMainScroller();
  if (main) {
    previousMainOverflow = main.style.overflow;
    main.style.overflow = 'hidden';
    main.setAttribute(LOCK_ATTR, 'true');
  }

  previousHtmlOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
}

export function unlockAppScroll() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  const main = getMainScroller();
  if (main) {
    main.style.overflow = previousMainOverflow;
    main.removeAttribute(LOCK_ATTR);
  }
  previousMainOverflow = '';

  document.documentElement.style.overflow = previousHtmlOverflow;
  previousHtmlOverflow = '';
}

/** Force-clear all locks (e.g. route change). Prefer unlockAppScroll in normal cleanup. */
export function resetAppScrollLock() {
  lockCount = 0;
  const main = getMainScroller();
  if (main) {
    main.style.overflow = '';
    main.removeAttribute(LOCK_ATTR);
  }
  document.documentElement.style.overflow = '';
  previousMainOverflow = '';
  previousHtmlOverflow = '';
}
