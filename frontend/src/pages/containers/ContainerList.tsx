import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { RootState } from '@/store/store';
import {
  fetchContainersThunk,
  createContainerThunk,
  updateContainerThunk,
  deleteContainerThunk,
} from '@/store/containers/containers.thunk';
import { clearContainersError } from '@/store/containers/containers.slice';
import { IContainer, ContainerStatus } from '@/store/containers/containers.types';

import { Plus, Search, Filter } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { DatePicker } from '@/components/ui/DatePicker';
import { Pagination } from '@/components/ui/Pagination';
import PageHeader from '@/components/common/PageHeader';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import { APP_ROUTES } from '@/utils/routes';
import { toast } from 'sonner';

import ContainerTable from '@/components/containers/ContainerTable';
import ContainerForm, { ContainerFormData } from '@/components/containers/ContainerForm';

const ContainerList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux state
  const { data, total, loading, submitting } = useAppSelector((state: RootState) => state.containers);

  // Pagination & Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedContainer, setSelectedContainer] = useState<IContainer | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch data
  const loadContainers = useCallback(() => {
    dispatch(
      fetchContainersThunk({
        count: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        startTimestamp: dateRange.start ? dateRange.start.getTime() : undefined,
        endTimestamp: dateRange.end ? dateRange.end.getTime() + 86399999 : undefined,
      })
    );
  }, [dispatch, currentPage, debouncedSearch, dateRange]);

  useEffect(() => {
    loadContainers();
  }, [loadContainers]);

  // Cleanup errors
  useEffect(() => {
    return () => {
      dispatch(clearContainersError());
    };
  }, [dispatch]);

  // Handlers
  const handleCreate = () => {
    setFormMode('create');
    setSelectedContainer(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (container: IContainer) => {
    setFormMode('edit');
    setSelectedContainer(container);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (container: IContainer) => {
    setSelectedContainer(container);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedContainer) {
      try {
        await dispatch(deleteContainerThunk(selectedContainer.cId)).unwrap();
        toast.success(`Booking "${selectedContainer.bookingNumber}" deleted successfully`);
        setIsDeleteModalOpen(false);
        setSelectedContainer(undefined);
        setCurrentPage(1);
        loadContainers();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete container');
      }
    }
  };

  const handleFormSubmit = async (formData: ContainerFormData) => {
    try {
      if (formMode === 'create') {
        await dispatch(createContainerThunk(formData)).unwrap();
        toast.success('Container created successfully');
      } else if (formMode === 'edit' && selectedContainer) {
        await dispatch(updateContainerThunk({ cId: selectedContainer.cId, payload: formData })).unwrap();
        toast.success('Container updated successfully');
      }
      setIsFormOpen(false);
      loadContainers();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${formMode} container`);
    }
  };

  const handleView = (c: IContainer) => {
    navigate(`${APP_ROUTES.CONTAINERS}/${c.cId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayData = data.filter((c) => {
    if (statusFilter !== 'all') {
      return c.status?.toLowerCase() === statusFilter.toLowerCase();
    }
    return true;
  });

  return (
    <div className="page-wrapper space-y-6 pt-20 lg:pt-8 min-h-screen">
      <PageHeader
        title="Shipping Containers"
        description="Manage container tracking, shipment times, and related documents."
        action={
          <Button onClick={handleCreate} leftIcon={<Plus className="w-4 h-4" />}>
            Add Container
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A] dark:border-[#2E2E2E] shadow-sm flex flex-col xl:flex-row gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Input
            placeholder="Search booking numbers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 xl:w-auto w-full">
          <div className="w-full sm:w-48 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Filter className="h-4 w-4 text-text-muted" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 w-full h-10 px-3 py-2 text-sm rounded-md border border-[#2A2A2A] dark:border-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-white dark:bg-[#1E1E1E] text-[#2A2A2A] dark:text-[#F5F5F5] appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value={ContainerStatus.LOADING}>Loading</option>
              <option value={ContainerStatus.VGM}>VGM Verified</option>
              <option value={ContainerStatus.SHIPPED}>Shipped</option>
              <option value={ContainerStatus.COMPLETED}>Arrived (Completed)</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <DatePicker
              selected={dateRange.start}
              onChange={(date: Date | null) => setDateRange((prev) => ({ ...prev, start: date }))}
              placeholderText="Start Date"
              maxDate={dateRange.end || undefined}
              className="w-full sm:w-40"
            />
          </div>
          <div className="w-full sm:w-auto">
            <DatePicker
              selected={dateRange.end}
              onChange={(date: Date | null) => setDateRange((prev) => ({ ...prev, end: date }))}
              placeholderText="End Date"
              minDate={dateRange.start || undefined}
              className="w-full sm:w-40"
            />
          </div>
          
          {(search || dateRange.start || dateRange.end || statusFilter !== 'all') && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearch('');
                setDateRange({ start: null, end: null });
                setStatusFilter('all');
              }}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table & Pagination */}
      <div className="flex flex-col gap-4">
        <ContainerTable
          containers={displayData}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
        {total > itemsPerPage && !loading && (
          <div className="mt-2 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(total / itemsPerPage)}
              totalItems={total}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <ContainerForm
          mode={formMode}
          initialData={selectedContainer}
          submitting={submitting}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && selectedContainer && (
        <DeleteConfirmModal
          entityName={`booking "${selectedContainer.bookingNumber}"`}
          entityType="container tracking"
          loading={submitting}
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};


export default ContainerList;
