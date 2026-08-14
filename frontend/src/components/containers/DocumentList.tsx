import React from 'react';
import { IContainerDocument } from '@/store/containers/containers.types';
import { FileText, Download, FileSpreadsheet, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentListProps {
  documents: IContainerDocument[];
}

const getIconForType = (type: string | null) => {
  const normalized = type?.toLowerCase() || '';
  if (normalized.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
  if (normalized.includes('xls') || normalized.includes('csv')) return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
  if (normalized.includes('doc')) return <FileText className="w-6 h-6 text-blue-500" />;
  if (normalized.match(/(jpg|jpeg|png|gif)/)) return <ImageIcon className="w-6 h-6 text-purple-500" />;
  return <FileIcon className="w-6 h-6 text-[#9A9A9A]" />;
};

const formatBytes = (bytesStr: string | null): string => {
  if (!bytesStr) return 'Unknown size';
  const bytes = Number(bytesStr);
  if (isNaN(bytes) || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#F5F5F5] dark:bg-[#1E1E1E] rounded-xl border border-dashed border-[#E5E5E5] dark:border-[#333333]">
        <FileIcon className="w-10 h-10 text-[#CCCCCC] dark:text-[#555555] mb-2" />
        <p className="text-sm text-[#9A9A9A] dark:text-[#AAAAAA]">No shipping documents attached</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.cdId}
          className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E5E5E5] dark:border-[#2E2E2E] shadow-sm hover:border-[#D4AF37] dark:hover:border-[#D4AF37] transition-colors group"
        >
          <div className="flex-shrink-0 p-2 bg-[#F5F5F5] dark:bg-[#252525] rounded-lg">
            {getIconForType(doc.documentType || doc.documentName)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#2A2A2A] dark:text-[#F5F5F5] truncate mb-0.5" title={doc.documentName || 'Document'}>
              {doc.documentName || 'Unnamed Document'}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#9A9A9A] dark:text-[#888888]">
              <span>{formatBytes(doc.documentSize)}</span>
              <span>&bull;</span>
              <span>{format(new Date(doc.createdAt), 'MMM dd, yyyy')}</span>
            </div>
          </div>

          <a
            href={doc.document}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex-shrink-0 p-2 text-[#9A9A9A] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] hover:text-[#D4AF37] rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Download Document"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
