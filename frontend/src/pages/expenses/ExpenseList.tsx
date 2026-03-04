// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { RootState } from '@/store/store';
import { fetchExpensesThunk, createExpenseThunk, updateExpenseThunk, deleteExpenseThunk } from '@/store/expenses/expenses.thunk';
import { IExpense } from '@/store/expenses/expenses.types';
import MonthlySummaryCard from '@/components/expenses/MonthlySummaryCard';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import ExpenseForm, { ExpenseFormData } from '@/components/expenses/ExpenseForm';
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

const ExpenseList: React.FC = () => {
  // ── HOOKS — Store ───────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const { records, loading, submitting, totalExpense } = useAppSelector(
    (s: RootState) => s.expenses
  );

  // ── STATE — UI Control ──────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<IExpense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IExpense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // ── COMPUTED VALUES ─────────────────────────────────────────────────────────
  const { startTimestamp, endTimestamp } = useMemo(() => getMonthRange(), []);

  const filterParams = useMemo(() => ({
    startTimestamp: startDate ? startDate.getTime() : startTimestamp,
    endTimestamp: endDate ? new Date(endDate).setHours(23, 59, 59, 999) : endTimestamp,
    search: searchTerm || undefined,
  }), [startDate, endDate, searchTerm, startTimestamp, endTimestamp]);

  // ── EFFECTS — Initial Load ──────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchExpensesThunk(filterParams));
  }, [dispatch, filterParams]);

  // ── FUNCTIONS — Event Handlers ──────────────────────────────────────────────
  const handleOpenCreate = useCallback(() => {
    setEditTarget(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((expense: IExpense) => {
    setEditTarget(expense);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditTarget(null);
  }, []);

  const handleDelete = useCallback((expense: IExpense) => {
    setDeleteTarget(expense);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    await dispatch(deleteExpenseThunk(deleteTarget.eId));
    setDeleteTarget(null);
  }, [dispatch, deleteTarget]);

  const handleFormSubmit = useCallback(
    async (data: ExpenseFormData) => {
      const payload = {
        expenseDate: dateToTimestamp(data.expenseDate),
        vendorName: data.vendorName,
        totalExpense: data.totalExpense,
        description: data.description || undefined,
        expenseType: data.expenseType || undefined,
      };

      if (editTarget) {
        const result = await dispatch(updateExpenseThunk({ eId: editTarget.eId, ...payload }));
        if (updateExpenseThunk.fulfilled.match(result)) handleCloseForm();
      } else {
        const result = await dispatch(createExpenseThunk(payload));
        if (createExpenseThunk.fulfilled.match(result)) handleCloseForm();
      }
    },
    [dispatch, editTarget, handleCloseForm]
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
  }, []);

  const hasActiveFilters = searchTerm || startDate || endDate;

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FDFBD4] dark:bg-[#121212] p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">Expenses</h1>
          <p className="text-sm text-[#9A9A9A] dark:text-[#666666] mt-0.5">
            Track and manage business expenses
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B] text-[#2A2A2A] dark:text-[#121212] text-sm font-medium transition-colors duration-150"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Monthly Summary */}
      <div className="max-w-xs">
        <MonthlySummaryCard totalExpense={totalExpense} loading={loading} />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9A9A9A]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor..."
            className="w-full h-9 pl-9 pr-3 rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] text-sm placeholder:text-[#9A9A9A] dark:placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
          />
        </div>

        {/* Date Range */}
        <div className="w-[140px]">
          <DatePicker
            value={startDate}
            onChange={setStartDate}
            placeholderText="Start Date"
            dateFormat="dd/MM/yyyy"
            fullWidth
          />
        </div>
        <span className="text-[#9A9A9A] text-sm">to</span>
        <div className="w-[140px]">
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholderText="End Date"
            dateFormat="dd/MM/yyyy"
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

      {/* Table */}
      <ExpenseTable
        expenses={records}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add/Edit Form Modal */}
      {showForm && (
        <ExpenseForm
          mode={editTarget ? 'edit' : 'create'}
          initialData={editTarget ?? undefined}
          submitting={submitting}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
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
              Delete Expense
            </h3>
            <p className="mt-2 text-sm text-[#5A5A5A] dark:text-[#AAAAAA]">
              Are you sure you want to delete the expense from{' '}
              <span className="font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">
                {deleteTarget.vendorName}
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

export default ExpenseList;
