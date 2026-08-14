// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React from 'react';

// Icons
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  isLoading?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Pagination - A standardized pagination control with per-page selector
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startRange = (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < totalPages && !isLoading;

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onItemsPerPageChange?.(Number(e.target.value));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-white dark:bg-ink-surface border-t border-cream-border dark:border-ink-border rounded-b-xl">
      {/* Range Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{totalItems === 0 ? 0 : startRange}-{endRange}</span> of <span className="font-semibold text-gray-900 dark:text-gray-100">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-6">
        {/* Items Per Page */}
        {onItemsPerPageChange && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              disabled={isLoading}
              className="bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 border-none focus:ring-0 cursor-pointer"
            >
              {[10, 20, 50, 100].map((limit) => (
                <option key={limit} value={limit} className="bg-white dark:bg-ink-surface">
                  {limit}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            className={`p-1 rounded hover:bg-cream-border/20 dark:hover:bg-ink-raised/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
            title="First Page"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className={`p-1 rounded hover:bg-cream-border/20 dark:hover:bg-ink-raised/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
            Page {currentPage} of {totalPages || 1}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className={`p-1 rounded hover:bg-cream-border/20 dark:hover:bg-ink-raised/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            className={`p-1 rounded hover:bg-cream-border/20 dark:hover:bg-ink-raised/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
            title="Last Page"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
