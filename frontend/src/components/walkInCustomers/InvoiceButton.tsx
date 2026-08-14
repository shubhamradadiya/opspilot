// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { walkInCustomersApi } from '@/api/walkInCustomers.api';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface InvoiceButtonProps {
  customerName: string;
  startTimestamp: number;
  endTimestamp: number;
  disabled?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================
const InvoiceButton: React.FC<InvoiceButtonProps> = ({
  customerName,
  startTimestamp,
  endTimestamp,
  disabled,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!customerName || !startTimestamp || !endTimestamp) {
      toast.error('Missing required parameters for invoice.');
      return;
    }

    try {
      setLoading(true);
      const htmlContent = await walkInCustomersApi.downloadInvoice({
        customerName,
        startTimestamp,
        endTimestamp,
      });

      // Open in a new window to print/save as PDF
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        // optionally wait a moment for fonts to load before printing
        setTimeout(() => {
          newWindow.focus();
          newWindow.print();
        }, 500);
      } else {
        toast.error('Popup blocked. Please allow popups to open the invoice.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || loading}
      className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-lg border border-[#D4AF37] text-[#D4AF37] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors duration-150 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      <span className="hidden sm:inline">Download Invoice</span>
    </button>
  );
};

export default InvoiceButton;
