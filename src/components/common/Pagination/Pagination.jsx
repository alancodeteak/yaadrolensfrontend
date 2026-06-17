import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

const navButtonClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200/60 bg-white text-gray-500 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-500';

const pageButtonClass = (isActive) =>
  clsx(
    'inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-sm font-medium tabular-nums transition-colors',
    isActive
      ? 'bg-[#007AFF] text-white shadow-sm'
      : 'border border-gray-200/60 bg-white text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:bg-gray-50'
  );

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const showResults =
    totalItems != null && itemsPerPage != null && Number.isFinite(totalItems) && totalItems > 0;

  const startItem = showResults ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = showResults ? Math.min(currentPage * itemsPerPage, totalItems) : null;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className={clsx(
        'flex flex-col gap-3 sm:flex-row sm:items-center',
        showResults ? 'sm:justify-between' : 'justify-center',
        className
      )}
      aria-label="Pagination"
    >
      {showResults && (
        <p className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-medium text-gray-900">{startItem}</span>
          {' – '}
          <span className="font-medium text-gray-900">{endItem}</span>
          {' of '}
          <span className="font-medium text-gray-900">{totalItems}</span>
        </p>
      )}

      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={navButtonClass}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-1 px-0.5">
          {pageNumbers.map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex h-9 min-w-9 items-center justify-center text-sm text-gray-400"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={pageButtonClass(currentPage === page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={navButtonClass}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
