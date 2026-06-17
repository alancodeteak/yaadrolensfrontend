import { lazy } from 'react';

/**
 * Reload once when a lazy chunk 404s (stale index.html after a new build).
 */
export function lazyWithRetry(importFn) {
  return lazy(() =>
    importFn().catch((error) => {
      const key = 'chunk-reload';
      const hasReloaded = sessionStorage.getItem(key);

      if (!hasReloaded) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
        return new Promise(() => {});
      }

      sessionStorage.removeItem(key);
      throw error;
    })
  );
}
