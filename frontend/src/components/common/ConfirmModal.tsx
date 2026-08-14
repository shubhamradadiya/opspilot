// ============================================================================
// IMPORTS
// ============================================================================

// React Core
import React from 'react';

// Icons
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

// Components - UI
import { Modal, Button } from '../ui';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ConfirmModal - A generic confirmation dialog for critical actions
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          icon: <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          button: 'primary' as const,
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          button: 'primary' as const,
        };
      case 'danger':
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />,
          bg: 'bg-red-100 dark:bg-red-900/30',
          button: 'danger' as const,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      size="sm"
    >
      <div className="flex flex-col items-center text-center p-2">
        {/* Icon Header */}
        <div className={`w-14 h-14 ${styles.bg} rounded-full flex items-center justify-center mb-6`}>
          {styles.icon}
        </div>
        
        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={styles.button}
            onClick={onConfirm}
            className="flex-1"
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


export default ConfirmModal;
