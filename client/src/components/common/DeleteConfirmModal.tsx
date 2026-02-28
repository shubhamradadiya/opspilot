// ============================================================================
// IMPORTS
// ============================================================================
import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface DeleteConfirmModalProps {
  entityName: string;
  entityType?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Reusable delete confirmation modal.
 * Per BRAND_DESIGN_GUIDELINES.md: backdrop blur, rounded-2xl, danger button.
 */
const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  entityName,
  entityType = 'item',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  // ── Close on Escape ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [loading, onCancel]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Panel */}
      <div className="relative bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-[#E8E0B8] dark:border-[#2E2E2E] p-6 max-w-md w-full">
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#FADADD] dark:bg-[rgba(192,57,43,0.15)] flex items-center justify-center">
            <AlertTriangle size={22} className="text-[#C0392B] dark:text-[#E05A4A]" />
          </div>
          <div>
            <h2
              id="delete-modal-title"
              className="text-base font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]"
            >
              Delete {entityType}
            </h2>
            <p className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA] mt-1">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
                {entityName}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E0B8] dark:border-[#2E2E2E]">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            loading={loading}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
