// ============================================================================
// IMPORTS
// ============================================================================
import React from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface EmployeeStatusBadgeProps {
  isActive: boolean;
  size?: 'sm' | 'md';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Displays an employee's active/inactive status as a colored pill badge.
 * Colors follow brand badge color map from BRAND_DESIGN_GUIDELINES.md.
 */
const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({
  isActive,
  size = 'md',
}) => {
  const base = 'inline-flex items-center gap-1 font-medium rounded-full';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm';

  const colorClasses = isActive
    ? 'bg-[#D4EDDA] text-[#2D7A4F] dark:bg-[rgba(45,122,79,0.2)] dark:text-[#4CAF80]'
    : 'bg-[#FADADD] text-[#C0392B] dark:bg-[rgba(192,57,43,0.2)] dark:text-[#E05A4A]';

  return (
    <span className={`${base} ${sizeClasses} ${colorClasses}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? 'bg-[#2D7A4F] dark:bg-[#4CAF80]' : 'bg-[#C0392B] dark:bg-[#E05A4A]'
        }`}
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

export default EmployeeStatusBadge;
