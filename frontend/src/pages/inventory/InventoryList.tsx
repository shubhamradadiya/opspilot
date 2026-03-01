import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  getInventories,
  createInventory,
  updateInventory,
  deleteInventory,
} from '../../store/inventory/inventory.thunk';
import { RootState } from '../../store/store';
import { InventoryTable } from '../../components/inventory/InventoryTable';
import { StockSummaryCards } from '../../components/inventory/StockSummaryCards';
import { InventoryForm, InventoryFormData } from '../../components/inventory/InventoryForm';
import { Plus, X } from 'lucide-react';
import { IInventory } from '../../store/inventory/inventory.types';
import { Pagination } from '@/components/ui';

const InventoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { records, loading, totalPages, totalItems } = useAppSelector((state: RootState) => state.inventory);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IInventory | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  useEffect(() => {
    dispatch(getInventories({ limit: LIMIT, page }));
  }, [dispatch, page]);

  const handleOpenModal = (record?: IInventory) => {
    if (record) setEditingRecord(record);
    else setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const onSubmitForm = async (data: InventoryFormData) => {
    // Backend @IsInt() requires exact timestamp numbers, not ISO strings.
    const dateTimestamp = new Date(data.inventoryDate).setHours(0, 0, 0, 0);

    if (editingRecord) {
      await dispatch(
        updateInventory({
          iId: editingRecord.iId,
          inventoryDate: dateTimestamp,
          carTiresCount: data.carTiresCount === undefined ? null : data.carTiresCount,
          truckTiresCount: data.truckTiresCount === undefined ? null : data.truckTiresCount,
          mixedTiresCount: data.mixedTiresCount === undefined ? null : data.mixedTiresCount,
          bales: data.bales === undefined ? null : data.bales,
        })
      );
    } else {
      await dispatch(
        createInventory({
          inventoryDate: dateTimestamp,
          carTiresCount: data.carTiresCount === undefined ? null : data.carTiresCount,
          truckTiresCount: data.truckTiresCount === undefined ? null : data.truckTiresCount,
          mixedTiresCount: data.mixedTiresCount === undefined ? null : data.mixedTiresCount,
          bales: data.bales === undefined ? null : data.bales,
        })
      );
    }
    handleCloseModal();
  };

  const handleDelete = async (iId: string) => {
    setIsDeletingId(iId);
    await dispatch(deleteInventory(iId));
    setIsDeletingId(null);
    
    // Potentially refresh page if needed (already managed by thunk reducer optionally or relying on reload)
    // Actually the deleteInventory thunk deletes from state, but pagination might be off by 1 item, which is usually fine until a refresh.
  };

  const latestInventory = records.length > 0 && page === 1 ? records[0] : null;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
            Inventory Stock
          </h1>
          <p className="text-sm text-[#5A5A5A] dark:text-[#AAAAAA] mt-1">
            Manage your daily tire and bale metrics
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="h-10 px-4 rounded-md bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B] text-ink-base transition-colors font-medium text-sm flex items-center justify-center gap-2 shadow-sm focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 dark:focus:ring-offset-[#121212] outline-none"
        >
          <Plus className="w-4 h-4" />
          New Snapshot
        </button>
      </div>

      <StockSummaryCards latestInventory={latestInventory} />

      <div className="space-y-4">
        <InventoryTable
          data={records}
          isLoading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          isDeletingId={isDeletingId}
        />
        
        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={LIMIT}
          onPageChange={setPage}
        />
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-cream-border dark:border-[#2E2E2E] p-6 max-w-lg w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
                {editingRecord ? 'Edit Inventory' : 'New Inventory'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 -mr-2 text-ink-400 hover:text-ink-600 dark:hover:text-cream-400 hover:bg-cream-subtle dark:hover:bg-ink-subtle rounded-md transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <InventoryForm
              initialData={editingRecord || undefined}
              onSubmit={onSubmitForm}
              isLoading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
