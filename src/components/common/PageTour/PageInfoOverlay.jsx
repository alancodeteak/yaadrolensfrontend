import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
function measureSteps(steps) {
  return steps
    .map((step) => {
      const el = document.querySelector(step.selector);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        ...step,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    })
    .filter(Boolean);
}

const InfoCard = ({ step, style }) => (
  <div
    className="pointer-events-auto max-w-[220px] rounded-xl border border-gray-200/60 bg-white p-3 shadow-[0_2px_16px_rgba(0,0,0,0.1)]"
    style={style}
  >
    <p className="text-sm font-semibold text-gray-900">{step.title}</p>
    <p className="mt-1 text-xs leading-relaxed text-gray-600">{step.body}</p>
  </div>
);

const PageInfoOverlay = ({ steps, onClose, pageLabel = 'this page' }) => {
  const [positions, setPositions] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const refresh = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
    setPositions(measureSteps(steps));
  }, [steps]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    refresh();

    const onResize = () => refresh();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [refresh]);

  const getCardStyle = (step) => {
    const cardWidth = 220;
    const gap = 8;
    let top = step.top + step.height + gap;
    let left = step.left;

    if (top + 100 > window.innerHeight) {
      top = Math.max(8, step.top - 100 - gap);
    }
    if (left + cardWidth > window.innerWidth - 8) {
      left = window.innerWidth - cardWidth - 8;
    }
    left = Math.max(8, left);

    return { top, left, width: cardWidth };
  };

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Page help">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close help overlay"
      />

      <button
        type="button"
        onClick={onClose}
        className="pointer-events-auto absolute right-4 top-4 z-[210] flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/60 bg-white text-gray-700 shadow-lg hover:bg-gray-50"
        aria-label="Close"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>

      {positions.map((step) => (
        <div
          key={step.id}
          className="pointer-events-none absolute z-[205] rounded-2xl ring-2 ring-[#007AFF] ring-offset-2 ring-offset-transparent"
          style={{
            top: step.top,
            left: step.left,
            width: step.width,
            height: step.height,
          }}
        />
      ))}

      {isMobile ? (
        <div className="pointer-events-auto absolute inset-x-4 bottom-4 top-16 z-[210] overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">What&apos;s on {pageLabel}</h2>
            <p className="text-[11px] text-gray-500">Brief guide to each section</p>
          </div>
          <ul className="max-h-full divide-y divide-gray-100 overflow-y-auto px-4 py-2">
            {steps.map((step) => (
              <li key={step.id} className="py-3">
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{step.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        positions.map((step) => (
          <InfoCard
            key={`card-${step.id}`}
            step={step}
            style={{ position: 'fixed', zIndex: 210, ...getCardStyle(step) }}
          />
        ))
      )}
    </div>
  );
};

export default PageInfoOverlay;
