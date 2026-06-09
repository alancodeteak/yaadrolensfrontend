import { useCallback, useRef, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function usePageTour(steps, storageKey) {
  const driverRef = useRef(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const destroyTour = useCallback(() => {
    if (driverRef.current?.isActive()) {
      driverRef.current.destroy();
    }
    driverRef.current = null;
  }, []);

  const closeInfo = useCallback(() => {
    setInfoOpen(false);
  }, []);

  const startInfo = useCallback(() => {
    destroyTour();
    setInfoOpen(true);
  }, [destroyTour]);

  const startTutorial = useCallback(() => {
    setInfoOpen(false);
    destroyTour();

    const driverObj = driver({
      showProgress: true,
      progressText: '{{current}} of {{total}}',
      overlayOpacity: 0.55,
      stagePadding: 8,
      stageRadius: 16,
      allowClose: true,
      smoothScroll: true,
      popoverClass: 'page-driver-popover',
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'Done',
      showButtons: ['previous', 'next', 'close'],
      steps: steps.map((step) => ({
        element: step.selector,
        popover: {
          title: step.title,
          description: step.body,
          side: 'bottom',
          align: 'start',
        },
        onHighlightStarted: (element) => {
          element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        },
      })),
      onPopoverRender: (popover, { driver: d }) => {
        const footer = popover.footerButtons;
        if (!footer || footer.querySelector('[data-skip-tour]')) return;

        const skipBtn = document.createElement('button');
        skipBtn.type = 'button';
        skipBtn.textContent = 'Skip tour';
        skipBtn.setAttribute('data-skip-tour', 'true');
        skipBtn.className = 'page-driver-skip';
        skipBtn.addEventListener('click', () => {
          if (storageKey) localStorage.setItem(storageKey, '1');
          d.destroy();
        });
        footer.prepend(skipBtn);
      },
      onDestroyed: () => {
        if (storageKey) localStorage.setItem(storageKey, '1');
        driverRef.current = null;
      },
    });

    driverRef.current = driverObj;
    driverObj.drive();
  }, [destroyTour, steps, storageKey]);

  return {
    infoOpen,
    startTutorial,
    startInfo,
    closeInfo,
    destroyTour,
  };
}
