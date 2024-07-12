import config from '../../../config';
// import { IImage } from './image.interface';
import { Image_model } from './image.model';

const create_image_db = async (
  bufferFile: Buffer | undefined,
  fileType: string
): Promise<string> => {
  const payload = { buffer: bufferFile, fileType };
  const result = await Image_model.create(payload);

  const image_User = `${config.server_url}/image/${result._id}/${result.id}.${fileType}`;

  return image_User;
};

// const getImageUrl = async (id: string): Promise<string> => {

// };
export const ImageService = { create_image_db };
