import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronDown, Upload } from 'lucide-react';
import { IContainer, ContainerStatus } from '@/store/containers/containers.types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchBookingNumbersThunk } from '@/store/containers/containers.thunk';
import { RootState } from '@/store/store';
import { DatePicker } from '@/components/ui/DatePicker';
import Input from '@/components/ui/Input';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ContainerFormData {
  bookingNumber: string;
  containerCount?: number;
  avgWeightInKgs?: number;
  loadingDate?: number;
  etdDate?: number;
  etaDate?: number;
  status?: string;
  containerDocuments?: File[];
}

interface ContainerFormProps {
  mode: 'create' | 'edit';
  initialData?: IContainer;
  submitting?: boolean;
  onSubmit: (data: ContainerFormData) => void;
  onClose: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_OPTIONS = [
  { value: ContainerStatus.LOADING, label: 'Loading' },
  { value: ContainerStatus.VGM, label: 'VGM Verified' },
  { value: ContainerStatus.SHIPPED, label: 'Shipped' },
  { value: ContainerStatus.COMPLETED, label: 'Arrived (Completed)' },
];

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const containerSchema = z.object({
  bookingNumber: z.string().min(1, 'Booking number is required'),
  containerCount: z.number().optional().nullable(),
  avgWeightInKgs: z.number().optional().nullable(),
  loadingDate: z.string().optional().nullable(),
  etdDate: z.string().optional().nullable(),
  etaDate: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
});

type ContainerSchema = z.infer<typeof containerSchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const toDateInputValue = (timestamp?: number | null): string => {
  if (!timestamp) return '';
  return new Date(timestamp).toISOString().split('T')[0];
};

const toTimestamp = (dateStr?: string | null): number | undefined => {
  if (!dateStr) return undefined;
  return new Date(dateStr).getTime();
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ContainerForm: React.FC<ContainerFormProps> = ({
  mode,
  initialData,
  submitting,
  onSubmit,
  onClose,
}) => {
  // ── HOOKS — Store ───────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const bookingNumbers = useAppSelector((s: RootState) => s.containers.bookingNumbers);

  // ── STATE ────────────────────────────────────────────────────────────────────
  const [showBookingDropdown, setShowBookingDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── FORM ─────────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ContainerSchema>({
    resolver: zodResolver(containerSchema),
    defaultValues: {
      bookingNumber: initialData?.bookingNumber ?? '',
      containerCount: initialData?.containerCount ?? undefined,
      avgWeightInKgs: initialData?.avgWeightInKgs ?? undefined,
      loadingDate: toDateInputValue(initialData?.loadingDate),
      etdDate: toDateInputValue(initialData?.etdDate),
      etaDate: toDateInputValue(initialData?.etaDate),
      status: initialData?.status ?? ContainerStatus.LOADING,
    },
  });

  const bookingNumberValue = watch('bookingNumber');

  // ── EFFECTS — Load auto-complete suggestions ─────────────────────────────────────
  useEffect(() => {
    if (bookingNumberValue) {
      dispatch(fetchBookingNumbersThunk({ search: bookingNumberValue }));
    }
  }, [bookingNumberValue, dispatch]);

  // ── EFFECTS — Close dropdown on outside click ──────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowBookingDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // ── FUNCTIONS — Handlers ─────────────────────────────────────────────────
  const handleBookingSelect = useCallback(
    (num: string) => {
      setValue('bookingNumber', num, { shouldValidate: true });
      setShowBookingDropdown(false);
    },
    [setValue]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset standard input to allow re-selection of identical objects successively
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit: SubmitHandler<ContainerSchema> = useCallback(
    (data) => {
      const submissionData: ContainerFormData = {
        bookingNumber: data.bookingNumber,
        containerCount: data.containerCount || undefined,
        avgWeightInKgs: data.avgWeightInKgs || undefined,
        loadingDate: toTimestamp(data.loadingDate),
        etdDate: toTimestamp(data.etdDate),
        etaDate: toTimestamp(data.etaDate),
        status: data.status || undefined,
        containerDocuments: selectedFiles.length > 0 ? selectedFiles : undefined,
      };
      onSubmit(submissionData);
    },
    [onSubmit, selectedFiles]
  );

  const filteredBookingNumbers = bookingNumbers.filter(
    (n: string) =>
      n.toLowerCase().includes((bookingNumberValue ?? '').toLowerCase()) && n !== bookingNumberValue
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-[#2A2A2A] dark:border-[#2E2E2E]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] dark:border-[#2E2E2E]">
          <h2 className="text-lg font-semibold text-[#2A2A2A] dark:text-[#F5F5F5]">
            {mode === 'create' ? 'Add Container' : 'Edit Container'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#9A9A9A] hover:text-[#2A2A2A] dark:hover:text-[#F5F5F5] hover:bg-[#F5F0D0] dark:hover:bg-[#252525] transition-colors duration-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto max-h-[75vh] custom-scrollbar">
        <form id="container-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Number */}
            <div className="relative md:col-span-2" ref={dropdownRef}>
              <div className="relative">
                <Input
                  label="Booking Number *"
                  placeholder="Enter or select booking number"
                  {...register('bookingNumber')}
                  error={errors.bookingNumber?.message}
                  onFocus={() => setShowBookingDropdown(true)}
                  onChange={(e) => {
                    register('bookingNumber').onChange(e);
                    setShowBookingDropdown(true);
                  }}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowBookingDropdown(!showBookingDropdown)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {showBookingDropdown && filteredBookingNumbers.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333333] rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredBookingNumbers.map((num: string, idx: number) => (
                    <li
                      key={idx}
                      onClick={() => handleBookingSelect(num)}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#FDFBD4] hover:text-[#D4AF37] dark:hover:bg-[#1E1E1E] dark:hover:text-[#D4AF37] cursor-pointer"
                    >
                      {num}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Container Count */}
            <Input
              label="Container Count"
              type="number"
              placeholder="e.g. 2"
              {...register('containerCount', { valueAsNumber: true })}
              error={errors.containerCount?.message}
            />

            {/* Avg Weight */}
            <Input
              label="Avg Weight (kg)"
              type="number"
              step="0.01"
              placeholder="e.g. 2500.5"
              {...register('avgWeightInKgs', { valueAsNumber: true })}
              error={errors.avgWeightInKgs?.message}
            />

            {/* Loading Date */}
            <Controller
              name="loadingDate"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">Loading Date</label>
                  <DatePicker
                    selected={field.value ? new Date(field.value) : undefined}
                    onChange={(date: Date | null) => field.onChange(date ? date.toISOString().split('T')[0] : null)}
                    placeholderText="Select date"
                    className="w-full"
                  />
                </div>
              )}
            />

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">Shipping Status</label>
              <div className="relative">
                <select
                  {...register('status')}
                  className={`w-full h-10 px-3 py-2 text-sm rounded-md border appearance-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all bg-white dark:bg-[#121212] text-[#2A2A2A] dark:text-[#F5F5F5] border-[#E5E5E5] dark:border-[#333333]`}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* ETD Date */}
            <Controller
              name="etdDate"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">Expected Target Departure (ETD)</label>
                  <DatePicker
                    selected={field.value ? new Date(field.value) : undefined}
                    onChange={(date: Date | null) => field.onChange(date ? date.toISOString().split('T')[0] : null)}
                    placeholderText="Select departure date"
                    className="w-full"
                  />
                </div>
              )}
            />

            {/* ETA Date */}
            <Controller
              name="etaDate"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">Expected Target Arrival (ETA)</label>
                  <DatePicker
                    selected={field.value ? new Date(field.value) : undefined}
                    onChange={(date: Date | null) => field.onChange(date ? date.toISOString().split('T')[0] : null)}
                    placeholderText="Select arrival date"
                    className="w-full"
                  />
                </div>
              )}
            />

            {/* Document Uploads */}
            <div className="md:col-span-2 mt-4">
              <label className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5] mb-2 block">
                Shipping Documents
              </label>
              
              <div className="flex flex-col gap-3">
                {/* File Dropzone / Button */}
                <div className="relative w-full">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
                  />
                  <div className="w-full px-4 py-8 border-2 border-dashed border-[#E5E5E5] dark:border-[#333333] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] rounded-xl flex flex-col items-center justify-center gap-2 bg-[#F9F9F9] dark:bg-[#1A1A1A] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#FDFBD4] dark:bg-[rgba(212,175,55,0.1)] flex items-center justify-center text-[#D4AF37]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5]">
                        Click or drag to upload files
                      </p>
                      <p className="text-xs text-[#9A9A9A] dark:text-[#777777] mt-1">
                        Supported: PDF, Excel, Word, or Images
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-xs font-semibold text-[#666666] dark:text-[#9A9A9A] uppercase tracking-wider">
                      Files to explicitly attach:
                    </p>
                    <div className="space-y-2">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 rounded-lg border border-[#E5E5E5] dark:border-[#333333] bg-[#F5F5F5] dark:bg-[#252525]">
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm text-[#2A2A2A] dark:text-[#F5F5F5] truncate">{file.name}</span>
                            <span className="text-[10px] text-[#9A9A9A]">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded z-20"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2A2A] dark:border-[#2E2E2E] mt-4 px-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-[#D4AF37] text-[#D4AF37] bg-white dark:bg-[#1E1E1E] text-sm font-medium hover:bg-[#FDFBD4] dark:hover:bg-[#2A2A2A] transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="container-form"
            disabled={submitting}
            className="h-9 px-6 rounded-lg bg-[#D4AF37] hover:bg-[#CE8946] active:bg-[#A8892B] text-[#2A2A2A] dark:text-[#121212] text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving…' : mode === 'create' ? 'Create Container' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContainerForm;
