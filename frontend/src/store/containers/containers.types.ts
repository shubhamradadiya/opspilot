// ============================================================================
// TYPES
// ============================================================================

export enum ContainerStatus {
  LOADING = 'loading',
  COMPLETED = 'completed',
  VGM = 'vgm',
  SHIPPED = 'shipped',
}

export enum DocumentType {
  DOC = 'doc',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  CSV = 'csv',
  PDF = 'pdf',
}

export interface IContainerDocument {
  id: number;
  cdId: string;
  document: string;
  documentType: DocumentType | string | null;
  documentSize: string | null;
  documentName: string | null;
  createdAt: number;
  updatedAt: string;
}

export interface IContainer {
  id: number;
  cId: string;
  bookingNumber: string;
  containerCount: number | null;
  avgWeightInKgs: number | null;
  loadingDate: number | null;
  etdDate: number | null;
  etaDate: number | null;
  status: ContainerStatus | string;
  containerDocuments: IContainerDocument[];
  createdAt: number;
  updatedAt: string;
}

export interface AddContainerPayload {
  bookingNumber: string;
  containerCount?: number | null;
  avgWeightInKgs?: number | null;
  loadingDate?: number | null;
  etdDate?: number | null;
  etaDate?: number | null;
  status?: ContainerStatus | string | null;
  containerDocuments?: File[];
}

export interface UpdateContainerPayload extends Partial<AddContainerPayload> {}

export interface ContainersState {
  data: IContainer[];
  bookingNumbers: string[];
  total: number;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}
