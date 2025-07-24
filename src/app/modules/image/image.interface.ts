import { Model, ObjectId } from 'mongoose';

export type IImage = {
  buffer: Buffer;
  fileType: ObjectId;
  original_filename: string;
  path: string;
  img_url: string;
  size: number;
};

export type Image = Model<IImage, Record<string, unknown>>;
