import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { IInventory } from '../../store/inventory/inventory.types';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

interface Props {
  data: IInventory[];
  onEdit: (inventory: IInventory) => void;
  onDelete: (iId: string) => void;
  isLoading: boolean;
  isDeletingId: string | null;
}

export const InventoryTable: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
  isLoading,
  isDeletingId,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<IInventory | null>(null);

  const formatNumber = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '—';
    return Number(val).toFixed(2);
  };

  const handleDeleteClick = (inv: IInventory) => {
    setInventoryToDelete(inv);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (inventoryToDelete) {
      onDelete(inventoryToDelete.iId);
      // Let the parent passing `isDeletingId` control the loading state, we can close the modal immediately or wait.
      // Easiest is to close it immediately and let the global or row loader show. Let's just close it.
      setDeleteModalOpen(false);
      setInventoryToDelete(null);
    }
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#1E1E1E] border border-cream-border dark:border-[#2E2E2E] rounded-xl overflow-hidden shadow-sm">
        <div className="animate-pulse flex flex-col">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 border-b border-cream-subtle dark:border-[#222222] bg-[#F5F0D0]/50 dark:bg-ink-subtle/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white dark:bg-[#1E1E1E] border border-cream-border dark:border-[#2E2E2E] rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F0D0] dark:bg-[#252525] border-b border-cream-border dark:border-[#2E2E2E]">
              <th className="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider dark:text-[#9A9A9A]">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider dark:text-[#9A9A9A]">
                Car Tires
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider dark:text-[#9A9A9A]">
                Truck Tires
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider dark:text-[#9A9A9A]">
                Mixed Tires
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider dark:text-[#9A9A9A]">
                Bales
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider dark:text-[#9A9A9A] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EDD0] dark:divide-[#222222]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-ink-600 dark:text-[#AAAAAA]"
                >
                  <p className="font-medium text-ink-900 dark:text-cream-100">No inventory entries found.</p>
                  <p className="mt-1">Add a new stock snapshot to get started.</p>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.iId}
                  className="even:bg-[#FEFDF0] dark:even:bg-[#1A1A1A] hover:bg-cream-base dark:hover:bg-[#252525] transition-colors group"
                >
                  <td className="px-4 py-3 text-sm text-ink-600 dark:text-[#AAAAAA] whitespace-nowrap">
                    <span className="font-mono text-[#5A5A5A] dark:text-[#AAAAAA]">
                      {new Date(row.inventoryDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-600 dark:text-[#AAAAAA]">
                    {formatNumber(row.carTiresCount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-600 dark:text-[#AAAAAA]">
                    {formatNumber(row.truckTiresCount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-600 dark:text-[#AAAAAA]">
                    {formatNumber(row.mixedTiresCount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink-600 dark:text-[#AAAAAA]">
                    {formatNumber(row.bales)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 text-ink-400 hover:text-[#D4AF37] hover:bg-cream-subtle dark:hover:bg-[#2A2200] rounded-md transition-colors"
                        title="Edit Entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(row)}
                        disabled={isDeletingId === row.iId}
                        className="p-1.5 text-ink-400 hover:text-[#C0392B] dark:hover:text-[#E05A4A] hover:bg-[#FADADD] dark:hover:bg-[rgba(192,57,43,0.15)] rounded-md transition-colors disabled:opacity-50"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteModalOpen && inventoryToDelete && (
        <DeleteConfirmModal
          entityName={`the inventory entry for ${new Date(
            inventoryToDelete.inventoryDate
          ).toLocaleDateString()}`}
          entityType="Inventory Entry"
          loading={isDeletingId === inventoryToDelete.iId}
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setInventoryToDelete(null);
          }}
        />
      )}
    </>
  );
};
