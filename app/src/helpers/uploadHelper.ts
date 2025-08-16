import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { logger, errorLogger } from '../shared/logger';
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MulterFile {
  fieldName: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  fileType?: string;
}

// const file = {
//   original_filename: fileDetails?.filename as string,
//   fileType: fileDetails?.mimetype || 'pdf',
//   user: req?.user?.id,
//   category: 'dashboard',
//   path: 'uploadFile/images',
//   img_url: 'uploadFile/images/' + fileDetails?.filename,
//   size: fileDetails?.size,
// };

type ImgReturnType = {
  original_filename: string;
  fileType: string;
  path: string;
  img_url: string;
  size: number;
};
export const uploadLocalFileURL = (
  req: Request,
  fileType: 'single' | 'multiple',
  fieldName: string
): ImgReturnType | ImgReturnType[] | undefined => {
  let profile_image = null;
  if (fileType === 'single') {
    const { file } = req;
    if (file && file.filename) {
      const fileData = file as unknown as MulterFile;
      profile_image = `uploadFile/images/${fileData.filename}`;
      req.body[fieldName] = profile_image;

      return {
        original_filename: fileData?.filename,
        fileType: fileData?.mimetype,
        path: 'uploadFile/images',
        img_url: `uploadFile/images/${fileData.filename}`,
        size: file?.size,
      };
    }
  }

  if (fileType === 'multiple') {
    const files = req.files as MulterFile[] | undefined;
    profile_image = [];
    const profileData = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        // eslint-disable-line
        profile_image.push(`/images/${files[i].filename}`);
        profileData.push({
          original_filename: files[i].originalname,
          fileType: files[i].mimetype,
          path: 'uploadFile/images',
          img_url: `uploadFile/images/${files[i].filename}`,
          size: files[i].size,
        });
      }
      req.body[fieldName] = profile_image;
      return profileData;
    }
  }
  return undefined;
};

export const deleteImageFile = (filePath: string): void => {
  const absolutePath = path.join(process.cwd(), filePath);
  fs.access(absolutePath, fs.constants.F_OK, err => {
    if (err) {
      errorLogger.error(`File not found: ${absolutePath}`);
      return;
    }
    fs.unlink(absolutePath, err => {
      if (err) {
        errorLogger.error(`Error deleting file: ${absolutePath} - ${err}`);
      } else {
        logger.info(`Successfully deleted file: ${absolutePath}`);
      }
    });
  });
};
