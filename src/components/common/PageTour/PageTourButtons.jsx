import { CircleHelp, GraduationCap } from 'lucide-react';

const btnClass =
  'inline-flex items-center gap-1.5 rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50 hover:text-gray-900';

const PageTourButtons = ({ onTutorial, onInfo }) => (
  <div className="flex items-center gap-2">
    <button type="button" className={btnClass} onClick={onTutorial}>
      <GraduationCap className="h-3.5 w-3.5" strokeWidth={2} />
      Tutorial
    </button>
    <button type="button" className={btnClass} onClick={onInfo} aria-label="What is on this page?">
      <CircleHelp className="h-3.5 w-3.5" strokeWidth={2} />
      Info
    </button>
  </div>
);

export default PageTourButtons;
