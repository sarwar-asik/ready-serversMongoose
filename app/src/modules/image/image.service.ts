import httpStatus from 'http-status';
import config from '../../config';
// import { IImage } from './image.interface';
import { Image_model } from './image.model';
import ApiError from '../../errors/ApiError';
import { Request } from 'express';
import { uploadLocalFileURL } from '../../helpers/uploadHelper';
import { IImage } from './image.interface';
import { logger, errorLogger } from '../../shared/logger';

const createBufferImageDB = async (
  bufferFile: Buffer | undefined,
  fileType: string,
): Promise<string> => {
  const payload = { buffer: bufferFile, fileType };
  const result = await Image_model.create(payload);

  const image_User = `${config.server_url}/image/${result._id}/${result.id}.${fileType}`;

  return image_User;
};

const createLocalImage = async (
  req: Request,
): Promise<Partial<IImage> | null> => {
  // return `${req.protocol}://${req.get('host')}`;
  try {
    if (req.file) {
      const profileImage = uploadLocalFileURL(req, 'single', 'img');

      if (profileImage && typeof profileImage !== 'undefined') {
        const profileImg = profileImage as any; // Cast to correct type

        const createImageDB = await Image_model.create({
          fileType: profileImg.fileType,
          original_filename: profileImg.original_filename,
          path: profileImg.path,
          img_url: `${req.protocol}://${req.get('host')}/${profileImg.img_url}`,
          size: profileImg.size,
        });

        return createImageDB;
      }
      logger.info(`Image upload attempted with body: ${JSON.stringify(req.body.img)}`);
    }
    return null;
  } catch (error) {
    errorLogger.error(`Error creating local image: ${error}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating local image',
    );
    // return null;
  }
};

export const ImageService = { createBufferImageDB, createLocalImage };
