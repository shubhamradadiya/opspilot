// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'table' | 'card' | 'form';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * SkeletonLoader - A placeholder for loading states
 * supports multiple variants for different UI parts
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-cream-border/50 dark:bg-ink-border/50';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded h-4 mb-2';
    }
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const renderSkeleton = (index: number) => {
    // Specialized variants
    if (variant === 'table') {
      return (
        <div key={index} className="w-full flex flex-col gap-4 py-4 animate-pulse">
          <div className="flex gap-4 border-b border-cream-border dark:border-ink-border pb-4">
            <div className="h-6 w-1/4 bg-cream-border/50 dark:bg-ink-border/50 rounded" />
            <div className="h-6 w-1/4 bg-cream-border/50 dark:bg-ink-border/50 rounded" />
            <div className="h-6 w-1/4 bg-cream-border/50 dark:bg-ink-border/50 rounded" />
            <div className="h-6 w-1/4 bg-cream-border/50 dark:bg-ink-border/50 rounded" />
          </div>
        </div>
      );
    }

    if (variant === 'card') {
      return (
        <div 
          key={index} 
          className={`p-6 bg-white dark:bg-ink-surface border border-cream-border dark:border-ink-border rounded-xl shadow-sm ${className}`}
        >
          <div className="flex items-center gap-4 mb-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-cream-border/50 dark:bg-ink-border/50" />
            <div className="flex-1">
              <div className="h-4 w-1/3 bg-cream-border/50 dark:bg-ink-border/50 rounded mb-2" />
              <div className="h-3 w-1/2 bg-cream-border/50 dark:bg-ink-border/50 rounded" />
            </div>
          </div>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-full bg-cream-border/50 dark:bg-ink-border/50 rounded" />
            <div className="h-4 w-5/6 bg-cream-border/50 dark:bg-ink-border/50 rounded" />
            <div className="h-4 w-4/6 bg-cream-border/50 dark:bg-ink-border/50 rounded" />
          </div>
        </div>
      );
    }

    if (variant === 'form') {
      return (
        <div key={index} className={`space-y-6 animate-pulse ${className}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/4 bg-cream-border/50 dark:bg-ink-border/50 rounded" />
                <div className="h-10 w-full border border-cream-border dark:border-ink-border bg-white/50 dark:bg-ink-surface/50 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 w-1/6 bg-cream-border/50 dark:bg-ink-border/50 rounded" />
            <div className="h-24 w-full border border-cream-border dark:border-ink-border bg-white/50 dark:bg-ink-surface/50 rounded-lg" />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-cream-border dark:border-ink-border">
            <div className="h-10 w-24 bg-cream-border/50 dark:bg-ink-border/50 rounded-lg" />
            <div className="h-10 w-32 bg-cream-border/50 dark:bg-ink-border/50 rounded-lg" />
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`${baseClasses} ${getVariantClasses()} ${className}`}
        style={style}
      />
    );
  };

  return (
    <div className="w-full">
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  );
};

export default SkeletonLoader;
