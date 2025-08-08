import path from 'path';
import { Request, RequestHandler } from 'express';
import multer, { FileFilterCallback, StorageEngine, Multer } from 'multer';

interface IFileUploadManager {
  getUploader(): Multer;
  getPdfUploader(): RequestHandler;
}

class FileUploadManager implements IFileUploadManager {
  private readonly allowedMimeTypes: string[];
  private readonly fileStorage: StorageEngine;
  private readonly pdfStorage: StorageEngine;

  constructor() {
    this.allowedMimeTypes = [
      'application/pdf',
      'application/x-x509-ca-cert',
      'application/octet-stream',
      'application/pkix-cert',
      'application/pkcs8',
      'application/msword',
    ];

    this.fileStorage = multer.diskStorage({
      destination: (
        req,
        file,
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
        req,
        file: { originalname: string },
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

    this.pdfStorage = multer.diskStorage({
      destination: (
        req,
        file,
        cb: (error: Error | null, destination: string) => void,
      ) => {
        cb(null, path.join(__dirname, '../../../uploadFile/pdfs/'));
      },
      filename: (
        req,
        file: { originalname: string },
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
  }

  private fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    if (
      this.allowedMimeTypes.includes(file.mimetype) ||
      file.mimetype.includes('image')
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Only ' +
            this.allowedMimeTypes.map(type => type.split('/')[1]).join(', ') +
            ' format is allowed!',
        ),
      );
    }
  }

  private pdfFileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    if (file.mimetype === 'file/pdf' || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only pdf format is allowed!'));
    }
  }

  public getUploader(): Multer {
    return multer({
      storage: this.fileStorage,
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
      fileFilter: this.fileFilter.bind(this),
    });
  }

  public getPdfUploader(): RequestHandler {
    return multer({
      storage: this.pdfStorage,
      fileFilter: this.pdfFileFilter.bind(this),
    }).single('pdf');
  }
}

// Singleton instance
export const fileUploadManager = new FileUploadManager();
export const uploadFile = fileUploadManager.getUploader();
export const uploadPdfFile = fileUploadManager.getPdfUploader();
