import { useCallback, useEffect, useRef, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { clearDriverTourArtifacts } from '../../../utils/driverTourCleanup';
import {
  getDriverTourCopy,
  pickGuideSteps,
  pickPageLabel,
  readPageTourLanguage,
} from './pageTourI18n';

function resolveSteps(stepsOrByLang, lang) {
  return pickGuideSteps(stepsOrByLang, lang);
}

export function usePageTour(stepsOrByLang, storageKey, pageLabelsByLang, routeKey) {
  const driverRef = useRef(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [resolvedSteps, setResolvedSteps] = useState(() =>
    resolveSteps(stepsOrByLang, readPageTourLanguage())
  );
  const [resolvedPageLabel, setResolvedPageLabel] = useState(() =>
    pickPageLabel(pageLabelsByLang)
  );
  const [resolvedLanguage, setResolvedLanguage] = useState(() => readPageTourLanguage());

  const refreshLocalizedContent = useCallback(() => {
    const language = readPageTourLanguage();
    setResolvedLanguage(language);
    setResolvedSteps(resolveSteps(stepsOrByLang, language));
    setResolvedPageLabel(pickPageLabel(pageLabelsByLang, language));
    return language;
  }, [pageLabelsByLang, stepsOrByLang]);

  const destroyTour = useCallback(() => {
    if (driverRef.current?.isActive()) {
      driverRef.current.destroy();
    }
    driverRef.current = null;
    clearDriverTourArtifacts();
  }, []);

  useEffect(
    () => () => {
      destroyTour();
      setInfoOpen(false);
    },
    [destroyTour]
  );

  // Close help overlay / tour when nested route changes (e.g. Settings tabs).
  useEffect(() => {
    if (routeKey == null) return;
    setInfoOpen(false);
    destroyTour();
  }, [routeKey, destroyTour]);

  const closeInfo = useCallback(() => {
    setInfoOpen(false);
  }, []);

  const startInfo = useCallback(() => {
    destroyTour();
    refreshLocalizedContent();
    setInfoOpen(true);
  }, [destroyTour, refreshLocalizedContent]);

  const startTutorial = useCallback(() => {
    setInfoOpen(false);
    destroyTour();
    const language = refreshLocalizedContent();
    const steps = resolveSteps(stepsOrByLang, language);
    const copy = getDriverTourCopy(language);

    const driverObj = driver({
      showProgress: true,
      progressText: copy.progressText,
      overlayOpacity: 0.55,
      stagePadding: 8,
      stageRadius: 16,
      allowClose: true,
      smoothScroll: true,
      popoverClass: 'page-driver-popover',
      nextBtnText: copy.nextBtnText,
      prevBtnText: copy.prevBtnText,
      doneBtnText: copy.doneBtnText,
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
          const scroller = document.getElementById('main-content');
          if (element && scroller && scroller.contains(element)) {
            const scrollerRect = scroller.getBoundingClientRect();
            const elRect = element.getBoundingClientRect();
            const nextTop =
              scroller.scrollTop +
              (elRect.top - scrollerRect.top) -
              scrollerRect.height / 2 +
              elRect.height / 2;
            scroller.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
            return;
          }
          element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        },
      })),
      onPopoverRender: (popover, { driver: d }) => {
        const footer = popover.footerButtons;
        if (!footer || footer.querySelector('[data-skip-tour]')) return;

        const skipBtn = document.createElement('button');
        skipBtn.type = 'button';
        skipBtn.textContent = copy.skipBtnText;
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
        clearDriverTourArtifacts();
      },
    });

    driverRef.current = driverObj;
    driverObj.drive();
  }, [destroyTour, refreshLocalizedContent, stepsOrByLang, storageKey]);

  return {
    infoOpen,
    startTutorial,
    startInfo,
    closeInfo,
    destroyTour,
    steps: resolvedSteps,
    pageLabel: resolvedPageLabel,
    language: resolvedLanguage,
  };
}
