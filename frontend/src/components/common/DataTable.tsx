// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React from 'react';

// Icons
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

// Components - Common
import SkeletonLoader from './SkeletonLoader';
import EmptyState from './EmptyState';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
  sortKey?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' };
  emptyState?: {
    title?: string;
    description?: string;
    action?: { label: string; onClick: () => void };
  };
  className?: string;
  rowClassName?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * DataTable - A standardized data table component
 * Supports sorting, custom rendering, and generic types
 */
const DataTable = <T extends { id?: string | number; cId?: string | number }>({
  columns,
  data,
  isLoading = false,
  onSort,
  sortConfig,
  emptyState,
  className = '',
  rowClassName = '',
}: DataTableProps<T>) => {
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;
    
    const sortKey = (column.sortKey || column.accessor) as string;
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.key === sortKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    onSort(sortKey, direction);
  };

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    const sortKey = (column.sortKey || column.accessor) as string;
    if (sortConfig?.key !== sortKey) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 ml-1 text-gold" />
      : <ChevronDown className="w-4 h-4 ml-1 text-gold" />;
  };

  if (isLoading) {
    return <SkeletonLoader variant="table" count={5} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState 
        title={emptyState?.title}
        description={emptyState?.description}
        action={emptyState?.action}
      />
    );
  }

  return (
    <div className={`overflow-x-auto bg-white dark:bg-ink-surface border border-cream-border dark:border-ink-border rounded-xl shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-cream-border/20 dark:bg-ink-raised/50 border-b border-cream-border dark:border-ink-border">
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 ${
                  column.sortable ? 'cursor-pointer select-none group' : ''
                } ${column.className || ''}`}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center">
                  {column.header}
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-border dark:divide-ink-border">
          {data.map((item, rowIdx) => (
            <tr 
              key={item.id || item.cId || rowIdx}
              className={`hover:bg-cream-border/10 dark:hover:bg-ink-raised/30 transition-colors ${rowClassName}`}
            >
              {columns.map((column, colIdx) => (
                <td 
                  key={colIdx} 
                  className={`px-6 py-4 text-sm text-gray-600 dark:text-gray-400 ${column.className || ''}`}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : (item[column.accessor as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
