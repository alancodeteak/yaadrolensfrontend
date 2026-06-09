import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { DOCS_PANEL } from '../docsTheme';

export const DocLink = ({ to, children }) => (
  <Link to={to} className="font-medium text-[#007AFF] hover:underline">
    {children}
  </Link>
);

export const DocList = ({ items }) => (
  <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-gray-700">
    {items.map((item, index) => (
      <li key={typeof item === 'string' ? item : index}>{item}</li>
    ))}
  </ul>
);

export const DocParagraph = ({ children }) => (
  <p className="text-[15px] leading-relaxed text-gray-700">{children}</p>
);

export const DocPageHeader = ({ title, subtitle }) => (
  <div className="mb-2">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    {subtitle && <p className="mt-1.5 text-base text-gray-500">{subtitle}</p>}
  </div>
);

export const DocContentGrid = ({ children, className }) => (
  <div className={clsx('grid gap-4 xl:grid-cols-2', className)}>{children}</div>
);

export const DocTip = ({ children }) => (
  <div className="flex gap-3 rounded-2xl border border-[#007AFF]/15 bg-[#007AFF]/5 px-4 py-3.5">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#007AFF]/10 text-[#007AFF]">
      <Lightbulb className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
    </div>
    <div className="min-w-0 text-sm leading-relaxed text-gray-700">{children}</div>
  </div>
);

const DocsSection = ({ title, subtitle, children, className }) => (
  <section className={clsx(DOCS_PANEL, 'h-full overflow-hidden', className)}>
    {(title || subtitle) && (
      <div className="border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
        {title && <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-[11px] text-gray-500 sm:text-sm">{subtitle}</p>}
      </div>
    )}
    <div className="space-y-3 p-4 sm:p-5">{children}</div>
  </section>
);

export default DocsSection;
