import { Link } from 'react-router-dom';
import { BookOpen, CircleHelp, GraduationCap } from 'lucide-react';
import { usePageDocsHref } from './usePageDocsHref';
import { getPageTourButtonCopy, readPageTourLanguage } from './pageTourI18n';

const btnClass =
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-xs font-semibold leading-none text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50 hover:text-gray-900';

const PageTourButtons = ({ onTutorial, onInfo, docsHref }) => {
  const guideHref = usePageDocsHref(docsHref);
  const copy = getPageTourButtonCopy(readPageTourLanguage());

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button type="button" className={btnClass} onClick={onTutorial}>
        <GraduationCap className="h-3.5 w-3.5" strokeWidth={2} />
        {copy.tutorial}
      </button>
      <button type="button" className={btnClass} onClick={onInfo} aria-label={copy.infoAria}>
        <CircleHelp className="h-3.5 w-3.5" strokeWidth={2} />
        {copy.info}
      </button>
      <Link to={guideHref} className={btnClass} aria-label={copy.guideAria}>
        <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
        {copy.guide}
      </Link>
    </div>
  );
};

export default PageTourButtons;
