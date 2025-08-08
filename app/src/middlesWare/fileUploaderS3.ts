import multer, { StorageEngine, FileFilterCallback, Multer } from 'multer';
import multerS3 from 'multer-s3';
import { Request, Express } from 'express';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import config from '../config';

interface IFileUploadManager {
  getUploader(useS3?: boolean): Multer;
}

export class FileUploadManager implements IFileUploadManager {
  private readonly s3Client: S3Client;
  private readonly s3Storage: StorageEngine;
  private readonly localStorage: StorageEngine;
  private readonly allowedMimeTypes: string[];

  constructor() {
    this.s3Client = new S3Client({
      region: config.s3.region as string,
      credentials: {
        accessKeyId: config.s3.accessKeyId as string,
        secretAccessKey: config.s3.secretAccessKey as string,
      },
    });

    this.localStorage = multer.diskStorage({
      destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void,
      ) => {
        const uploadFilePath = '../../../uploadFile';
        let destinationPath;

        if (file.mimetype.includes('image')) {
          destinationPath = path.join(__dirname, `${uploadFilePath}/images/`);
        } else if (file.mimetype.includes('pdf')) {
          destinationPath = path.join(__dirname, `${uploadFilePath}/pdfs/`);
        } else if (file.mimetype.includes('application')) {
          destinationPath = path.join(__dirname, `${uploadFilePath}/docs/`);
        } else if (file.mimetype.includes('video')) {
          destinationPath = path.join(__dirname, `${uploadFilePath}/videos/`);
        } else if (file.mimetype.includes('audio')) {
          destinationPath = path.join(__dirname, `${uploadFilePath}/audios/`);
        } else {
          destinationPath = path.join(__dirname, `${uploadFilePath}/others/`);
        }

        cb(null, destinationPath);
      },
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void,
      ) => {
        const fileExt = path.extname(file.originalname);
        const fileName =
          file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') +
          '-' +
          Date.now();
        cb(null, fileName + fileExt);
      },
    });

    this.s3Storage = multerS3({
      s3: this.s3Client as any,
      bucket: config.s3.bucket as string,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req: Request, file: Express.Multer.File, cb) => {
        const fileName = `${Date.now().toString()}_${file.originalname}`;
        cb(null, fileName);
      },
    });

    this.allowedMimeTypes = [
      'application/pdf',
      'application/x-x509-ca-cert',
      'application/octet-stream',
      'application/pkix-cert',
      'application/pkcs8',
      'application/msword',
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/webm',
      'video/x-msvideo',
      'video/x-flv',
      'video/quicktime',
      'video/x-ms-wmv',
    ];
  }

  /**
   * Returns a configured multer instance for file upload (local or S3).
   * @param useS3 If true, uses S3 storage. Otherwise, uses local storage.
   */
  public getUploader(useS3: boolean = false): Multer {
    return multer({
      storage: useS3 ? this.s3Storage : this.localStorage,
      limits: { fileSize: 50 * 1024 * 1024 },
      fileFilter: this.fileFilter.bind(this),
    });
  }

  /**
   * File filter to restrict upload formats.
   */
  private fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void {
    if (
      this.allowedMimeTypes.includes(file.mimetype) ||
      file.mimetype.includes('image') ||
      file.mimetype.includes('video')
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Only ' +
            this.allowedMimeTypes.map(type => type.split('/')[1]).join(', ') +
            ' formats are allowed!',
        ),
      );
    }
  }
}

// Singleton export for easy usage
export const fileUploadManager = new FileUploadManager();

/**
 * Example usage:
 *
 * import { fileUploadManager } from './fileUploaderS3';
 *
 * // Single file upload (S3)
 * app.post('/upload/single', fileUploadManager.getUploader(true).single('img'), handler);
 *
 * // Multiple files upload (S3)
 * app.post('/upload/multiple',
 *   fileUploadManager.getUploader(true).fields([
 *     { name: 'img', maxCount: 1 },
 *     { name: 'equipment_img', maxCount: 1 },
 *     { name: 'muscle_group_img', maxCount: 1 },
 *   ]),
 *   handler
 * );
 */
