import { useEffect } from 'react';
import { lockAppScroll, unlockAppScroll } from '../utils/appScrollLock';

/**
 * Lock #main-content (and html) while `locked` is true.
 * Use for modals, drawers, and overlays that do not go through useModalAccessibility.
 */
export default function useAppScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    lockAppScroll();
    return () => unlockAppScroll();
  }, [locked]);
}
