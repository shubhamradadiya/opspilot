// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { WalkInCustomerStatus } from '@/store/walkInCustomers/walkInCustomers.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface BulkStatusModalProps {
  onClose: () => void;
  onSubmit: (status: WalkInCustomerStatus) => void;
  submitting?: boolean;
  selectedCount: number;
}

// ============================================================================
// COMPONENT
// ============================================================================
const BulkStatusModal: React.FC<BulkStatusModalProps> = ({
  onClose,
  onSubmit,
  submitting,
  selectedCount,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<WalkInCustomerStatus | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    onSubmit(selectedStatus as WalkInCustomerStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-[#2A2A2A] dark:border-[#2E2E2E]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
          <h2 className="text-lg font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
            Update Status
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#2A2A2A] dark:hover:text-[#F5F5F5] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors duration-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <p className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">
            You have selected <strong>{selectedCount}</strong> records. Choose a new status to apply to all selected records.
          </p>
          <div>
            <label className="block text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA] mb-1">
              New Status <span className="text-[#C0392B]">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as WalkInCustomerStatus)}
                required
                className="w-full h-9 px-3 py-2 pr-8 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
              >
                <option value="">Select status</option>
                <option value={WalkInCustomerStatus.PENDING}>Pending</option>
                <option value={WalkInCustomerStatus.PAID}>Paid</option>
                <option value={WalkInCustomerStatus.CANCELLED}>Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-[#9A9A9A] pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2A2A2A] dark:border-[#2E2E2E] mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-9 px-4 rounded-lg border border-[#D4AF37] text-[#D4AF37] bg-white dark:bg-[#1E1E1E] text-sm font-medium hover:bg-[#FDFBD4] dark:hover:bg-[#2A2A2A] transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedStatus}
              className="h-9 px-6 rounded-lg bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B] text-[#2A2A2A] dark:text-[#121212] text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Applying...' : 'Apply Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkStatusModal;
