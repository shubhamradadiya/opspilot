// ============================================================================
// PAYOUT RECEIPT BUTTON COMPONENT
// OpsPilot · FE-06
// Triggers receipt PDF download, opens in new tab.
// ============================================================================
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Loader2 } from 'lucide-react';
import { downloadReceiptThunk } from '@/store/payouts/payouts.thunk';
import type { AppDispatch, RootState } from '@/store/store';

// ============================================================================
// TYPES
// ============================================================================
interface PayoutReceiptButtonProps {
  uid: string;
  startTimestamp: number;
  endTimestamp: number;
}

// ============================================================================
// COMPONENT
// ============================================================================
const PayoutReceiptButton: React.FC<PayoutReceiptButtonProps> = ({
  uid,
  startTimestamp,
  endTimestamp,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const submitting = useSelector((s: RootState) => s.payouts.submitting);

  const handleDownload = () => {
    dispatch(downloadReceiptThunk({ uid, startTimestamp, endTimestamp }));
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={submitting}
      title="Download PDF Receipt"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {submitting
        ? <Loader2 size={12} className="animate-spin" />
        : <FileText size={12} />
      }
      Receipt
    </button>
  );
};

export default PayoutReceiptButton;
