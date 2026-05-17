import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/types';
import clsx from 'clsx';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit, hasNext, hasPrev } = pagination;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Build page number range (show at most 5 pages around current)
  const pageNumbers: number[] = [];
  const delta = 2;
  const left = Math.max(1, page - delta);
  const right = Math.min(totalPages, page + delta);

  for (let i = left; i <= right; i++) {
    pageNumbers.push(i);
  }

  const btnBase =
    'flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
      {/* Result count */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Showing <span className="font-medium text-gray-700 dark:text-gray-300">{start}–{end}</span>{' '}
        of <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span> leads
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className={clsx(btnBase, 'gap-0.5 px-2', hasPrev
            ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
          Prev
        </button>

        {/* First page if not in range */}
        {left > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className={clsx(btnBase, 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700')}>
              1
            </button>
            {left > 2 && <span className="text-gray-400 px-1">…</span>}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map((n) => (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={clsx(btnBase, n === page
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
            aria-label={`Page ${n}`}
            aria-current={n === page ? 'page' : undefined}
          >
            {n}
          </button>
        ))}

        {/* Last page if not in range */}
        {right < totalPages && (
          <>
            {right < totalPages - 1 && <span className="text-gray-400 px-1">…</span>}
            <button onClick={() => onPageChange(totalPages)} className={clsx(btnBase, 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700')}>
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className={clsx(btnBase, 'gap-0.5 px-2', hasNext
            ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          )}
          aria-label="Next page"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
