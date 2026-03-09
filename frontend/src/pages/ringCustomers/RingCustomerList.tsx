// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, HelpCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { RootState } from '@/store/store';
import {
  fetchRingCustomersThunk,
  createRingCustomerThunk,
  updateRingCustomerThunk,
  deleteRingCustomerThunk,
} from '@/store/ringCustomers/ringCustomers.thunk';
import { RingCustomerStatus } from '@/store/ringCustomers/ringCustomers.types';
import RingCustomerTable from '@/components/ringCustomers/RingCustomerTable';
import RingCustomerForm, { RingCustomerFormData } from '@/components/ringCustomers/RingCustomerForm';
import { DatePicker } from '@/components/ui/DatePicker';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const endOfDay = (dateInfo: Date | number | string) => {
  const d = new Date(dateInfo);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

const startOfDay = (dateInfo: Date | number | string) => {
  const d = new Date(dateInfo);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const RingCustomerList: React.FC = () => {
  // ── HOOKS — Store ────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const { records, loading, submitting, totalItems, totalPages, currentPage, totalAmount } =
    useAppSelector((state: RootState) => state.ringCustomers);

  // ── STATE — Filters & pagination ─────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const limit = 10;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // ── STATE — Modals ───────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  // ── EFFECTS — Debounce search ────────────────────────────────────────────
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ── EFFECTS — Fetch data ─────────────────────────────────────────────────
  const fetchRecords = useCallback(
    (page: number, currentLimit?: number) => {
      dispatch(
        fetchRingCustomersThunk({
          count: (page - 1) * (currentLimit || limit),
          limit: currentLimit || limit,
          search: debouncedSearchTerm || undefined,
          startTimestamp: startDate ? startOfDay(startDate) : undefined,
          endTimestamp: endDate ? endOfDay(endDate) : undefined,
        })
      );
    },
    [dispatch, limit, debouncedSearchTerm, startDate, endDate]
  );

  useEffect(() => {
    fetchRecords(1);
  }, [fetchRecords]);

  // ── COMPUTED ─────────────────────────────────────────────────────────────
  // Frontend filter for Status since backend may not natively support it based on docs
  const filteredRecords = useMemo(() => {
    if (statusFilter === 'all') return records;
    return records.filter((r) => r.status === statusFilter);
  }, [records, statusFilter]);

  // ── HANDLERS — Actions ───────────────────────────────────────────────────
  const handleCreate = async (data: RingCustomerFormData) => {
    const payload = {
      ringCustomerDate: new Date(data.ringCustomerDate).getTime(),
      customerName: data.customerName,
      orderedRingCount: data.orderedRingCount,
      price: data.price,
      deliveryFee: data.deliveryFee ?? undefined,
      totalAmount: data.totalAmount,
      status: data.status,
    };
    await dispatch(createRingCustomerThunk(payload)).unwrap();
    setIsFormOpen(false);
  };

  const handleUpdate = async (data: RingCustomerFormData) => {
    if (!editingRecord) return;
    const payload = {
      rcId: editingRecord.rcId,
      ringCustomerDate: new Date(data.ringCustomerDate).getTime(),
      customerName: data.customerName,
      orderedRingCount: data.orderedRingCount,
      price: data.price,
      deliveryFee: data.deliveryFee ?? undefined,
      totalAmount: data.totalAmount,
      status: data.status,
    };
    await dispatch(updateRingCustomerThunk(payload)).unwrap();
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = async (rcId: string) => {
    await dispatch(deleteRingCustomerThunk(rcId)).unwrap();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchRecords(newPage);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5] flex items-center gap-2">
            Ring Customers
            <span
              className="mt-1"
              title="Manage ring orders and customer deliveries."
            >
              <HelpCircle size={16} className="text-[#9A9A9A] dark:text-[#666666] cursor-help" />
            </span>
          </h1>
          <p className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">
            View and manage {totalItems} ring customer orders
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRecord(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B] text-[#2A2A2A] dark:text-[#121212] rounded-lg font-medium transition-colors duration-150 shrink-0 shadow-sm"
        >
          <Plus size={18} />
          <span>Add Record</span>
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#2A2A2A] dark:border-[#2E2E2E] p-5">
           <p className="text-sm font-medium text-[#9A9A9A] dark:text-[#AAAAAA] uppercase tracking-wider mb-2">Total Amount</p>
           <p className="text-3xl font-bold text-[#D4AF37]">{formatCurrency(totalAmount)}</p>
         </div>
         <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-[#2A2A2A] dark:border-[#2E2E2E] p-5">
           <p className="text-sm font-medium text-[#9A9A9A] dark:text-[#AAAAAA] uppercase tracking-wider mb-2">Total Orders</p>
           <p className="text-3xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5]">{totalItems}</p>
         </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-[#1E1E1E] shadow-sm rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="w-full lg:w-1/3">
            <label className="block text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#E5E5E5] dark:border-[#2E2E2E] rounded-lg bg-[#F9F9F9] dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] placeholder-[#9A9A9A] dark:placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/4">
             <label className="block text-xs font-semibold text-[#5A5A5A] dark:text-[#AAAAAA] uppercase tracking-wider mb-2">
              Status Filter
            </label>
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 border border-[#E5E5E5] dark:border-[#2E2E2E] rounded-lg bg-[#F9F9F9] dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
              >
                <option value="all">All Statuses</option>
                <option value={RingCustomerStatus.PENDING}>Pending</option>
                <option value={RingCustomerStatus.DELIVERED}>Delivered</option>
                <option value={RingCustomerStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>

          <div className="w-full lg:w-1/5">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              fullWidth
            />
          </div>

          <div className="w-full lg:w-1/5">
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* ── Data Table ── */}
      <RingCustomerTable
        records={filteredRecords}
        loading={loading}
        onEdit={(record) => {
          setEditingRecord(record);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* ── Pagination ── */}
      {!loading && filteredRecords.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E5E5] dark:border-[#2E2E2E] pt-4">
          <div className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">
            Showing page <span className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">{currentPage}</span> of{' '}
            <span className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border border-[#E5E5E5] dark:border-[#333333] text-sm font-medium text-[#5A5A5A] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-[400px]">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 py-1 text-[#9A9A9A]">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[32px] px-2 py-1 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-[#D4AF37] text-white'
                          : 'hover:bg-[#F5F5F5] dark:hover:bg-[#333333] text-[#5A5A5A] dark:text-[#AAAAAA]'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md border border-[#E5E5E5] dark:border-[#333333] text-sm font-medium text-[#5A5A5A] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] dark:hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {isFormOpen && (
        <RingCustomerForm
          mode={editingRecord ? 'edit' : 'create'}
          initialData={editingRecord || undefined}
          submitting={submitting}
          onSubmit={editingRecord ? handleUpdate : handleCreate}
          onClose={() => {
            setIsFormOpen(false);
            setEditingRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default RingCustomerList;
