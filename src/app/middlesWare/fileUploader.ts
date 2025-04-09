/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import path from 'path';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, RequestHandler } from 'express';
import multer, { FileFilterCallback, StorageEngine } from 'multer';

// Configure the storage engine
const fileStorage: StorageEngine = multer.diskStorage({
  destination: (
    req: any,
    file: any,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadFilePath = '../../../uploadFile';
    // console.log(file, 'file');
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
    req: any,
    file: { originalname: string },
    cb: (error: Error | null, filename: string) => void
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

// Define the file filter function
const fileFilterFun = (req: Request, file: any, cb: FileFilterCallback) => {
  const allowedMimeTypes = [
    // 'image/jpg',
    // 'image/png',
    // 'image/jpeg',
    // 'image/heic',
    // 'image/heif',
    // 'image/gif',
    // 'image/avif',
    'application/pdf',
    'application/x-x509-ca-cert',
    'application/octet-stream',
    'application/pkix-cert',
    'application/pkcs8',
    'application/msword',
  ];

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    file.mimetype.includes('image') // allow all image types
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only ' +
        allowedMimeTypes.map(type => type.split('/')[1]).join(', ') +
        'format is allowed!'
      )
    );
  }
};

// Configure the multer upload
export const uploadFile = multer({
  storage: fileStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: fileFilterFun,
});

//! another pdf uploader//
const pdfStorage: StorageEngine = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => any) => {
    cb(null, path.join(__dirname, '../../../uploadFile/pdfs/'));
  },
  filename: (
    req: any,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => any
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
const fileFilterPdf = (req: Request, file: any, cb: FileFilterCallback) => {
  if (file.mimetype === 'file/pdf' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only pdf format is allowed!'));
  }
};

export const uploadPdfFile: RequestHandler = multer({
  storage: pdfStorage,
  // limits: {
  //   fileSize: 10 * 1024 * 1024, // 10 MB
  // },
  fileFilter: fileFilterPdf,
}).single('pdf');
