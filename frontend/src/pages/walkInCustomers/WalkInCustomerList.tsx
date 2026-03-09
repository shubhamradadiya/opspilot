// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { RootState } from '@/store/store';
import {
  fetchWalkInCustomersThunk,
  createWalkInCustomerThunk,
  updateWalkInCustomerThunk,
  deleteWalkInCustomerThunk,
  updateWalkInCustomersStatusThunk,
} from '@/store/walkInCustomers/walkInCustomers.thunk';
import { IWalkInCustomer, WalkInCustomerStatus } from '@/store/walkInCustomers/walkInCustomers.types';
import WalkInCustomerTable from '@/components/walkInCustomers/WalkInCustomerTable';
import WalkInCustomerForm, { WalkInCustomerFormData } from '@/components/walkInCustomers/WalkInCustomerForm';
import BulkStatusModal from '@/components/walkInCustomers/BulkStatusModal';
import InvoiceButton from '@/components/walkInCustomers/InvoiceButton';
import { DatePicker } from '@/components/ui/DatePicker';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return {
    startTimestamp: start.getTime(),
    endTimestamp: end.getTime(),
  };
};

const dateToTimestamp = (dateStr: string): number =>
  new Date(dateStr).setHours(0, 0, 0, 0);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WalkInCustomerList: React.FC = () => {
  // ── HOOKS — Store ───────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const { records, loading, submitting, totalAmount } = useAppSelector(
    (s: RootState) => s.walkInCustomers
  );

  // ── STATE — UI Control ──────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editTarget, setEditTarget] = useState<IWalkInCustomer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IWalkInCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── COMPUTED VALUES ─────────────────────────────────────────────────────────
  const { startTimestamp, endTimestamp } = useMemo(() => getMonthRange(), []);

  const filterParams = useMemo(() => ({
    calenderSlotType: 'day',
    startTimestamp: startDate ? startDate.getTime() : startTimestamp,
    endTimestamp: endDate ? new Date(endDate).setHours(23, 59, 59, 999) : endTimestamp,
    search: searchTerm || undefined,
  }), [startDate, endDate, searchTerm, startTimestamp, endTimestamp]);

  // ── EFFECTS — Initial Load ──────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchWalkInCustomersThunk(filterParams));
    setSelectedIds([]); // clear selection when filters change
  }, [dispatch, filterParams]);

  // ── FUNCTIONS — Event Handlers ──────────────────────────────────────────────
  const handleOpenCreate = useCallback(() => {
    setEditTarget(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((customer: IWalkInCustomer) => {
    setEditTarget(customer);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditTarget(null);
  }, []);

  const handleDelete = useCallback((customer: IWalkInCustomer) => {
    setDeleteTarget(customer);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    await dispatch(deleteWalkInCustomerThunk(deleteTarget.wcId));
    setDeleteTarget(null);
  }, [dispatch, deleteTarget]);

  const handleFormSubmit = useCallback(
    async (data: WalkInCustomerFormData) => {
      const payload = {
        walkInCustomerDate: dateToTimestamp(data.walkInCustomerDate),
        customerName: data.customerName,
        carTiresCount: data.carTiresCount,
        carTiresPrice: data.carTiresPrice,
        truckTiresCount: data.truckTiresCount,
        truckTiresPrice: data.truckTiresPrice,
        rimsCount: data.rimsCount,
        rimsPrice: data.rimsPrice,
        totalAmount: data.totalAmount,
        status: data.status,
      };

      if (editTarget) {
        const result = await dispatch(updateWalkInCustomerThunk({ wcId: editTarget.wcId, ...payload }));
        if (updateWalkInCustomerThunk.fulfilled.match(result)) handleCloseForm();
      } else {
        const result = await dispatch(createWalkInCustomerThunk(payload));
        if (createWalkInCustomerThunk.fulfilled.match(result)) handleCloseForm();
      }
    },
    [dispatch, editTarget, handleCloseForm]
  );

  const handleSelect = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(records.map((r) => r.wcId));
      } else {
        setSelectedIds([]);
      }
    },
    [records]
  );

  const handleBulkStatusSubmit = useCallback(async (status: WalkInCustomerStatus) => {
    // Only support bulk update for a single customer and timeline
    // Actually the API expects `customerName`, `startTimestamp`, `endTimestamp`, and `status`.
    // It doesn't take an array of IDs.
    // If we select a row, we should use its `customerName` or just restrict to when one customer is filtered or use the search term if single customer
    
    // As per the API:
    // @ApiQuery({ name: 'customerName', required: true, type: String, example: 'John Doe' })
    // @ApiQuery({ name: 'startTimestamp', required: true, type: Number })
    // @ApiQuery({ name: 'endTimestamp', required: true, type: Number })
    // If the API updates by customer name + date range, we must have a customer selected.
    // Assuming we pick the first selected customer's name for simplicity if multiple are selected
    if (selectedIds.length === 0) return;
    const selectedRecord = records.find(r => r.wcId === selectedIds[0]);
    if (!selectedRecord) return;
    
    // Let's use the current filter date range and the selected customer's name
    const result = await dispatch(
      updateWalkInCustomersStatusThunk({
        customerName: selectedRecord.customerName,
        startTimestamp: filterParams.startTimestamp,
        endTimestamp: filterParams.endTimestamp,
        status,
      })
    );
    if (updateWalkInCustomersStatusThunk.fulfilled.match(result)) {
      setShowBulkModal(false);
      setSelectedIds([]);
      dispatch(fetchWalkInCustomersThunk(filterParams)); // refresh
    }
  }, [dispatch, filterParams, records, selectedIds]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
  }, []);

  const hasActiveFilters = searchTerm || startDate || endDate;

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">Walk-In Customers</h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-0.5">
            Manage walk-in sales and invoices
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <InvoiceButton
            customerName={searchTerm || (selectedIds.length > 0 ? records.find(r => r.wcId === selectedIds[0])?.customerName || '' : '')}
            startTimestamp={filterParams.startTimestamp}
            endTimestamp={filterParams.endTimestamp}
            disabled={(!searchTerm && selectedIds.length === 0)}
          />
          <button
            onClick={handleOpenCreate}
            className="flex w-full sm:w-auto items-center justify-center gap-2 h-9 px-4 rounded-lg bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B] text-[#2A2A2A] dark:text-[#121212] text-sm font-medium transition-colors duration-150"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-5 flex flex-col justify-center">
            <h3 className="text-sm text-[#9A9A9A] dark:text-[#666666]">Total Walk-In Sales</h3>
            <p className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5] mt-1">
              ${loading ? '...' : totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
        </div>
      </div>

      {/* Filters & Bulk Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Bulk Actions */}
        <div className="flex items-center gap-3 h-9">
          {selectedIds.length > 0 ? (
            <>
              <span className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA] font-medium hidden sm:inline">
                {selectedIds.length} selected
              </span>
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-white dark:bg-[#1A1A1A] border border-[#2A2A2A] dark:border-[#2E2E2E] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm font-medium transition-colors"
              >
                Change Status
              </button>
            </>
          ) : (
            <div className="hidden sm:block h-9" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:flex-1 sm:min-w-[200px] sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9A9A9A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
            />
          </div>

          {/* Start Date */}
          <div className="w-full sm:w-[140px]">
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              placeholderText="Start Date"
              dateFormat="dd/MM/yyyy"
              maxDate={endDate ?? undefined}
              fullWidth
            />
          </div>
          <span className="hidden sm:inline text-[#9A9A9A] text-sm">to</span>
          {/* End Date */}
          <div className="w-full sm:w-[140px]">
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholderText="End Date"
              dateFormat="dd/MM/yyyy"
              minDate={startDate ?? undefined}
              fullWidth
            />
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 h-9 px-3 rounded-md text-sm text-[#9A9A9A] hover:text-[#2A2A2A] dark:hover:text-[#F5F5F5] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors duration-100"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <WalkInCustomerTable
        customers={records}
        loading={loading}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Form Modal */}
      {showForm && (
        <WalkInCustomerForm
          mode={editTarget ? 'edit' : 'create'}
          initialData={editTarget ?? undefined}
          submitting={submitting}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}

      {/* Bulk Status Update Modal */}
      {showBulkModal && (
        <BulkStatusModal
          onClose={() => setShowBulkModal(false)}
          onSubmit={handleBulkStatusSubmit}
          submitting={submitting}
          selectedCount={selectedIds.length}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-[#2A2A2A] dark:border-[#2E2E2E] p-6">
            <h3 className="text-lg font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
              Delete Record
            </h3>
            <p className="mt-2 text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">
              Are you sure you want to delete the record for{' '}
              <span className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">
                {deleteTarget.customerName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="h-9 px-4 rounded-lg border border-[#D4AF37] text-[#D4AF37] bg-white dark:bg-[#1E1E1E] text-sm font-medium hover:bg-[#FDFBD4] dark:hover:bg-[#2A2A2A] transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="h-9 px-4 rounded-lg bg-[#C0392B] hover:bg-[#A0302A] text-white text-sm font-medium transition-colors duration-150 disabled:opacity-40"
              >
                {submitting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkInCustomerList;
