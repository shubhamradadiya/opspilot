import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IInventory } from '../../store/inventory/inventory.types';
import { DatePicker } from '@/components/ui/DatePicker';

const inventorySchema = z.object({
  inventoryDate: z.string().min(1, 'Date is required'),
  carTiresCount: z.coerce.number().int('Must be a whole number').min(0, 'Cannot be negative').optional(),
  truckTiresCount: z.coerce.number().int('Must be a whole number').min(0, 'Cannot be negative').optional(),
  mixedTiresCount: z.coerce.number().int('Must be a whole number').min(0, 'Cannot be negative').optional(),
  bales: z.coerce.number().int('Must be a whole number').min(0, 'Cannot be negative').optional(),
});

export type InventoryFormData = z.infer<typeof inventorySchema>;

interface Props {
  initialData?: IInventory;
  onSubmit: (data: InventoryFormData) => void;
  isLoading?: boolean;
}

export const InventoryForm: React.FC<Props> = ({ initialData, onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema) as any,
    defaultValues: {
      inventoryDate: new Date().toISOString().split('T')[0],
      carTiresCount: undefined,
      truckTiresCount: undefined,
      mixedTiresCount: undefined,
      bales: undefined,
    },
  });

  const inventoryDate = watch('inventoryDate');

  useEffect(() => {
    if (initialData) {
      reset({
        inventoryDate: initialData.inventoryDate
          ? new Date(initialData.inventoryDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        carTiresCount: initialData.carTiresCount ?? undefined,
        truckTiresCount: initialData.truckTiresCount ?? undefined,
        mixedTiresCount: initialData.mixedTiresCount ?? undefined,
        bales: initialData.bales ?? undefined,
      });
    } else {
      reset({
        inventoryDate: new Date().toISOString().split('T')[0],
        carTiresCount: undefined,
        truckTiresCount: undefined,
        mixedTiresCount: undefined,
        bales: undefined,
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Field */}
        <div className="space-y-1.5 pt-0.5">
          <DatePicker
            label="Inventory Date *"
            value={inventoryDate ? new Date(inventoryDate) : null}
            onChange={(date) => {
              setValue(
                'inventoryDate',
                date ? new Date(date).toISOString().split('T')[0] : ''
              );
            }}
            error={errors.inventoryDate?.message}
            placeholderText="Select date"
            dateFormat="MMM d, yyyy"
            maxDate={new Date()}
          />
        </div>

        {/* Car Tires */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">Car Tires</label>
          <div className="relative">
            <input
              {...register('carTiresCount', { valueAsNumber: true })}
              type="number"
              step="1"
              min="0"
              className={`w-full h-9 px-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none transition-all
                ${errors.carTiresCount ? 'border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]' : 'border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37]'}`}
              placeholder="0"
            />
          </div>
          {errors.carTiresCount && (
            <p className="text-xs text-[#C0392B]">{errors.carTiresCount.message}</p>
          )}
        </div>

        {/* Truck Tires */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">Truck Tires</label>
          <div className="relative">
            <input
              {...register('truckTiresCount', { valueAsNumber: true })}
              type="number"
              step="1"
              min="0"
              className={`w-full h-9 px-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none transition-all
                ${errors.truckTiresCount ? 'border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]' : 'border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37]'}`}
              placeholder="0"
            />
          </div>
          {errors.truckTiresCount && (
            <p className="text-xs text-[#C0392B]">{errors.truckTiresCount.message}</p>
          )}
        </div>

        {/* Mixed Tires */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">Mixed Tires</label>
          <div className="relative">
            <input
              {...register('mixedTiresCount', { valueAsNumber: true })}
              type="number"
              step="1"
              min="0"
              className={`w-full h-9 px-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none transition-all
                ${errors.mixedTiresCount ? 'border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]' : 'border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37]'}`}
              placeholder="0"
            />
          </div>
          {errors.mixedTiresCount && (
            <p className="text-xs text-[#C0392B]">{errors.mixedTiresCount.message}</p>
          )}
        </div>

        {/* Bales */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#5A5A5A] dark:text-[#AAAAAA]">Bales</label>
          <div className="relative">
            <input
              {...register('bales', { valueAsNumber: true })}
              type="number"
              step="1"
              min="0"
              className={`w-full h-9 px-3 rounded-md text-sm border bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] outline-none transition-all
                ${errors.bales ? 'border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]' : 'border-[#E8E0B8] dark:border-[#2E2E2E] focus:ring-2 focus:ring-[#D4AF37]'}`}
              placeholder="0"
            />
          </div>
          {errors.bales && (
            <p className="text-xs text-[#C0392B]">{errors.bales.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-[#E8E0B8] dark:border-[#2E2E2E]">
        <button
          type="button"
          className="h-9 px-4 rounded-md font-medium text-sm transition-colors text-ink-600 dark:text-[#AAAAAA] hover:bg-[#E8E0B8]/20 dark:hover:bg-[#2A2A2A] bg-transparent"
          onClick={() => reset()}
          disabled={isLoading}
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="h-9 px-4 rounded-md bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B] text-ink-base transition-colors font-medium text-sm flex items-center justify-center min-w-[100px] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-ink-base border-t-transparent animate-spin mr-2" />
          ) : null}
          {initialData ? 'Update Inventory' : 'Save Inventory'}
        </button>
      </div>
    </form>
  );
};
