import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/utils/routes';
import { containersApi } from '@/api/containers.api';
import { IContainer } from '@/store/containers/containers.types';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { ArrowLeft, Box, Scale, CalendarDays, Ship, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import ContainerTimeline from '@/components/containers/ContainerTimeline';
import ContainerStatusBadge from '@/components/containers/ContainerStatusBadge';
import DocumentList from '@/components/containers/DocumentList';
import { Spinner } from '@/components/ui/Spinner';

export const ContainerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [container, setContainer] = useState<IContainer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContainer = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await containersApi.getById(id);
        
        if (response.data?.data) {
          setContainer(response.data.data);
        } else {
          toast.error('Container tracking not found');
          navigate(APP_ROUTES.CONTAINERS);
        }
      } catch (err: any) {
        toast.error('Failed to load container details');
        navigate(APP_ROUTES.CONTAINERS);
      } finally {
        setLoading(false);
      }
    };
    fetchContainer();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-16">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-500">Retrieving tracking details...</p>
      </div>
    );
  }

  if (!container) return null;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto w-full pt-20 lg:pt-8 min-h-screen">
      
      {/* Back nav & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate(APP_ROUTES.CONTAINERS)} className="p-2">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#2A2A2A] dark:text-[#F5F5F5] flex items-center gap-3">
              Booking #{container.bookingNumber}
              <ContainerStatusBadge status={container.status} />
            </h1>
            <p className="text-sm text-[#9A9A9A] dark:text-[#888888] mt-1">
              Internal Tracking ID: {container.cId.slice(0, 8)}...
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Properties */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E5E5E5] dark:border-[#333333] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5E5E5] dark:border-[#333333] bg-gray-50 dark:bg-[#121212]">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Shipment Details</h3>
            </div>
            <div className="p-5 flex flex-col gap-5">
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-500">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Container Count</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{container.containerCount || 'N/A'} Units</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-500">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Average Weight</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{container.avgWeightInKgs ? `${container.avgWeightInKgs} kg/container` : 'N/A'}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E5E5E5] dark:border-[#333333] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E5E5E5] dark:border-[#333333] bg-gray-50 dark:bg-[#121212]">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Date Targets</h3>
            </div>
            <div className="p-5 flex flex-col gap-5">

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Loading Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{container.loadingDate ? format(new Date(container.loadingDate), 'PPP') : 'Not Set'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Target Departure (ETD)</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{container.etdDate ? format(new Date(container.etdDate), 'PPP') : 'Not Set'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Target Arrival (ETA)</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{container.etaDate ? format(new Date(container.etaDate), 'PPP') : 'Not Set'}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Docs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E5E5E5] dark:border-[#333333] shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 font-display">Tracking Timeline</h3>
            <ContainerTimeline status={container.status} />
          </div>

          <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E5E5E5] dark:border-[#333333] shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-display">Shipping Documents</h3>
              <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded-full font-medium">
                {container.containerDocuments?.length || 0} Attached
              </span>
            </div>
            
            <DocumentList documents={container.containerDocuments || []} />
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContainerDetail;
