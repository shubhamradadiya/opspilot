import fs, { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import {
  DOCS_EXTENSIONS,
  IMAGE_EXTENSIONS,
  MediaTypes,
  PDF_EXTENSIONS,
  STORAGE_PATH,
  VIDEO_EXTENSIONS,
} from '../constants/app.constant';
import type { Express } from 'express';
import ffmpeg, { type FfprobeData } from 'fluent-ffmpeg';
import { storagePath } from 'src/config/app.config';
import type { ICopiedMedia, IMulterFileWithMeta } from 'src/interfaces/file-upload.interface';

/**
 * Filter image
 * @param file
 * @returns
 */
export const validateFileType = (file: Express.Multer.File, fileExtType: string) => {

  const originalName = file.originalname.toLowerCase();

  const regExp = new RegExp(`\\.(${fileExtType})$`, 'i');
  if (!regExp.test(originalName)) return false;

  return true;
};

/**
 * Validate file size
 * @param file The file to validate
 * @param maxSizeInMB The maximum size in MB
 * @returns True if the file size is valid, false otherwise
 */
export const validateFileSize = (
  file: Express.Multer.File,
  maxSizeInMB: number,
): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  return file.size <= maxSizeInBytes;
};

/**
 * Upload file
 * @param dir
 * @param file
 * @returns
 */
export const uploadFile = (dir: string, file: Express.Multer.File) => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const fileName = `${dir}/${randomName}${extname(file.originalname)}`;

  const storageDirExists = existsSync(`/${STORAGE_PATH}/`);
  if (!storageDirExists) mkdirSync(`${STORAGE_PATH}/`, { recursive: true });

  const exists = existsSync(`${STORAGE_PATH}/${dir}`);
  if (!exists) mkdirSync(`${STORAGE_PATH}/${dir}`);

  writeFileSync(`${STORAGE_PATH}/${fileName}`, file.buffer);

  return fileName;
};

/**
 * Upload multiple files
 * @param dir
 * @param file
 * @returns
 */
export const uploadFiles = async (dir: string, files: Array<Express.Multer.File>) => {
  const fileNames = await Promise.all(
    files.map(async (file: Express.Multer.File) => {
      // file name
      const randomName = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join('');
      const fileName = `${dir}/${randomName}${extname(file.originalname)}`;

      // ext validation
      const extensionMappings: Record<string, MediaTypes> = {
        [IMAGE_EXTENSIONS]: MediaTypes.IMAGE,
        [DOCS_EXTENSIONS]: MediaTypes.DOCUMENT,
        [PDF_EXTENSIONS]: MediaTypes.PDF,
        [VIDEO_EXTENSIONS]: MediaTypes.VIDEO,
      };

      const type =
        Object.entries(extensionMappings).find(([extensions]) =>
          validateFileType(file, extensions),
        )?.[1] ?? MediaTypes.IMAGE;

      // storage dir
      const storageDirExists = existsSync(`/${STORAGE_PATH}/`);
      if (!storageDirExists) mkdirSync(`${STORAGE_PATH}/`, { recursive: true });

      const exists = existsSync(`${STORAGE_PATH}/${dir}`);
      if (!exists) mkdirSync(`${STORAGE_PATH}/${dir}`);

      // store
      writeFileSync(`${STORAGE_PATH}/${fileName}`, file.buffer);

      // if video then generate thumbnail & get video duration
      if (type === MediaTypes.VIDEO) {
        const mediaThumbnail = await generateThumbnail(
          `${STORAGE_PATH}/${fileName}`,
          `${STORAGE_PATH}/${dir}`,
          randomName,
        );

        // get video duration
        const seconds = getVideoDuration(`${STORAGE_PATH}/${fileName}`);

        return {
          media: fileName,
          mediaType: type,
          seconds,
          mediaThumbnail,
          originalName: file.originalname,
        };
      }

      return {
        media: fileName,
        mediaType: type,
        originalName: file.originalname,
      };
    }),
  );

  return fileNames;
};

/**
 * Copy files
 * @param dir
 * @param files
 * @returns
 */
export const copyFiles = async (
  dir: string,
  files: IMulterFileWithMeta[],
): Promise<ICopiedMedia[]> => {
  const fileNames = await Promise.all(
    files.map(async (file): Promise<ICopiedMedia> => {
      // name
      const randomName = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join('');
      const fileName = `${dir}/${randomName}${extname(file.originalname)}`;

      const inStr = fs.createReadStream(
        join(__dirname, '../../..', `/public/storage/${file.media}`),
      );
      const outStr = fs.createWriteStream(
        join(__dirname, '../../..', `/public/storage/${fileName}`),
      );

      inStr.pipe(outStr);

      return {
        media: fileName,
        mediaType: file.mediaType,
        seconds: file.seconds,
        mediaThumbnail: file.mediaThumbnail,
        originalName: file.originalname,
      };
    }),
  );
  return fileNames;
};

/**
 * Delete file
 * @param {string} file
 * @returns
 */
export const deleteFile = (file: string) => {
  const path = `./${STORAGE_PATH}/${file}`;
  if (existsSync(path)) {
    unlinkSync(path);
  }
  return true;
};

/**
 * Get storage url
 * @param file
 * @returns
 */
export const castToStorage = (file: string) => {
  return file ? storagePath(file) : file;
};

/**
 * Generate Thumbnail
 * @param inputFilePath
 * @param outputFilePath
 * @param fileName
 * @returns
 */
export const generateThumbnail = async (
  inputFilePath: string,
  outputFilePath: string,
  fileName: string,
) => {
  // Generate thumbnail using ffmpeg
  await ffmpeg(inputFilePath)
    .on('end', () => {})
    .on('error', err => {
      console.error('Error generating thumbnail:', err);
    })
    .screenshots({
      count: 1,
      filename: `${fileName}-thumbnail.png`,
      folder: outputFilePath,
      size: '320x180',
    });

  return `${fileName}-thumbnail.png`;
};

/**
 * Generate Thumbnail and get metadata
 * @param file
 * @returns
 */
export const generateThumbnailAndGetMetadata = async (file: Express.Multer.File) => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  const fileName = `temp/${randomName}${extname(file.originalname)}`;

  const storageDirExists = existsSync(`/${STORAGE_PATH}/`);
  if (!storageDirExists) mkdirSync(`${STORAGE_PATH}/`, { recursive: true });

  const exists = existsSync(`${STORAGE_PATH}/temp`);
  if (!exists) mkdirSync(`${STORAGE_PATH}/temp`);

  const storagePath = `${STORAGE_PATH}/${fileName}`;

  writeFileSync(storagePath, file.buffer);

  // Generate thumbnail using ffmpeg

  await new Promise((resolve, reject) => {
    ffmpeg(storagePath)
      .on('end', res => {
        resolve(res);
      })
      .on('error', err => {
        console.error('Error generating thumbnail: ', err);
        reject(err);
      })
      .screenshots({
        count: 1,
        filename: `${randomName}-thumbnail.png`,
        folder: `${STORAGE_PATH}/temp`,
        // size: '512x1512',
      });
  });

  const path = `./${STORAGE_PATH}/${fileName}`;
  if (existsSync(path)) {
    unlinkSync(path);
  }

  return {
    thumbnailPath: `${STORAGE_PATH}/temp/${randomName}-thumbnail.png`,
    thumbnailName: `${randomName}-thumbnail.png`,
  };
};

/**
 * Get video duration
 * @param inputFilePath
 * @returns
 */
export const getVideoDuration = async (inputFilePath: string) => {
  await ffmpeg.ffprobe(inputFilePath, (_error: Error | null, metadata: FfprobeData) => {
    return metadata.format.duration;
  });
};

/**
 * Convert file to buffer
 * @param inputFilePath
 * @returns
 */
export const convertFileToBuffer = async (inputFilePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(join(__dirname, '..', '..', '..', `/${inputFilePath}`), function (err, buffer) {
      if (err) reject(err);

      resolve(buffer);

      const path = `./${STORAGE_PATH}/${inputFilePath}`;
      if (existsSync(path)) {
        unlinkSync(path);
      }
    });
  });
};
