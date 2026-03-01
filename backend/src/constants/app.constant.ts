import dotenv from 'dotenv';
dotenv.config();

export const DEFAULT_COUNT = 0;
export const DEFAULT_LIMIT = 10;

export enum Languages {
  EN = 'en',
}

export enum DeviceTypes {
  WEB = 'web',
}

export enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  LOCAL = 'local',
}

export const BASE_URL = process.env.APP_URL;

export const STORAGE_PATH = 'public/storage';
export const IMAGE_EXTENSIONS = 'jpg|jpeg|png|gif|heic';
export const XLSX_EXTENSIONS = 'xls|xlsx';
export const PDF_EXTENSIONS = 'pdf';
export const CSV_EXTENSIONS = 'csv';
export const DOCS_EXTENSIONS = 'doc|docx|pdf';
export const VIDEO_EXTENSIONS = 'mp4|wmv|mov';
export const AUDIO_EXTENSIONS = 'mp3|m4a';
export const TXT_EXTENSIONS = 'txt';

export enum MediaTypes {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
  DOCUMENT = 'doc',
}

export enum DocumentType {
  DOC = 'doc',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  CSV = 'csv',
  PDF = 'pdf',
}

export enum ExpenseType {
  MANUAL = 'manual',
  PAYOUT = 'payout',
}

export enum CalenderSlotTypes {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}
