import type { Express } from 'express';

export interface ICopiedMedia {
  media: string;
  mediaType?: string;
  seconds?: number;
  mediaThumbnail?: string;
  originalName: string;
}

export interface IMulterFileWithMeta extends Express.Multer.File {
  media?: string;
  mediaType?: string;
  seconds?: number;
  mediaThumbnail?: string;
}
